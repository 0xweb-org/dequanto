import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { ITokenGlob } from '@dequanto/models/ITokenGlob';
import { ATokenProvider } from '@dequanto/tokens/TokenProviders/ATokenProvider';
import { ITokenProvider } from '@dequanto/tokens/TokenProviders/ITokenProvider';
import { $path } from '@dequanto/utils/$path';



export class ArbTokenProvider  extends ATokenProvider  implements ITokenProvider {
    store = new JsonArrayStore<ITokenGlob> ({
        path: $path.resolve('/data/tokens/arbitrum.json'),
        key: x => x.symbol
    });

    getTokens(): Promise<ITokenGlob[]> {
        return this.store.getAll();
    }

    async redownloadTokens(): Promise<any> {
        let resp = await fetch(`https://bridge.arbitrum.io/token-list-42161.json`);
        let json = await resp.json();

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
        await this.store.saveAll(tokens);
        return tokens;
    }
}
