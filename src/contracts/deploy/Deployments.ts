import alot from 'alot';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { IAccount } from '@dequanto/models/TAccount';
import { TEth } from '@dequanto/models/TEth';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $contract } from '@dequanto/utils/$contract';
import { $require } from '@dequanto/utils/$require';
import { Constructor, ParametersFromSecond } from '@dequanto/utils/types';

import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';
import { ContractVerifier } from '@dequanto/explorer/ContractVerifier';
import { HardhatWeb3Client } from '@dequanto/hardhat/HardhatWeb3Client';
import { LoggerService } from '@dequanto/loggers/LoggerService';
import { $is } from '@dequanto/utils/$is';

import { $bytecode } from '@dequanto/evm/utils/$bytecode';
import { TAddress } from '@dequanto/models/TAddress';
import { l } from '@dequanto/utils/$logger';
import { $promise } from '@dequanto/utils/$promise';
import { IBeacon, IBeaconProxy, IProxy, IProxyAdmin, ProxyDeployment } from './proxy/ProxyDeployment';
import { DeploymentsStorage, IDeployment } from './storage/DeploymentsStorage';



type TDeploymentOptions = {
    id?: string

    // For proxy deployments: redeploys the implementation if the bytecode has not changed but the immutable arguments have changed.
    immutablesKey?: string

    // Older deployments did not have immutablesKey, so any proxy implementation with immutable variables would trigger redeployment.
    checkImmutables?: boolean

    /** Deploys the contract. */
    force?: boolean
    /** Checks whether the local bytecode has changed and deploys if needed. */
    latest?: boolean

    verification?: boolean | 'silent'

    // Used for the verification process.
    proxyFor?: TAddress

    deployment?: {
        // Pending deployment transaction will be rechecked.
        tx?: TEth.Hex
        // When false, the implementation will not be updated in the proxy.
        upgradeProxy?: boolean
        // Owner, if different from the deployer.
        owner?: TEth.IAccount
    }
}
type TVerificationOptions = TDeploymentOptions & {
    // Otherwise, this will be fetched from the deployment transaction.
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
            TransparentProxy: {},
            Beacon: {}
        }

    constructor(public client: Web3Client, public deployer: IAccount, public opts: {
        owner?: IAccount
        Proxy?: Constructor<ContractBase>,
        ProxyAdmin?: Constructor<IProxyAdmin>
        directory?: string
        // Part of the deployments filename.
        name?: string
        // TPlatform of a forked network
        fork?: string

        Beacon?: {
            Beacon: Constructor<IBeacon>
            BeaconProxy: Constructor<IBeaconProxy>
        }

        verification?: boolean

        // default: true
        checkBytecode?: boolean

        // default 'redeploy'
        whenBytecodeChanged?: 'redeploy' | 'ignore' | 'throw'

        // default: upgrade proxy implementation, when ignored, the upgrade is omitted and can be executed later
        whenUpgradeRequired?: 'ignore'

    } = {}) {
        this._config.TransparentProxy.Proxy = opts?.Proxy;
        this._config.TransparentProxy.ProxyAdmin = opts?.ProxyAdmin;
        this._config.Beacon.Beacon = opts?.Beacon?.Beacon;
        this._config.Beacon.BeaconProxy = opts?.Beacon?.BeaconProxy;
        this.store = new DeploymentsStorage(client, deployer, opts);

        this._proxyDeployment = new ProxyDeployment(this.store, this._config);

        if (opts?.fork) {
            $require.eq(client.platform, 'hardhat', 'Only hardhat is supported for forked networks');
            (client as HardhatWeb3Client).configureFork(opts.fork);
        } else if (client.forked?.platform != null) {
            this.opts ??= {};
            this.opts.fork = client.forked.platform;
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
            throw new Error(`Deployment ${Ctor.name} ${opts?.id ?? ''} was not found in ${this.client.platform} [${this.store.opts?.name ?? this.store.opts?.directory ?? ''}]`);
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
     * Gets the deployment for Ctor, but returns the CtorWrapped instance. Useful for proxies, etc.
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
        $require.notNull(deployment, `Deployment for ${params.id} was not found`);
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
                ? (this.client.platform === 'hardhat' || this.opts?.checkBytecode !== false)
                : (opts.latest);

            /** For backward compatibility:
             *  For older deployments, the deployer should set this if immutablesKey is not present in the deployed state. */
            let hasNewImmutables = opts.checkImmutables === true
                ? Boolean(currentDeployment.immutablesKey != opts.immutablesKey)
                : Boolean(currentDeployment.immutablesKey && currentDeployment.immutablesKey != opts.immutablesKey);

            if (opts.force !== true && requireLatest !== true && hasNewImmutables !== true) {
                // Return the already deployed contract.
                $contract.store.register(contract as any);
                return {
                    contract,
                    deployment: currentDeployment,
                };
            }
            if (requireLatest === true && opts.force !== true) {
                // The contract was already deployed. Check the new bytecode hash.
                let isSame = await this.isSameBytecode(Ctor, currentDeployment);
                if (isSame && hasNewImmutables !== true) {
                    $contract.store.register(contract as any);
                    return {
                        contract,
                        deployment: currentDeployment,
                    };
                }
            }
        }

        if (contract != null) {
            if (this.opts?.whenBytecodeChanged === 'ignore') {
                return {
                    contract,
                    deployment: currentDeployment,
                };
            }
            if (this.opts?.whenBytecodeChanged === 'throw') {
                throw new Error(`The bytecode of ${currentDeployment.id} has changed, but 'whenBytecodeChanged' is set to 'throw'`);
            }
        }



        // Deploy the contract: new, forced, or latest.

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
            tx: opts.deployment?.tx
        });

        let deployment = await this.store.saveDeployment(deployedContract, {
            id,
            name: Ctor.name,
            immutablesKey: opts.immutablesKey,
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
        T extends (TContract & TInitializers<TInit>),
        TInit extends TFunction
    >(
        CtorImpl: Constructor<T>,
        opts?: TConstructorArgs<T> & TDeploymentOptions & TInitializerParams<T>
    ): Promise<{
        // The implementation contract with the address set to the proxy.
        contract: T
        contractReceipt?: TEth.TxReceipt
        contractProxy: IProxy,
        contractProxyAdmin: IProxyAdmin,
        contractImplementation: T
        deployment: IDeployment
    }> {


        let id = opts?.id ?? getImplementationId(CtorImpl);
        let proxyId = `${id}Proxy`;
        let immutablesKey = getImmutablesKey(opts?.arguments);

        let {
            contract: contractImpl,
            receipt: contractReceipt,
            deployment: contractImplDeployment
        } = await this.ensure(CtorImpl, {
            arguments: opts?.arguments as any,
            id: id,
            immutablesKey,
            force: opts?.force,
            latest: this.opts?.checkBytecode !== false,
            verification: opts?.verification,
            deployment: opts?.deployment
        });

        let initData = serializeInitData(id, contractImpl, opts.initialize);
        let { migrationData, migrationV } = serializeMigrationData(id, contractImpl, opts);
        let implementationAddress = contractImplDeployment.implementation ?? contractImplDeployment.address;

        let {
            contractProxy,
            contractProxyDeployment,
            contractProxyAdmin
        } = await this._proxyDeployment.ensureProxy({
            ImplementationContract: CtorImpl,
            proxyId: proxyId,
            deployer: this.deployer,
            owner: opts.deployment?.owner ?? this.opts?.owner ?? this.deployer,
            deployments: this,
            implementation: {
                address: implementationAddress,
                initData,
                migrationData,
                migrationV,
            },
            upgradeImplementation: opts.deployment?.upgradeProxy ?? this.opts?.whenUpgradeRequired !== 'ignore'
        })

        if (contractImplDeployment.implementation == null) {
            // Set the proxy contract as the main address.
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
     * Deploys the Beacon contract. The implementation is the target contract (can be a proxy or normal contract).
     * https://docs.openzeppelin.com/contracts/5.x/api/proxy#beacon
     **/
    async ensureWithBeacon<
        T extends (TContract & { initialize?: TInit }),
        TInit extends TFunction
    >(
        CtorImpl: Constructor<T>,
        opts: TConstructorArgs<T> & TDeploymentOptions & {
            // Supports path with the first slug as the Implementation ID, e.g. `myImplementation/Foo`
            id: string
            initialize?: ParametersFromSecond<T['initialize']>
        }
    ): Promise<{
        // The implementation contract with the address set to the Beacon proxy.
        contract: T
        contractReceipt?: TEth.TxReceipt
        contractDeployment: IDeployment

        contractBeacon: IBeacon
        contractBeaconDeployment: IDeployment
        contractBeaconProxy: IBeaconProxy
        contractBeaconProxyDeployment: IDeployment
    }> {

        $require.notEmpty(opts?.id, `ID is required for Beacon deployment, as the implementation can have multiple Beacons`);

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
            latest: this.opts?.checkBytecode !== false,
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
                initData: data,
                // @TODO Implement migrations for Beacons.
                migrationData: null
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

        // Recheck v1.
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
                    // Local deployedBytecode does not contain immutable data.
                    // Instead, solc generates bytecode with 0 as the placeholder.
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
     * A simple method to configure contract state.
     */
    public async configure<T extends TContract, TValue>(Ctor: Constructor<T> | T, opts: {
        id?: string;

        // Latest value. If it differs from current, the updater will be executed.
        value?: TValue
        // Current value.
        current?: TValue | Promise<TValue> | ((x: T) => Promise<TValue>);
        shouldUpdate?: boolean | (() => boolean | Promise<boolean>)
        updater: (x: T, value: TValue) => Promise<any>

        // Logged with the old and new values.
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


type TFunction = (...args: any[]) => any
type TInitializerName = 'initialize' | `initializeV${number}`
type TInitializers<TInit extends TFunction> = {
    [K in TInitializerName]?: TInit
}
type TInitializerParams<T extends TInitializers<TFunction>> = {
    initialize?: T['initialize'] extends TFunction
        ? ParametersFromSecond<T['initialize']>
        : never
    initializeV2?: T['initializeV2'] extends TFunction
        ? ParametersFromSecond<T['initializeV2']>
        : never
    initializeV3?: T['initializeV3'] extends TFunction
        ? ParametersFromSecond<T['initializeV3']>
        : never
} & {
    [K in Extract<keyof T, `initializeV${number}`>]?: T[K] extends TFunction
        ? ParametersFromSecond<T[K]>
        : any
}

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
    // Check arrays.
    if (Array.isArray(a) || Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }
        return a.every((x, i) => {
            return isEqual(x, b[i]);
        });
    }
    // Check objects.
    for (let key in a) {
        let aValue = a[key];
        let bValue = b[key];
        if (isEqual(aValue, bValue) === false) {
            return false;
        }
    }
    for (let key in b) {
        if (key in a === false && b[key] != null) {
            // Value is present in b, but not in a.
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


function serializeMigrationData(id: string, contract: ContractBase, opts: any) {
    let rgx = /^initializeV(?<version>[\d+])$/;
    let migrations = contract
        .abi
        .map(x => rgx.exec(x.name))
        .filter(x => x != null)
        .map(match => Number(match.groups.version))
        ;
    if (migrations.length === 0) {
        return { migrationData: null, migrationV: 1 };
    }
    let v = alot(migrations).max(x => x);
    let key = `initializeV${v}`;
    let migrationAbi = contract.abi.find(x => x.name === key);
    let migrationParams = opts?.[key] ?? [];
    if (migrationParams?.length !== migrationAbi.inputs.length) {
        throw new Error(`Wrong number of arguments (${migrationParams?.length}) for initializer method (${migrationAbi.inputs.length}) in ${id}.`);
    }
    return {
        migrationData: $abiUtils.serializeMethodCallData(migrationAbi, migrationParams ?? []),
        migrationV: v
    };
}


/**
 * Normalizes the contract name by removing any version suffix from the name.
 * "FooV1" is actually the "Foo" contract.
 */
function getImplementationId (Ctor: Constructor<TContract>) {
    let id = Ctor.name;
    let version = /V?(?<version>\d)$/i.exec(id);
    if (version) {
        id = id.substring(0, id.length - version[0].length)
    };
    return id;
}


function getImmutablesKey (args: any[]) {
    if (args == null || args.length === 0) {
        return null;
    }
    let key = args.map(arg => `${arg?.toString()}`).join('-');
    return key;
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
