import alot from 'alot';
import type { Deployments } from '../Deployments';
import { TAddress } from '@dequanto/models/TAddress';
import { TEth } from '@dequanto/models/TEth';
import { IAccount } from '@dequanto/models/TAccount';
import { $contract } from '@dequanto/utils/$contract';
import { Constructor } from '@dequanto/utils/types';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { $require } from '@dequanto/utils/$require';
import { $address } from '@dequanto/utils/$address';
import { $logger, l } from '@dequanto/utils/$logger';
import { ContractWriter } from '@dequanto/contracts/ContractWriter';
import { DeploymentsStorage } from '../storage/DeploymentsStorage';
import { $proxyDeploy } from './$proxyDeploy';
import { File } from 'atma-io';
import { IContractWrapped } from '@dequanto/contracts/ContractClassFactory';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';

export interface IProxy extends ContractBase {
    changeAdmin?
}
export interface IProxyAdmin extends ContractBase {
    upgradeAndCall
}

export interface IBeaconProxy extends ContractBase {
    $constructor (deployer: IAccount, beacon: TEth.Address, initData: TEth.Hex)
}
export interface IBeacon extends ContractBase {
    $constructor (deployer: IAccount, implementation: TEth.Address, initialOwner?: TEth.Address)


    implementation(): Promise<TEth.Address>
    upgradeTo (sender: IAccount, newImplementation: TAddress)
}

interface IDeploymentCtx {
    ImplementationContract: Constructor<ContractBase>
    deployer: IAccount
    owner?: IAccount
    deployments: Deployments
    implementation: {
        address: TAddress
        initData: TEth.Hex
    }
    options?: {
        skipStorageLayoutCheck?: boolean
    }
    upgradeImplementation?: boolean
}

interface IProxyDeploymentCtx extends IDeploymentCtx {
    proxyId: string
    TransparentProxy?: {
        Proxy?: Constructor<ContractBase>,
        ProxyAdmin?: Constructor<IProxyAdmin>
    }
    Beacon?: {
        Beacon?: Constructor<IBeacon>,
        BeaconProxy?: Constructor<IBeaconProxy>
    }
}


interface IBeaconDeploymentCtx extends IDeploymentCtx {
    beaconId: string
    beaconProxyId: string
    Beacon?: {
        Beacon?: Constructor<IBeacon>,
        BeaconProxy?: Constructor<IBeaconProxy>
    }
}

// Supports OpenZeppelin proxy deployments

export class ProxyDeployment {

    constructor(private store: DeploymentsStorage, private opts: {
        TransparentProxy?: {
            Proxy?: Constructor<ContractBase>,
            ProxyAdmin?: Constructor<IProxyAdmin>
        },
        Beacon?: {
            Beacon?: Constructor<IBeacon>,
            BeaconProxy?: Constructor<IBeaconProxy>
        }
    }) {

    }

    async ensureProxy(ctx: IProxyDeploymentCtx) {
        $require.notEmpty(ctx.proxyId, `ProxyId for the contract is required`);
        $require.Address(ctx.implementation?.address, `Implementation address is required`);
        //@TODO add support of UUPS proxy
        return this.ensureTransparentProxy(ctx);
    }

