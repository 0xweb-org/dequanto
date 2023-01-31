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
exports.PlatformFactory = void 0;
const BlockChainExplorerProvider_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerProvider");
const ChainAccountsService_1 = require("@dequanto/ChainAccountsService");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const TokenService_1 = require("@dequanto/tokens/TokenService");
const TokensServiceFactory_1 = require("@dequanto/tokens/TokensServiceFactory");
const TokenTransferService_1 = require("@dequanto/tokens/TokenTransferService");
const memd_1 = __importDefault(require("memd"));
class PlatformFactory {
    async get(platform, opts) {
        let client = Web3ClientFactory_1.Web3ClientFactory.get(platform, opts);
        let tokens = TokensServiceFactory_1.TokensServiceFactory.get(platform);
        let explorer = BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(platform);
        let accounts = new ChainAccountsService_1.ChainAccountsService();
        let transfer = new TokenTransferService_1.TokenTransferService(client);
        let token = new TokenService_1.TokenService(client);
        return {
            platform,
            client,
            tokens,
            token,
            explorer,
            accounts,
            transfer,
        };
    }
}
__decorate([
    memd_1.default.deco.memoize()
], PlatformFactory.prototype, "get", null);
exports.PlatformFactory = PlatformFactory;
