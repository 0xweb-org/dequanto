"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockChainExplorerFactory = void 0;
const alot_1 = __importDefault(require("alot"));
const memd_1 = __importDefault(require("memd"));
const axios_1 = __importDefault(require("axios"));
const _logger_1 = require("@dequanto/utils/$logger");
const _promise_1 = require("@dequanto/utils/$promise");
var BlockChainExplorerFactory;
(function (BlockChainExplorerFactory) {
    function create(opts) {
        const client = new Client();
        return class {
            constructor() {
                this.localDb = opts.CONTRACTS;
                this.config = opts.getConfig();
                this.getContractAbi = memd_1.default.fn.memoize(this.getContractAbi, {
                    trackRef: true,
                    persistance: new memd_1.default.FsTransport({
                        path: opts.ABI_CACHE
                    })
                });
                this.getContractSource = memd_1.default.fn.memoize(this.getContractSource, {
                    trackRef: true,
                    persistance: new memd_1.default.FsTransport({
                        path: opts.ABI_CACHE.replace('.json', '-source.json')
                    })
                });
            }
            async getContractMeta(q) {
                q = q.toLowerCase();
                let info = this.localDb.find(x => x.address.toLowerCase() === q || x.name?.toLowerCase() === q);
                return info;
            }
            async getContractAbi(address, params) {
                let info = await this.getContractMeta(address);
                if (info?.proxy) {
                    address = info.proxy;
                }
                let url = `${this.config.host}/api?module=contract&action=getabi&address=${address}&apikey=${this.config.key}`;
                let abi = await client.get(url);
                let abiJson = JSON.parse(abi);
                if (params?.implementation) {
                    if (/0x.{64}/.test(params.implementation)) {
                        let web3 = opts.getWeb3();
                        let stat = await web3.getNodeInfos();
                        //-let x = (BigInt($contract.keccak256("eip1967.proxy.implementation")) - 1n).toString(16);
                        let uin256Hex = await web3.getStorageAt('0x5a58505a96d1dbf8df91cb21b54419fc36e93fde', `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc`);
                        let hex = uin256Hex.replace(/0x0+/, '0x');
                        return this.getContractAbi(hex);
                    }
                    throw new Error(`Implement ${params.implementation} support`);
                }
                if (isOpenZeppelinProxy(abiJson)) {
                    let web3 = opts.getWeb3();
                    let uin256Hex = await web3.getStorageAt(address, `0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc`);
                    let hex = uin256Hex.replace(/0x0+/, '0x');
                    return this.getContractAbi(hex);
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
            async getContractSource(address) {
                let url = `${this.config.host}/api?module=contract&action=getsourcecode&address=${address}&apikey=${this.config.key}`;
                let result = await client.get(url);
                return Array.isArray(result) ? result[0] : result;
            }
            async getTransactions(addr, params) {
                return this.loadTxs('txlist', addr, params);
            }
            async getTransactionsAll(addr) {
                return this.loadTxsAll('txlist', addr);
            }
            async getInternalTransactions(addr, params) {
                return this.loadTxs('txlistinternal', addr, params);
            }
            async getInternalTransactionsAll(addr) {
                return this.loadTxsAll('txlistinternal', addr);
            }
            async getErc20Transfers(addr, fromBlockNumber) {
                let events = await this.loadTxs('tokentx', addr, { fromBlockNumber });
                events.forEach(transfer => {
                    transfer.timeStamp = new Date((Number(transfer.timeStamp) * 1000));
                    transfer.value = BigInt(transfer.value);
                    transfer.blockNumber = Number(transfer.blockNumber);
                    transfer.tokenDecimal = Number(transfer.tokenDecimal);
                });
                return events;
            }
            async getErc20TransfersAll(addr, fromBlockNumber) {
                let events = await this.loadTxsAll('tokentx', addr);
                events.forEach(transfer => {
                    transfer.timeStamp = new Date((Number(transfer.timeStamp) * 1000));
                    transfer.value = BigInt(transfer.value);
                    transfer.blockNumber = Number(transfer.blockNumber);
                    transfer.tokenDecimal = Number(transfer.tokenDecimal);
                });
                return events;
            }
            async loadTxs(type, address, params) {
                let url = `${this.config.host}/api?module=account&action=${type}&address=${address}&sort=${params.sort ?? 'desc'}&apikey=${this.config.key}`;
                if (params.fromBlockNumber != null) {
                    url += `&startblock=${params.fromBlockNumber}`;
                }
                if (params.page != null) {
                    url += `&page=${params.page}`;
                }
                if (params.size != null) {
                    url += `&offset=${params.size}`;
                }
                let txs = await client.get(url);
                return txs;
            }
            async loadTxsAll(type, address) {
                let page = 1;
                let size = 1000;
                let out = [];
                let fromBlockNumber = null;
                while (true) {
                    let arr = await this.loadTxs(type, address, { fromBlockNumber, sort: 'asc' });
                    out.push(...arr);
                    _logger_1.$logger.log(`Got transactions(${type}) for ${address}. Page: ${arr.length}; Received: ${out.length}. Latest Block: ${fromBlockNumber}`);
                    if (arr.length < size) {
                        break;
                    }
                    page++;
                    fromBlockNumber = Number(arr[arr.length - 1].blockNumber);
                }
                return (0, alot_1.default)(out).distinctBy(x => x.hash).toArray();
            }
        };
    }
    BlockChainExplorerFactory.create = create;
})(BlockChainExplorerFactory = exports.BlockChainExplorerFactory || (exports.BlockChainExplorerFactory = {}));
function isOpenZeppelinProxy(abi) {
    let $interface = ['upgradeTo', 'implementation'];
    return $interface.every(name => {
        return abi.some(item => item.type === 'function' && item.name === name);
    });
}
function hasImplementationSlot(abi) {
    let $interface = ['proxyOwner', 'implementation'];
    return $interface.every(name => {
        return abi.some(item => item.type === 'function' && item.name === name);
    });
}
function hasTargetSlot(abi) {
    let $interface = ['upgrade', 'getTarget'];
    return $interface.every(name => {
        return abi.some(item => item.type === 'function' && item.name === name);
    });
}
class Client {
    async get(url) {
        return this.getInner(url);
    }
    async getPaged(url) {
        let arr = [];
        let page = 1;
        let size = 200;
        while (true) {
            let path = `${url}&page=${page}&offset=${size}`;
            let pageArr = await this.get(path);
            arr = arr.concat(pageArr);
            if (pageArr.length < size) {
                break;
            }
            page++;
        }
        return arr;
    }
    async getInner(url, opts) {
        let resp = await axios_1.default.get(url);
        let data = resp.data;
        if (data.message === 'NOTOK') {
            let str = data.result;
            if (/Max rate/i.test(str)) {
                let count = opts?.retryCount ?? 3;
                if (--count === 0) {
                    throw new Error(str);
                }
                await _promise_1.$promise.wait(200);
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
__decorate([
    memd_1.default.deco.queued({ throttle: 1000 / 5 })
], Client.prototype, "get", null);
