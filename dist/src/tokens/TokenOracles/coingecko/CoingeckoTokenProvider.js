"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoingeckoTokenProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const JsonArrayStore_1 = require("@dequanto/json/JsonArrayStore");
const _config_1 = require("@dequanto/utils/$config");
const _path_1 = require("@dequanto/utils/$path");
// https://www.coingecko.com/en/api/documentation
class CoingeckoTokenProvider {
    constructor() {
        this.root = _config_1.$config.get('oracles.coingecko.root');
        this.store = new JsonArrayStore_1.JsonArrayStore({
            path: _path_1.$path.resolve('/data/coingecko/tokens.json'),
            key: x => x.symbol,
            format: true,
        });
    }
    async getCoingeckoToken(token) {
        let arr = await this.store.getAll();
        let t = arr.find(x => x.symbol === token.symbol);
        return t;
    }
    async redownload() {
        let list = await this.downloadList();
        await this.store.saveAll(list);
        return list;
    }
    async downloadList() {
        let resp = await axios_1.default.get(`${this.root}/coins/list`);
        return resp.data;
    }
}
exports.CoingeckoTokenProvider = CoingeckoTokenProvider;
