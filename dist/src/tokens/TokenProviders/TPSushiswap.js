"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TPSushiswap = void 0;
const axios_1 = __importDefault(require("axios"));
const JsonArrayStore_1 = require("@dequanto/json/JsonArrayStore");
const TokenUtils_1 = require("../utils/TokenUtils");
const ATokenProvider_1 = require("./ATokenProvider");
const tokensStore = new JsonArrayStore_1.JsonArrayStore({
    path: '/data/tokens/sushi.json',
    key: (x) => x.symbol
});
class TPSushiswap extends ATokenProvider_1.ATokenProvider {
    getTokens() {
        return tokensStore.getAll();
    }
    /** Finds remote  */
    async find(address) {
        throw new Error('Not implemented');
    }
    async redownloadTokens() {
        let tokensByPlatform = await Promise.all([
            this.downloadForPlatform('eth'),
            this.downloadForPlatform('polygon'),
            this.downloadForPlatform('xdai'),
        ]);
        let globals = TokenUtils_1.TokenUtils.merge(...tokensByPlatform);
        await tokensStore.saveAll(globals);
        return globals;
    }
    async downloadForPlatform(platform) {
        let url;
        let mapper;
        function mapperApi(resp) {
            let arr = resp.data[1];
            return arr.map(t => {
                return {
                    symbol: t.Symbol,
                    name: t.Name,
                    decimals: t.Decimals,
                    platform: platform,
                    address: t.Contract,
                };
            });
        }
        function mapperGithub(resp) {
            let arr = resp.data;
            return arr.map(t => {
                return {
                    symbol: t.symbol,
                    name: t.name,
                    decimals: t.decimals,
                    platform: platform,
                    address: t.address,
                };
            });
        }
        switch (platform) {
            case 'eth':
                url = `https://api2.sushipro.io/?action=all_tokens&chainID=1`;
                mapper = mapperApi;
                break;
            case 'bsc':
                throw new Error(`Bsc is not supported by sushiswap api`);
                break;
            case 'polygon':
                url = `https://api2.sushipro.io/?action=all_tokens&chainID=137`;
                mapper = mapperApi;
                break;
            case 'xdai':
                url = `https://raw.githubusercontent.com/sushiswap/default-token-list/master/tokens/xdai.json`;
                mapper = mapperGithub;
                break;
            default:
                throw new Error(`Invalid Platform ${platform}`);
        }
        let resp = await axios_1.default.get(url);
        let tokens = mapper(resp);
        return tokens;
    }
}
exports.TPSushiswap = TPSushiswap;
