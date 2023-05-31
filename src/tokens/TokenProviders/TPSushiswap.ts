import axios, { AxiosResponse } from 'axios';
import { $address } from '@dequanto/utils/$address';
import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { IToken, ITokenBase } from '@dequanto/models/IToken';
import { ITokenGlob } from '@dequanto/models/ITokenGlob';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TokenUtils } from '../utils/TokenUtils';
import { ITokenProvider } from './ITokenProvider';
import { ATokenProvider } from './ATokenProvider';
import { $path } from '@dequanto/utils/$path';
import alot from 'alot';
import { Config } from '@dequanto/Config';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';


export class TPSushiswap extends ATokenProvider implements ITokenProvider  {
    store = new JsonArrayStore<ITokenGlob> ({
        path: $path.resolve('/data/tokens/sushi.json'),
        key: x => x.symbol,
        format: true,
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
        const url: string = `https://tokens.sushi.com/v0`;
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

        let resp = await axios.get<TResponse[]>(url);
        let tokens = resp
            .data
            .filter(x => x.chainId in platforms)
            .map(token => {
                return <IToken> {
                    ...token,
                    platform: platforms[token.chainId]
                }
            });
        return tokens;
    }

    // private async downloadForPlatform(platform: TPlatform) {
    //     let url: string;
    //     let mapper: (resp: AxiosResponse) => IToken[];

    //     function mapperApi (resp: AxiosResponse): IToken[] {
    //         let arr = resp.data[1];
    //         return arr.map(t => {
    //             return <IToken> {
    //                 symbol: t.Symbol,
    //                 name: t.Name,
    //                 decimals: t.Decimals,
    //                 platform: platform,
    //                 address: t.Contract,
    //             }
    //         })
    //     }
    //     function mapperGithub (resp: AxiosResponse): IToken[] {
    //         let arr = resp.data;
    //         return arr.map(t => {
    //             return <IToken> {
    //                 symbol: t.symbol,
    //                 name: t.name,
    //                 decimals: t.decimals,
    //                 platform: platform,
    //                 address: t.address,
    //             }
    //         })
    //     }

    //     switch (platform) {
    //         case 'eth':
    //             url = `https://api2.sushipro.io/?action=all_tokens&chainID=1`;
    //             mapper = mapperApi;
    //             break;
    //         case 'bsc':
    //             throw new Error(`Bsc is not supported by sushiswap api`);
    //             break;
    //         case 'polygon':
    //             url = `https://api2.sushipro.io/?action=all_tokens&chainID=137`;
    //             mapper = mapperApi;
    //             break;
    //         case 'xdai':
    //             url = `https://raw.githubusercontent.com/sushiswap/default-token-list/master/tokens/xdai.json`;
    //             mapper = mapperGithub;
    //             break;
    //         default:
    //             throw new Error(`Invalid Platform ${platform}`)
    //     }

    //     let resp = await axios.get<[{}, { Contract, Symbol, Name, Decimals }[]] | {symbol, name, decimals, address } >(url);
    //     let tokens = mapper(resp);

    //     return tokens;
    // }
}
