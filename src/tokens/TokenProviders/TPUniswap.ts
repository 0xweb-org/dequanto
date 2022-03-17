import axios from 'axios'
import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { ITokenProvider } from './ITokenProvider';
import { ATokenProvider } from './ATokenProvider';
import { ITokenGlob } from '@dequanto/models/ITokenGlob';
import { $path } from '@dequanto/utils/$path';


const TheGraphUrl = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';

export class TPUniswap extends ATokenProvider implements ITokenProvider {
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
        let resp = await axios.post(TheGraphUrl, body);
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

            let resp = await axios.post(TheGraphUrl, body);
            console.log(resp);
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
