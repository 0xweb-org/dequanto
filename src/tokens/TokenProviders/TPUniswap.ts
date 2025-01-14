import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { ITokenProvider } from './ITokenProvider';
import { ATokenProvider } from './ATokenProvider';
import { ITokenGlob } from '@dequanto/models/ITokenGlob';
import { $path } from '@dequanto/utils/$path';
import { $http } from '@dequanto/utils/$http';
import { TokenUtils } from '../utils/TokenUtils';
import { Config } from '@dequanto/config/Config';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import alot from 'alot';
import { TAddress } from '@dequanto/models/TAddress';
import { IToken } from '@dequanto/models/IToken';

export class TPUniswap extends ATokenProvider implements ITokenProvider  {
    store = new JsonArrayStore<ITokenGlob> ({
        path: $path.resolve('/data/tokens/uni.json'),
        key: x => x.symbol
    });

    getTokens(): Promise<ITokenGlob[]> {
        return this.store.getAll();
    }

    /** Finds remote  */
    async find (address: string) {
        throw new Error('Not implemented')
    }

    async redownloadTokens () {
        let tokensByPlatform = await this.downloadTokens();

        let globals = TokenUtils.merge(tokensByPlatform);
        await this.store.saveAll(globals);
        return globals;
    }

    private async downloadTokens() {
        const urls = {
            eth: 'https://raw.githubusercontent.com/Uniswap/default-token-list/refs/heads/main/src/tokens/mainnet.json',
            polygon: 'https://raw.githubusercontent.com/Uniswap/default-token-list/refs/heads/main/src/tokens/polygon.json',
            base: 'https://raw.githubusercontent.com/Uniswap/default-token-list/refs/heads/main/src/tokens/base.json',
            bnb: 'https://raw.githubusercontent.com/Uniswap/default-token-list/refs/heads/main/src/tokens/bnb.json',
        };

        const config = await Config.fetch();
        const platforms = alot
            .fromObject(config.web3)
            .map(x => {
                let platform = x.key;
                let chainId = x.value.chainId;
                if (chainId == null) {
                    try {
                        let client = Web3ClientFactory.get(platform);
                        chainId = client.chainId;
                    } catch (e) {}
                }
                if (chainId == null) {
                    return null;
                }
                return {
                    platform,
                    chainId,
                };
            })
            .filter(x => x!= null)
            .toDictionary(x => x.chainId, x => x.platform);

        type TResponse = {
            id: string
            address: TAddress
            chainId: number | 1
            name: string
            symbol: string
            decimals: number | 18
        };

        let resp = await alot.fromObject(urls).mapManyAsync(async entry => {
            let resp = await $http.get<TResponse[]>(entry.value);
            let data = resp.data;
            let json = typeof data === 'string' ? JSON.parse(data) : data;
            return json as TResponse[];
        }).toArrayAsync();

        let tokens = resp
            .filter(x => x.chainId in platforms)
            .map(token => {
                return <IToken> {
                    ...token,
                    platform: platforms[token.chainId]
                }
            });
        return tokens;
    }

}


const TheGraphUrl = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';

export class TPUniswapV0 extends ATokenProvider implements ITokenProvider {
    store = new JsonArrayStore<ITokenGlob> ({
        path: $path.resolve('/data/tokens/uni.json'),
        key: x => x.symbol
    });

    getTokens(): Promise<ITokenGlob[]> {
        return this.store.getAll();
    }

    /** Finds remote  */
    async find (address: string) {
        let body = {
            query: `
                {
                    tokens (where: {id: "${address}"}) {
                    id
                    symbol
                    name
                    decimals
                    }
                }
            `
        };
        let resp = await $http.post({
            url: TheGraphUrl,
            body: body
        });
        return resp.data.data?.tokens[0];
    }

    async redownloadTokens () {
        let skip = 0;
        let take = 1000;
        let out = [] as ITokenGlob[];
        while (true) {
            let body = {
                query: `
                {
                    tokens (skip: ${skip} first:${take}) {
                      id
                      symbol
                      name
                      decimals
                    }
                }
                `
            };

            let resp = await $http.post({ url: TheGraphUrl, body });
            let tokens = resp.data.data?.tokens ?? [];

            let arr = tokens.map(uniT => {
                return <ITokenGlob> {
                    symbol: uniT.symbol,
                    name: uniT.name,
                    decimals: Number(uniT.decimals) || 18,
                    platforms: [
                        {
                            platform: 'eth',
                            address: uniT.id,
                            decimals: uniT.decimals,
                        }
                    ]
                };
            })
            out = out.concat(...arr);
            if (tokens.length < take) {
                break;
            }
            skip += take;
        }

        await this.store.saveAll(out);
        return out;
    }
}
