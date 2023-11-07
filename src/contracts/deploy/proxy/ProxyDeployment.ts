import type { Deployments } from '../Deployments';
import { TAddress } from '@dequanto/models/TAddress';
import { TEth } from '@dequanto/models/TEth';
import { IAccount } from '@dequanto/models/TAccount';
import { $contract } from '@dequanto/utils/$contract';
import { Constructor } from 'atma-utils';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { $require } from '@dequanto/utils/$require';
import { $address } from '@dequanto/utils/$address';
import { l } from '@dequanto/utils/$logger';
import { ContractWriter } from '@dequanto/contracts/ContractWriter';
import { DeploymentsStorage } from '../storage/DeploymentsStorage';
import { $proxyDeploy } from './$proxyDeploy';


export interface IProxy extends ContractBase {
    changeAdmin?
}
export interface IProxyAdmin extends ContractBase {
    upgradeAndCall
}

interface IProxyDeploymentCtx {

    ImplementationContract: Constructor<ContractBase>,
    proxyId: string
    TransparentProxy?: {
        Proxy?: Constructor<ContractBase>,
        ProxyAdmin?: Constructor<IProxyAdmin>
    }
    deployer: IAccount
    deployments: Deployments
    implementation: {
        address: TAddress
        initData: TEth.Hex
    }
    options?: {
        skipStorageLayoutCheck?: boolean
    }
}

// Supports OpenZeppelin proxy deployments

export class ProxyDeployment {

    constructor(private store: DeploymentsStorage, private opts: {
        TransparentProxy?: {
            Proxy?: Constructor<ContractBase>,
            ProxyAdmin?: Constructor<IProxyAdmin>
        }
    }) {

    }

    async ensureProxy(ctx: IProxyDeploymentCtx) {
        $require.notEmpty(ctx.proxyId, `ProxyId for the contract is required`);

        //@TODO add support of UUPS proxy
        return this.ensureTransparentProxy(ctx)
    }


    // Supports OpenZeppelin TransparentProxy of v ^4.0 and ^5.0
    protected async ensureTransparentProxy(ctx: IProxyDeploymentCtx) {
        let {
            proxyId,
            deployer,
            deployments,
            ImplementationContract
        } = ctx;
        let {
            client
        } = deployments;
        let {

            address: implAddress,
            initData
        } = ctx.implementation;
        let {
            Proxy,
            ProxyAdmin,
        } = ctx.TransparentProxy ?? this.opts.TransparentProxy;
        $require.notNull(Proxy, 'TransparentProxy.Proxy is required');
        $require.notNull(ProxyAdmin, 'TransparentProxy.ProxyAdmin is required');


        let proxyOpts = {
            id: proxyId,
            arguments: [
                // address _logic, address initialOwner, bytes memory _data
                implAddress, deployer.address, initData
            ]
        };
        let v = 'upgradeAndCall' in new Proxy() ? 'V5' : 'V4';

        let hasProxy = await deployments.has(Proxy, proxyOpts);
        let {
            contract: contractProxy,
            receipt: contractProxyReceipt,
            deployment: contractProxyDeployment
        } = await deployments.ensure(Proxy, proxyOpts);
        let contractProxyAdmin: IProxyAdmin;
        let contractProxyAdminId = `${proxyId}Admin`;

        if (contractProxyReceipt) {
            let [log] = $contract.extractLogsForAbi(contractProxyReceipt, 'event AdminChanged(address previousAdmin, address newAdmin)');
            if (log == null) {
                console.error(contractProxyReceipt);
                throw new Error(`AdminChanged event was not extracted from the deployment receipt. Invalid TransparentUpgradeableProxy implementation?`);
            }

            if ($address.eq(log.params.newAdmin, deployer.address)) {
                // Openzeppelin < 5 was not deploying AdminContract automatically
                let { contract } = await deployments.ensure(ProxyAdmin, {
                    id: contractProxyAdminId
                });
                contractProxyAdmin = contract;
                // make sure we upgrade

                l`Will change the EOA admin to ProxyAdmin contract`;
                let receipt = await Interfaces.call(
                    deployer,
                    contractProxy,
                    Interfaces.TransparentProxy.V4.contractProxy.changeAdmin,
                    contractProxyAdmin.address
                );

            } else {
                // Openzeppelin TransparentUpgradeableProxy V5 creates additionally the ProxyAdmin contract on Proxy deployment
                contractProxyAdmin = new ProxyAdmin(log.params.newAdmin, client);
                await this.store.saveDeployment(contractProxyAdmin, {
                    id: contractProxyAdminId,
                    name: 'ProxyAdmin'
                }, contractProxyReceipt);
            }
        } else {
            contractProxyAdmin = await deployments.get(ProxyAdmin, { id: contractProxyAdminId });
            $require.notNull(contractProxyAdmin, `Proxy was deployed previously, but the ProxyAdmin ${contractProxyAdminId} not found`);
        }

        if (hasProxy) {
            let SLOT = `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc` as const;
            let slotValue = await client.getStorageAt(contractProxy.address, SLOT);
            let address = `0x` + slotValue.slice(-40);
            if ($address.eq(address, implAddress) === false) {
                await this.requireCompatibleStorageLayout(ctx);

                console.log(`Upgrading ProxyAdmin to ${implAddress}`);
                let receipt = await Interfaces.call(
                    deployer,
                    contractProxyAdmin,
                    Interfaces.TransparentProxy[v].contractProxyAdmin.upgradeAndCall,
                    contractProxy.address,
                    implAddress,
                    null // data
                );
                await this.saveStorageLayout(ctx);
            }
        }
        if (hasProxy === false && contractProxyReceipt != null) {
            // new proxy deployment, save the storage layout
            await this.saveStorageLayout(ctx);
        }
        return {
            contractProxy,
            contractProxyDeployment,
            contractProxyAdmin,
        }
    }

