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
exports.Web3Client = void 0;
const memd_1 = __importDefault(require("memd"));
const ClientPool_1 = require("./ClientPool");
const ClientPoolStats_1 = require("./ClientPoolStats");
const ethers_1 = require("ethers");
const _number_1 = require("@dequanto/utils/$number");
const a_di_1 = __importDefault(require("a-di"));
const BlockDateResolver_1 = require("@dequanto/blocks/BlockDateResolver");
class Web3Client {
    constructor(mix) {
        this.TIMEOUT = 3 * 60 * 1000;
        this.defaultTxType = 2;
        if (Array.isArray(mix)) {
            this.options = { endpoints: mix };
        }
        else if (mix != null) {
            this.options = mix;
        }
        if (this.options.endpoints == null && this.options.web3 == null) {
            console.dir(this.options, { depth: null });
            throw new Error(`Neither Node endpoints nor web3 instance provided`);
        }
        this.pool = new ClientPool_1.ClientPool(this.options);
    }
    async sign(txData, privateKey) {
        let wallet = new ethers_1.Wallet(privateKey);
        let json = {
            ...txData,
            type: txData.type ?? this.defaultTxType,
            chainId: this.chainId
        };
        if (json.type === 1) {
            // delete `type` field in case old tx type. Some old nodes may reject type field presence
            delete json.type;
        }
        let tx = await wallet.signTransaction(json);
        return tx;
    }
    getEventStream(address, abi, event) {
        return this.pool.getEventStream(address, abi, event);
    }
    with(fn) {
        return this.pool.call(fn);
    }
    withSync(fn) {
        return this.pool.callSync(fn);
    }
    async getWeb3(options) {
        return await this.pool.getWeb3(options);
    }
    async getNodeURL(options) {
        return await this.pool.getNodeURL(options);
    }
    async subscribe(...args) {
        let web3 = await this.getWeb3({ ws: true });
        return web3.eth.subscribe(...args);
    }
    readContract(data) {
        let { address, method, abi, options, blockNumber, arguments: params } = data;
        return this.pool.call(async (web3) => {
            let contract = new web3.eth.Contract(abi, address);
            let callArgs = [];
            if (options != null) {
                callArgs[0] = options;
            }
            if (blockNumber != null) {
                callArgs[0] = null;
                callArgs[1] = blockNumber;
            }
            let result = await contract.methods[method](...params).call(...callArgs);
            return result;
        }, {
            trace: ClientPoolStats_1.ClientPoolTrace.createContractCall(address, method, params)
        });
    }
    encodeParameters(types, paramaters) {
        return this.pool.callSync(web3 => {
            return web3.eth.abi.encodeParameters(types, paramaters);
        });
    }
    getBalance(address, blockNumber) {
        return this.pool.call(async (web3) => {
            let weiStr = await web3.eth.getBalance(address, blockNumber);
            return BigInt(weiStr);
        });
    }
    getTransactionCount(address, type) {
        return this.pool.call(web3 => {
            return web3.eth.getTransactionCount(address, type);
        });
    }
    isSyncing() {
        return this.pool.call(web3 => {
            return web3.eth.isSyncing();
        });
    }
    getTransaction(txHash, opts) {
        return this.pool.call(web3 => {
            return web3.eth.getTransaction(txHash);
        }, opts);
    }
    getTransactionReceipt(txHash) {
        return this.pool.call(web3 => {
            return web3.eth.getTransactionReceipt(txHash);
        });
    }
    getBlock(nr) {
        return this.pool.call(web3 => {
            return web3.eth.getBlock(nr);
        });
    }
    getPendingTransactions() {
        return this.pool.call(web3 => {
            return web3.eth.getPendingTransactions();
        });
    }
    getPoolStatus() {
        return this.pool.call(async (web3) => {
            let eth = web3.eth;
            if (eth.txpool == null) {
                eth.extend({
                    property: 'txpool',
                    methods: [{
                            name: 'content',
                            call: 'txpool_content'
                        }, {
                            name: 'inspect',
                            call: 'txpool_inspect'
                        }, {
                            name: 'status',
                            call: 'txpool_status'
                        }]
                });
            }
            let status = await eth.txpool.status();
            return {
                baseFee: BigInt(status.baseFee),
                pending: Number(status.pending),
                queued: Number(status.queued),
            };
        });
    }
    getStorageAt(address, position, blockNumber) {
        return this.pool.call(web3 => {
            return web3.eth.getStorageAt(address, position, blockNumber);
        });
    }
    getGasPrice() {
        return this.pool.call(web3 => {
            return web3.eth.getGasPrice().then(x => {
                return {
                    price: BigInt(x)
                };
            });
        });
    }
    getGasEstimation(from, tx) {
        return this.pool.call(async (web3) => {
            let txData = {
                from: from,
                to: tx.to,
                value: tx.value,
                data: tx.data,
                nonce: tx.nonce,
            };
            let gasAmount = await web3.eth.estimateGas(txData);
            return gasAmount;
        });
    }
    async getAccounts(options) {
        let web3 = await this.getWeb3(options);
        return web3.eth.getAccounts();
    }
    async getChainId(options) {
        let web3 = await this.getWeb3(options);
        return web3.eth.getChainId();
    }
    async switchChain(params, options) {
        let web3 = await this.getWeb3(options);
        if (typeof web3.eth.currentProvider.request !== 'function') {
            throw new Error(`Current provider doesn't have request method`);
        }
        return web3.eth.currentProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: _number_1.$number.toHex(params.chainId) }],
        });
    }
    sendSignedTransaction(signedTxBuffer) {
        return this.pool.callPromiEvent(web3 => {
            return web3.eth.sendSignedTransaction(signedTxBuffer);
        }, { preferSafe: true, distinct: true });
    }
    sendTransaction(data) {
        return this.pool.callPromiEvent(web3 => {
            return web3.eth.sendTransaction(data);
        }, { preferSafe: true, distinct: true });
    }
    getBlockNumber() {
        return this.pool.call(web3 => {
            return web3.eth.getBlockNumber();
        });
    }
    getBlockNumberCached() {
        return this.pool.call(web3 => {
            return web3.eth.getBlockNumber();
        });
    }
    async getPastLogs(options) {
        const getBlock = async (block) => {
            if (block == null) {
                return 'latest';
            }
            if (block instanceof Date) {
                let resolver = a_di_1.default.resolve(BlockDateResolver_1.BlockDateResolver, this);
                return resolver.getBlockNumberFor(block);
            }
            return block;
        };
        options.fromBlock = await getBlock(options.fromBlock);
        options.toBlock = await getBlock(options.toBlock);
        options.topics = options.topics?.map(topic => {
            if (typeof topic === 'string' && topic.startsWith('0x')) {
                return '0x' + topic.substring(2).padStart(64, '0');
            }
            return topic;
        });
        let MAX = this.pool.getOptionForFetchableRange();
        if (typeof options.fromBlock === 'number') {
            let to = options.toBlock;
            if (typeof to !== 'number') {
                to = await this.getBlockNumber();
            }
            let range = to - options.fromBlock;
            if (range > MAX) {
                let logs = [];
                let cursor = options.fromBlock;
                let pages = Math.ceil(range / MAX);
                let page = 0;
                let complete = false;
                while (complete === false) {
                    ++page;
                    console.log(`Get past logs paged: ${page}/${pages}. Loaded ${logs.length}`);
                    let end = cursor + MAX;
                    if (end > to) {
                        end = options.toBlock;
                        complete = true;
                    }
                    let paged = await this.pool.call(web3 => web3.eth.getPastLogs({
                        ...options,
                        fromBlock: cursor,
                        toBlock: end ?? undefined,
                    }));
                    logs.push(...paged);
                    cursor += MAX + 1;
                }
            }
        }
        return this.pool.call(web3 => {
            return web3.eth.getPastLogs(options);
        });
    }
    getNodeInfos() {
        return this.pool.getNodeInfos();
    }
    getNodeStats() {
        return this.pool.getNodeStats();
    }
    static url(mix, opts) {
        const Ctor = this;
        let options;
        if (typeof mix === 'string') {
            options = { endpoints: [{ url: mix }] };
        }
        else if (Array.isArray(mix)) {
            options = { endpoints: mix };
        }
        else {
            options = mix;
        }
        const param = {
            ...options,
            ...(opts ?? {})
        };
        return new Ctor(param);
    }
}
__decorate([
    memd_1.default.deco.memoize({ maxAge: 30 })
], Web3Client.prototype, "getBlockNumberCached", null);
exports.Web3Client = Web3Client;
