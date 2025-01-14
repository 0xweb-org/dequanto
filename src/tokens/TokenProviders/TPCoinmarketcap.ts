import { class_Uri } from 'atma-utils';
import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { $config } from '@dequanto/utils/$config';

import { ITokenGlob } from '@dequanto/models/ITokenGlob';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { ATokenProvider } from './ATokenProvider';
import { ITokenProvider } from './ITokenProvider';
import { $http } from '@dequanto/utils/$http';
import alot from 'alot';


const coinmarketcap = $config.get('coinmarketcap') as {
    key: string
    cache?: string
};

const tokensStore = new JsonArrayStore<ITokenGlob>({
    path: class_Uri.combine(coinmarketcap?.cache ?? './data/tokens/coinmarketcap/', 'tokens.json'),
    key: (x) => x.symbol
});

const HOST = `https://pro-api.coinmarketcap.com/`

export class TPCoinmarketcap extends ATokenProvider implements ITokenProvider {

    getTokens(): Promise<ITokenGlob[]> {
        return tokensStore.getAll();
    }

    async redownloadTokens() {
        if (coinmarketcap == null) {
            console.warn(`No ApiKey for coinmarketcap found. Skipping this token provider`);
            return [];
        }
        let url = class_Uri.combine(HOST, `/v1/cryptocurrency/map?CMC_PRO_API_KEY=${coinmarketcap.key}`);
        let resp = await $http.get(url);
        let tokens = resp.data.data as {
            "name": string
            "symbol": string
            "platform": {
                "id": number
                "name": "Binance Smart Chain" | "Ethereum" | "Polygon" | "xDai"
                "token_address": TAddress
            }
        }[];

        let names = alot(tokens).map(x => x.platform).filter(Boolean).distinctBy(x => x.name).toArray();
        console.log(names);
        console.log(tokens.filter(x => x.platform == null).slice(0, 20));

        let arr = tokens.map(token => {
            if (token.platform == null) {
                return null;
            }
            let platform: TPlatform;
            switch (token.platform.name) {
                case "Binance Smart Chain":
                    platform = "bsc";
                    break;
                case "Ethereum":
                    platform = "eth";
                    break;
                case "Polygon":
                    platform = "polygon";
                    break;
                case "xDai":
                    platform = "xdai";
                    break;
                default:
                    return null;
            }

            return <ITokenGlob>{
                symbol: token.symbol,
                name: token.name,
                platforms: [{
                    platform,
                    address: token.platform.token_address
                }]
            };
        }).filter(Boolean);


        await tokensStore.saveAll(arr);
        return arr;
    }
}
