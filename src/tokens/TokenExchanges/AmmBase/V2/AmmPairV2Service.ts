import di from 'a-di';
import alot from 'alot';
import memd from 'memd';
import { env } from 'atma-io';
import { $bigint } from '@dequanto/utils/$bigint';
import { $date } from '@dequanto/utils/$date';

import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { $address } from '@dequanto/utils/$address';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TokensService } from '@dequanto/tokens/TokensService';
import { IToken, ITokenBase } from '@dequanto/models/IToken';

import { AmmV2ExchangeBase } from '../../AmmV2ExchangeBase';
import { SushiswapPolygonExchange } from '../../SushiswapPolygonExchange';
import { PancakeswapExchange } from '../../PancakeswapExchange';
import { UniswapV2Exchange } from '../../UniswapV2Exchange';
import { $cache } from '@dequanto/utils/$cache';

export interface ISwapPoolInfo {
    address: TAddress
    token0: TAddress
    token1: TAddress

    from?: IToken
    to?: IToken
};
export interface ISwapPool extends ISwapPoolInfo {
    date: Date
    fromPrice?: number
    reserves?: {
        _reserve0: bigint
        _reserve1: bigint
        _blockTimestampLast: number
    }
}


export interface ISwapRouted {
    outToken: ITokenBase
    outAmount: bigint
    outUsd: number
    outUsdPrice: number

    inToken: ITokenBase
    inAmount: bigint
    inUsd: number
    inUsdPrice: number

    route: ISwapped[]
}

export interface ISwapped {
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


const CACHE_PATH = $cache.file(`dex-pools.json`);
const CACHE_SECONDS = $date.parseTimespan('7d', { get: 's' });

export class AmmPairV2Service {
    private exchange: AmmV2ExchangeBase
    private tokensService: TokensService;

    private targetCoins: string[]

    constructor(public client: Web3Client, public explorer: IBlockChainExplorer) {
        switch (client.platform) {
            case 'bsc':
                this.exchange = di.resolve(PancakeswapExchange, this.client, this.explorer);
                this.targetCoins = ['BUSD', 'USDT'];
                break;
            case 'eth':
                this.exchange = di.resolve(UniswapV2Exchange, this.client, this.explorer);
                this.targetCoins = ['USDC', 'USDT', 'DAI'];
                break;
            case 'polygon':
                this.exchange = di.resolve(SushiswapPolygonExchange, this.client, this.explorer);
                this.targetCoins = ['USDC', 'USDT', 'DAI'];
                break;
            default:
                throw new Error(`Unsupported Platform for exchange yet: ${client.platform}`);
        }

        this.tokensService = di.resolve(TokensService, this.client.platform, this.explorer);
    }

    @memd.deco.memoize({
        perInstance: true,
        trackRef: true,
        maxAge: CACHE_SECONDS,
        key: (ctx, platform, address) => {
            let self = ctx.this as AmmPairV2Service;
            let key = `bestRoute_${platform}_${address}`;
            return key;
        },
        persistance: new memd.FsTransport({ path:  CACHE_PATH })
    })
    async resolveBestStableRoute (platform: TPlatform, address: TAddress): Promise<ISwapPoolInfo[]> {
        let pool = await alot(this.targetCoins)
            .mapAsync(async symbol => {
                return this.getPoolInfo(address, symbol);
            })
            .filterAsync(x => x != null)
            .sortByAsync(({reserveTo}) => reserveTo, 'desc')
            .firstAsync();


        if (pool == null || pool.reserveTo < (50_000n * BigInt(pool.pair.to.decimals))) {
            // if NO or low-liquidity pool found, check the WETH pool
            const SYMBOL = { bsc: 'WBNB', polygon: 'MATIC' }[platform] ?? 'WETH';
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


        return [ pool.pair ];
    }

    async resolveRoute (address: TAddress, symbols: string[]): Promise<ISwapPoolInfo[]> {

        let tokens = await alot(symbols)
            .mapAsync(x => this.tokensService.getTokenOrDefault(x))
            .toArrayAsync();

        let prev = address;
        let out = [] as ISwapPoolInfo[];
        for (let token of tokens) {
            let poolInfo = await this.getPoolInfo(prev, token.address);
            out.push(poolInfo.pair);
            prev = token.address;
        }
        return out;
    }

    @memd.deco.memoize({
        perInstance: true,
        trackRef: true,
        key: (ctx, fromAddress, toSymbol) => {
            let self = ctx.this as AmmPairV2Service;
            let key = `pool_${self.client.platform}_${fromAddress}_${toSymbol}`;
            return key;
        },
        persistance: new memd.FsTransport({ path: CACHE_PATH })
    })
    private async getPoolInfo (fromAddress: TAddress, symbol: string): Promise<{ pair: ISwapPoolInfo, reserveTo: number }> {
        let toToken = await this.tokensService.getTokenOrDefault(symbol);
        if (toToken == null) {
            return null;
        }

        let lpAddress = await this.exchange.factoryContract.getPair(fromAddress, toToken.address);
        if ($address.isEmpty(lpAddress)) {
            return null;
        }
        let poolPair = this.exchange.pairContract(lpAddress);
        let lpReserves = await poolPair.getReserves();
        if (lpReserves == null || lpReserves._reserve0 < 1000n) {
            return null;
        }

        let [ fromI, toI ] = BigInt(fromAddress) < BigInt(toToken.address) ? [0, 1] : [1, 0];

        let reserveFrom: bigint = lpReserves[`_reserve${fromI}`];
        let reserveTo: bigint = lpReserves[`_reserve${toI}`];
        if (toToken.decimals == null) {
            toToken.decimals = 18;
        }

        if (reserveTo < 10n ** BigInt(toToken.decimals ?? 18)) {
            return null;
        }
        let fromToken = await this.tokensService.getTokenOrDefault(fromAddress);

        return {
            pair: PairUtil.createPairInfo(fromToken, toToken, lpAddress),
            reserveTo: $bigint.toEther(reserveTo, toToken.decimals),
        };
    }
}


namespace PairUtil {
    export function createPairInfo (fromToken: IToken, toToken: IToken, lpAddress: TAddress): ISwapPoolInfo {
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
}
