import alot from 'alot';
import memd from 'memd';
import axios from 'axios'
import { IBlockChainExplorer, IBlockChainTransferEvent } from './IBlockChainExplorer';
import { Transaction } from 'web3-core';
import { AbiItem } from 'web3-utils';
import { IContractDetails } from '@dequanto/models/IContractDetails';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { $logger } from '@dequanto/utils/$logger';
import { $promise } from '@dequanto/utils/$promise';

export namespace BlockChainExplorerFactory {

    export function create (opts: {
        ABI_CACHE: string
        CONTRACTS: IContractDetails[]
        getWeb3: () => Web3Client
        getConfig: () => { key: string, host: string }
    }) {

        const client = new Client();

        return class implements IBlockChainExplorer {

            localDb: IContractDetails[] = opts.CONTRACTS
            config = opts.getConfig()

            constructor () {
                this.getContractAbi = memd.fn.memoize(this.getContractAbi, {
                    trackRef: true,
                    persistance: new memd.FsTransport({
                        path: opts.ABI_CACHE
                    })
                });
                this.getContractSource = memd.fn.memoize(this.getContractSource, {
                    trackRef: true,
                    persistance: new memd.FsTransport({
                        path: opts.ABI_CACHE.replace('.json', '-source.json')
                    })
                });
            }

            async getContractMeta (name: string)
            async getContractMeta (address: string)
            async getContractMeta (q: string): Promise<IContractDetails> {
                q = q.toLowerCase();

                let info = this.localDb.find(x => x.address.toLowerCase() === q || x.name?.toLowerCase() === q);

                return info;
            }

            async getContractAbi (address: TAddress, params?: { implementation: string }): Promise<{ abi: string, implementation: TAddress }> {
                let info = await this.getContractMeta(address);
                if (info?.proxy) {
                    address = info.proxy;
                }

                let url = `${this.config.host}/api?module=contract&action=getabi&address=${address}&apikey=${this.config.key}`;
                let abi: string = await client.get(url);

                let abiJson = JSON.parse(abi);
                if (params?.implementation) {
                    if (/0x.{64}/.test(params.implementation)) {
                        let web3 = opts.getWeb3();

                        let stat = await web3.getNodeInfos();

                        //-let x = (BigInt($contract.keccak256("eip1967.proxy.implementation")) - 1n).toString(16);
                        let uin256Hex = await web3.getStorageAt(
                        '0x5a58505a96d1dbf8df91cb21b54419fc36e93fde',
                        `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc`
                        );
                        let hex = uin256Hex.replace(/0x0+/, '0x');
                        return this.getContractAbi(hex)
                    }
                    throw new Error(`Implement ${params.implementation} support`);
                }
                if (isOpenZeppelinProxy(abiJson)) {
                    let web3 = opts.getWeb3();
                    let uin256Hex = await web3.getStorageAt(
                        address,
                        `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc`
                    );
                    let hex = uin256Hex.replace(/0x0+/, '0x');
                    return this.getContractAbi(hex)
                }

                if (hasImplementationSlot(abiJson)) {
                    let web3 = opts.getWeb3();
                    let uin256Hex = await web3.readContract({
                        address: address,
                        abi: abiJson,
                        method: 'implementation',
                        arguments: []
                    });
                    let hex = uin256Hex.replace(/0x0+/, '0x');
                    return this.getContractAbi(hex);
                }
                if (hasTargetSlot(abiJson)) {
                    let web3 = opts.getWeb3();
                    let uin256Hex = await web3.readContract({
                        address: address,
                        abi: abiJson,
                        method: 'getTarget',
                        arguments: []
                    });
                    let hex = uin256Hex.replace(/0x0+/, '0x');
                    return this.getContractAbi(hex);
                }
                return { abi, implementation: address };
            }

            async getContractSource (address: string): Promise<{
                SourceCode: string
                ContractName: string
                ABI: string
            }> {
                let url = `${this.config.host}/api?module=contract&action=getsourcecode&address=${address}&apikey=${this.config.key}`;
                let result = await client.get(url);
                return Array.isArray(result) ? result[0] : result;
            }

            async getTransactions (addr: TAddress, params?: { fromBlockNumber?: number, page?: number, size?: number, sort?: 'asc' | 'desc' }): Promise<Transaction[]> {
                return this.loadTxs('txlist', addr, params);
            }
            async getTransactionsAll (addr: TAddress): Promise<Transaction[]> {
                return this.loadTxsAll('txlist', addr);
            }


            async getInternalTransactions (addr: TAddress, params?: { fromBlockNumber?: number, page?: number, size?: number, sort?: 'asc' | 'desc' }): Promise<Transaction[]> {
                return this.loadTxs('txlistinternal', addr, params);
            }
            async getInternalTransactionsAll (addr: TAddress): Promise<Transaction[]> {
                return this.loadTxsAll('txlistinternal', addr);
            }


            async getErc20Transfers (addr: TAddress, fromBlockNumber?: number): Promise<IBlockChainTransferEvent[]> {
                let events: IBlockChainTransferEvent[] = await this.loadTxs('tokentx', addr, { fromBlockNumber });
                events.forEach(transfer => {
                    transfer.timeStamp = new Date((Number(transfer.timeStamp) * 1000))
                    transfer.value = BigInt(transfer.value);
                    transfer.blockNumber = Number(transfer.blockNumber);
                    transfer.tokenDecimal = Number(transfer.tokenDecimal);
                });
                return events;
            }
            async getErc20TransfersAll (addr: TAddress, fromBlockNumber?: number): Promise<IBlockChainTransferEvent[]> {
                let events = await this.loadTxsAll('tokentx', addr) as any as IBlockChainTransferEvent[];
                events.forEach(transfer => {
                    transfer.timeStamp = new Date((Number(transfer.timeStamp) * 1000))
                    transfer.value = BigInt(transfer.value);
                    transfer.blockNumber = Number(transfer.blockNumber);
                    transfer.tokenDecimal = Number(transfer.tokenDecimal);
                });
                return events;
            }


            private async loadTxs(type: 'tokentx' | 'txlistinternal' | 'txlist', address: TAddress, params?: {
                fromBlockNumber?: number,
                page?: number,
                size?: number,
                sort?: 'asc' | 'desc'
            }) {
                let url = `${this.config.host}/api?module=account&action=${type}&address=${address}&sort=${params.sort ?? 'desc'}&apikey=${this.config.key}`;
                if (params.fromBlockNumber != null) {
                    url += `&startblock=${params.fromBlockNumber}`
                }
                if (params.page != null) {
                    url += `&page=${params.page}`
                }
                if (params.size != null) {
                    url += `&offset=${params.size}`
                }
                let txs = await client.get(url);
                return txs;
            }

            private async loadTxsAll (type: 'tokentx' | 'txlistinternal' | 'txlist', address: TAddress): Promise<Transaction[]> {

                let page = 1;
                let size = 1000;
                let out = [] as Transaction[];
                let fromBlockNumber = null as number;
                while(true) {
                    let arr = await this.loadTxs(type, address, { fromBlockNumber, sort: 'asc' });
                    out.push(...arr);
                    $logger.log(`Got transactions(${type}) for ${address}. Page: ${arr.length}; Received: ${out.length}. Latest Block: ${fromBlockNumber}`);

                    if (arr.length < size) {
                        break;
                    }
                    page++;
                    fromBlockNumber = Number(arr[arr.length - 1].blockNumber);
                }
                return alot(out).distinctBy(x => x.hash).toArray();
            }
        }
    }
}

