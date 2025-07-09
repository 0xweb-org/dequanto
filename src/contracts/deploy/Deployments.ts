import alot from 'alot';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { IAccount } from '@dequanto/models/TAccount';
import { TEth } from '@dequanto/models/TEth';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $contract } from '@dequanto/utils/$contract';
import { $require } from '@dequanto/utils/$require';
import { ParametersFromSecond } from '@dequanto/utils/types';
import { Constructor } from '@dequanto/utils/types';

import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';
import { ContractVerifier } from '@dequanto/explorer/ContractVerifier';
import { HardhatWeb3Client } from '@dequanto/hardhat/HardhatWeb3Client';
import { LoggerService } from '@dequanto/loggers/LoggerService';
import { $is } from '@dequanto/utils/$is';

import { IBeacon, IBeaconProxy, IProxy, IProxyAdmin, ProxyDeployment } from './proxy/ProxyDeployment';
import { DeploymentsStorage, IDeployment } from './storage/DeploymentsStorage';
import { TAddress } from '@dequanto/models/TAddress';
import { $promise } from '@dequanto/utils/$promise';
import { l } from '@dequanto/utils/$logger';
import { $bytecode } from '@dequanto/evm/utils/$bytecode';



type TDeploymentOptions = {
    id?: string

    /** Will deploy the contract */
    force?: boolean
    /** Will check if local bytecode has changed and will deploy */
    latest?: boolean

    verification?: boolean | 'silent'

    // Will be used for verification process
    proxyFor?: TAddress
}
type TVerificationOptions = TDeploymentOptions & {
    // otherwise will be fetched from the deployment TX
    constructorParams?: any[]
}

export class Deployments {
    public store: DeploymentsStorage;

    private _logger = new LoggerService('deployments', {
        fs: false,
        std: true
    });
    private _hh = new HardhatProvider();
    private _proxyDeployment: ProxyDeployment;
    private _config: {
        TransparentProxy?: {
            Proxy?: Constructor<ContractBase>,
            ProxyAdmin?: Constructor<IProxyAdmin>
        },
        Beacon?: {
            Beacon?: Constructor<IBeacon>,
            BeaconProxy?: Constructor<IBeaconProxy>
        }
    } = {
            TransparentProxy: {}
        }

    constructor(public client: Web3Client, public deployer: IAccount, public opts: {
        Proxy?: Constructor<ContractBase>,
        ProxyAdmin?: Constructor<IProxyAdmin>
        directory?: string
        // Will be part of the deployments filename
        name?: string
        // TPlatform of a forked network
        fork?: string

        Beacon?: {
            Beacon: Constructor<IBeacon>
            BeaconProxy: Constructor<IBeaconProxy>
        }

        verification?: boolean

    } = {}) {
        this._config.TransparentProxy.Proxy = opts?.Proxy;
        this._config.TransparentProxy.ProxyAdmin = opts?.ProxyAdmin;
        this._config.Beacon = opts?.Beacon;
        this.store = new DeploymentsStorage(client, deployer, opts);

        this._proxyDeployment = new ProxyDeployment(this.store, this._config);

        if (opts?.fork) {
            $require.eq(client.platform, 'hardhat', 'Only hardhat is supported for forked networks');
            (client as HardhatWeb3Client).configureFork(opts.fork);
        }
    }

    async has<T extends ContractBase>(Ctor: Constructor<T>, opts?: {
        id?: string;
        params?: ConstructorParameters<Constructor<T>>;
    }): Promise<boolean> {
        let x = await this.getOrNull(Ctor, opts);
        return x != null;
    }

    async get<T extends ContractBase>(Ctor: Constructor<T>, opts?: {
        id?: string;
        address?: TAddress;
        version?: string
    }): Promise<T> {
        let contract = await this.getOrNull(Ctor, opts);
        if (contract == null) {
            throw new Error(`Deployment ${Ctor.name} ${opts?.id ?? ''} not found in ${this.client.platform} [${this.store.opts?.name ?? this.store.opts?.directory ?? ''}]`);
        }
        return contract;
    }

    async getIfExists<T extends ContractBase>(Ctor: Constructor<T>, opts?: {
        id?: string;
        address?: TAddress;
    }): Promise<T> {
        return this.getOrNull(Ctor, opts);
    }

