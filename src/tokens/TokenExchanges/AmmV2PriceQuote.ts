import di from 'a-di';
import alot from 'alot';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IToken } from '@dequanto/models/IToken';
import { AmmV2ExchangeBase } from './AmmV2ExchangeBase';
import { PancakeswapExchange } from './PancakeswapExchange';
import { UniswapV2Exchange } from './UniswapV2Exchange';
import { TAddress } from '@dequanto/models/TAddress';
import { TokenUtils } from '../utils/TokenUtils';
import { TokensService } from '../TokensService';
import { $address } from '@dequanto/utils/$address';
import { LoggerService } from '@dequanto/loggers/LoggerService';
import { TResult, TResultAsync } from '@dequanto/models/TResult';
import { TokenPriceStore } from '../TokenOracles/TokenPriceStore';
import { $bigint } from '@dequanto/utils/$bigint';
import { AmmPairV2Service, ISwapPool, ISwapPoolInfo } from './AmmBase/V2/AmmPairV2Service';
import { SushiswapPolygonExchange } from './SushiswapPolygonExchange';
import { ISwapOptions } from '../TokenOracles/IOracle';


export class AmmV2PriceQuote {

    private exchange: AmmV2ExchangeBase
    private tokensService = di.resolve(TokensService, this.client.platform, this.explorer)
    private pairService = di.resolve(AmmPairV2Service, this.client, this.explorer)
    private logger = di.resolve(LoggerService, 'AmmPriceV2Oracle');

    constructor(public client: Web3Client, public explorer: IBlockChainExplorer) {
        switch (client.platform) {
            case 'bsc':
                this.exchange = di.resolve(PancakeswapExchange, this.client, this.explorer);
                break;
            case 'eth':
                this.exchange = di.resolve(UniswapV2Exchange, this.client, this.explorer);
                break;
            case 'polygon':
                this.exchange = di.resolve(SushiswapPolygonExchange, this.client, this.explorer);
                break;
            default:
                throw new Error(`Unsupported Platform for exchange yet: ${client.platform}`);
        }
    }

