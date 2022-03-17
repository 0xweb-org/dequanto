"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TPOneInch = void 0;
const axios_1 = __importDefault(require("axios"));
const JsonArrayStore_1 = require("@dequanto/json/JsonArrayStore");
const TokenUtils_1 = require("../utils/TokenUtils");
const ATokenProvider_1 = require("./ATokenProvider");
const _path_1 = require("@dequanto/utils/$path");
class TPOneInch extends ATokenProvider_1.ATokenProvider {
    constructor() {
        super(...arguments);
        this.store = new JsonArrayStore_1.JsonArrayStore({
            path: _path_1.$path.resolve('/data/tokens/1inch.json'),
            key: x => x.symbol,
            format: true,
        });
    }
    getTokens() {
        return this.store.getAll();
    }
    async redownloadTokens() {
        let tokensByPlatform = await Promise.all([
            this.downloadForPlatform('eth'),
            this.downloadForPlatform('bsc'),
            this.downloadForPlatform('polygon'),
        ]);
        let globals = TokenUtils_1.TokenUtils.merge(...tokensByPlatform);
        await this.store.saveAll(globals);
        return globals;
    }
    async downloadForPlatform(platform) {
        let url;
        switch (platform) {
            case 'eth':
                url = `https://api.1inch.exchange/v3.0/1/tokens`;
                break;
            case 'bsc':
                url = `https://api.1inch.exchange/v3.0/56/tokens`;
                break;
            case 'polygon':
                url = `https://api.1inch.exchange/v3.0/137/tokens`;
                break;
            default:
                throw new Error(`Invalid Platform ${platform}`);
        }
        let resp = await axios_1.default.get(url);
        let hash = resp.data.tokens;
        let arr = Object.keys(hash).map(key => {
            let t = hash[key];
            return {
                symbol: t.symbol,
                name: t.name,
                decimals: t.decimals,
                logo: t.logoURI,
                platform: platform,
                address: t.address,
            };
        });
        return arr;
    }
}
exports.TPOneInch = TPOneInch;
