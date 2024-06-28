import { IToken } from '@dequanto/models/IToken';
import { ITokenGlob } from '@dequanto/models/ITokenGlob';
import { ITokenProvider } from './ITokenProvider';
import { ATokenProvider } from './ATokenProvider';
import { Config, config } from '@dequanto/config/Config';
import { $require } from '@dequanto/utils/$require';


export class TPConfig extends ATokenProvider implements ITokenProvider {


    async getTokens(): Promise<ITokenGlob[]> {
        return config.tokens ?? [];
    }

    async addToken (token: IToken) {
        $require.Address(token.address);
        $require.Number(token.decimals);
        $require.notNull(token.platform, 'Not possible to add the token - platform is undefined');

        let tokens = await this.getTokens();
        let current = tokens.find(t => t.symbol === token.symbol);
        if (current == null) {
            current = <ITokenGlob> {
                symbol: token.symbol,
                platforms: []
            };
            tokens.push(current);
        }
        if (current.platforms == null) {
            current.platforms = [];
        }
        let currentPlatform = current.platforms.find(x => x.platform == token.platform);
        if (currentPlatform == null) {
            current.platforms.push({
                platform: token.platform,
                decimals: token.decimals,
                address: token.address,
            });
        } else {
            currentPlatform.decimals = token.decimals;
            currentPlatform.address = token.address;
        }

        await Config.extend({
            tokens
        });
    }

    async redownloadTokens(): Promise<any> {

    }
}
