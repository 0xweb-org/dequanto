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
exports.ChainlinkOracle = void 0;
const a_di_1 = __importDefault(require("a-di"));
const alot_1 = __importDefault(require("alot"));
const memd_1 = __importDefault(require("memd"));
const _bigint_1 = require("@dequanto/utils/$bigint");
const ContractReader_1 = require("@dequanto/contracts/ContractReader");
const ChainlinkFeedProvider_1 = require("./ChainlinkFeedProvider");
const _require_1 = require("@dequanto/utils/$require");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const _cache_1 = require("@dequanto/utils/$cache");
const CACHE_PATH = _cache_1.$cache.file(`chainlink-feeds.json`);
class ChainlinkOracle {
    constructor(clients) {
        this.clients = clients;
        this.feeds = a_di_1.default.resolve(ChainlinkFeedProvider_1.ChainlinkFeedProvider);
        this.abi = {
            latestAnswer: `latestAnswer(): uint256`,
            latestTimestamp: `latestTimestamp(): uint256`,
            latestRoundData: `latestRoundData(): (uint256 roundId, uint256 answer, uint256 startedAt, uint256 updatedAt)`,
            decimals: `decimals(): uint64`,
            description: `description(): string`,
        };
    }
    async getPrice(token, opts) {
        opts ?? (opts = {});
        _require_1.$require.notNull(token.symbol, `Chainlink gets the feed by token's symbol, but it is empty`);
        let route = await this.feeds.getRouteForSymbol(token.symbol);
        if (route == null || route.length === 0) {
            return { error: new Error(`Chainlink feeds not found for ${token.symbol} to get the USD price`) };
        }
        let hops = await (0, alot_1.default)(route).mapAsync(async (hop) => {
            let [price, config,] = await Promise.all([
                this.price(hop),
                this.config(hop)
            ]);
            return { price, config };
        }).toArrayAsync();
        let { amountEth: price } = hops.reduce((prev, hop) => {
            let { price, config } = hop;
            let amountOut = _bigint_1.$bigint.multWithFloat(price.answer, prev.amountEth);
            let amountEth = _bigint_1.$bigint.toEther(amountOut, config.decimals);
            return { amountEth };
        }, { amountEth: 1 });
        let date = (0, alot_1.default)(hops).min(x => x.price.updatedAt);
        return {
            result: {
                quote: { symbol: 'USD' },
                price,
                date,
            }
        };
    }
    async config(feed) {
        let reader = this.getReader(feed.platform);
        let feedAddress = feed.address;
        let [decimals, description] = await Promise.all([
            reader.readAsync(feedAddress, this.abi.decimals),
            reader.readAsync(feedAddress, this.abi.description)
        ]);
        return { decimals, description };
    }
    async price(feed) {
        let reader = this.getReader(feed.platform);
        let feedAddress = feed.address;
        try {
            let { updatedAt, answer } = await reader.readAsync(feedAddress, this.abi.latestRoundData);
            return {
                answer: answer,
                updatedAt: new Date(Number(updatedAt) * 1000),
            };
        }
        catch (error) {
            // skip error, and try to check another old ABI
        }
        let [answer, updatedAt] = await Promise.all([
            reader.readAsync(feedAddress, this.abi.latestAnswer),
            reader.readAsync(feedAddress, this.abi.latestTimestamp)
        ]);
        return {
            answer: answer,
            updatedAt: new Date(Number(updatedAt) * 1000),
        };
    }
    getReader(platform) {
        let c = this.getClient(platform);
        return new ContractReader_1.ContractReader(c);
    }
    getClient(platform) {
        let c = this.clients?.find(x => x.platform === platform);
        if (c) {
            return c;
        }
        c = Web3ClientFactory_1.Web3ClientFactory.get(platform);
        return c;
    }
}
__decorate([
    memd_1.default.deco.memoize({
        perInstance: true,
        trackRef: true,
        key: (ctx, feed) => {
            let self = ctx.this;
            let key = `cl_feed_${feed.address}`;
            return key;
        },
        persistance: new memd_1.default.FsTransport({ path: CACHE_PATH })
    })
], ChainlinkOracle.prototype, "config", null);
__decorate([
    memd_1.default.deco.memoize({ maxAge: 60 /* minute */ })
], ChainlinkOracle.prototype, "price", null);
__decorate([
    memd_1.default.deco.memoize()
], ChainlinkOracle.prototype, "getReader", null);
exports.ChainlinkOracle = ChainlinkOracle;
