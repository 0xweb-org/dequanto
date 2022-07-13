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
exports.TokensService = void 0;
const a_di_1 = __importDefault(require("a-di"));
const memd_1 = __importDefault(require("memd"));
const ERC20_1 = require("@dequanto/contracts/common/ERC20");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const BlockChainExplorerProvider_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerProvider");
const TokenDataProvider_1 = require("./TokenDataProvider");
class TokensService {
    constructor(platform, explorer) {
        this.platform = platform;
        this.explorer = explorer;
        this.provider = new TokenDataProvider_1.TokenDataProvider(this.platform, this.explorer);
    }
    async getTokenOrDefault(address, chainLookup = true) {
        return this.provider.getTokenOrDefault(address, chainLookup);
    }
    async getToken(mix, chainLookup = true) {
        return this.provider.getToken(mix, chainLookup);
    }
    async getKnownToken(mix) {
        return this.provider.getKnownToken(mix);
    }
    async addKnownToken(token) {
        await this.provider.addKnownToken(token);
    }
    isNative(mix) {
        return this.provider.isNative(mix);
    }
    getNative(platform = this.platform) {
        return this.provider.getNative(platform);
    }
    /** Download tokens with various exchange/swap providers and merge them into one collection. */
    async redownload() {
        return this.provider.redownload();
    }
    async getTokenByAddress(address, chainLookup = true) {
        return this.provider.getTokenByAddress(address, chainLookup);
    }
    async getTokenBySymbol(symbol, chainLookup = true) {
        return this.provider.getTokenBySymbol(symbol, chainLookup);
    }
    static async erc20(token, platform) {
        let client = Web3ClientFactory_1.Web3ClientFactory.get(platform);
        let explorer = BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(platform);
        if (typeof token === 'string') {
            let service = a_di_1.default.resolve(TokensService, platform, explorer);
            token = await service.getToken(token);
        }
        if (token == null) {
            throw new Error(`Token not found ${arguments[0]} in ${platform}`);
        }
        return new ERC20_1.ERC20(token.address, client, explorer);
    }
    async erc20(token) {
        return TokensService.erc20(token, this.platform);
        // let client = Web3ClientFactory.get(this.platform);
        // let explorer = BlockChainExplorerProvider.get(this.platform);
        // let t = typeof token === 'string'
        //     ? await this.getToken(token)
        //     : token;
        // if (t == null) {
        //     if (typeof token === 'string' && $address.isValid(token)) {
        //         t = {
        //             address: token,
        //             decimals: 18,
        //             platform: this.platform
        //         };
        //     }
        //     throw new Error(`Token not found: ${arguments[0]}`);
        // }
        // return new ERC20(t.address, client, explorer);
    }
}
__decorate([
    memd_1.default.deco.memoize()
], TokensService.prototype, "erc20", null);
__decorate([
    memd_1.default.deco.memoize()
], TokensService, "erc20", null);
exports.TokensService = TokensService;
