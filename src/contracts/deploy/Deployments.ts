import memd from 'memd';
import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { Constructor, class_Uri } from 'atma-utils';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { TAddress } from '@dequanto/models/TAddress';
import { $date } from '@dequanto/utils/$date';
import { TEth } from '@dequanto/models/TEth';
import { IAccount } from '@dequanto/models/TAccount';
import { $address } from '@dequanto/utils/$address';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { ParametersFromSecond } from '@dequanto/utils/types';
import { $contract } from '@dequanto/utils/$contract';
import { $require } from '@dequanto/utils/$require';

import { ContractValidator } from '@dequanto/BlockchainExplorer/ContractValidator';
import { BlockChainExplorerProvider } from '@dequanto/BlockchainExplorer/BlockChainExplorerProvider';
import { $is } from '@dequanto/utils/$is';
import { LoggerService } from '@dequanto/loggers/LoggerService';
import alot from 'alot';


export interface IDeployment {
    id: string
    name: string
    address: TAddress

    // If the Contract was deployed with Proxy - the Address is the address of the proxy
    implementation?: TAddress

    proxyFor?: TAddress

    tx: TEth.Hex
    block: number
    deployer: TEth.Address
    timestamp: number
    bytecodeHash: TEth.Hex
    history?: Omit<IDeployment, 'id' | 'name'>[]
}

export interface IProxy extends ContractBase {

}
export interface IProxyAdmin extends ContractBase {
    upgradeAndCall
}


export class Deployments {
    private _logger = new LoggerService('deployments', {
        fs: false,
        std: true
    });
    private _hh = new HardhatProvider();

    private _config: {
        TransparentProxy?: {
            Proxy?: Constructor<ContractBase>,
            ProxyAdmin?: Constructor<IProxyAdmin>
        }
    } = {
        TransparentProxy: {}
    }

    constructor(public client: Web3Client, public deployer: IAccount, public opts?: {
        Proxy?: Constructor<ContractBase>,
        ProxyAdmin?: Constructor<IProxyAdmin>
        directory?: string
    }) {
        this._config.TransparentProxy.Proxy = opts?.Proxy;
        this._config.TransparentProxy.ProxyAdmin = opts?.ProxyAdmin;
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
        let deployment = await this.getDeploymentInfo(Ctor, opts);
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
        let deployment = await this.getDeploymentInfo(Ctor, opts);
        return deployment == null
            ? null
            : new CtorWrapped(deployment.address, this.client);
    }

    async getDeploymentInfo (Ctor: Constructor<any>, opts?: { id?: string }): Promise<IDeployment>
    async getDeploymentInfo (name: string, opts?: { id?: string }): Promise<IDeployment>
    async getDeploymentInfo (contractInfo: Constructor<any> | string, opts?: { id?: string }): Promise<IDeployment>
    async getDeploymentInfo (mix: Constructor<any> | string, opts?: { id?: string }): Promise<IDeployment> {
        await this.cleanTestDeploymentsIfAny();
        let id = opts?.id ?? (typeof mix === 'string' ? mix : mix.name);
        let store = await this.getDeploymentsStore();
        let deployment = await store.getSingle(id);
        return deployment;
    }

    async getDeployments (): Promise<IDeployment[]> {
        await this.cleanTestDeploymentsIfAny();
        let store = await this.getDeploymentsStore();
        let deployments = await store.getAll();
        return deployments;
    }

    async ensureContract<T extends ContractBase>(Ctor: Constructor<T>, opts?: {
        id?: string;
        force?: boolean;
        arguments?: ConstructorParameters<Constructor<T>>;
    }): Promise<T> {
        let { contract } = await this.ensure(Ctor, opts);
        return contract;
    }

