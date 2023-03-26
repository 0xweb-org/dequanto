"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRangePriceService = exports.AmmV2PriceQuote = void 0;
const a_di_1 = __importDefault(require("a-di"));
const alot_1 = __importDefault(require("alot"));
const PancakeswapExchange_1 = require("./PancakeswapExchange");
const UniswapV2Exchange_1 = require("./UniswapV2Exchange");
const TokenUtils_1 = require("../utils/TokenUtils");
const TokensService_1 = require("../TokensService");
const _address_1 = require("@dequanto/utils/$address");
const LoggerService_1 = require("@dequanto/loggers/LoggerService");
const TokenPriceStore_1 = require("../TokenOracles/TokenPriceStore");
const _bigint_1 = require("@dequanto/utils/$bigint");
const AmmPairV2Service_1 = require("./AmmBase/V2/AmmPairV2Service");
const SushiswapPolygonExchange_1 = require("./SushiswapPolygonExchange");
class AmmV2PriceQuote {
    constructor(client, explorer) {
        this.client = client;
        this.explorer = explorer;
        this.tokensService = a_di_1.default.resolve(TokensService_1.TokensService, this.client.platform, this.explorer);
        this.pairService = a_di_1.default.resolve(AmmPairV2Service_1.AmmPairV2Service, this.client, this.explorer);
        this.logger = a_di_1.default.resolve(LoggerService_1.LoggerService, 'AmmPriceV2Oracle');
        switch (client.platform) {
            case 'bsc':
                this.exchange = a_di_1.default.resolve(PancakeswapExchange_1.PancakeswapExchange, this.client, this.explorer);
                break;
            case 'eth':
                this.exchange = a_di_1.default.resolve(UniswapV2Exchange_1.UniswapV2Exchange, this.client, this.explorer);
                break;
            case 'polygon':
                this.exchange = a_di_1.default.resolve(SushiswapPolygonExchange_1.SushiswapPolygonExchange, this.client, this.explorer);
                break;
            default:
                throw new Error(`Unsupported Platform for exchange yet: ${client.platform}`);
        }
    }
    async getPrice(token, opts) {
        let amount = opts?.amountWei ?? (BigInt(opts?.amount ?? 1) * 10n ** BigInt(token.decimals));
        if (TokenUtils_1.TokenUtils.isStable(token.symbol)) {
            // Assume swap 1:1
            let usd = _bigint_1.$bigint.divToFloat(amount, 10n ** BigInt(token.decimals));
            return {
                result: {
                    outToken: token,
                    outAmount: amount,
                    outUsd: usd,
                    outUsdPrice: 1,
                    inToken: token,
                    inAmount: amount,
                    inUsd: usd,
                    inUsdPrice: 1,
                    route: [],
                }
            };
        }
        let cacheableDate = opts?.date ?? (opts?.block == null && new Date() || null);
        if (cacheableDate != null) {
            let swap = await this.getSwapFromCache(token, amount, cacheableDate);
            if (swap != null) {
                return swap;
            }
        }
        let pairs;
        if (opts?.pairs) {
            pairs = opts.pairs.map(pair => {
                let tokens = [pair.from.address, pair.to.address];
                let sorted = BigInt(tokens[0]) < BigInt(tokens[1]);
                return {
                    address: pair.address,
                    token0: sorted ? tokens[0] : tokens[1],
                    token1: sorted ? tokens[1] : tokens[0],
                    from: pair.from,
                    to: pair.to
                };
            });
        }
        let route = pairs ?? (opts?.route != null
            ? await this.pairService.resolveRoute(token.address, opts.route)
            : await this.pairService.resolveBestStableRoute(this.client.platform, token.address));
        if (route == null || route.length === 0) {
            let error = new Error(`Route not found for Token ${token.address}`);
            return { error };
        }
        let pools = await (0, alot_1.default)(route).mapAsync(async (lp) => {
            if (cacheableDate != null) {
                let price = await this.getPriceInUsdFromCache(lp.from.address, cacheableDate);
                if (price != null) {
                    return {
                        result: {
                            ...lp,
                            date: cacheableDate,
                            priceFrom: price
                        }
                    };
                }
            }
            let poolPair = this.exchange.pairContract(lp.address);
            let lpReserves = await poolPair
                .forBlock(opts?.block ?? opts?.date)
                .getReserves();
            if (lpReserves == null || lpReserves._reserve0 < 1000n) {
                let error = new Error(`Small reserve in the routed pool ${lp.address}: ${lpReserves._reserve1} - ${lpReserves._reserve0}`);
                this.logger.write(error.message);
                return { error };
            }
            return {
                result: {
                    ...lp,
                    date: cacheableDate,
                    reserves: lpReserves
                }
            };
        }).toArrayAsync({ errors: 'reject' });
        let error = (0, alot_1.default)(pools).first(x => x.error != null)?.error;
        if (error != null) {
            return { error };
        }
        let swapped = await TokenPrice.swapRouted(token, amount, pools.map(x => x.result), this.tokensService);
        return { result: swapped };
    }
    async getSwapFromCache(token, inAmount, date) {
        if (date == null) {
            return null;
        }
        let inPrice = await this.getPriceInUsdFromCache(token.address, date);
        if (inPrice == null) {
            return null;
        }
        let usdcToken = await this.tokensService.getToken('USDC');
        let outAmount = inAmount
            * (_bigint_1.$bigint.toBigInt(inPrice * 10 ** 6) * _bigint_1.$bigint.pow(10, usdcToken.decimals - 6))
            / (_bigint_1.$bigint.pow(10, token.decimals));
        let outUsd = _bigint_1.$bigint.divToFloat(outAmount, 10n ** BigInt(token.decimals));
        return {
            result: {
                outToken: usdcToken,
                outAmount: outAmount,
                outUsd: outUsd,
                outUsdPrice: 1,
                inToken: token,
                inAmount: inAmount,
                inUsd: outUsd,
                inUsdPrice: inPrice,
                route: [],
            }
        };
    }
    async getPriceInUsdFromCache(token, date) {
        if (date == null) {
            return null;
        }
        return TokenPriceStore_1.TokenPriceStore.forToken(token).getPrice(date.getTime());
    }
    async setPriceInUsdToCache(token, date, price) {
        if (date == null) {
            return null;
        }
        return TokenPriceStore_1.TokenPriceStore.forToken(token).setPrice(price, date.getTime());
    }
}
exports.AmmV2PriceQuote = AmmV2PriceQuote;
class TokenRangePriceService {
    constructor(service) {
        this.service = service;
        this.cache = new Map();
        this.INTERVAL = 5 * 60 * 1000;
    }
    async getPrice(mix, opts) {
        let key = typeof mix === 'string'
            ? mix
            : mix.address;
        let byBlock = null;
        let byDate = null;
        if (opts?.block != null) {
            byBlock = opts.block;
            key += '_' + (byBlock - byBlock % 20) + '';
        }
        else {
            let d = opts.date ?? new Date;
            byDate = new Date(d);
            byDate.setMilliseconds(0);
            byDate.setSeconds(0);
            let minutes = byDate.getMinutes();
            minutes -= minutes % 5;
            byDate.setMinutes(minutes);
            key += '_' + byDate.toISOString();
        }
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        let promise = this.service.getPrice(mix, {
            ...(opts ?? {}),
            date: byDate,
            block: byBlock
        });
        this.cache.set(key, promise);
        return promise;
    }
}
exports.TokenRangePriceService = TokenRangePriceService;
var TokenPrice;
(function (TokenPrice) {
    async function swapRouted(fromToken, fromAmount, route, tokenService) {
        let $step;
        let $fromToken = fromToken;
        let $fromAmount = fromAmount;
        let $route = [];
        for (let i = 0; i < route.length; i++) {
            $step = await calcSwap($fromToken, $fromAmount, route[i], tokenService);
            $fromAmount = $step.toAmount;
            $fromToken = $step.to;
            $route.push($step);
        }
        calcUsdFromRoute($route);
        let $stepFirst = $route[0];
        //console.log('LAST STEP for ', fromToken.symbol, $step);
        return {
            outToken: $step.to,
            outAmount: $step.toAmount,
            outUsd: $step.toUsd,
            outUsdPrice: $step.toPrice,
            inToken: $stepFirst.from,
            inAmount: $stepFirst.fromAmount,
            inUsd: $stepFirst.fromUsd,
            inUsdPrice: $stepFirst.fromPrice,
            route: $route,
        };
    }
    TokenPrice.swapRouted = swapRouted;
    function calcUsdFromRoute(route) {
        let knownUsd = route.find(x => x.fromUsd != null || x.toUsd != null);
        if (knownUsd == null) {
            return;
        }
        let knownUsdI = route.indexOf(knownUsd);
        for (let i = knownUsdI - 1; i > -1; i--) {
            let knownPrice = route[i + 1];
            let prev = route[i];
            prev.toUsd = knownPrice.fromUsd;
            prev.toPrice = TokenUtils_1.TokenUtils.calcPrice(prev.toAmount, prev.to, prev.toUsd);
            prev.fromUsd = prev.toUsd;
            prev.fromPrice = TokenUtils_1.TokenUtils.calcPrice(prev.fromAmount, prev.from, prev.fromUsd);
        }
        for (let i = knownUsdI + 1; i < route.length; i++) {
            let knownPrice = route[i - 1];
            let next = route[i];
            next.fromUsd = knownPrice.toUsd;
            next.fromPrice = TokenUtils_1.TokenUtils.calcPrice(next.fromAmount, next.from, next.fromUsd);
            next.toUsd = next.fromUsd;
            next.toPrice = TokenUtils_1.TokenUtils.calcPrice(next.toAmount, next.to, next.toUsd);
        }
    }
    async function calcPrices(swapped) {
    }
    TokenPrice.calcPrices = calcPrices;
    async function calcSwap(fromToken, fromAmount, lp, tokenService) {
        let fromTokenAddress = lp.from.address;
        let toTokenAddress = lp.to.address;
        if (_address_1.$address.eq(fromTokenAddress, fromToken.address) === false) {
            throw new Error(`Invalid from token addres ${fromTokenAddress} != ${fromToken.address}`);
        }
        let $fromPrice = lp.fromPrice;
        if ($fromPrice != null) {
            let $fromUsd = TokenUtils_1.TokenUtils.calcTotal(fromToken, fromAmount, $fromPrice);
            return {
                from: fromToken,
                fromAmount: fromAmount,
                fromUsd: $fromUsd,
                fromPrice: $fromPrice,
                // Optimistic assume same USD out.
                toUsd: $fromUsd
            };
        }
        let [fromI, toI] = BigInt(fromToken.address) < BigInt(toTokenAddress) ? [0, 1] : [1, 0];
        let toToken = lp.to;
        let reserveFrom = lp.reserves[`_reserve${fromI}`];
        let reserveTo = lp.reserves[`_reserve${toI}`];
        let k = reserveFrom * reserveTo;
        let reserveFromAfter = reserveFrom + fromAmount;
        let reserveToAfter = k / reserveFromAfter;
        let amountActual = reserveTo - reserveToAfter;
        let fromUsd = TokenUtils_1.TokenUtils.calcUsdIfStable(fromAmount, fromToken);
        let toUsd = TokenUtils_1.TokenUtils.calcUsdIfStable(amountActual, toToken);
        let fromPrice = TokenUtils_1.TokenUtils.calcPrice(fromAmount, fromToken, fromUsd ?? toUsd);
        let toPrice = TokenUtils_1.TokenUtils.calcPrice(amountActual, toToken, toUsd ?? fromUsd);
        //console.log('FromPice', fromPrice, fromAmount, fromToken, fromUsd, toUsd);
        //$logger.log(`Swap: ${fromToken.symbol}(${fromAmount})[${fromUsd}$] > ${toToken.symbol} (${amountActual})[${toUsd}$]; Price ${fromToken.symbol}: ${fromPrice}`);
        if (lp.date) {
            // Cache prices
            let fromStore = TokenPriceStore_1.TokenPriceStore.forToken(fromToken.address);
            fromStore.setPrice(fromPrice, lp.date.getTime());
            let toStore = TokenPriceStore_1.TokenPriceStore.forToken(toToken.address);
            toStore.setPrice(toPrice, lp.date.getTime());
        }
        return {
            from: lp.from,
            fromAmount: fromAmount,
            fromUsd: fromUsd ?? toUsd,
            fromPrice,
            to: lp.to,
            toAmount: amountActual,
            toUsd: toUsd ?? fromUsd,
            toPrice,
            usd: 0,
            date: new Date(Number(lp.reserves._blockTimestampLast * 1000)),
            pool: {
                address: lp.address,
                reserve0: lp.reserves._reserve0,
                reserve1: lp.reserves._reserve1,
            }
        };
    }
    TokenPrice.calcSwap = calcSwap;
})(TokenPrice || (TokenPrice = {}));
