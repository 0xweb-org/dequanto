import alot from 'alot';
import memd from 'memd';
import { IBlockChainExplorer, IBlockChainTransferEvent } from './IBlockChainExplorer';
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
import { Constructor } from '@dequanto/utils/types';
import { $str } from '@dequanto/solidity/utils/$str';
import { $platform } from '@dequanto/utils/$platform';
import type { TAbiItem } from '@dequanto/types/TAbi';
import { TEth } from '@dequanto/models/TEth';
import { $is } from '@dequanto/utils/$is';
import { $http } from '@dequanto/utils/$http';
import { IVerifier } from './verifiers/IVerifier';
import { FsHtmlVerifier } from './verifiers/FsHtmlVerifier';

export interface IBlockChainExplorerFactoryParams {

    platform?: string
    ABI_CACHE?: string
    CONTRACTS?: IContractDetails[]
    getWeb3?: (platform?: TPlatform) => Web3Client
    getConfig?: (platform?: TPlatform) => IBlockChainExplorerConfig
}

export interface IBlockChainExplorerConfig {
    key: string
    api?: string
    host: string
    www: string
    verification?: boolean | 'fs'
    explorers?: {
        api: string
        apiKey?: string
        verification?: boolean | 'fs'
    }[]
}

export namespace BlockChainExplorerFactory {


    type TxFilter = {
        fromBlockNumber?: number,
        page?: number,
        size?: number,
        sort?: 'asc' | 'desc'
    }