function isOpenZeppelinProxy(abi: AbiItem[]) {
    let $interface = ['upgradeTo', 'implementation'];
    return $interface.every(name => {
        return abi.some(item => item.type === 'function' && item.name === name);
    })
}
function hasImplementationSlot (abi: AbiItem[]) {
    let $interface = ['proxyOwner', 'implementation'];
    return $interface.every(name => {
        return abi.some(item => item.type === 'function' && item.name === name);
    })
}
function hasTargetSlot (abi: AbiItem[]) {
    let $interface = ['upgrade', 'getTarget'];
    return $interface.every(name => {
        return abi.some(item => item.type === 'function' && item.name === name);
    })
}



class Client {

    @memd.deco.queued({ throttle: 1000 / 5 })
    async get (url: string) {
        return this.getInner(url)
    }

    async getPaged (url: string) {
        let arr = [];
        let page = 1;
        let size = 200;
        while (true) {
            let path = `${url}&page=${page}&offset=${size}`;
            let pageArr: any[] = await this.get(path);
            arr = arr.concat(pageArr);
            if (pageArr.length < size) {
                break;
            }
            page++;
        }
        return arr;
    }

    private async getInner (url: string, opts?: { retryCount: number }) {
        let resp = await axios.get(url);
        let data = resp.data as { status: string, message: 'OK' | 'NOTOK', result: any };
        if (data.message === 'NOTOK') {
            let str = data.result;
            if (/Max rate/i.test(str)) {
                let count = opts?.retryCount ?? 3;
                if (--count === 0) {
                    throw new Error(str);
                }
                await $promise.wait(200);
                return this.getInner(url, {
                    retryCount: count
                });
            }
            throw new Error(str);
        }
        if (data.result == null) {
            console.warn(`Blockchain "${url}" explorer returned empty result`, data);
        }
        return data.result;
    }
}

