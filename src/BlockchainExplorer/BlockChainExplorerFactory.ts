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
import { $require } from '@dequanto/utils/$require';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { $config } from '@dequanto/utils/$config';

export interface IBlockChainExplorerParams {

    platform?: string
    ABI_CACHE?: string
    CONTRACTS?: IContractDetails[]
    getWeb3?: (platform?: TPlatform) => Web3Client
    getConfig?: (platform?: TPlatform) => { key: string, host: string, www: string }
}

export namespace BlockChainExplorerFactory {


    type TxFilter = {
        fromBlockNumber?: number,
        page?: number,
        size?: number,
        sort?: 'asc' | 'desc'
    }

    export function create (opts: IBlockChainExplorerParams) {

        const client = new Client();

        opts = ensureDefaults(opts);

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

            async getContractAbi (address: TAddress, params?: {
                // address or slot
                implementation: TAddress | string
            }): Promise<{ abi: string, implementation: TAddress }> {

                if ($address.isValid(params?.implementation)) {
                    return this.getContractAbi(params.implementation);
                }

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
                            address,
                            params.implementation
                        );
                        let hex = $address.fromBytes32(uin256Hex);
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
                    let hex =  $address.fromBytes32(uint256Hex);
                    return this.getContractAbi(hex)
                }

                if (hasImplementationSlot(abiJson)) {
                    let web3 = opts.getWeb3(this.platform);
                    let implAddress = await web3.readContract({
                        address: address,
                        abi: abiJson,
                        method: 'implementation',
                        arguments: []
                    });
                    return this.getContractAbi(implAddress);
                }
                if (hasTargetSlot(abiJson)) {
                    let web3 = opts.getWeb3(this.platform);
                    let implAddress = await web3.readContract({
                        address: address,
                        abi: abiJson,
                        method: 'getTarget',
                        arguments: []
                    });
                    return this.getContractAbi(implAddress);
                }
                return { abi, implementation: address };
            }

            async getContractSource (address: string): Promise<{
                SourceCode: {
                    contractName: string
                    files: {
                        [filename: string]: {
                            content: string
                        }
                    }
                }
                ContractName: string
                ABI: string
            }> {
                let url = `${this.config.host}/api?module=contract&action=getsourcecode&address=${address}&apikey=${this.config.key}`;
                let result = await client.get(url);


                let json = Array.isArray(result) ? result[0] : result;

                function parseSourceCode (contractName: string, code: string): {
                    contractName: string
                    files: {
                        [filename: string]: {
                            content: string
                        }
                    }
                } {
                    if (typeof code !== 'string') {
                        return code;
                    }

                    if (/^\s*\{/.test(code) === false) {
                        // single source code (not a serialized JSON)
                        return {
                            contractName: contractName,
                            files: {
                                [`${contractName}.sol`]: {
                                    content: code
                                }
                            }
                        };
                    }
                    try {
                        let sources = parseJson(code);
                        let files = sources.sources ?? sources;
                        return {
                            contractName: contractName,
                            files
                        };
                    } catch (error) {
                        throw new Error(`Source code (${url}) can't be parsed: ${error.message}`);
                    }
                }
                function parseJson (str: string) {
                    try {
                        return JSON.parse(str)
                    } catch (error) {
                        // etherscan returns code wrapped into {{}}
                    }
                    str = str
                        .replace(/\{\{/g, '{')
                        .replace(/\}\}/g, '}')
                        // @TODO check etherscan serialized jsons. Does it always has "{{...}}" wrappings


                    return JSON.parse(str)
                }

                return {
                    ...json,
                    SourceCode: parseSourceCode(json.ContractName, json.SourceCode)
                };
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

function ensureDefaults (opts: IBlockChainExplorerParams) {
    opts ??= {};

    let hasNull = opts.ABI_CACHE == null
        || opts.CONTRACTS == null
        || opts.getConfig == null
        || opts.getWeb3 == null;

    if (hasNull === false) {
        return opts;
    }

    let platform = opts.platform;
    $require.notNull(platform, `Generic Blockchain Explorer Config should contain platform name`);

    opts.ABI_CACHE ??= `./cache/${platform}/abis.json`
    opts.CONTRACTS ??= [];
    opts.getWeb3 ??= (_) => {
        return Web3ClientFactory.get(platform);
    };
    opts.getConfig ??= () => {
        let config = $config.get(`blockchainExplorer.${platform}`);

        let mainnet = /(?<mainnet>\w+):/.exec(platform)?.groups?.mainnet;
        if (mainnet != null) {
            let mainnetConfig = $config.get(`blockchainExplorer.${mainnet}`);
            config = {
                ...(mainnetConfig ?? {}),
                ...(config ?? {})
            };
        }
        return {
            key: config?.key,
            host: config?.host,
            www: config?.www,
        };
    };
    return opts;
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

