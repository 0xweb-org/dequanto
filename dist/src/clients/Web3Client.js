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
class Web3Client {
    constructor(config) {
        this.config = config;
        this.TIMEOUT = 3 * 60 * 1000;
        this.pool = new ClientPool_1.ClientPool(this.config);
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
    getTransaction(txHash) {
        return this.pool.call(web3 => {
            return web3.eth.getTransaction(txHash);
        });
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
                return BigInt(x);
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
    sendSignedTransaction(signedTxBuffer) {
        return this.pool.callPromiEvent(web3 => {
            return web3.eth.sendSignedTransaction(signedTxBuffer);
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
    getNodeInfos() {
        return this.pool.getNodeInfos();
    }
    getNodeStats() {
        return this.pool.getNodeStats();
    }
    static url(url) {
        const Ctor = this;
        return new Ctor({
            endpoints: [
                { url }
            ],
        });
    }
}
__decorate([
    memd_1.default.deco.memoize({ maxAge: 30 })
], Web3Client.prototype, "getBlockNumberCached", null);
exports.Web3Client = Web3Client;