    private async getOrNull<T extends ContractBase>(Ctor: Constructor<T>, opts: {
        id?: string;
        address?: TAddress;
        version?: string;
    }): Promise<T> {
        let deployment = await this.store.getDeploymentInfo(Ctor, opts);
        let address = deployment?.address;
        if (address == null) {
            return null;
        }
        return new Ctor(address, this.client);
    }

    /**
     * Get the deployment for Ctor, but returns the CtorWrapped instance. Useful for proxies, etc.
     * e.g. deployments.getAs(SomeProxy, SomeImplementation);
     */
    async getAs<TDeployed extends ContractBase, TWrapped extends ContractBase>(Ctor: Constructor<TDeployed>, CtorWrapped: Constructor<TWrapped>, opts?: {
        id?: string;
    }): Promise<TWrapped> {
        let deployment = await this.store.getDeploymentInfo(Ctor, opts);
        return deployment == null
            ? null
            : new CtorWrapped(deployment.address, this.client);
    }

    async verify (params: {
        id: string
        address?: TAddress,
        Ctor: Constructor<ContractBase>
        constructorParams?: any[]
    }) {
        let deployment = await this.store.getDeploymentInfo('', {
            id: params.id
        });
        $require.notNull(deployment, `Deployment for ${params.id} not found`);
        await this.ensureVerification(params.Ctor, deployment, {
            id: params.id,
            constructorParams: params.constructorParams,
            proxyFor: deployment.proxyFor,
        });

    }


    async ensureContract<T extends TContract>(Ctor: Constructor<T>, opts?: TConstructorArgs<T> & {
        id?: string;
        force?: boolean;
    }): Promise<T> {
        let { contract } = await this.ensure(Ctor, opts);
        return contract;
    }

    async ensure<T extends TContract>(Ctor: Constructor<T>, opts?: TConstructorArgs<T> & TDeploymentOptions): Promise<{
        contract: T
        receipt?: TEth.TxReceipt
        deployment: IDeployment
    }> {
        opts ??= {} as any;

        let currentDeployment = await this.store.getDeploymentInfo(Ctor, opts);
        let contract = await this.getOrNull(Ctor, opts);
        if (contract != null) {
            await this.ensureVerification(Ctor, currentDeployment, opts);

            let requireLatest = opts.latest == null
                ? (this.client.platform === 'hardhat')
                : (opts.latest ?? false);

            if (opts.force !== true && requireLatest !== true) {
                // return already deployed contract
                $contract.store.register(contract as any);
                return {
                    contract,
                    deployment: currentDeployment,
                };
            }
            if (requireLatest === true && opts.force !== true) {
                // was already deployed. Check new bytecode hash
                let isSame = await this.isSameBytecode(Ctor, currentDeployment);
                if (isSame) {
                    $contract.store.register(contract as any);
                    return {
                        contract,
                        deployment: currentDeployment,
                    };
                }
            }
        }

        // Lets deploy the contract, new, forced, or latest

        let constructorArgs = opts.arguments ?? [];
        let id = opts.id ?? Ctor.name;

        let {
            receipt,
            contract: deployedContract,
            bytecode,
            deployedBytecode
        } = await this._hh.deployClass(Ctor, {
            arguments: constructorArgs,
            client: this.client,
            deployer: this.deployer as any,
        });

        let deployment = await this.store.saveDeployment(deployedContract, {
            id,
            name: Ctor.name,
            bytecodeHash: this.getBytecodeHash(deployedBytecode)
        }, receipt);

        await this.ensureVerification(Ctor, deployment, {
            id: id,
            verification: opts?.verification,
        });

        return {
            receipt,
            contract: deployedContract,
            deployment: deployment
        };
    }

