import di from 'a-di';
import alot from 'alot';
import memd from 'memd';
import { env } from 'atma-io';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { $bigint } from '@dequanto/utils/$bigint';
import { ITokenBase } from '@dequanto/models/IToken';
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { IOracle, IOracleResult, ISwapOptions } from '../IOracle';
import { TResultAsync } from '@dequanto/models/TResult';
import { ChainlinkFeedProvider, IChainlinkFeedInfo } from './ChainlinkFeedProvider';
import { $require } from '@dequanto/utils/$require';
import { TPlatform } from '@dequanto/models/TPlatform';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { $cache } from '@dequanto/utils/$cache';


const CACHE_PATH = $cache.file(`chainlink-feeds.json`);

export class ChainlinkOracle implements IOracle {

    protected feeds = di.resolve(ChainlinkFeedProvider)


    protected abi = {
        latestAnswer: `latestAnswer(): uint256`,
        latestTimestamp: `latestTimestamp(): uint256`,
        latestRoundData: `latestRoundData(): (uint256 roundId, uint256 answer, uint256 startedAt, uint256 updatedAt)`,

        decimals: `decimals(): uint64`,
        description: `description(): string`,
    }

    public constructor (private clients?: Web3Client[]) {

    }


    public async getPrice(token: ITokenBase, opts?: ISwapOptions): TResultAsync<IOracleResult> {
        opts ??= {};

        $require.notNull(token.symbol, `Chainlink gets the feed by token's symbol, but it is empty`);

        let route = await this.feeds.getRouteForSymbol(token.symbol);
        if (route == null || route.length === 0) {
            return { error: new Error(`Chainlink feeds not found for ${token.symbol} to get the USD price`) }
        }

        let hops = await alot(route).mapAsync(async hop => {
            let [
                price,
                config,
            ] = await Promise.all([
                this.price(hop),
                this.config(hop)
            ]);
            return { price, config }
        }).toArrayAsync();

        console.log(hops);

        let { amountEth: price } = hops.reduce((prev, hop) => {
            let { price, config } = hop;
            let amountOut = $bigint.multWithFloat(price.answer, prev.amountEth);
            let amountEth = $bigint.toEther(amountOut, config.decimals);
            return { amountEth };
        }, { amountEth: 1 })
        let date = alot(hops).min(x => x.price.updatedAt);

        return {
            result: {
                quote: { symbol: 'USD' },
                price,
                date,
            }
        };
    }

    @memd.deco.memoize({
        perInstance: true,
        trackRef: true,
        key: (ctx, feed: IChainlinkFeedInfo) => {
            let self = ctx.this as ChainlinkOracle;
            let key = `cl_feed_${feed.address}`;
            return key;
        },
        persistance: new memd.FsTransport({ path:  CACHE_PATH })
    })
    private async config (feed: IChainlinkFeedInfo) {
        let reader = this.getReader(feed.platform)
        let feedAddress = feed.address;
        let [ decimals, description ] = await Promise.all([
            reader.readAsync <number> (feedAddress, this.abi.decimals),
            reader.readAsync <string> (feedAddress, this.abi.description)
        ]);
        return { decimals, description };
    }

    @memd.deco.memoize({ maxAge: 60 /* minute */})
    private async price (feed: IChainlinkFeedInfo) {
        let reader = this.getReader(feed.platform)
        let feedAddress = feed.address;

        try {
            let { updatedAt, answer } = await reader.readAsync<{ updatedAt: bigint, answer: bigint }>(feedAddress, this.abi.latestRoundData);
            return {
                answer: answer,
                updatedAt: new Date( Number(updatedAt) * 1000 ),
            };
        } catch (error) {
            // skip error, and try to check another old ABI
        }
        let [ answer, updatedAt ] = await Promise.all([
            reader.readAsync <bigint> (feedAddress, this.abi.latestAnswer),
            reader.readAsync <string> (feedAddress, this.abi.latestTimestamp)
        ]);
        return {
            answer: answer,
            updatedAt: new Date( Number(updatedAt) * 1000 ),
        };
    }


    @memd.deco.memoize()
    private getReader(platform: TPlatform) {
        let c = this.getClient(platform);
        return new ContractReader(c);
    }
    private getClient(platform: TPlatform) {
        let c = this.clients?.find(x => x.platform === platform);
        if (c) {
            return c;
        }
        c = Web3ClientFactory.get(platform);
        return c;
    }
}
