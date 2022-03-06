import di from 'a-di';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IToken } from '@dequanto/models/IToken';
import { AmmV2ExchangeBase } from './TokenExchanges/AmmV2ExchangeBase';
import { TAddress } from '@dequanto/models/TAddress';
import { TokenUtils } from './utils/TokenUtils';
import { TokensService } from './TokensService';
import { $address } from '@dequanto/utils/$address';
import { LoggerService } from '@dequanto/loggers/LoggerService';
import { TResultAsync } from '@dequanto/models/TResult';
import { AmmPairV2Service, ISwapped, ISwapPool, ISwapRouted } from './TokenExchanges/AmmBase/V2/AmmPairV2Service';
import { AmmPriceV2Oracle } from './TokenOracles/AmmPriceV2Oracle';
import { TokenPriceStore } from './TokenOracles/TokenPriceStore';
import { $bigint } from '@dequanto/utils/$bigint';
import { $logger } from '@dequanto/utils/$logger';



interface ITokenPriceOptions {
    /** default: 1 */
    amount?: number

    amountWei?: bigint

    date?: Date
    block?: number
    route?: string[]

    pairs?: any[]
}
interface ITokenPrice {
    error?: Error
    price?: number
    pools?: any[]
}

export class TokenPriceService {

    private tokens = di.resolve(TokensService, this.client.platform, this.explorer)
    private oracle = di.resolve(
        AmmPriceV2Oracle
        , this.client
        , this.explorer
    );

    constructor(private client: Web3Client, private explorer: IBlockChainExplorer) {

    }

    async getPrice (symbol: string, opts?: ITokenPriceOptions): Promise<ITokenPrice>
    async getPrice (address: TAddress, opts?: ITokenPriceOptions): Promise<ITokenPrice>
    async getPrice (token: IToken, opts?: ITokenPriceOptions): Promise<ITokenPrice>
    async getPrice (mix: IToken | TAddress | string, opts?: ITokenPriceOptions): Promise<ITokenPrice> {

        let token: IToken;

        try {
            token = typeof mix === 'string'
                ? await this.tokens.getKnownToken(mix)
                : mix;
        } catch (error) {}

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

                function getTotalToken(t: { price: number, total: bigint, decimals: number }): bigint {
                    let amount = t.total / 10n** BigInt(t.decimals);
                    return $bigint.multWithFloat(amount, t.price);
                }

                return getTotalToken(t1) + getTotalToken(t2);
            })
        };
    }
}


export class TokenPriceServiceCacheable {

    private cache = new Map<string, ReturnType<TokenPriceService['getPrice']>>()
    private INTERVAL = 5 * 60 * 1000;

    constructor (private service: TokenPriceService) {

    }


    async getPrice (symbol: string, opts?: ITokenPriceOptions): TResultAsync<ISwapRouted>
    async getPrice (address: TAddress, opts?: ITokenPriceOptions): TResultAsync<ISwapRouted>
    async getPrice (token: IToken, opts?: ITokenPriceOptions): TResultAsync<ISwapRouted>
    async getPrice (mix: IToken | TAddress | string, opts?: ITokenPriceOptions): TResultAsync<ISwapRouted> {

        let key: string = typeof mix === 'string'
            ? mix
            : mix.address;

        let byBlock: number = null;
        let byDate: Date = null;

        if (opts?.block != null) {
            byBlock = opts.block;
            key += '_' + (byBlock - byBlock % 20) + '';

        } else {
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

        let promise = this.service.getPrice(<any> mix, {
            ...(opts ?? {}),
            date: byDate,
            block: byBlock
        });
        this.cache.set(key, promise);
        return promise;
    }
}


namespace TokenPrice {


    export async function swapRouted (fromToken: IToken, fromAmount: bigint, route: ISwapPool[], tokenService: TokensService): Promise<ISwapRouted> {
        let $step: ISwapped;
        let $fromToken = fromToken;
        let $fromAmount = fromAmount;
        let $route = [] as ISwapped[];

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

    function calcUsdFromRoute (route: ISwapped[]) {
        let knownUsd = route.find(x => x.fromUsd != null || x.toUsd != null);
        if (knownUsd == null) {
            return;
        }
        let knownUsdI = route.indexOf(knownUsd);
        for (let i = knownUsdI - 1; i > -1; i--) {
            let knownPrice = route[i + 1];
            let prev = route[i];

            prev.toUsd = knownPrice.fromUsd;
            prev.toPrice = TokenUtils.calcPrice(prev.toAmount, prev.to, prev.toUsd);
            prev.fromUsd = prev.toUsd;
            prev.fromPrice = TokenUtils.calcPrice(prev.fromAmount, prev.from, prev.fromUsd);
        }
        for (let i = knownUsdI + 1; i < route.length; i++) {
            let knownPrice = route[i - 1];
            let next = route[i];

            next.fromUsd = knownPrice.toUsd;
            next.fromPrice = TokenUtils.calcPrice(next.fromAmount, next.from, next.fromUsd);
            next.toUsd = next.fromUsd;
            next.toPrice = TokenUtils.calcPrice(next.toAmount, next.to, next.toUsd);
        }
    }

    export async function calcPrices (swapped: ISwapped) {

    }

    export async function calcSwap (fromToken: IToken, fromAmount: bigint, lp: ISwapPool, tokenService: TokensService) {

        let fromTokenAddress: TAddress = lp.from.address;
        let toTokenAddress: TAddress = lp.to.address;

        if ($address.eq(fromTokenAddress, fromToken.address) === false) {
            throw new Error(`TP: Invalid from token addres ${fromTokenAddress} != ${fromToken.address}`);
        }

        let [ fromI, toI ] = BigInt(fromToken.address) < BigInt(toTokenAddress) ? [0, 1] : [1, 0];

        let toToken = lp.to;
        let reserveFrom: bigint = lp.reserves[`_reserve${fromI}`];
        let reserveTo: bigint = lp.reserves[`_reserve${toI}`];

        let k = reserveFrom * reserveTo;
        let reserveFromAfter = reserveFrom + fromAmount;
        let reserveToAfter = k / reserveFromAfter;
        let amountActual = reserveTo - reserveToAfter;
        let fromUsd = TokenUtils.calcUsdIfStable(fromAmount, fromToken);
        let toUsd = TokenUtils.calcUsdIfStable(amountActual, toToken);

        let fromPrice = TokenUtils.calcPrice(fromAmount, fromToken, fromUsd ?? toUsd);
        let toPrice = TokenUtils.calcPrice(amountActual, toToken, toUsd ?? fromUsd);

        //console.log('FromPice', fromPrice, fromAmount, fromToken, fromUsd, toUsd);
        $logger.log(`Swap: ${fromToken.symbol}(${fromAmount})[${fromUsd}$] > ${toToken.symbol} (${amountActual})[${toUsd}$]; Price ${fromToken.symbol}: ${fromPrice}`);

        return <ISwapped> {
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
}