    async ensureWithProxy<
        T extends (TContract & { initialize?: TInit }),
        TInit extends TInitializer
    >(
        CtorImpl: Constructor<T>,
        opts?: TConstructorArgs<T> & TDeploymentOptions & {
            initialize?: ParametersFromSecond<T['initialize']>
        }
    ): Promise<{
        // the Implementation Contract with the address set to Proxy
        contract: T
        contractReceipt?: TEth.TxReceipt
        contractProxy: IProxy,
        contractProxyAdmin: IProxyAdmin,
        contractImplementation: T
        deployment: IDeployment
    }> {


        let id = opts?.id ?? getImplementationId(CtorImpl);
        let proxyId = `${id}Proxy`;

        let {
            contract: contractImpl,
            receipt: contractReceipt,
            deployment: contractImplDeployment
        } = await this.ensure(CtorImpl, {
            arguments: opts?.arguments as any,
            id: id,
            force: opts?.force,
            latest: true,
            verification: opts?.verification,
        });

        let data = serializeInitData(id, contractImpl, opts.initialize);
        let implementationAddress = contractImplDeployment.implementation ?? contractImplDeployment.address;

        let {
            contractProxy,
            contractProxyDeployment,
            contractProxyAdmin
        } = await this._proxyDeployment.ensureProxy({
            ImplementationContract: CtorImpl,
            proxyId: proxyId,
            deployer: this.deployer,
            deployments: this,
            implementation: {
                address: implementationAddress,
                initData: data
            }
        })

        if (contractImplDeployment.implementation == null) {
            // Set the Proxy contract as the main Address
            contractImplDeployment.implementation = contractImplDeployment.address;
            contractImplDeployment.address = contractProxy.address;

            contractProxyDeployment.proxyFor = contractImplDeployment.implementation;
            await this.store.updateDeployment(contractImplDeployment);
            await this.store.updateDeployment(contractProxyDeployment);
        }


        let contract = new CtorImpl(contractProxy.address, this.client);
        return {
            contract: contract,
            contractReceipt,
            contractProxy: contractProxy,
            contractProxyAdmin: contractProxyAdmin,
            contractImplementation: contractImpl,
            deployment: contractImplDeployment
        };
    }

    /**
     * Deploys the Beacon contract. Implementation is the target contract (can be a proxy or normal contract)
     * https://docs.openzeppelin.com/contracts/5.x/api/proxy#beacon
     **/
    async ensureWithBeacon<
        T extends (TContract & { initialize?: TInit }),
        TInit extends TInitializer
    >(
        CtorImpl: Constructor<T>,
        opts: TConstructorArgs<T> & TDeploymentOptions & {
            // Supports path with the first slug as the Implementation ID, e.g. `myImplementation/Foo`
            id: string
            initialize?: ParametersFromSecond<T['initialize']>
        }
    ): Promise<{
        // the Implementation Contract with the address set to Beacon Proxy
        contract: T
        contractReceipt?: TEth.TxReceipt
        contractDeployment: IDeployment

        contractBeacon: IBeacon
        contractBeaconDeployment: IDeployment
        contractBeaconProxy: IBeaconProxy
        contractBeaconProxyDeployment: IDeployment
    }> {

        $require.notEmpty(opts?.id, `ID is required for Beacon deployment, as Implementation apparently will get multiple Beacons`);

        let beaconProxyId = opts.id;
        let implId = beaconProxyId.includes('/')
            ? beaconProxyId.substring(0, beaconProxyId.indexOf('/'))
            : getImplementationId(CtorImpl);
        let beaconId = `${implId}/beacon`;

        let {
            contract: contractImpl,
            receipt: contractReceipt,
            deployment: contractImplDeployment
        } = await this.ensure(CtorImpl, {
            arguments: opts?.arguments as any,
            id: implId,
            force: opts?.force,
            latest: true,
            verification: opts?.verification,
        });

        let data = serializeInitData(implId, contractImpl, opts.initialize);
        let implementationAddress = contractImplDeployment.implementation ?? contractImplDeployment.address;

        let {
            contractBeacon,
            contractBeaconDeployment,
            contractBeaconProxy,
            contractBeaconProxyDeployment,
        } = await this._proxyDeployment.ensureBeaconProxy({
            ImplementationContract: CtorImpl,
            beaconId,
            beaconProxyId,
            deployer: this.deployer,
            deployments: this,
            implementation: {
                address: implementationAddress,
                initData: data
            }
        });


        let contract = new CtorImpl(contractBeaconProxy.address, this.client);
        return {
            contract: contract,
            contractReceipt,
            contractDeployment: contractImplDeployment,

            contractBeacon,
            contractBeaconDeployment,
            contractBeaconProxy,
            contractBeaconProxyDeployment,
        };
    }


