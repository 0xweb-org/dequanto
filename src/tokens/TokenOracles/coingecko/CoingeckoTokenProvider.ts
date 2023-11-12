import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { ITokenBase } from '@dequanto/models/IToken';
import { $config } from '@dequanto/utils/$config';
import { $path } from '@dequanto/utils/$path';
import { $is } from '@dequanto/utils/$is';
import { $http } from '@dequanto/utils/$http';


// https://www.coingecko.com/en/api/documentation
export class CoingeckoTokenProvider {

    private root = $config.get('oracles.coingecko.root')

    private store = new JsonArrayStore<TDetails> ({
        path: $path.resolve('/data/coingecko/tokens.json'),
        key: x => x.symbol,
        format: true,
    });


    async getCoingeckoToken (token: ITokenBase) {
        let arr = await this.store.getAll();
        let t = arr.find(x => x.symbol === token.symbol);
        return t;
    }

    async redownload(): Promise<TDetails[]> {
        let list = await this.downloadList();

        list.forEach(entry => {
            entry.platforms = entry.platforms?.filter(p => $is.Address(p.address)) ?? []
        });
        //list = list.filter(x => x.platforms.length > 0);

        await this.store.saveAll(list);
        return list;
    }

    private async downloadList () {
        let resp = await $http.get<{id, symbol, name, platforms: { platform, decimals, address }[] }[]>(`${this.root}/coins/list`);
        return resp.data;
    }
}



type TDetails = {
    id,
    symbol,
    name
}
