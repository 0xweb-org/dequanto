import alot from 'alot';
import memd from 'memd';
import axios from 'axios'
import { IBlockChainExplorer, IBlockChainTransferEvent } from './IBlockChainExplorer';
import { Transaction } from 'web3-core';
import { type AbiItem } from 'web3-utils';
import { IContractDetails } from '@dequanto/models/IContractDetails';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { $logger } from '@dequanto/utils/$logger';
import { $promise } from '@dequanto/utils/$promise';
import { TPlatform } from '@dequanto/models/TPlatform';
import { $address } from '@dequanto/utils/$address';



export namespace BlockChainExplorerFactory {


    type TxFilter = {
        fromBlockNumber?: number,
        page?: number,
        size?: number,
        sort?: 'asc' | 'desc'
    }

    export function create (opts: {
        ABI_CACHE: string
        CONTRACTS: IContractDetails[]
        getWeb3: (platform?: TPlatform) => Web3Client
        getConfig: (platform?: TPlatform) => { key: string, host: string, www: string }
    }) {

        const client = new Client();

        return class implements IBlockChainExplorer {

            localDb: IContractDetails[] = opts.CONTRACTS
            config = opts.getConfig(this.platform)

            constructor (public platform?: TPlatform) {
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
                let abi: string;

                try {
                    abi = await client.get(url);
                } catch (err) {
                    let addressByByteCode = await this.getSimilarContract(address);
                    if (addressByByteCode != null) {
                        $logger.log(`Found similar byte code address: ${addressByByteCode}`);
                        return this.getContractAbi(addressByByteCode);
                    }
                    throw err;
                }

                let abiJson = JSON.parse(abi);
                if (params?.implementation) {
                    if (/0x.{64}/.test(params.implementation)) {
                        let web3 = opts.getWeb3(this.platform);

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
                    let web3 = opts.getWeb3(this.platform);
                    // (BigInt($contract.keccak256("eip1967.proxy.implementation")) - 1n).toString(16);
                    let uint256Hex = await web3.getStorageAt(address,`0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc`);
                    if ($address.isEmpty(uint256Hex)) {
                        // keccak-256 hash of "org.zeppelinos.proxy.implementation"
                        uint256Hex = await web3.getStorageAt(address, `0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3`);
                    }
                    let hex = uint256Hex.replace(/0x0+/, '0x');
                    return this.getContractAbi(hex)
                }

                if (hasImplementationSlot(abiJson)) {
                    let web3 = opts.getWeb3(this.platform);
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
                    let web3 = opts.getWeb3(this.platform);
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

            async getTransactions (addr: TAddress, params?: TxFilter): Promise<Transaction[]> {
                return this.loadTxs('txlist', addr, params);
            }
            async getTransactionsAll (addr: TAddress, params?: TxFilter): Promise<Transaction[]> {
                return this.loadTxsAll('txlist', addr, params);
            }


            async getInternalTransactions (addr: TAddress, params?: TxFilter): Promise<Transaction[]> {
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

            async getSimilarContract(address: TAddress) {
                let url = `${this.config.www}/address/${address}#code`;
                let html = await client.getHtml(url);
                let rgx = /This contract matches/ig;
                let match = rgx.exec(html);
                if (match == null) {
                    return null;
                }

                let rgxAddress = /0x[a-f\d]{40}/g;

                rgxAddress.lastIndex = match.index;

                let matchAddress = rgxAddress.exec(html);
                if (matchAddress == null) {
                    return null;
                }
                return matchAddress[0];
            }


            async loadTxs(type: 'tokentx' | 'txlistinternal' | 'txlist', address: TAddress, params?: {
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

            async loadTxsAll (type: 'tokentx' | 'txlistinternal' | 'txlist', address: TAddress, params?: TxFilter): Promise<Transaction[]> {

                let page = 1;
                let size = 1000;
                let out = [] as Transaction[];
                let fromBlockNumber = params?.fromBlockNumber;
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
        return hasMethod(abi, name);
    });
}
function hasImplementationSlot (abi: AbiItem[]) {
    let $required = [ 'implementation' ];
    let hasRequired = $required.every(name => {
        return hasMethod(abi, name);
    });
    if (hasRequired === false) {
        return false;
    }
    let $some = ['proxyOwner', 'proxyType'];
    let hasOneOf = $some.some(name => {
        return hasMethod(abi, name);
    });
    if (hasOneOf === false) {
        return false;
    }
    return true;
}
function hasTargetSlot (abi: AbiItem[]) {
    let $interface = ['upgrade', 'getTarget'];
    return $interface.every(name => {
        return hasMethod(abi, name);
    })
}
function hasMethod (abi: AbiItem[], name: string) {
    return abi.some(item => item.type === 'function' && item.name === name);
}



class Client {

    @memd.deco.queued({ throttle: 1000 / 5 })
    async get (url: string) {
        return this.getInner(url)
    }

    @memd.deco.queued({ throttle: 1000 / 5 })
    async getHtml (url: string) {
        let resp = await axios.get(url);
        if (resp.status !== 200) {
            throw new Error(`${url} not loaded with status ${resp.status}.`);
        }
        return resp.data;
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

