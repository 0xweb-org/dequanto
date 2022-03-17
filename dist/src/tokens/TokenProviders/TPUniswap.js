"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TPUniswap = void 0;
const axios_1 = __importDefault(require("axios"));
const JsonArrayStore_1 = require("@dequanto/json/JsonArrayStore");
const ATokenProvider_1 = require("./ATokenProvider");
const _path_1 = require("@dequanto/utils/$path");
const TheGraphUrl = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
class TPUniswap extends ATokenProvider_1.ATokenProvider {
    constructor() {
        super(...arguments);
        this.store = new JsonArrayStore_1.JsonArrayStore({
            path: _path_1.$path.resolve('/data/tokens/uni.json'),
            key: x => x.symbol
        });
    }
    getTokens() {
        return this.store.getAll();
    }
    /** Finds remote  */
    async find(address) {
        let body = {
            query: `
                {
                    tokens (where: {id: "${address}"}) {
                    id
                    symbol
                    name
                    decimals
                    }
                }
            `
        };
        let resp = await axios_1.default.post(TheGraphUrl, body);
        return resp.data.data?.tokens[0];
    }
    async redownloadTokens() {
        let skip = 0;
        let take = 1000;
        let out = [];
        while (true) {
            let body = {
                query: `
                {
                    tokens (skip: ${skip} first:${take}) {
                      id
                      symbol
                      name
                      decimals
                    }
                }
                `
            };
            let resp = await axios_1.default.post(TheGraphUrl, body);
            console.log(resp);
            let tokens = resp.data.data?.tokens ?? [];
            let arr = tokens.map(uniT => {
                return {
                    symbol: uniT.symbol,
                    name: uniT.name,
                    decimals: Number(uniT.decimals) || 18,
                    platforms: [
                        {
                            platform: 'eth',
                            address: uniT.id,
                            decimals: uniT.decimals,
                        }
                    ]
                };
            });
            out = out.concat(...arr);
            if (tokens.length < take) {
                break;
            }
            skip += take;
        }
        await this.store.saveAll(out);
        return out;
    }
}
exports.TPUniswap = TPUniswap;
