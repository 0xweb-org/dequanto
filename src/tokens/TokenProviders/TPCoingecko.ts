import memd from 'memd';
import alot from 'alot';
import { File } from 'atma-io';
import { TPlatform } from '@dequanto/models/TPlatform';
import { ITokenProvider } from './ITokenProvider';
import { $path } from '@dequanto/utils/$path';
import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { ITokenGlob } from '@dequanto/models/ITokenGlob';
import { ATokenProvider } from './ATokenProvider';
import { l } from '@dequanto/utils/$logger';
import { $promise } from '@dequanto/utils/$promise';
import { ITokenBase } from '@dequanto/models/IToken';
import { $address } from '@dequanto/utils/$address';
import { $require } from '@dequanto/utils/$require';
import { $http } from '@dequanto/utils/$http';

// https://www.coingecko.com/en/api/documentation

interface ITokenBaseCoingecko extends ITokenBase {
    id: string
}
interface ITokenGlobCoingecko extends ITokenGlob {
    id: string
}

export class TPCoingecko extends ATokenProvider  implements ITokenProvider {

    store = new JsonArrayStore<ITokenGlobCoingecko> ({
        path: $path.resolve('/data/tokens/coingecko.json'),
        key: x => x.symbol,
        format: true,
    });


    getTokens(): Promise<ITokenGlobCoingecko[]> {
        return this.store.getAll();
    }

    async find (token: ITokenBase): Promise<ITokenBaseCoingecko> {
        let tokens = await this.getTokens();
        let platform = token.platform;
        let symbol = token.symbol;
        let address = token.address;
        $require.notNull(symbol || address, `Address or symbol is required ${symbol}/${address}`);

        let  matched = alot(tokens)
            .mapMany(token => {
                return token.platforms.map(platform => {
                    return { token, platform };
                })
            })
            .toArray();

        if (address != null) {
            matched = matched.filter(x => $address.eq(address, x.platform?.address));
        }
        if (symbol != null) {
            matched = matched.filter(x => symbol.toLowerCase() === x.token.symbol?.toLowerCase());
        }
        if (platform != null) {
            let found = matched.find(x => x.platform?.platform === platform);
            return <ITokenBaseCoingecko> {
                ...found.token,
                ...found.platform,
            };
        }
        let order = [ 'eth', 'polygon', 'bsc' ];
        let found = alot(order)
            .map(platform => {
                return matched.find(x => x.platform?.platform === platform);
            })
            .first(x => x!= null)
            ;

        let x = found ?? matched[0];
        return <ITokenBaseCoingecko> {
            ...x.token,
            ...x.platform,
        };
    }

    async redownloadTokens(): Promise<ITokenGlob[]> {
        let list = await this.downloadList();
        l`Got list of ${list.length} tokens from CoinGecko. Fetching details...`;


        let tokens = await alot(list)
        .mapAsync(async (token, i) => {

            if (i > 0 && i % 10 === 0) {
                l`Fetched ${i}/${list.length} token details`;
            }
            let info = await this.downloadTokenInfoOrCache(token.id);
            return <ITokenGlobCoingecko>{
                id: token.id,
                name: token.name,
                symbol: token.symbol,
                platforms: alot
                    .fromObject(info?.detail_platforms ?? {})
                    .map(entry => {
                        let platform = this.mapPlatform(entry.key);
                        return {
                            platform,
                            decimals: entry.value.decimal_place,
                            address: entry.value.contract_address,
                        };
                    })
                    .filter(x => Boolean(x.platform) && Boolean(x.address) && Boolean(x.decimals))
                    .toArray()
            }
        })
        .filterAsync(x => x.platforms.length > 0)
        .toArrayAsync();

        await this.store.saveAll(tokens);
        return tokens;
    }


    private async downloadList () {
        let resp = await $http.get<{id, symbol, name}[]>(`https://api.coingecko.com/api/v3/coins/list`);
        return resp.data;
    }

    private async downloadTokenInfoOrCache (id: string): Promise<TDetails> {
        let cachePath = `./cache/coingecko/${id}.json`;
        if (await File.existsAsync(cachePath)) {
            let json = await File.readAsync<{info: TDetails, timestamp}>(cachePath);
            return json.info;
        }
        let info = await this._downloadTokenInfo(id);
        await File.writeAsync(cachePath, { info, id, timestamp: Date.now() });
        return info;
    }

    // 50 per minute
    @memd.deco.throttle(60 * 1000 / 50)
    private async _downloadTokenInfo (id: string) {

        let wait = 10_000;
        async function fetch  () {
            try {
                let resp = await $http.get<TDetails>(`https://api.coingecko.com/api/v3/coins/${id}`);
                return resp.data
            } catch (error) {
                let e = error;
                if (e.response?.status === 404) {
                    return <TDetails> { id, detail_platforms: {} };
                }
                if (e.response?.status === 429) {
                    l`Throttled. Wait for ${wait}ms`;
                    await $promise.wait(wait);
                    wait *= 1.2;
                    return fetch();
                }
                throw error;
            }
        }
        return fetch();
    }

    private mapPlatform (platformName: string): TPlatform {
        return this.mapping[platformName] ?? platformName;
    }
    private mapping = {
        'ethereum': 'eth',
        'polygon-pos': 'poly',
        'xdai': 'xdai',
        'binance-smart-chain': 'bsc',
        'arbitrum-one': 'arbitrum'
    };
}

type TDetails = {
    id, symbol, name,
    detail_platforms: Record<string, { decimal_place, contract_address }>
}