    async ensure<T extends ContractBase & { $constructor?: TInit }, TInit extends TInitializer>(Ctor: Constructor<T>, opts?: {
        id?: string

        /** Will deploy the contract */
        force?: boolean
        /** Will check if local bytecode has changed and will deploy */
        latest?: boolean

        arguments?: T['$constructor'] extends Function ? ParametersFromSecond<T['$constructor']> : any[]
        validation?: boolean | 'silent'
    }): Promise<{
        contract: T
        receipt?: TEth.TxReceipt
        deployment: IDeployment
    }> {
        opts ??= {};

        let currentDeployment = await this.getDeploymentInfo(Ctor, opts);
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

        let deployment = await this.saveDeployment(deployedContract, {
            id,
            name: Ctor.name,
            bytecodeHash: $contract.keccak256(deployedBytecode)
        }, receipt);

        if (this.client.platform !== 'hardhat' && opts?.validation !== false) {
            let explorer = await BlockChainExplorerProvider.get(this.client.platform);
            let validator = new ContractValidator(this, explorer);
            let waitConfirmation = opts?.validation !== 'silent'
            await validator.ensure(Ctor, {
                ...opts,
                waitConfirmation: waitConfirmation
            });
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
        contractProxy: IProxy,
        contractProxyAdmin: IProxyAdmin,
        contractImplementation: T
    }> {

        let Proxy = $require.notNull(
            this._config.TransparentProxy?.Proxy
            , `Proxy Constructor is not configured`
        );
        let ProxyAdmin = $require.notNull(
            this._config.TransparentProxy?.ProxyAdmin
            , 'ProxyAdmin Constructor is not configured'
        );

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
            deployment: contractImplDeployment
        } = await this.ensure(CtorImpl, implantationOpts);

        let data: TEth.Hex = null;
        let initializeAbi = contractImpl.abi.find(x => x.name === 'initialize');
        if (initializeAbi && opts.initialize?.length > 0) {
            data = $abiUtils.serializeMethodCallData(initializeAbi, opts.initialize);
        }

        let implementationAddress = contractImplDeployment.implementation ?? contractImplDeployment.address;
        let proxyOpts = {
            id: proxyId,
            arguments: [
                // address _logic, address initialOwner, bytes memory _data
                implementationAddress, this.deployer.address, data
            ]
        };

        let hasProxy = await this.has(Proxy, proxyOpts);
        let {
            contract: contractProxy,
            receipt: contractProxyReceipt,
            deployment: contractProxyDeployment
        } = await this.ensure(Proxy, proxyOpts);
        let contractProxyAdmin: IProxyAdmin;
        let contractProxyAdminId = `${proxyId}Admin`;

        // Openzeppelin TransparentUpgradeableProxy creates additionally the ProxyAdmin contract on Proxy deployment
        if (contractProxyReceipt) {
            let [ log ] = $contract.extractLogsForAbi(contractProxyReceipt, 'event AdminChanged(address previousAdmin, address newAdmin)');
            if (log == null) {
                console.error(contractProxyReceipt);
                throw new Error(`AdminChanged event was not extracted from the deployment receipt. Invalid TransparentUpgradeableProxy implementation?`);
            }
            contractProxyAdmin = new ProxyAdmin(log.params.newAdmin, this.client);
            await this.saveDeployment(contractProxyAdmin, {
                id: contractProxyAdminId,
                name: 'ProxyAdmin'
            }, contractProxyReceipt);
        } else {
            contractProxyAdmin = await this.get(ProxyAdmin, { id: contractProxyAdminId });
            $require.notNull(contractProxyAdmin, `Proxy was deployed previously, but the ProxyAdmin ${contractProxyAdminId} not found`);
        }


        if (hasProxy) {
            let SLOT = `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc` as const;
            let slotValue = await this.client.getStorageAt(contractProxy.address, SLOT);
            let address = `0x` + slotValue.slice(-40);
            if ($address.eq(address, implementationAddress) === false) {
                let tx = await contractProxyAdmin.upgradeAndCall(
                    this.deployer
                    , contractProxy.address
                    , contractImpl.address
                    , null//data
                );
                let receipt = await tx.wait();
            }
        }
        if (contractImplDeployment.implementation == null) {
            // Set the Proxy contract as the main Address
            contractImplDeployment.implementation = contractImplDeployment.address;
            contractImplDeployment.address = contractProxy.address;

            contractProxyDeployment.proxyFor = contractImplDeployment.implementation;
            await this.updateDeployment(contractImplDeployment);
            await this.updateDeployment(contractProxyDeployment);
        }


        let contract = new CtorImpl(contractProxy.address, this.client);
        return {
            contract: contract,
            contractProxy: contractProxy,
            contractProxyAdmin: contractProxyAdmin,
            contractImplementation: contractImpl,
        };
    }

