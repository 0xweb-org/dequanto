import { $address } from '@dequanto/utils/$address';
import { IToken } from '@dequanto/models/IToken';
import { ITokenGlob } from '@dequanto/models/ITokenGlob';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';

export abstract class ATokenProvider {
    abstract getTokens (): Promise<ITokenGlob[]>

    async getByAddress (platform: TPlatform, address: TAddress): Promise<IToken> {
        let tokens = await this.getTokens();
        let global = tokens.find(x => x.platforms?.some(y => y.platform === platform && $address.eq(y.address, address)));
        if (global == null) {
            return null;
        }
        let p = global.platforms.find(x => x.platform === platform);
        return <IToken> {
            symbol: global.symbol,
            name: global.name,
            platform: platform,
            address: p.address,
            decimals: p.decimals,
        };
    }
    async getBySymbol (platform: TPlatform, symbol: string) {
        let tokens = await this.getTokens();

        symbol = symbol.toLowerCase();
        let global = tokens.find(x => x.symbol.toLowerCase() === symbol && x.platforms?.some(y => y.platform === platform));
        if (global == null) {
            return null;
        }
        let p = global.platforms.find(x => x.platform === platform);
        return <IToken> {
            symbol: global.symbol,
            name: global.name,
            platform: platform,
            address: p.address,
            decimals: p.decimals,
        };
    }
}
