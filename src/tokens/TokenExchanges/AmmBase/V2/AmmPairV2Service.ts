import di from 'a-di';
import alot from 'alot';
import memd from 'memd';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { $address } from '@dequanto/utils/$address';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { AmmV2ExchangeBase } from '@dequanto/tokens/TokenExchanges/AmmV2ExchangeBase';
import { PancakeswapExchange } from '@dequanto/tokens/TokenExchanges/PancakeswapExchange';
import { UniswapExchange } from '@dequanto/tokens/TokenExchanges/UniswapExchange';
import { TokensService } from '@dequanto/tokens/TokensService';
import { IToken } from '@dequanto/models/IToken';
import { SushiswapPolygonExchange } from '../../SushiswapPolygonExchange';
import { $require } from '@dequanto/utils/$require';



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



export class AmmPairV2Service {
    exchange: AmmV2ExchangeBase
    tokensService = di.resolve(TokensService, this.client.platform, this.explorer);

    targetCoins: string[]

    constructor(public client: Web3Client, public explorer: IBlockChainExplorer) {
        switch (client.platform) {
            case 'bsc':
                this.exchange = di.resolve(PancakeswapExchange, this.client, this.explorer);
                this.targetCoins = ['BUSD', 'USDT'];
                break;
            case 'eth':
                this.exchange = di.resolve(UniswapExchange, this.client, this.explorer);
                this.targetCoins = ['USDC', 'USDT', 'DAI'];
                break;
            case 'polygon':
                this.exchange = di.resolve(SushiswapPolygonExchange, this.client, this.explorer);
                this.targetCoins = ['USDC', 'USDT', 'DAI'];
                break;
            default:
                throw new Error(`Unsupported Platform for exchange yet: ${client.platform}`);
        }
    }

    @memd.deco.memoize({
        perInstance: true,
        trackRef: true,
        persistance: new memd.FsTransport({ path:  `./cache/pools.json` })
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
            const SYMBOL = { eth: 'WETH', bsc: 'WBNB', polygon: 'MATIC' }[platform];
            $require.notNull(SYMBOL, `Native symbol for platform ${platform} not FOUND`);
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

    private async getPoolInfo (fromAddress: TAddress, symbol: string): Promise<{ pair: ISwapPoolInfo, reserveTo: number }> {
        let toToken = await this.tokensService.getTokenOrDefault(symbol);
        if (toToken == null) {
            return null;
        }

        let lpAddress = await this.getPair(fromAddress, toToken.address);
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
            reserveTo: Number(reserveTo / 10n ** BigInt(toToken.decimals ?? 18)),
        };
    }

    @memd.deco.memoize()
    private async getPair (from: TAddress, to: TAddress) {
        return await this.exchange.factoryContract.getPair(from, to);
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