    @memd.deco.memoize({ perInstance: true })
    private async getDeploymentsStore() {
        const array = new JsonArrayStore<IDeployment>({
            path: class_Uri.combine(this.opts?.directory ?? './deploy', `deployments-${this.client.platform.replace(/[:]/g, '-')}.json`),
            key: x => x.id,
            format: true,
        });
        return array;
    }

    private async saveDeployment (contract: ContractBase, info: {
        id: string
        name: string
        bytecodeHash?: TEth.Hex
    }, receipt?: TEth.TxReceipt) {
        $contract.store.register(contract as any);

        let store = await this.getDeploymentsStore();
        let deployment = <IDeployment> {
            id: info.id,
            name: info.name,
            bytecodeHash: info.bytecodeHash,
            address: contract.address,
            block: receipt.blockNumber,
            tx: receipt.transactionHash,
            gas: receipt.gasUsed,
            deployer: this.deployer.address,
            timestamp: $date.toUnixTimestamp(new Date()),

            // Even though deployment could be the logic implementation, we set it to null, to let the deployer later to reconfigure the proxy
            implementation: null,
        };
        let currentDeployment = await store.getSingle(info.id);
        if (currentDeployment) {
            let history = currentDeployment.history ?? [];
            let historyItem = {
                ...currentDeployment,
                id: void 0,
                name: void 0,
                history: void 0,
            };
            history.push(historyItem);
            deployment.history = history;
        }
        await store.upsert(deployment);
        return deployment;
    }

    async updateDeployment (deployment: IDeployment) {
        let store = await this.getDeploymentsStore();
        await store.upsert(deployment);
    }

    async updateProxyDeployment (deploymentImplementation: IDeployment, deploymentProxy: IDeployment) {
        if (deploymentImplementation.implementation != null) {
            return;
        }
        deploymentImplementation.implementation = deploymentImplementation.address;
        deploymentImplementation.address = deploymentProxy.address;
        deploymentProxy.proxyFor = deploymentImplementation.implementation;

        await this.updateDeployment(deploymentImplementation);
        await this.updateDeployment(deploymentProxy);
    }

    @memd.deco.memoize({ perInstance: true })
    private async cleanTestDeploymentsIfAny(): Promise<void> {
        if (this.client.platform !== 'hardhat') {
            return;
        }
        let block = await this.client.getBlock(0);
        let store = await this.getDeploymentsStore();
        let deployments = await store.getAll();
        let stale = deployments.filter(x => x.timestamp == null || x.timestamp < block.timestamp);
        await store.removeMany(stale.map(x => x.id));
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

        this._logger.log(`${deployment.id} bytecode has changed. ${newBytecode} !== ${bytecodeHash}`);
        return false;
    }


    public async fixBytecodeHashesByReread () {
        let deployments = await this.getDeployments();
        await alot(deployments).forEachAsync(async (deployment, i) => {
            this._logger.log(`Fixing BytecodeHashes: ${i}/${deployments.length}`);

            let address = deployment.implementation ?? deployment.address;
            let bytecode = await this.client.getCode(address);
            $require.True($is.Hex(bytecode), `Bytecode not resolved for ${address}`);
            let bytecodeHash = $contract.keccak256(bytecode);

            deployment.bytecodeHash = bytecodeHash;
        }).toArrayAsync({ threads: 4 });

        let store = await this.getDeploymentsStore();
        await store.saveAll(deployments);
    }
}


type TInitializer = (...args: any[]) => any
