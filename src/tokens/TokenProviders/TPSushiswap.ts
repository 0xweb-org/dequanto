import axios, { AxiosResponse } from 'axios';
import { $address } from '@dequanto/utils/$address';
import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { IToken } from '@dequanto/models/IToken';
import { ITokenGlob } from '@dequanto/models/ITokenGlob';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TokenUtils } from '../utils/TokenUtils';
import { ITokenProvider } from './ITokenProvider';
import { ATokenProvider } from './ATokenProvider';


const tokensStore = new JsonArrayStore<ITokenGlob> ({
    path: '/data/tokens/sushi.json',
    key: (x) => x.symbol
});
export class TPSushiswap extends ATokenProvider implements ITokenProvider  {
    getTokens(): Promise<ITokenGlob[]> {
        return tokensStore.getAll();
    }

    /** Finds remote  */
    async find (address: string) {
        throw new Error('Not implemented')
    }

    async redownloadTokens () {
        let tokensByPlatform = await Promise.all([
            this.downloadForPlatform('eth'),
            this.downloadForPlatform('polygon'),
            this.downloadForPlatform('xdai'),
        ]);

        let globals = TokenUtils.merge(...tokensByPlatform);
        await tokensStore.saveAll(globals);
        return globals;
    }

    private async downloadForPlatform(platform: TPlatform) {
        let url: string;
        let mapper: (resp: AxiosResponse) => IToken[];

        function mapperApi (resp: AxiosResponse): IToken[] {
            let arr = resp.data[1];
            return arr.map(t => {
                return <IToken> {
                    symbol: t.Symbol,
                    name: t.Name,
                    decimals: t.Decimals,
                    platform: platform,
                    address: t.Contract,
                }
            })
        }
        function mapperGithub (resp: AxiosResponse): IToken[] {
            let arr = resp.data;
            return arr.map(t => {
                return <IToken> {
                    symbol: t.symbol,
                    name: t.name,
                    decimals: t.decimals,
                    platform: platform,
                    address: t.address,
                }
            })
        }

        switch (platform) {
            case 'eth':
                url = `https://api2.sushipro.io/?action=all_tokens&chainID=1`;
                mapper = mapperApi;
                break;
            case 'bsc':
                throw new Error(`Bsc is not supported by sushiswap api`);
                break;
            case 'polygon':
                url = `https://api2.sushipro.io/?action=all_tokens&chainID=137`;
                mapper = mapperApi;
                break;
            case 'xdai':
                url = `https://raw.githubusercontent.com/sushiswap/default-token-list/master/tokens/xdai.json`;
                mapper = mapperGithub;
                break;
            default:
                throw new Error(`Invalid Platform ${platform}`)
        }

        let resp = await axios.get<[{}, { Contract, Symbol, Name, Decimals }[]] | {symbol, name, decimals, address } >(url);
        let tokens = mapper(resp);

        return tokens;
    }
}
