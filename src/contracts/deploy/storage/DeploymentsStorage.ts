import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { $require } from '@dequanto/utils/$require';
import { Constructor, class_Uri } from 'atma-utils';
import memd from 'memd';

import alot from 'alot';
import { File } from 'atma-io';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { TEth } from '@dequanto/models/TEth';
import { ISlotVarDefinition } from '@dequanto/solidity/SlotsParser/models';
import { $contract } from '@dequanto/utils/$contract';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { IAccount } from '@dequanto/models/TAccount';
import { $date } from '@dequanto/utils/$date';



export interface IDeployment {
    id: string
    name: string
    // TS/JS file
    main: string
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


export interface IProxyStorageLayout {
    id: string
    slots: ISlotVarDefinition[]
}


export class  DeploymentsStorage {

    constructor (public client: Web3Client, public deployer: IAccount, public opts: {
        directory?: string
        // Will be part of the deployments filename
        name?: string
        // TPlatform of a forked network
        fork?: string
    }) {

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



    async updateDeployment (deployment: IDeployment) {
        let store = await this.getDeploymentsStore();
        await store.upsert(deployment);
    }

    async updateProxyDeployment (deploymentImplementation: IDeployment, deploymentProxy: IDeployment) {

        deploymentImplementation.implementation = deploymentImplementation.implementation ?? deploymentImplementation.address;
        deploymentImplementation.address = deploymentProxy.address;
        deploymentProxy.proxyFor = deploymentImplementation.implementation;

        await this.updateDeployment(deploymentImplementation);
        await this.updateDeployment(deploymentProxy);
    }

    async saveAll (deployments: IDeployment[]) {
        let store = await this.getDeploymentsStore();
        await store.saveAll(deployments);
    }

    async saveDeployment (contract: ContractBase, info: {
        id: string
        name: string
        bytecodeHash?: TEth.Hex
    }, receipt?: TEth.TxReceipt) {
        $contract.store.register(contract as any);

        let store = await this.getDeploymentsStore();
        let currentDeployment = await store.getSingle(info.id);

        let deployment = <IDeployment> {
            id: info.id,
            name: info.name,
            main: contract.$meta.class,
            bytecodeHash: info.bytecodeHash,
            address: contract.address,
            block: receipt.blockNumber,
            tx: receipt.transactionHash,
            gas: receipt.gasUsed,
            deployer: this.deployer.address,
            timestamp: $date.toUnixTimestamp(new Date()),

            // If current deployment is the implementation, set the field to null, for later reconfiguration, otherwise keep the field uninitialized
            implementation: currentDeployment?.implementation ? null : void 0,
        };

        if (currentDeployment) {
            let history = currentDeployment.history ?? [];
            let historyItem = {
                ...currentDeployment,
                address: currentDeployment.implementation ?? currentDeployment.address,
                id: void 0,
                name: void 0,
                history: void 0,
                implementation: void 0,
                bytecodeHash: void 0,
                deployer: void 0,
                timestamp: void 0,
                proxyFor: void 0,
            };
            history.push(historyItem);
            deployment.history = history;
        }
        await store.upsert(deployment);

        await this.ensureDeploymentsPathInOxweb();
        return deployment;
    }

    async getStorageLayoutInfo (id: string) {
        let store = await this.getStorageLayoutStore();
        return store.getSingle(id);
    }
    async saveStorageLayoutInfo (info: IProxyStorageLayout) {
        let store = await this.getStorageLayoutStore();
        return store.upsert(info);
    }

    async getDeployments (): Promise<IDeployment[]> {
        await this.cleanTestDeploymentsIfAny();
        let store = await this.getDeploymentsStore();
        let deployments = await store.getAll();
        return deployments;
    }

    @memd.deco.memoize({ perInstance: true })
    private async getStorageLayoutStore() {
        let store = await this.getDeploymentsStore();
        let path = store.options.path.replace('.json', '.layout.json');
        let array = new JsonArrayStore<IProxyStorageLayout>({
            path: path,
            key: x => x.id,
            format: true,
        });
        return array;
    }

    @memd.deco.memoize({ perInstance: true })
    private async getDeploymentsStore() {
        let directory = this.opts.directory ?? './deploy';
        let filenamePrefix = `deployments-` + (this.opts.name ? `${this.opts.name}-` : '');
        let path: string;
        let platformPathNormalized = this.client.platform.replace(/[:]/g, '-');
        let fork = this.opts.fork;
        if (fork == null) {
            path = class_Uri.combine(directory, `${filenamePrefix}${platformPathNormalized}.json`)
        } else {

            $require.eq(this.client.platform, 'hardhat', 'Forks are only supported on Hardhat');

            let upstreamPlatformNormalized = fork.replace(/[:]/g, '-');
            let upstreamFilename = `${filenamePrefix}${upstreamPlatformNormalized}.json`;
            let upstreamDeploymentsPath = class_Uri.combine(directory, upstreamFilename);

            path = class_Uri.combine(directory, `${filenamePrefix}${platformPathNormalized}-${upstreamPlatformNormalized}.json`);

            let upstreamDeploymentExists = await File.existsAsync(upstreamDeploymentsPath);

            let shouldCopy = true;
            if (await File.existsAsync(path)) {
                // forked deployments path already exists, check if stale
                let blockNumber = await this.client.getBlockNumber();
                if (upstreamDeploymentExists) {
                    let upstreamDeployments = await File.readAsync<IDeployment[]>(upstreamDeploymentsPath);

                    // 1. Check if the original(upstream) network has more recent deployments
                    let hasNewDeployments = upstreamDeployments.some(x => x.block > blockNumber);
                    shouldCopy = hasNewDeployments;
                }

                if (shouldCopy === false) {
                    let deployments = await File.readAsync<IDeployment[]>(path);
                    // 2. Just-in-case, check if there are deployments with higher block number, as the current HEAD
                    let hasNewDeployments = deployments.some(x => x.block > blockNumber);
                    shouldCopy = hasNewDeployments;

                    if (shouldCopy === false) {
                        // 3. Check if the latest deployments transaction exists in current forked network
                        let latestDeployment = alot(deployments).maxItem(x => x.block);
                        if (latestDeployment != null) {
                            try {
                                let tx = await this.client.getTransaction(latestDeployment.tx);
                                shouldCopy = tx == null;
                            } catch (error) {
                                shouldCopy = true;
                            }
                        }
                    }
                }
            }

            if (shouldCopy) {
                // current forked deployments are stale, copy the upstream deployments or clean
                if (upstreamDeploymentExists) {
                    await File.copyToAsync(upstreamDeploymentsPath, path, {
                        silent: true
                    });
                } else {
                    // clear
                    await File.writeAsync(path, []);
                }
            }

        }
        let array = new JsonArrayStore<IDeployment>({
            path: path,
            key: x => x.id,
            format: true,
        });
        return array;
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

    @memd.deco.memoize({ perInstance: true })
    @memd.deco.queued()
    private async ensureDeploymentsPathInOxweb () {
        type TDeployments = {
            deployments: {
                [platform: string]: {
                    name?: string
                    path: string
                }[]
            }
        }
        let path0xweb = `0xweb.json`;
        let json = await File.existsAsync(path0xweb)
            ? await File.readAsync<TDeployments>(path0xweb, { cached: false })
            : <TDeployments> {};

        if (json.deployments == null) {
            json.deployments = {};
        }
        if (json.deployments[this.client.platform] == null) {
            json.deployments[this.client.platform] = [];
        }
        let store = await this.getDeploymentsStore();
        let path = store.options.path;

        let arr = json.deployments[this.client.platform];
        let has = arr.some(x => x.name == this.opts.name && x.path == path);
        if (has) {
            return;
        }
        arr.push({
            name: this.opts.name ?? void 0,
            path: path,
        });
        await File.writeAsync(path0xweb, json);
    }
}
