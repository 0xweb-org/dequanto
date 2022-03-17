import axios from 'axios'
import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { IToken } from '@dequanto/models/IToken';
import { ITokenGlob } from '@dequanto/models/ITokenGlob';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TokenUtils } from '../utils/TokenUtils';
import { ITokenProvider } from './ITokenProvider';
import { ATokenProvider } from './ATokenProvider';
import { $path } from '@dequanto/utils/$path';



export class TPOneInch extends ATokenProvider implements ITokenProvider {

    store = new JsonArrayStore<ITokenGlob> ({
        path: $path.resolve('/data/tokens/1inch.json'),
        key: x => x.symbol,
        format: true,
    });

    getTokens(): Promise<ITokenGlob[]> {
        return this.store.getAll();
    }

    async redownloadTokens () {

        let tokensByPlatform = await Promise.all([
            this.downloadForPlatform('eth'),
            this.downloadForPlatform('bsc'),
            this.downloadForPlatform('polygon'),
        ]);

        let globals = TokenUtils.merge(...tokensByPlatform);
        await this.store.saveAll(globals);
        return globals;
    }

    private async downloadForPlatform(platform: TPlatform) {
        let url: string;
        switch (platform) {
            case 'eth':
                url = `https://api.1inch.exchange/v3.0/1/tokens`;
                break;
            case 'bsc':
                url = `https://api.1inch.exchange/v3.0/56/tokens`;
                break;
            case 'polygon':
                url = `https://api.1inch.exchange/v3.0/137/tokens`;
                break;
            default:
                throw new Error(`Invalid Platform ${platform}`)
        }

        let resp = await axios.get(url);
        let hash = resp.data.tokens;

        let arr = Object.keys(hash).map(key => {
            let t = hash[key];
            return <IToken> {
                symbol: t.symbol,
                name: t.name,
                decimals: t.decimals,
                logo: t.logoURI,
                platform: platform,
                address: t.address,
            }
        });
        return arr;
    }

}
