"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArbTokenProvider = void 0;
const JsonArrayStore_1 = require("@dequanto/json/JsonArrayStore");
const ATokenProvider_1 = require("@dequanto/tokens/TokenProviders/ATokenProvider");
const axios_1 = __importDefault(require("axios"));
let tokensStore = new JsonArrayStore_1.JsonArrayStore({
    path: '/data/tokens/arbitrum.json',
    key: x => x.symbol
});
class ArbTokenProvider extends ATokenProvider_1.ATokenProvider {
    getTokens() {
        return tokensStore.getAll();
    }
    async redownloadTokens() {
        let { data: json } = await axios_1.default.get(`https://bridge.arbitrum.io/token-list-42161.json`);
        let tokens = json.tokens.map(token => {
            return {
                symbol: token.symbol,
                name: token.name,
                logo: token.logoURI,
                platforms: [{
                        platform: 'arbitrum',
                        address: token.address,
                        decimals: token.decimals
                    }]
            };
        });
        await tokensStore.saveAll(tokens);
        return tokens;
    }
}
exports.ArbTokenProvider = ArbTokenProvider;
