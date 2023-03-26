"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmmV2Oracle = void 0;
const _require_1 = require("@dequanto/utils/$require");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const AmmV2PriceQuote_1 = require("@dequanto/tokens/TokenExchanges/AmmV2PriceQuote");
const BlockChainExplorerProvider_1 = require("@dequanto/BlockchainExplorer/BlockChainExplorerProvider");
const TokensServiceFactory_1 = require("@dequanto/tokens/TokensServiceFactory");
const _cache_1 = require("@dequanto/utils/$cache");
const CACHE_PATH = _cache_1.$cache.file(`amm-pairs.json`);
class AmmV2Oracle {
    constructor(clients) {
        this.clients = clients;
        let client = clients?.[0] ?? Web3ClientFactory_1.Web3ClientFactory.get('eth');
        let explorer = BlockChainExplorerProvider_1.BlockChainExplorerProvider.get(client.platform);
        this.quoter = new AmmV2PriceQuote_1.AmmV2PriceQuote(client, explorer);
    }
    async getPrice(token, opts) {
        opts ?? (opts = {});
        _require_1.$require.notNull(token.symbol, `Chainlink gets the feed by token's symbol, but it is empty`);
        let platform = this.quoter.client.platform;
        let t = token.symbol ?? token.address;
        let tokenService = TokensServiceFactory_1.TokensServiceFactory.get(platform);
        let tokenData = await tokenService.getKnownToken(t);
        if (tokenData == null) {
            throw new Error(`AmmV2Oracle: Token not found ${t} for ${platform}`);
        }
        let { error, result: route } = await this.quoter.getPrice(tokenData);
        if (error) {
            return { error };
        }
        return {
            result: {
                quote: route.outToken,
                price: route.outUsd,
                date: new Date(),
            }
        };
    }
}
exports.AmmV2Oracle = AmmV2Oracle;