    export function create (opts: IBlockChainExplorerFactoryParams): Constructor<IBlockChainExplorer> {

        const client = new HttpClient();

        opts = ensureDefaults(opts);

        return class implements IBlockChainExplorer {

            localDb: IContractDetails[] = opts.CONTRACTS
            config: IBlockChainExplorerConfig;
            fsVerification: IVerifier

            constructor (public platform?: TPlatform) {

                this.config = opts.getConfig(this.platform)

                if ($str.isNullOrWhiteSpace(opts.ABI_CACHE) === false) {
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
                this.fsVerification = new FsHtmlVerifier(this.platform, this.config);
            }

            async getContractMeta (name: string)
            async getContractMeta (address: string)
            async getContractMeta (q: string): Promise<IContractDetails> {

                q = q.toLowerCase();
                let info = this.localDb.find(x => $address.eq(x.address, q) || x.name?.toLowerCase() === q);
                return info;
            }

            async getContractCreation(address: TAddress): Promise<{ creator: TAddress, txHash: TEth.Hex }> {
                let url = `${this.config.host}/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${this.config.key}`;
                let result = await client.get(url);
                let json = Array.isArray(result) ? result[0] : result;
                if (json == null) {
                    throw new Error(`EMPTY_RESPONSE: ContractCreation response is empty for ${address}`);
                }
                return {
                    creator: json.contractCreator,
                    txHash: json.txHash
                };
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
                if (info?.abi) {
                    return { abi: info.abi, implementation: address }
                }

                $require.notEmpty(this.config.host, `Host is not configured`);
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
                    if ($is.HexBytes32(params.implementation)) {
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
                if (isOpenZeppelinProxy(abiJson) || mightBeProxy(abiJson)) {
                    let web3 = opts.getWeb3(this.platform);
                    // (BigInt($contract.keccak256("eip1967.proxy.implementation")) - 1n).toString(16);
                    let uint256Hex = await web3.getStorageAt(address,`0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc`);
                    if ($address.isEmpty(uint256Hex)) {
                        // keccak-256 hash of "org.zeppelinos.proxy.implementation"
                        uint256Hex = await web3.getStorageAt(address, `0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3`);
                    }
                    if ($address.isEmpty(uint256Hex) === false) {
                        let hex =  $address.fromBytes32(uint256Hex);
                        try {
                            return await this.getContractAbi(hex);
                        } catch (err) {
                            err.message += `. Proxy ${hex}`;
                            throw err;
                        }
                    }
                }

                if (hasImplementationSlot(abiJson)) {
                    let web3 = opts.getWeb3(this.platform);
                    let implAddress = await web3.readContract({
                        address: address,
                        abi: abiJson,
                        method: 'implementation',
                        params: []
                    });
                    return this.getContractAbi(implAddress);
                }
                if (hasTargetSlot(abiJson)) {
                    let web3 = opts.getWeb3(this.platform);
                    let implAddress = await web3.readContract({
                        address: address,
                        abi: abiJson,
                        method: 'getTarget',
                        params: []
                    });
                    return this.getContractAbi(implAddress);
                }
                return { abi, implementation: address };
            }

            async submitContractVerification (contractData: {
                address: TAddress
                sourceCode: string | any
                contractName
                compilerVersion
                optimizer?: {
                    enabled?: boolean
                    runs: number
                },
                arguments: TEth.Hex
            }) {
                await this.fsVerification.submitContractVerification(contractData);

                let url = `${this.config.host}/api`;
                let body = {
                    apikey: this.config.key,
                    module: 'contract',
                    action: 'verifysourcecode',
                    contractaddress: contractData.address,
                    sourceCode: contractData.sourceCode,
                    codeformat: 'solidity-standard-json-input',
                    contractname: contractData.contractName,
                    compilerversion: contractData.compilerVersion,
                    optimizationUsed: contractData.optimizer == null || contractData.optimizer.enabled === false ? 0 : 1,
                    runs: contractData.optimizer?.runs,
                    constructorArguements: contractData.arguments?.replace('0x', '')
                };
                let guid = await client.post(url, {
                    body
                });
                return guid;
            }

            async checkContractVerificationSubmission (submission: { guid }) {
                let url = `${this.config.host}/api`;
                let result = await client.get<string>(url, {
                    apikey: this.config.key,
                    module: "contract",
                    action: "checkverifystatus",
                    guid: submission.guid
                });
                return result;
            }

            async submitContractProxyVerification(contractData: {
                address: TEth.Address
                expectedImplementation?: TEth.Address
            }): Promise<string> {
                await this.fsVerification.submitContractProxyVerification(contractData);

                let url = `${this.config.host}/api`;
                let guid = await client.post(url, {
                    body: {
                        apikey: this.config.key,
                        module: "contract",
                        action: "verifyproxycontract",
                        address: contractData.address,
                        expectedimplementation: contractData.expectedImplementation ?? void 0
                    }
                });
                return guid;
            }
            async checkContractProxyVerificationSubmission(submission: { guid: any; }): Promise<string> {
                let url = `${this.config.host}/api`;
                let result = await client.get<string>(url, {
                    apikey: this.config.key,
                    module: "contract",
                    action: "checkproxyverification",
                    guid: submission.guid
                });
                return result;
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

                function parseSourceCode (
                    contractName: string
                    , code: string
                    , filename?: string
                    , additionalSources?: {SourceCode: string , Filename: string }[]
                ): {
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
                        filename ??= `${contractName}.sol`;
                        let additionalSourcesDict = alot(additionalSources ?? []).toDictionary(
                            x => x.Filename,
                            x => ({ content: x.SourceCode })
                        );
                        // single source code (not a serialized JSON)
                        return {
                            contractName: contractName,
                            files: {
                                [filename]: {
                                    content: code
                                },
                                ...additionalSourcesDict
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
                        .replace(/^\s*\{\{/g, '{')
                        .replace(/\}\}\s*$/g, '}');
                        // @TODO check etherscan serialized jsons. Does it always has "{{...}}" wrappings

                    return JSON.parse(str)
                }

                return {
                    ...json,
                    SourceCode: parseSourceCode(json.ContractName, json.SourceCode, json.FileName, json.AdditionalSources)
                };
            }

            async getTransactions (addr: TAddress, params?: TxFilter): Promise<TEth.Tx[]> {
                return this.loadTxs('txlist', addr, params);
            }
            async getTransactionsAll (addr: TAddress, params?: TxFilter): Promise<TEth.Tx[]> {
                return this.loadTxsAll('txlist', addr, params);
            }


            async getInternalTransactions (addr: TAddress, params?: TxFilter): Promise<TEth.Tx[]> {
                return this.loadTxs('txlistinternal', addr, params);
            }
            async getInternalTransactionsAll (addr: TAddress): Promise<TEth.Tx[]> {
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
                return matchAddress[0] as TEth.Address;
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

            async loadTxsAll (type: 'tokentx' | 'txlistinternal' | 'txlist', address: TAddress, params?: TxFilter): Promise<TEth.Tx[]> {

                let page = 1;
                let size = 1000;
                let out = [] as TEth.Tx[];
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

            async registerAbi (abis: {name, address, abi}[]) {
                abis.forEach(x => {
                    let fromDb = this.localDb.find(current => $address.eq(current.address, x.address));
                    if (fromDb != null) {
                        fromDb.abi = x.abi;
                        return;
                    }
                    this.localDb.push(x);
                });
            }
        }
    }
}

function isOpenZeppelinProxy(abi: TAbiItem[]) {
    let $interface = ['upgradeTo', 'implementation'];
    return $interface.every(name => {
        return hasMethod(abi, name);
    });
}
function mightBeProxy(abi: TAbiItem[]) {
    let methods = abi.filter(x => x.type === 'function');
    if (methods.length === 0) {
        return true;
    }
    return false;
}
function hasImplementationSlot (abi: TAbiItem[]) {
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
function hasTargetSlot (abi: TAbiItem[]) {
    let $interface = ['upgrade', 'getTarget'];
    return $interface.every(name => {
        return hasMethod(abi, name);
    })
}
function hasMethod (abi: TAbiItem[], name: string) {
    return abi.some(item => item.type === 'function' && item.name === name);
}

function ensureDefaults (opts: IBlockChainExplorerFactoryParams) {
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

    opts.ABI_CACHE ??= `./cache/${ $platform.toPath(platform) }/abis.json`
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


class HttpClient {

    @memd.deco.queued({ throttle: 1000 / 5 })
    async get <TOut> (url: string, params?) {
        return this.getInner <TOut> (url, {
            params
        })
    }

    async post (url: string, opts: {
        params?: Record<string, any>
        body: any
    }) {
        return this.postInner(url, opts)
    }

    @memd.deco.queued({ throttle: 1000 / 5 })
    async getHtml (url: string) {
        let resp = await $http.get(url);
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

    private async getInner <TOut> (url: string, opts?: { retryCount?: number, params? }) {
        type TResponse = {
            status: '1' | '0'
            message: 'OK' | 'NOTOK'
            result: any
        }
        let resp = await $http.get<TResponse>({
            url,
            params: opts.params
        });
        let data = resp.data;
        if (data.message === 'NOTOK') {
            let str = data.result;
            if (/Max rate/i.test(str)) {
                let count = opts?.retryCount ?? 3;
                if (--count === 0) {
                    throw new Error(str);
                }
                await $promise.wait(200);
                return this.getInner(url, {
                    ...(opts ?? {}),
                    retryCount: count
                });
            }
            throw new Error(str);
        }
        if (data.result == null) {
            $logger.warn(`Blockchain "${url}" explorer returned empty result`, data);
        }
        return data.result as TOut;
    }
    private async postInner (url: string, opts: {
        body: any
        params?: any
        retryCount?: number
    }) {

        let resp = await $http.post({
            url,
            method: 'post',
            //params: opts.params,
            body: opts.body,
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            }
        });
        let data = resp.data as { status: string, message: 'OK' | 'NOTOK', result: any };
        if (data.message === 'NOTOK') {
            let str = data.result;
            throw new Error(str);
        }
        if (data.result == null) {
            $logger.warn(`Blockchain "${url}" explorer returned empty result`, data);
        }
        return data.result;
    }
}

