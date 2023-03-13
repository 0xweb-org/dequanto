import alot from 'alot';
import axios from 'axios'
import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { IToken } from '@dequanto/models/IToken';
import { ITokenGlob } from '@dequanto/models/ITokenGlob';
import { TPlatform } from '@dequanto/models/TPlatform';
import { $path } from '@dequanto/utils/$path';
import { File } from 'atma-io';
import { $require } from '@dequanto/utils/$require';
import { l } from '@dequanto/utils/$logger';
import { TAddress } from '@dequanto/models/TAddress';
import { $str } from '@dequanto/solidity/utils/$str';


export interface IChainlinkFeedInfo {
    platform: TPlatform
    address: TAddress

    asset: string
    pair: [ string, string ]
}

export class ChainlinkFeedProvider {

    store = new JsonArrayStore<IChainlinkFeedInfo> ({
        path: $path.resolve('/data/chainlink/feeds.json'),
        key: x => x.address,
        format: true,
    });

    async getFeeds(): Promise<IChainlinkFeedInfo[]> {
        return await this.store.getAll();
    }
    async getRouteForSymbol (symbol: string, targetSymbol = 'USD', ignoreSymbols: string[] = []): Promise<IChainlinkFeedInfo[]> {
        let allFeeds = await this.getFeeds();

        let symbolFeeds = allFeeds.filter(x => x.pair[0] === symbol);
        let target = symbolFeeds.find(x => x.pair[1] === targetSymbol);
        if (target) {
            return [ target ];
        }


        let routes = await alot(symbolFeeds)
            .mapAsync(async symbolFeed => {
                let hopSymbol = symbolFeed.pair[1];
                if (ignoreSymbols.includes(hopSymbol)) {
                    return null;
                }
                let ignore = [ ...ignoreSymbols, symbol ];
                let arr = await this.getRouteForSymbol(hopSymbol, targetSymbol, ignore);
                if (arr == null || arr.length === 0) {
                    return null;
                }
                return [ symbolFeed, ...arr ];
            })
            .filterAsync(x => x != null && x.length > 0)
            .toArrayAsync();

        if (routes.length === 0) {
            return [];
        }

        let smallest = alot(routes).sortBy(x => x.length).first();
        return [ ...smallest ]
    }

    async redownload () {

        // from 'https://docs.chain.link/data-feeds/price-feeds/addresses';
        const paths = [
            { url: 'https://reference-data-directory.vercel.app/feeds-mainnet.json', platform: 'eth' },
            { url: 'https://reference-data-directory.vercel.app/feeds-matic-mainnet.json', platform: 'polygon' }
        ];

        let tokens = await alot(paths).mapManyAsync(async pathInfo => {
            return this.fetchFeed(pathInfo.url, pathInfo.platform);
        }).toArrayAsync();


        l`Fetched ${tokens.length} feeds`;
        let platformStats = alot(tokens).groupBy(x => x.platform).toDictionary(x => x.key, x => x.values.length);
        l`Feeds per platform: ${platformStats}`;
        let uniqueStats = alot(tokens).distinctBy(x => x.pair[0]).toArray().length;
        l`Feeds with unique base: ${uniqueStats}`;

        let noUSDStats = alot(tokens)
            .groupBy(x => x.pair[0])
            .filter(g => {
                let hasUSD = g.values.some(x => x.pair[1] === 'USD');
                if (hasUSD === false) {
                    l`NO USD QUOTE for ${g.key}`;
                }
                return hasUSD === false;
            })
            .toArray();
        l`Feed with no USD quote ${ noUSDStats.length}`

        await this.store.saveAll(tokens);
        return tokens;
    }

    private async fetchFeed (path: string, platform: TPlatform) {
        const resp = await axios.get<any[]>(path);

        const tokens = alot(resp.data).map(feed => {
            let pair: [ string, string ];
            if ($str.isNullOrWhiteSpace(feed.pair[0] || feed.pair[1])) {
                let match = /(?<base>\w+)\s*\/\s*(?<quote>\w+)/.exec(feed.name);
                if (match == null) {
                    console.log(` - Chainlink skipped "${feed.name}" as not a crypto pair`);
                    return null;
                }
                pair = [ match.groups.base, match.groups.quote];
            } else {
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

            $require.notNull(feed.proxyAddress, `The proxy address is undefined in ${JSON.stringify(feed)}`);
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
