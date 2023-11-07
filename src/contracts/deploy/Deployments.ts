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
import { Constructor } from 'atma-utils';

import { BlockChainExplorerProvider } from '@dequanto/explorer/BlockChainExplorerProvider';
import { ContractValidator } from '@dequanto/explorer/ContractValidator';
import { HardhatWeb3Client } from '@dequanto/clients/HardhatWeb3Client';
import { LoggerService } from '@dequanto/loggers/LoggerService';
import { $is } from '@dequanto/utils/$is';

import { IProxy, IProxyAdmin, ProxyDeployment } from './proxy/ProxyDeployment';
import { DeploymentsStorage, IDeployment } from './storage/DeploymentsStorage';


export class Deployments {
    private _logger = new LoggerService('deployments', {
        fs: false,
        std: true
    });
    private _hh = new HardhatProvider();
    private _proxyDeployment: ProxyDeployment;
    private _store: DeploymentsStorage;

    private _config: {
        TransparentProxy?: {
            Proxy?: Constructor<ContractBase>,
            ProxyAdmin?: Constructor<IProxyAdmin>
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

    } = {}) {
        this._config.TransparentProxy.Proxy = opts?.Proxy;
        this._config.TransparentProxy.ProxyAdmin = opts?.ProxyAdmin;
        this._store = new DeploymentsStorage(client, deployer, opts);
        this._proxyDeployment = new ProxyDeployment(this._store, this._config);

        if (opts?.fork) {
            $require.eq(client.platform, 'hardhat', 'Only hardhat is supported for forked networks');
            (client as HardhatWeb3Client).configureFork(opts.fork);
        }
    }

    async has<T extends ContractBase>(Ctor: Constructor<T>, opts?: {
        id?: string;
        params?: ConstructorParameters<Constructor<T>>;
    }): Promise<boolean> {
        let x = await this.get(Ctor, opts);
        return x != null;
    }

    async get<T extends ContractBase>(Ctor: Constructor<T>, opts?: {
        id?: string;
    }): Promise<T> {
        let deployment = await this._store.getDeploymentInfo(Ctor, opts);
        return deployment == null
            ? null
            : new Ctor(deployment.address, this.client);
    }

    /**
     * Get the deployment for Ctor, but returns the CtorWrapped instance. Useful for proxies, etc.
     * e.g. deployments.getAs(SomeProxy, SomeImplementation);
     */
    async getAs<TDeployed extends ContractBase, TWrapped extends ContractBase>(Ctor: Constructor<TDeployed>, CtorWrapped: Constructor<TWrapped>, opts?: {
        id?: string;
    }): Promise<TWrapped> {
        let deployment = await this._store.getDeploymentInfo(Ctor, opts);
        return deployment == null
            ? null
            : new CtorWrapped(deployment.address, this.client);
    }



    async ensureContract<T extends TCtor>(Ctor: Constructor<T>, opts?: TConstructorArgs<T> & {
        id?: string;
        force?: boolean;
    }): Promise<T> {
        let { contract } = await this.ensure(Ctor, opts);
        return contract;
    }