    private async isSameBytecode<T extends ContractBase>(Ctor: Constructor<T>, deployment: IDeployment) {
        let bytecodeHash = deployment.bytecodeHash;
        if (bytecodeHash == null) {
            let address = deployment.implementation ?? deployment.address;
            let bytecode = await this.client.getCode(address);
            $require.True($is.Hex(bytecode), `Bytecode not resolved for ${address}`);
            bytecodeHash = this.getBytecodeHash(bytecode);
        }

        let { deployedBytecode } = await this._hh.getFactoryForClass(Ctor);
        let newBytecodeHash = this.getBytecodeHash(deployedBytecode);
        if (newBytecodeHash === bytecodeHash) {
            this._logger.log(`${deployment.id} bytecode has not changed`);
            return true;
        }

        // recheck v1
        if (deployment.bytecodeHash != null) {
            let address = deployment.implementation ?? deployment.address;
            let bytecode = await this.client.getCode(address);
            $require.True($is.Hex(bytecode), `Bytecode not resolved for ${address}`);
            let currentHash = this.getBytecodeHash(bytecode);
            if (currentHash == newBytecodeHash) {
                this._logger.log(`${deployment.id} bytecode has not changed. yellow<v0 bytecode check>`);
                return true;
            }

            if (bytecode.length === deployedBytecode.length) {

                let { bytecode: bytecodeOnchain } = $bytecode.splitToMetadata(bytecode);
                let { bytecode: bytecodeLocal } = $bytecode.splitToMetadata(deployedBytecode);
                let [ localDiff, onchainDiff ] = Str.getDifference(bytecodeLocal, bytecodeOnchain);
                if (localDiff === '' || /^0+$/.test(localDiff)) {
                    this._logger.log(`${deployment.id} bytecode has only immutable data diff, assume unchanged`);
                    // Local deployedBytecode doesn't contain the immutable data
                    // instead the solc generates the bytecode with 0 as the placeholder
                    return true;
                }
            }
        }

        this._logger.log(`yellow<${deployment.id} bytecode has changed. Redeploying...>`);
        return false;
    }


    private async ensureVerification <T extends TContract> (Ctor: Constructor<T>, deployment: IDeployment, opts: TVerificationOptions) {
        if (this.client.platform === 'hardhat' || opts?.verification === false || this.opts.verification === false) {
            return;
        }

        let explorer = await BlockchainExplorerFactory.get(this.client.platform);
        let verifier = new ContractVerifier(this, explorer);
        if (deployment.verified != null
            && /Unable to locate/.test(deployment.verified) === false
            && /Error 429/.test(deployment.verified) === false
            && /timeout/.test(deployment.verified) === false) {
            return;
        }

        let diff = (Date.now() / 1000 | 0) - deployment.timestamp;
        l`Time passed since deployment: bold<${diff}ms>`;
        if (diff < 5000) {
            this._logger.log(`Wait to be indexed by explorer: ${diff}ms passed`);
            await $promise.wait(5000);
        }

        let waitConfirmation = opts?.verification !== 'silent';
        let address = deployment.implementation ?? deployment.address;
        try {
            await verifier.ensure(Ctor, {
                id: opts?.id,
                address: address,
                waitConfirmation: waitConfirmation,
                proxyFor: opts?.proxyFor,
                constructorParams: opts?.constructorParams,
            });

            deployment.verified = new Date().toISOString();
            await this.store.updateDeployment(deployment);
        } catch (error) {
            deployment.verified = error.message;
            await this.store.updateDeployment(deployment);
            this._logger.error(`Verification error ${error.stack ?? error.message}`);
        }
    }


    public async fixBytecodeHashesByReread() {
        let deployments = await this.store.getDeployments();
        await alot(deployments).forEachAsync(async (deployment, i) => {
            this._logger.log(`Fixing BytecodeHashes: ${i}/${deployments.length}`);

            let address = deployment.implementation ?? deployment.address;
            let bytecode = await this.client.getCode(address);
            $require.True($is.Hex(bytecode), `Bytecode not resolved for ${address}`);
            let bytecodeHash = this.getBytecodeHash(bytecode);

            deployment.bytecodeHash = bytecodeHash;
        }).toArrayAsync({ threads: 4 });


        await this.store.saveAll(deployments);
    }

    private getBytecodeHash(bytecode: TEth.Hex) {
        let { bytecode: bytecodeRaw } = $bytecode.splitToMetadata(bytecode);
        return $contract.keccak256(bytecodeRaw);
    }


