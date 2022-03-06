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
exports.TxProvider = void 0;
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
const a_di_1 = __importDefault(require("a-di"));
const memd_1 = __importDefault(require("memd"));
class TxProvider {
    constructor(client = a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client)) {
        this.client = client;
        this.cache = CacheProvider.create(`./cache/${this.client.platform}/txs.json`);
    }
    async loadTransaction(txHash) {
        let tx = await this.client.getTransaction(txHash);
        return tx;
    }
    async loadTransactionCached(txHash) {
        return this.fromCache(`tx.${txHash}`, () => this.loadTransaction(txHash));
    }
    async loadTransactionReceipt(txHash) {
        let receipt = await this.client.getTransactionReceipt(txHash);
        return receipt;
    }
    async loadTransactionReceiptCached(txHash) {
        return this.fromCache(`receipt.${txHash}`, () => this.loadTransactionReceipt(txHash));
    }
    async loadBlock(blockNumber) {
        let block = await this.client.getBlock(blockNumber);
        return block;
    }
    async loadBlockCached(blockNumber) {
        return this.fromCache(`block.${blockNumber}`, () => this.loadBlock(blockNumber));
    }
    async fromCache(key, fn) {
        let cached = await this.cache.getAsync(key);
        if (cached) {
            return cached;
        }
        let val = await fn();
        await this.cache.setAsync(key, val);
        return val;
    }
}
__decorate([
    memd_1.default.deco.memoize()
], TxProvider.prototype, "loadTransactionCached", null);
__decorate([
    memd_1.default.deco.memoize()
], TxProvider.prototype, "loadTransactionReceiptCached", null);
__decorate([
    memd_1.default.deco.memoize()
], TxProvider.prototype, "loadBlockCached", null);
exports.TxProvider = TxProvider;
class CacheProvider {
    static create(path) {
        let cache = new memd_1.default.Cache({
            persistance: new memd_1.default.FsTransport({ path }),
            trackRef: true
        });
        return cache;
    }
}
__decorate([
    memd_1.default.deco.memoize()
], CacheProvider, "create", null);
