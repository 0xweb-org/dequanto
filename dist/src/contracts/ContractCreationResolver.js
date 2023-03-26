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
exports.ContractCreationResolver = void 0;
const memd_1 = __importDefault(require("memd"));
const _block_1 = require("@dequanto/utils/$block");
const _cache_1 = require("@dequanto/utils/$cache");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const BlockChainExplorerProvider_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerProvider");
const _require_1 = require("@dequanto/utils/$require");
const _promise_1 = require("@dequanto/utils/$promise");
class ContractCreationResolver {
    constructor(client, explorer) {
        this.client = client;
        this.explorer = explorer;
        _require_1.$require.notNull(client, 'Web3Client is undefined');
        _require_1.$require.notNull(explorer, 'Explorer is undefined');
    }
    static get(platform) {
        let client = Web3ClientFactory_1.Web3ClientFactory.get(platform);
        let explorer = BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(platform);
        return new ContractCreationResolver(client, explorer);
    }
    async getInfo(address) {
        let resovler = new BlockchainExplorerDateResolver(this.client, this.explorer);
        return resovler.get(address);
    }
}
__decorate([
    memd_1.default.deco.memoize({
        trackRef: true,
        key: (ctx, address) => {
            let self = ctx.this;
            let key = `${self.client.platform}:${address}`;
            return key;
        },
        persistance: new memd_1.default.FsTransport({ path: _cache_1.$cache.file('contract-dates.json') })
    })
], ContractCreationResolver.prototype, "getInfo", null);
exports.ContractCreationResolver = ContractCreationResolver;
class OnchainDateResolver {
    constructor(client) {
        this.client = client;
        throw new Error(`Not implemented`);
    }
    async get(address) {
        this.to = await this.client.getBlockNumberCached();
        this.from = 0;
    }
}
class BlockchainExplorerDateResolver {
    constructor(client, explorer) {
        this.client = client;
        this.explorer = explorer;
    }
    async get(address) {
        let { result: info, error } = await _promise_1.$promise.catched(this.explorer.getContractCreation(address));
        if (error) {
            if (/empty/i.test(error.message)) {
                let code = await this.client.getCode(address);
                if (code == null) {
                    throw new Error(`${this.client.platform}:${address} is not a contract`);
                }
            }
            throw error;
        }
        let tx = await this.client.getTransaction(info.txHash);
        let block = await this.client.getBlock(tx.blockNumber);
        return {
            tx: tx.hash,
            block: tx.blockNumber,
            timestamp: _block_1.$block.getDate(block).valueOf()
        };
    }
}