    /**
     * A simple method to configure the contracts state
     */
    public async configure<T extends TContract, TValue>(Ctor: Constructor<T> | T, opts: {
        id?: string;

        // Latest value, if differs from current, the updater will be executed
        value?: TValue
        // Current value.
        current?: TValue | Promise<TValue> | ((x: T) => Promise<TValue>);
        shouldUpdate?: boolean | (() => boolean | Promise<boolean>)
        updater: (x: T, value: TValue) => Promise<any>

        // Will be logged with old and new value
        title?: string
    }) {
        let x: T;
        if (typeof Ctor === 'function') {
            x = await this.get(Ctor, {
                id: opts.id
            });
        } else {
            x = Ctor;
        }

        let currentVal;
        if ('current' in opts) {
            let currentMix = opts.current;
            let current = typeof currentMix === 'function'
                ? await (currentMix as Function)(x)
                : await currentMix;

            if (isEqual(current, opts.value)) {
                return;
            }
            currentVal = current;
        }
        if ('shouldUpdate' in opts && opts.shouldUpdate != null) {
            let shouldUpdate = typeof opts.shouldUpdate === 'boolean'
                ? opts.shouldUpdate
                : await opts.shouldUpdate();
            if (!shouldUpdate) {
                return;
            }
        }
        if (opts.title!= null) {
            let currentStr = currentVal == null || typeof currentVal === 'object'
                ? ''
                : ` from ${currentVal}`;
            this._logger.log(`Update bold<cyan<${opts.title}>> to ${opts.value}${currentStr}`);
        }
        await opts.updater(x, opts.value);
    }
}


type TInitializer = (...args: any[]) => any


type TContract = ContractBase & { $constructor?: (...args: any[]) => any }
type TConstructorArgs<T extends TContract> = T['$constructor'] extends Function ? {
    arguments: ParametersFromSecond<T['$constructor']>
} : {
    arguments?: any[]
}


function isEqual(a, b) {
    if (a == null || b == null) {
        return a == b;
    }
    if (typeof a !== 'object' && typeof b !== 'object') {

        if (typeof a === 'string' && typeof b ==='string') {
            if (a.startsWith('0x') && b.startsWith('0x') && $is.Hex(a) && $is.Hex(b)) {
                a = a.toLowerCase();
                b = b.toLowerCase();
            }
        }

        // Not strictly equal
        return a == b;
    }
    // check arrays
    if (Array.isArray(a) || Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }
        return a.every((x, i) => {
            return isEqual(x, b[i]);
        });
    }
    // check objects
    for (let key in a) {
        let aValue = a[key];
        let bValue = b[key];
        if (isEqual(aValue, bValue) === false) {
            return false;
        }
    }
    for (let key in b) {
        if (key in a === false && b[key] != null) {
            // value present in b, but was not in a
            return false;
        }
    }
    return true;
}

function serializeInitData(id: string, contract: ContractBase, initializeParams: any) {
    let data: TEth.Hex = null;
    let initializeAbi = contract.abi.find(x => x.name === 'initialize');
    if (initializeAbi) {
        if (initializeParams?.length !== initializeAbi.inputs.length) {
            throw new Error(`Wrong number of arguments (${initializeParams?.length}) for initializer method (${initializeAbi.inputs.length}) in ${id}.`);
        }
        data = $abiUtils.serializeMethodCallData(initializeAbi, initializeParams ?? []);
    }
    return data;
}


/**
 * Normalize the contract name by removing any versions from name
 * "FooV1" is actually the "Foo" contract
 */
function getImplementationId (Ctor: Constructor<TContract>) {
    let id = Ctor.name;
    let version = /V?(?<version>\d)$/i.exec(id);
    if (version) {
        id = id.substring(0, id.length - version[0].length)
    };
    return id;
}

namespace Str {
    export function getDifference (a: TEth.Hex, b: TEth.Hex) {
        if (a === b) {
            return [ '', '' ];
        }

        let start = -1;
        let end = -1;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                start = i;
                break;
            }
        }
        for (let i = a.length - 1; i > start; i--) {
            if (a[i] !== b[i]) {
                end = i;
                break;
            }
        }

        return [
            a.substring(start, end + 1),
            b.substring(start, end + 1),
        ];
    }
}