    async ensureBeaconProxy(ctx: IBeaconDeploymentCtx) {
        $require.notEmpty(ctx.beaconId, `BeaconId for the contract is required`);
        $require.notEmpty(ctx.beaconProxyId, `BeaconProxyId for the contract is required`);
        $require.Address(ctx.implementation?.address, `Implementation address is required`);

        return this.ensureBeaconInner(ctx);
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

        if (Proxy == null) {
            let internal = await this.getOpenzeppelinUpgradable({ beacon: false, proxy: true });
            Proxy = internal.TransparentUpgradeableProxy;
            ProxyAdmin = internal.ProxyAdmin as Constructor<IProxyAdmin>;
        }

        $require.notNull(Proxy, 'TransparentProxy.Proxy is required');
        $require.notNull(ProxyAdmin, 'TransparentProxy.ProxyAdmin is required');


        let proxyOpts = <Parameters<Deployments['ensure']>[1]> {
            id: proxyId,
            // will not compare the contract updates, once deployed. As proxies normally not updated
            latest: false,
            // will be used for verification
            proxyFor: implAddress,
            arguments: [
                // address _logic, address initialOwner, bytes memory _data
                implAddress, deployer.address, initData
            ]
        };

        let proxyAbi = new Proxy().abi;
        let v = proxyAbi.some(x => x.name === 'upgradeToAndCall') || !proxyAbi.some(x => x.type === 'error') ? 'V4' : 'V5';
        /** OpenZeppelin V5 hides admin/upgrade public methods and introduces "error" types*/



        let hasProxy = await deployments.has(Proxy, proxyOpts);
        let shouldUpdate = ctx.upgradeImplementation ?? true;
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
                if (shouldUpdate) {
                    await this.requireCompatibleStorageLayout(proxyId, ctx);
                    $logger.log(`Upgrading ProxyAdmin(${contractProxyAdmin.address}) to ${implAddress} (${v}) from ${address}`);
                    let receipt = await Interfaces.call(
                        ctx.owner ?? deployer,
                        contractProxyAdmin,
                        Interfaces.TransparentProxy[v].contractProxyAdmin.upgradeAndCall,
                        contractProxy.address,
                        implAddress,
                        null // data
                    );
                    await this.saveStorageLayout(proxyId, ctx);
                } else {
                    $logger.log(`Skip upgrade ProxyAdmin(${contractProxyAdmin.address}) to ${implAddress} (${v}) from ${address}`);
                }
            }
        }
        if (hasProxy === false && contractProxyReceipt != null) {
            // new proxy deployment, save the storage layout
            await this.saveStorageLayout(proxyId, ctx);
        }
        return {
            contractProxy,
            contractProxyDeployment,
            contractProxyAdmin,
        }
    }

    private async getOpenzeppelinUpgradable (opts?: { proxy?: boolean, beacon?: boolean }) {
        // We can't compile OpenZeppelin's contracts directly from node_modules folder, so create the wrappers
        const baseSource = `./node_modules/@openzeppelin/contracts/proxy`;
        const baseOutput = `./contracts/oz`;
        const deps = {
            TransparentUpgradeableProxy: `@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol`,
            ProxyAdmin: `@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol`,
            UpgradeableBeacon: `@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol`,
            BeaconProxy: `@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol`,
        };
        const paths = {
            TransparentUpgradeableProxy: {
                source: `${baseSource}/transparent/TransparentUpgradeableProxy.sol`,
                output: `${baseOutput}/Proxy.sol`,
                template: `
                    import \"${deps.TransparentUpgradeableProxy}\";
                `,
                //install: `TransparentUpgradeableProxy,ProxyAdmin`,
                contracts: [`TransparentUpgradeableProxy`,`ProxyAdmin`]
            },
            Beacon: {
                source: `${baseSource}/beacon/UpgradeableBeacon.sol`,
                output: `${baseOutput}/Beacon.sol`,
                template: `
                    import \"${deps.UpgradeableBeacon}\";
                    import \"${deps.BeaconProxy}\";
                `,
                //install: `UpgradeableBeacon,BeaconProxy`,
                contracts: [`UpgradeableBeacon`,`BeaconProxy`],
            }
        };

        if (opts?.beacon === false) {
            delete paths.Beacon;
        }
        if (opts?.proxy === false) {
            delete paths.TransparentUpgradeableProxy;
        }

        function fmt (template: string) {
            let match = /^ +/m.exec(template);
            return template.trim().replace(new RegExp(`^${match[0]}`, 'gm'), '');
        }

        let provider = new HardhatProvider();
        let contracts = await alot.fromObject(paths).mapMany(async entry => {
            let info = entry.value;
            let code = fmt(info.template);

            if (await File.existsAsync(info.output) === false) {
                await File.writeAsync(info.output, code);
                await provider.compileSol(info.output, {
                    tsgen: false,
                });
            }

            return await alot(info.contracts)
                .mapAsync(async key => {
                    let compilation = await provider.getContractFromSolPath(deps[key]);
                    return {
                        key: key,
                        Ctor: compilation.ContractCtor
                    };
                })
                .toArrayAsync();
        }).toArrayAsync({ threads: 1 });

        return alot(contracts).toDictionary(x => x.key, x => x.Ctor) as {
            [K in keyof typeof deps]: Constructor<IContractWrapped>
        };
    }

    protected async ensureBeaconInner(ctx: IBeaconDeploymentCtx) {
        let {
            beaconId,
            beaconProxyId,
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
            Beacon,
            BeaconProxy,
        } = ctx.Beacon ?? this.opts.Beacon;

        if (Beacon == null) {
            let internal = await this.getOpenzeppelinUpgradable({ beacon: true, proxy: false });
            BeaconProxy = internal.BeaconProxy as Constructor<IBeaconProxy>;
            Beacon = internal.UpgradeableBeacon as Constructor<IBeacon>;
        }

        $require.notNull(Beacon, 'Beacon is required');
        $require.notNull(BeaconProxy, 'BeaconProxy is required');

        let ozVersion = this.getOzVersionByBeacon(Beacon);

        let beaconOpts = {
            id: beaconId,
            proxyFor: implAddress,
            arguments: ozVersion === 4
                ? [
                    // address implementation
                    implAddress
                ] as [ TEth.Address ]
                : [
                    // address implementation_, address initialOwner
                    implAddress,
                    deployer.address
                ] as [ TEth.Address, TEth.Address ]
        };
        let hasBeacon = await deployments.has(Beacon, beaconOpts);
        let {
            contract: contractBeacon,
            receipt: contractBeaconReceipt,
            deployment: contractBeaconDeployment,
        } = await deployments.ensure(Beacon, beaconOpts);

        if (hasBeacon) {
            let address = await contractBeacon.implementation();
            if ($address.eq(address, implAddress) === false) {
                await this.requireCompatibleStorageLayout(beaconId, ctx);

                l`Upgrading Beacon to ${implAddress}`;
                let receipt = await Interfaces.call(
                    deployer,
                    contractBeacon,
                    Interfaces.Beacon.Beacon.upgradeTo,
                    implAddress
                );
                await this.saveStorageLayout(beaconId, ctx);
            }
        } else {
            if (contractBeaconReceipt?.status) {
                // new beacon deployment, save the storage layout
                await this.saveStorageLayout(beaconId, ctx);
            }
        }

        let beaconProxyOpts = {
            id: beaconProxyId,
            // Pass the target implementation address for verification
            proxyFor: implAddress,
            arguments: [
                // address implementation
                contractBeacon.address, initData
            ] as [TEth.Address, TEth.Hex]
        };
        let hasBeaconProxy = await deployments.has(BeaconProxy, beaconProxyOpts);
        let {
            contract: contractBeaconProxy,
            receipt: contractBeaconProxyReceipt,
            deployment: contractBeaconProxyDeployment
        } = await deployments.ensure(BeaconProxy, beaconProxyOpts);

        return {
            contractBeacon,
            contractBeaconDeployment,
            contractBeaconProxy,
            contractBeaconProxyDeployment,
        }
    }

    private async saveStorageLayout(proxyId: string, ctx: IDeploymentCtx) {
        $require.notNull(ctx.ImplementationContract, `Implementation Contract Class is required to compare the storage layout`);
        let newSlots = new ctx.ImplementationContract().storage?.$storage?.slots ?? [];
        await this.store.saveStorageLayoutInfo({
            id: proxyId,
            slots: newSlots
        });
    }

    private async requireCompatibleStorageLayout(proxyId: string, ctx: IDeploymentCtx) {
        if (ctx.options?.skipStorageLayoutCheck !== true) {
            $require.notNull(ctx.ImplementationContract, `Implementation Contract Class is required to compare the storage layout`);

            let newStorageLayout = new ctx.ImplementationContract().storage?.$storage?.slots;
            $require.notNull(newStorageLayout, `No storage layout was generated for ${ctx.ImplementationContract.name}. `);

            let currentStorageLayout = await this.store.getStorageLayoutInfo(proxyId);
            if (currentStorageLayout != null) {
                let error = await $proxyDeploy.compareStorageLayout(currentStorageLayout.slots, newStorageLayout);
                if (error) {
                    console.error(`StorageLayout error`, error);
                    throw new Error(error.message)
                }
            }
        }
    }

    private getOzVersionByBeacon (Beacon: Constructor<IBeacon>): 5 | 4 {
        let $constructor = new Beacon().abi?.find(x => x.type === 'constructor');
        $require.notNull($constructor, `Invalid Beacon contract: constructor not found`);

        if ($constructor.inputs.length === 1) {
            // constructor(address implementation_)
            return 4;
        }
        if ($constructor.inputs.length === 2) {
            // constructor(address implementation_, address initialOwner)
            return 5;
        }
        console.error($constructor.inputs);
        throw new Error(`Invalid Beacon contract: invalid constructor signature`);
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

    export namespace Beacon {
        export const Beacon = {
            upgradeTo: `upgradeTo(address newImplementation)`
        }
    }
}