    private async saveStorageLayout(ctx: IProxyDeploymentCtx) {
        $require.notNull(ctx.ImplementationContract, `Implementation Contract Class is required to compare the storage layout`);
        let newSlots = new ctx.ImplementationContract().storage?.$storage?.slots ?? [];
        await this.store.saveStorageLayoutInfo({
            id: ctx.proxyId,
            slots: newSlots
        });
    }

    private async requireCompatibleStorageLayout(ctx: IProxyDeploymentCtx) {
        if (ctx.options?.skipStorageLayoutCheck !== true) {
            $require.notNull(ctx.ImplementationContract, `Implementation Contract Class is required to compare the storage layout`);

            let newStorageLayout = new ctx.ImplementationContract().storage?.$storage?.slots;
            $require.notNull(newStorageLayout, `No storage layout was generated for ${ctx.ImplementationContract.name}. `);

            let currentStorageLayout = await this.store.getStorageLayoutInfo(ctx.proxyId);
            if (currentStorageLayout != null) {
                let error = await $proxyDeploy.compareStorageLayout(currentStorageLayout.slots, newStorageLayout);
                if (error) {
                    console.error(`StorageLayout error`, error);
                    throw new Error(error.message)
                }
            }
        }
    }
}


namespace Interfaces {
    export async function call(
        account: IAccount
        , contract
        , method: string | ((account: IAccount, contract, ...params) => Promise<TEth.TxReceipt>)
        , ...params): Promise<TEth.TxReceipt> {

        if (typeof method === 'string') {
            let writer = new ContractWriter(contract.address, contract.client)
            let tx = await writer.writeAsync(account, method, params);
            return tx.wait();
        }
        let receipt = await method(account, contract, ...params);
        return receipt;
    }
    export namespace TransparentProxy {
        export const V4 = {
            contractProxy: {
                changeAdmin: 'changeAdmin(address newAdmin) external',
            },
            contractProxyAdmin: {
                async upgradeAndCall(account, contract, proxyAddress, implementationAddress, data) {
                    return call(
                        account,
                        contract,
                        'upgrade(address proxy, address implementation) external',
                        proxyAddress,
                        implementationAddress,
                    );
                }
            }
        }
        export const V5 = {
            contractProxy: {

            },
            contractProxyAdmin: {
                upgradeAndCall: 'upgradeAndCall(address proxy, address implementation, bytes memory data) external'
            }
        }
    }
}
