"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenPriceServiceCacheable = exports.TokenPriceService = void 0;
const a_di_1 = __importDefault(require("a-di"));
const TokenUtils_1 = require("./utils/TokenUtils");
const TokensService_1 = require("./TokensService");
const _address_1 = require("@dequanto/utils/$address");
const AmmV2PriceQuote_1 = require("./TokenExchanges/AmmV2PriceQuote");
const _bigint_1 = require("@dequanto/utils/$bigint");
const _logger_1 = require("@dequanto/utils/$logger");
class TokenPriceService {
    constructor(client, explorer) {
        this.client = client;
        this.explorer = explorer;
        this.tokens = a_di_1.default.resolve(TokensService_1.TokensService, this.client.platform, this.explorer);
        this.oracle = a_di_1.default.resolve(AmmV2PriceQuote_1.AmmV2PriceQuote, this.client, this.explorer);
    }
    async getPrice(mix, opts) {
        let token;
        try {
            token = typeof mix === 'string'
                ? await this.tokens.getKnownToken(mix)
                : mix;
        }
        catch (error) { }
        if (token == null) {
            return { error: new Error(`Token ${mix} not found`) };
        }
        if (token.decimals == null) {
            return { error: new Error(`Token has no decimals ${token.symbol}`) };
        }
        let { error, result } = await this.oracle.getPrice(token, opts);
        if (error != null) {
            return { error };
        }
        return {
            price: result.outUsd,
            pools: result.route.map(route => {
                let sorted = BigInt(route.from.address) < BigInt(route.to.address);
                let t1 = {
                    price: sorted ? route.fromPrice : route.toPrice,
                    decimals: sorted ? route.from.decimals : route.to.decimals,
                    total: sorted ? route.pool.reserve0 : route.pool.reserve1,
                };
                let t2 = {
                    price: sorted ? route.toPrice : route.fromPrice,
                    decimals: sorted ? route.to.decimals : route.from.decimals,
                    total: sorted ? route.pool.reserve1 : route.pool.reserve0,
                };
                function getTotalToken(t) {
                    let amount = t.total / 10n ** BigInt(t.decimals);
                    return _bigint_1.$bigint.multWithFloat(amount, t.price);
                }
                return getTotalToken(t1) + getTotalToken(t2);
            })
        };
    }
}
exports.TokenPriceService = TokenPriceService;
class TokenPriceServiceCacheable {
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
exports.TokenPriceServiceCacheable = TokenPriceServiceCacheable;
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
            throw new Error(`TP: Invalid from token addres ${fromTokenAddress} != ${fromToken.address}`);
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
        _logger_1.$logger.log(`Swap: ${fromToken.symbol}(${fromAmount})[${fromUsd}$] > ${toToken.symbol} (${amountActual})[${toUsd}$]; Price ${fromToken.symbol}: ${fromPrice}`);
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
