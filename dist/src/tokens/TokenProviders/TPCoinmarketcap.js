"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TPCoinmarketcap = void 0;
const axios_1 = __importDefault(require("axios"));
const atma_utils_1 = require("atma-utils");
const JsonArrayStore_1 = require("@dequanto/json/JsonArrayStore");
const _config_1 = require("@dequanto/utils/$config");
const ATokenProvider_1 = require("./ATokenProvider");
const coinmarketcap = _config_1.$config.get('coinmarketcap');
const tokensStore = new JsonArrayStore_1.JsonArrayStore({
    path: atma_utils_1.class_Uri.combine(coinmarketcap?.cache ?? './data/tokens/coinmarketcap/', 'tokens.json'),
    key: (x) => x.symbol
});
const HOST = `https://pro-api.coinmarketcap.com/`;
class TPCoinmarketcap extends ATokenProvider_1.ATokenProvider {
    getTokens() {
        return tokensStore.getAll();
    }
    async redownloadTokens() {
        if (coinmarketcap == null) {
            console.warn(`No ApiKey for coinmarketcap found. Skipping this token provider`);
            return [];
        }
        let url = atma_utils_1.class_Uri.combine(HOST, `/v1/cryptocurrency/map?CMC_PRO_API_KEY=${coinmarketcap.key}`);
        let resp = await axios_1.default.get(url);
        let tokens = resp.data.data;
        let arr = tokens.map(token => {
            if (token.platform == null) {
                return null;
            }
            let platform;
            switch (token.platform.name) {
                case "Binance Smart Chain":
                    platform = "bsc";
                    break;
                case "Ethereum":
                    platform = "eth";
                    break;
                case "Polygon":
                    platform = "polygon";
                    break;
                case "xDai":
                    platform = "xdai";
                    break;
                default:
                    return null;
            }
            return {
                symbol: token.symbol,
                name: token.name,
                platforms: [{
                        platform,
                        address: token.platform.token_address
                    }]
            };
        }).filter(Boolean);
        await tokensStore.saveAll(arr);
    }
}
exports.TPCoinmarketcap = TPCoinmarketcap;
