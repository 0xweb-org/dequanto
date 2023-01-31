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
exports.TPCoingecko = void 0;
const axios_1 = __importDefault(require("axios"));
const memd_1 = __importDefault(require("memd"));
const alot_1 = __importDefault(require("alot"));
const atma_io_1 = require("atma-io");
const _path_1 = require("@dequanto/utils/$path");
const JsonArrayStore_1 = require("@dequanto/json/JsonArrayStore");
const ATokenProvider_1 = require("./ATokenProvider");
const _logger_1 = require("@dequanto/utils/$logger");
const _promise_1 = require("@dequanto/utils/$promise");
class TPCoingecko extends ATokenProvider_1.ATokenProvider {
    constructor() {
        super(...arguments);
        this.store = new JsonArrayStore_1.JsonArrayStore({
            path: _path_1.$path.resolve('/data/tokens/coingecko.json'),
            key: x => x.symbol,
            format: true,
        });
        this.mapping = {
            'ethereum': 'eth',
            'polygon-pos': 'poly',
            'xdai': 'xdai',
            'binance-smart-chain': 'bsc',
            'arbitrum-one': 'arbitrum'
        };
    }
    getTokens() {
        return this.store.getAll();
    }
    async redownloadTokens() {
        let list = await this.downloadList();
        (0, _logger_1.l) `Got list of ${list.length} tokens from CoinGecko. Fetching details...`;
        let tokens = await (0, alot_1.default)(list)
            .mapAsync(async (token, i) => {
            if (i > 0 && i % 10 === 0) {
                (0, _logger_1.l) `Fetched ${i}/${list.length} token details`;
            }
            let info = await this.downloadTokenInfoOrCache(token.id);
            return {
                name: token.name,
                symbol: token.symbol,
                platforms: alot_1.default
                    .fromObject(info?.detail_platforms ?? {})
                    .map(entry => {
                    let platform = this.mapPlatform(entry.key);
                    return {
                        platform,
                        decimals: entry.value.decimal_place,
                        address: entry.value.contract_address,
                    };
                })
                    .filter(x => Boolean(x.platform) && Boolean(x.address) && Boolean(x.decimals))
                    .toArray()
            };
        })
            .filterAsync(x => x.platforms.length > 0)
            .toArrayAsync();
        await this.store.saveAll(tokens);
        return tokens;
    }
    async downloadList() {
        let resp = await axios_1.default.get(`https://api.coingecko.com/api/v3/coins/list`);
        return resp.data;
    }
    async downloadTokenInfoOrCache(id) {
        let cachePath = `./cache/coingecko/${id}.json`;
        if (await atma_io_1.File.existsAsync(cachePath)) {
            let json = await atma_io_1.File.readAsync(cachePath);
            return json.info;
        }
        let info = await this._downloadTokenInfo(id);
        await atma_io_1.File.writeAsync(cachePath, { info, id, timestamp: Date.now() });
        return info;
    }
    // 50 per minute
    async _downloadTokenInfo(id) {
        let wait = 10000;
        async function fetch() {
            try {
                let resp = await axios_1.default.get(`https://api.coingecko.com/api/v3/coins/${id}`);
                return resp.data;
            }
            catch (error) {
                let e = error;
                if (e.response?.status === 404) {
                    return { id, detail_platforms: {} };
                }
                if (e.response?.status === 429) {
                    (0, _logger_1.l) `Throttled. Wait for ${wait}ms`;
                    await _promise_1.$promise.wait(wait);
                    wait *= 1.2;
                    return fetch();
                }
                throw error;
            }
        }
        return fetch();
    }
    mapPlatform(platformName) {
        return this.mapping[platformName] ?? platformName;
    }
}
__decorate([
    memd_1.default.deco.throttle(60 * 1000 / 50)
], TPCoingecko.prototype, "_downloadTokenInfo", null);
exports.TPCoingecko = TPCoingecko;
