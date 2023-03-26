"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainlinkFeedProvider = void 0;
const alot_1 = __importDefault(require("alot"));
const axios_1 = __importDefault(require("axios"));
const JsonArrayStore_1 = require("@dequanto/json/JsonArrayStore");
const _path_1 = require("@dequanto/utils/$path");
const _require_1 = require("@dequanto/utils/$require");
const _logger_1 = require("@dequanto/utils/$logger");
const _str_1 = require("@dequanto/solidity/utils/$str");
class ChainlinkFeedProvider {
    constructor() {
        this.store = new JsonArrayStore_1.JsonArrayStore({
            path: _path_1.$path.resolve('/data/chainlink/feeds.json'),
            key: x => x.address,
            format: true,
        });
    }
    async getFeeds() {
        return await this.store.getAll();
    }
    async getRouteForSymbol(symbol, targetSymbol = 'USD', ignoreSymbols = []) {
        let allFeeds = await this.getFeeds();
        let symbolFeeds = allFeeds.filter(x => x.pair[0] === symbol);
        let target = symbolFeeds.find(x => x.pair[1] === targetSymbol);
        if (target) {
            return [target];
        }
        let routes = await (0, alot_1.default)(symbolFeeds)
            .mapAsync(async (symbolFeed) => {
            let hopSymbol = symbolFeed.pair[1];
            if (ignoreSymbols.includes(hopSymbol)) {
                return null;
            }
            let ignore = [...ignoreSymbols, symbol];
            let arr = await this.getRouteForSymbol(hopSymbol, targetSymbol, ignore);
            if (arr == null || arr.length === 0) {
                return null;
            }
            return [symbolFeed, ...arr];
        })
            .filterAsync(x => x != null && x.length > 0)
            .toArrayAsync();
        if (routes.length === 0) {
            return [];
        }
        let smallest = (0, alot_1.default)(routes).sortBy(x => x.length).first();
        return [...smallest];
    }
    async redownload() {
        // from 'https://docs.chain.link/data-feeds/price-feeds/addresses';
        const paths = [
            { url: 'https://reference-data-directory.vercel.app/feeds-mainnet.json', platform: 'eth' },
            { url: 'https://reference-data-directory.vercel.app/feeds-matic-mainnet.json', platform: 'polygon' }
        ];
        let tokens = await (0, alot_1.default)(paths).mapManyAsync(async (pathInfo) => {
            return this.fetchFeed(pathInfo.url, pathInfo.platform);
        }).toArrayAsync();
        (0, _logger_1.l) `Fetched ${tokens.length} feeds`;
        let platformStats = (0, alot_1.default)(tokens).groupBy(x => x.platform).toDictionary(x => x.key, x => x.values.length);
        (0, _logger_1.l) `Feeds per platform: ${platformStats}`;
        let uniqueStats = (0, alot_1.default)(tokens).distinctBy(x => x.pair[0]).toArray().length;
        (0, _logger_1.l) `Feeds with unique base: ${uniqueStats}`;
        await this.store.saveAll(tokens);
        return tokens;
    }
    async fetchFeed(path, platform) {
        const resp = await axios_1.default.get(path);
        const tokens = (0, alot_1.default)(resp.data).map(feed => {
            let pair;
            if (_str_1.$str.isNullOrWhiteSpace(feed.pair[0] || feed.pair[1])) {
                let match = /(?<base>\w+)\s*\/\s*(?<quote>\w+)/.exec(feed.name);
                if (match == null) {
                    console.log(` - Chainlink skipped "${feed.name}" as not a crypto pair`);
                    return null;
                }
                pair = [match.groups.base, match.groups.quote];
            }
            else {
                pair = feed.pair;
            }
            switch (feed.feedCategory) {
                case 'deprecating': {
                    // skip
                    return null;
                }
                default: {
                    if (feed.feedCategory !== 'verified') {
                        console.log(` - The Feed ${feed.name} is not verified ("${feed.feedCategory}")`);
                    }
                    break;
                }
            }
            _require_1.$require.notNull(feed.proxyAddress, `The proxy address is undefined in ${JSON.stringify(feed)}`);
            return {
                platform: platform,
                address: feed.proxyAddress,
                asset: feed.assetName ?? feed.name,
                pair: pair,
            };
        })
            .filter(x => x != null)
            .toArray();
        return tokens;
    }
}
exports.ChainlinkFeedProvider = ChainlinkFeedProvider;
