import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { ITokenGlob } from '@dequanto/models/ITokenGlob';
import { ATokenProvider } from '@dequanto/tokens/TokenProviders/ATokenProvider';
import { ITokenProvider } from '@dequanto/tokens/TokenProviders/ITokenProvider';
import axios from 'axios';

let tokensStore = new JsonArrayStore<ITokenGlob> ({
    path: '/data/tokens/arbitrum.json',
    key: x => x.symbol
});


export class ArbTokenProvider  extends ATokenProvider  implements ITokenProvider {
    getTokens(): Promise<ITokenGlob[]> {
        return tokensStore.getAll();
    }

    async redownloadTokens(): Promise<any> {
        let { data: json } = await axios.get(`https://bridge.arbitrum.io/token-list-42161.json`);

        let tokens = json.tokens.map(token => {
            return <ITokenGlob> {
                symbol: token.symbol,
                name: token.name,
                logo: token.logoURI,

                platforms: [{
                    platform: 'arbitrum',
                    address: token.address,
                    decimals: token.decimals
                }]
            };
        });
        await tokensStore.saveAll(tokens);
        return tokens;
    }
}
