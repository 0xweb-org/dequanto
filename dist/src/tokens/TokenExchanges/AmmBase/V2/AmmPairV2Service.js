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
exports.AmmPairV2Service = void 0;
const a_di_1 = __importDefault(require("a-di"));
const alot_1 = __importDefault(require("alot"));
const memd_1 = __importDefault(require("memd"));
const _address_1 = require("@dequanto/utils/$address");
const PancakeswapExchange_1 = require("@dequanto/tokens/TokenExchanges/PancakeswapExchange");
const UniswapExchange_1 = require("@dequanto/tokens/TokenExchanges/UniswapExchange");
const TokensService_1 = require("@dequanto/tokens/TokensService");
const SushiswapPolygonExchange_1 = require("../../SushiswapPolygonExchange");
const _require_1 = require("@dequanto/utils/$require");
;
class AmmPairV2Service {
    constructor(client, explorer) {
        this.client = client;
        this.explorer = explorer;
        this.tokensService = a_di_1.default.resolve(TokensService_1.TokensService, this.client.platform, this.explorer);
        switch (client.platform) {
            case 'bsc':
                this.exchange = a_di_1.default.resolve(PancakeswapExchange_1.PancakeswapExchange, this.client, this.explorer);
                this.targetCoins = ['BUSD', 'USDT'];
                break;
            case 'eth':
                this.exchange = a_di_1.default.resolve(UniswapExchange_1.UniswapExchange, this.client, this.explorer);
                this.targetCoins = ['USDC', 'USDT', 'DAI'];
                break;
            case 'polygon':
                this.exchange = a_di_1.default.resolve(SushiswapPolygonExchange_1.SushiswapPolygonExchange, this.client, this.explorer);
                this.targetCoins = ['USDC', 'USDT', 'DAI'];
                break;
            default:
                throw new Error(`Unsupported Platform for exchange yet: ${client.platform}`);
        }
    }
    async resolveBestStableRoute(platform, address) {
        let pool = await (0, alot_1.default)(this.targetCoins)
            .mapAsync(async (symbol) => {
            return this.getPoolInfo(address, symbol);
        })
            .filterAsync(x => x != null)
            .sortByAsync(({ reserveTo }) => reserveTo, 'desc')
            .firstAsync();
        if (pool == null || pool.reserveTo < (50000n * BigInt(pool.pair.to.decimals))) {
            const SYMBOL = { eth: 'WETH', bsc: 'WBNB', polygon: 'MATIC' }[platform];
            _require_1.$require.notNull(SYMBOL, `Native symbol for platform ${platform} not FOUND`);
            const nativeTokenPool = await this.getPoolInfo(address, SYMBOL);
            if (nativeTokenPool == null || nativeTokenPool.reserveTo < 10) {
                return null;
            }
            let nativeRoute = await this.resolveBestStableRoute(platform, nativeTokenPool.pair.to.address);
            if (nativeRoute == null) {
                return null;
            }
            return [
                nativeTokenPool.pair,
                ...nativeRoute
            ];
        }
        return [pool.pair];
    }
    async resolveRoute(address, symbols) {
        let tokens = await (0, alot_1.default)(symbols)
            .mapAsync(x => this.tokensService.getTokenOrDefault(x))
            .toArrayAsync();
        let prev = address;
        let out = [];
        for (let token of tokens) {
            let poolInfo = await this.getPoolInfo(prev, token.address);
            out.push(poolInfo.pair);
            prev = token.address;
        }
        return out;
    }
    async getPoolInfo(fromAddress, symbol) {
        let toToken = await this.tokensService.getTokenOrDefault(symbol);
        if (toToken == null) {
            return null;
        }
        let lpAddress = await this.getPair(fromAddress, toToken.address);
        if (_address_1.$address.isEmpty(lpAddress)) {
            return null;
        }
        let poolPair = this.exchange.pairContract(lpAddress);
        let lpReserves = await poolPair.getReserves();
        if (lpReserves == null || lpReserves._reserve0 < 1000n) {
            return null;
        }
        let [fromI, toI] = BigInt(fromAddress) < BigInt(toToken.address) ? [0, 1] : [1, 0];
        let reserveFrom = lpReserves[`_reserve${fromI}`];
        let reserveTo = lpReserves[`_reserve${toI}`];
        if (toToken.decimals == null) {
            toToken.decimals = 18;
        }
        if (reserveTo < 10n ** BigInt(toToken.decimals ?? 18)) {
            return null;
        }
        let fromToken = await this.tokensService.getTokenOrDefault(fromAddress);
        return {
            pair: PairUtil.createPairInfo(fromToken, toToken, lpAddress),
            reserveTo: Number(reserveTo / 10n ** BigInt(toToken.decimals ?? 18)),
        };
    }
    async getPair(from, to) {
        return await this.exchange.factoryContract.getPair(from, to);
    }
}
__decorate([
    memd_1.default.deco.memoize({
        perInstance: true,
        trackRef: true,
        persistance: new memd_1.default.FsTransport({ path: `./cache/pools.json` })
    })
], AmmPairV2Service.prototype, "resolveBestStableRoute", null);
__decorate([
    memd_1.default.deco.memoize()
], AmmPairV2Service.prototype, "getPair", null);
exports.AmmPairV2Service = AmmPairV2Service;
var PairUtil;
(function (PairUtil) {
    function createPairInfo(fromToken, toToken, lpAddress) {
        let token0 = fromToken.address;
        let token1 = toToken.address;
        if (BigInt(token1) < BigInt(token0)) {
            token0 = toToken.address;
            token1 = fromToken.address;
        }
        return {
            address: lpAddress,
            token0,
            token1,
            from: fromToken,
            to: toToken,
        };
    }
    PairUtil.createPairInfo = createPairInfo;
})(PairUtil || (PairUtil = {}));