    async getPrice (token: IToken, opts?: ISwapOptions): TResultAsync<ISwapRouted> {
        let amount = opts?.amountWei ?? (BigInt(opts?.amount ?? 1) * 10n ** BigInt(token.decimals));

        if (TokenUtils.isStable(token.symbol)) {
            // Assume swap 1:1
            let usd = $bigint.divToFloat(amount, 10n**BigInt(token.decimals));
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

        let cashableDate = opts?.date ?? (opts?.block == null && new Date() || null);
        if (cashableDate != null) {
            let swap = await this.getSwapFromCache(token, amount, cashableDate);
            if (swap != null) {
                return swap;
            }
        }

        let pairs: ISwapPoolInfo[];
        if (opts?.pairs) {
            pairs = opts.pairs.map(pair => {
                let tokens = [pair.from.address, pair.to.address ];
                let sorted = BigInt(tokens[0]) < BigInt(tokens[1]);
                return <ISwapPoolInfo> {
                    address: pair.address,
                    token0: sorted ? tokens[0] : tokens[1],
                    token1: sorted ? tokens[1] : tokens[0],
                    from: pair.from,
                    to: pair.to
                };
            })
        }

        let route: ISwapPoolInfo[] = pairs ?? (opts?.route != null
            ? await this.pairService.resolveRoute(token.address, opts.route)
            : await this.pairService.resolveBestStableRoute(this.client.platform, token.address)
        );

        if (route == null || route.length === 0) {
            let error = new Error(`Route not found for Token ${token.address}`);
            return { error };
        }

        let pools = await alot(route).mapAsync<TResult<ISwapPool>>(async lp => {

            if (cashableDate != null) {
                let price = await this.getPriceInUsdFromCache(lp.from.address, cashableDate);
                if (price != null) {
                    return {
                        result: <ISwapPool> {
                            ...lp,
                            date: cashableDate,
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
                result: <ISwapPool> {
                    ...lp,
                    date: cashableDate,
                    reserves: lpReserves
                }
            };
        }).toArrayAsync({ errors: 'reject' });

        let error = alot(pools).first(x => x.error != null)?.error;
        if (error != null) {
            return { error };
        }


        let swapped = await TokenPrice.swapRouted(
            token,
            amount,
            pools.map(x => x.result),
            this.tokensService
        );
        return { result: swapped };
    }

    private async getSwapFromCache (token: IToken, inAmount: bigint, date: Date): TResultAsync<ISwapRouted> {
        if (date == null) {
            return null;
        }
        let inPrice = await this.getPriceInUsdFromCache(token.address, date);
        if (inPrice == null) {
            return null;
        }
        let usdcToken = await this.tokensService.getToken('USDC');

        let outAmount = inAmount
            * ($bigint.toBigInt(inPrice * 10**6) * $bigint.pow(10, usdcToken.decimals - 6))
            / ($bigint.pow(10, token.decimals));

        let outUsd = $bigint.divToFloat(outAmount, 10n**BigInt(token.decimals));
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
        }
    }
    private async getPriceInUsdFromCache (token: TAddress, date: Date): Promise<number> {
        if (date == null) {
            return null;
        }
        return TokenPriceStore.forToken(token).getPrice(date.getTime());
    }
    private async setPriceInUsdToCache (token: TAddress, date: Date, price: number): Promise<void> {
        if (date == null) {
            return null;
        }
        return TokenPriceStore.forToken(token).setPrice(price, date.getTime());
    }
}


export class TokenRangePriceService {

    private cache = new Map<string,  TResultAsync<ISwapRouted>>()
    private INTERVAL = 5 * 60 * 1000;

    constructor (private service: AmmV2PriceQuote) {

    }


    async getPrice (symbol: string, opts?: ISwapOptions): TResultAsync<ISwapRouted>
    async getPrice (address: TAddress, opts?: ISwapOptions): TResultAsync<ISwapRouted>
    async getPrice (token: IToken, opts?: ISwapOptions): TResultAsync<ISwapRouted>
    async getPrice (mix: IToken | TAddress | string, opts?: ISwapOptions): TResultAsync<ISwapRouted> {

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
            throw new Error(`Invalid from token address ${fromTokenAddress} != ${fromToken.address}`);
        }

        let $fromPrice = lp.fromPrice;
        if ($fromPrice != null) {
            let $fromUsd = TokenUtils.calcTotal(fromToken, fromAmount, $fromPrice);
            return <ISwapped> {
                from: fromToken,
                fromAmount: fromAmount,
                fromUsd: $fromUsd,
                fromPrice: $fromPrice,

                // Optimistic assume same USD out.
                toUsd: $fromUsd
            };
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
        //$logger.log(`Swap: ${fromToken.symbol}(${fromAmount})[${fromUsd}$] > ${toToken.symbol} (${amountActual})[${toUsd}$]; Price ${fromToken.symbol}: ${fromPrice}`);


        if (lp.date) {
            // Cache prices
            let fromStore = TokenPriceStore.forToken(fromToken.address);
            fromStore.setPrice(fromPrice, lp.date.getTime());

            let toStore = TokenPriceStore.forToken(toToken.address);
            toStore.setPrice(toPrice, lp.date.getTime());
        }

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

            date: new Date(Number(lp.reserves._blockTimestampLast) * 1000),

            pool: {
                address: lp.address,
                reserve0: lp.reserves._reserve0,
                reserve1: lp.reserves._reserve1,
            }
        };
    }
}

interface ISwapRouted {
    outToken: IToken
    outAmount: bigint
    outUsd: number
    outUsdPrice: number

    inToken: IToken
    inAmount: bigint
    inUsd: number
    inUsdPrice: number

    route: ISwapped[]
}

interface ISwapped {
    from: IToken
    fromAmount: bigint
    fromUsd?: number
    fromPrice?: number

    to: IToken
    toAmount: bigint
    toUsd?: number
    toPrice?: number

    usd: number
    date: Date
    pool: {
        address: TAddress
        reserve0: bigint
        reserve1: bigint
    }
}

