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
import { Config } from '@dequanto/config/Config';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { $http } from '@dequanto/utils/$http';


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

        let resp = await $http.get<TResponse[]>(url);
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

}