    async ensure<T extends TCtor>(Ctor: Constructor<T>, opts?: TConstructorArgs<T> & {
        id?: string

        /** Will deploy the contract */
        force?: boolean
        /** Will check if local bytecode has changed and will deploy */
        latest?: boolean

         validation?: boolean | 'silent'
    }): Promise<{
        contract: T
        receipt?: TEth.TxReceipt
        deployment: IDeployment
    }> {
        opts ??= {} as any;

        let currentDeployment = await this._store.getDeploymentInfo(Ctor, opts);
        let contract = await this.get(Ctor, opts);
        if (contract != null && opts.force !== true && opts.latest !== true) {
            // return already deployed contract
            $contract.store.register(contract as any);
            return {
                contract,
                deployment: currentDeployment,
            };
        }

        if (contract != null && opts.latest === true) {
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

        let deployment = await this._store.saveDeployment(deployedContract, {
            id,
            name: Ctor.name,
            bytecodeHash: $contract.keccak256(deployedBytecode)
        }, receipt);

        if (this.client.platform !== 'hardhat' && opts?.validation !== false) {
            let explorer = await BlockChainExplorerProvider.get(this.client.platform);
            let validator = new ContractValidator(this, explorer);
            let waitConfirmation = false; opts?.validation !== 'silent';
            try {
                await validator.ensure(Ctor, {
                    ...opts,
                    waitConfirmation: waitConfirmation
                });
            } catch (error) {
                this._logger.error(`Verification error ${error.message}`);
            }
        }

        return {
            receipt,
            contract: deployedContract,
            deployment: deployment
        };
    }

    async ensureWithProxy< T extends (ContractBase & { initialize?: TInit }), TInit extends TInitializer>(
        CtorImpl: Constructor<T>,
        opts?: {
            id?: string
            force?: boolean
            latest?: boolean
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


        let id = opts?.id ?? CtorImpl.name;
        let version = /V?(?<version>\d)$/i.exec(id);
        let proxyId = version == null
            ? `${id}Proxy` : `${ id.substring(0, id.length - version[0].length) }Proxy`;

        let implantationOpts = {
            ...opts,
            // Implementation must be initializable
            arguments: null
        }
        let {
            contract: contractImpl,
            receipt: contractReceipt,
            deployment: contractImplDeployment
        } = await this.ensure(CtorImpl, implantationOpts);

        let data: TEth.Hex = null;
        let initializeAbi = contractImpl.abi.find(x => x.name === 'initialize');
        if (initializeAbi) {
            if (opts.initialize?.length !== initializeAbi.inputs.length) {
                throw new Error(`Wrong number of arguments (${opts.initialize?.length}) for initializer method (${initializeAbi.inputs.length}) in ${id}.`);
            }
            data = $abiUtils.serializeMethodCallData(initializeAbi, opts.initialize ?? []);
        }

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
            await this._store.updateDeployment(contractImplDeployment);
            await this._store.updateDeployment(contractProxyDeployment);
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



    private async isSameBytecode<T extends ContractBase>(Ctor: Constructor<T>, deployment: IDeployment) {
        let bytecodeHash = deployment.bytecodeHash;
        if (bytecodeHash == null) {
            let address = deployment.implementation ?? deployment.address;
            let bytecode = await this.client.getCode(address);
            $require.True($is.Hex(bytecode), `Bytecode not resolved for ${address}`);
            bytecodeHash = $contract.keccak256(bytecode);
        }

        let { deployedBytecode } = await this._hh.getFactoryForClass(Ctor);
        let newBytecode = $contract.keccak256(deployedBytecode);
        if (newBytecode === bytecodeHash) {
            this._logger.log(`${deployment.id} bytecode has not changed`);
            return true;
        }

        this._logger.log(`${deployment.id} bytecode has changed. Redeploying...`);
        return false;
    }




    public async fixBytecodeHashesByReread () {
        let deployments = await this._store.getDeployments();
        await alot(deployments).forEachAsync(async (deployment, i) => {
            this._logger.log(`Fixing BytecodeHashes: ${i}/${deployments.length}`);

            let address = deployment.implementation ?? deployment.address;
            let bytecode = await this.client.getCode(address);
            $require.True($is.Hex(bytecode), `Bytecode not resolved for ${address}`);
            let bytecodeHash = $contract.keccak256(bytecode);

            deployment.bytecodeHash = bytecodeHash;
        }).toArrayAsync({ threads: 4 });


        await this._store.saveAll(deployments);
    }


    /**
     * A simple method to configure the contracts state
     */
    public async configure<T extends TCtor, TValue>(Ctor: Constructor<T>, opts: {
        id?: string;

        value: TValue
        current?: (x: T) => Promise<TValue>;
        updater: (x: T, value: TValue) => Promise<any>;
    }) {
        let x = await this.get(Ctor, {
            id: opts.id
        });
        $require.notNull(x, `Deployment not found for ${Ctor.name} ${opts.id ?? ''}.`);

        if (opts.current != null) {
            let current = await opts.current(x);
            if (isEqual(current, opts.value)) {
                return;
            }
        }
        await opts.updater(x, opts.value);
    }
}


type TInitializer = (...args: any[]) => any


type TCtor = ContractBase & { $constructor?: (...args: any[]) => any }
type TConstructorArgs<T extends TCtor> = T['$constructor'] extends Function ? {
    arguments: ParametersFromSecond<T['$constructor']>
}: {
    arguments?: any[]
}


function isEqual (a, b) {
    if (a == null || b == null) {
        return a == b;
    }
    if (typeof a !== 'object' && typeof b !== 'object') {
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
