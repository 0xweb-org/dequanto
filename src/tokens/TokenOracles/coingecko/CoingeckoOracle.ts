import axios from 'axios';
import { ITokenBase } from '@dequanto/models/IToken';
import { TResultAsync } from '@dequanto/models/TResult';
import { $config } from '@dequanto/utils/$config';
import { $date } from '@dequanto/utils/$date';
import { IOracle, IOracleResult, ISwapOptions } from '../IOracle';
import { CoingeckoTokenProvider } from './CoingeckoTokenProvider';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { $block } from '@dequanto/utils/$block';
import { $require } from '@dequanto/utils/$require';

export class CoingeckoOracle  implements IOracle {


    private config = $config.get<{ key: string, root: string, rateLimit: string }>('oracles.coingecko');


    async getPrice(token: ITokenBase, opts?: ISwapOptions): TResultAsync<IOracleResult> {

        $require.notNull(this.config?.root, `Coingecko api root path not found in config`);

        opts ??= {};

        let coingeckoProvider = new CoingeckoTokenProvider();
        let coingeckoToken = await coingeckoProvider.getCoingeckoToken(token);
        if (coingeckoToken == null) {
            return { error: new Error(`NOT_FOUND: Token ${token.symbol} not found`) }
        }
        let date = opts.date;
        if (date == null && opts.block) {
            let platform = token.platform ?? 'eth';
            let client = Web3ClientFactory.get(platform);
            let block = await client.getBlock(opts.block);
            date = $block.getDate(block);
        }

        let priceInfo: { price: number, date: Date };
        if (date) {
            priceInfo = await this.getHistorical(coingeckoToken.id, date);
        } else {
            priceInfo = await this.getCurrent(coingeckoToken.id);
        }

        return {
            result: {
                quote: { symbol: 'USD' },
                price: priceInfo.price,
                date: priceInfo.date
            }
        };
    }


    private async getCurrent (tokenId: string) {
        let path = `/simple/price`;
        let query = {
            ids: tokenId,
            vs_currencies:'usd',
            include_market_cap: false,
            include_24hr_vol: false,
            include_24hr_change:false,
            include_last_updated_at:true,
            precision:'full'
        };
        let resp = await this.fetch<ICoingeckoCurrentPrice>(path, query);
        let data = resp[tokenId];
        return {
            price: data.usd,
            date: new Date(data.last_updated_at * 1000),
        };
    }

    private async getHistorical (tokenId: string, date: Date) {
        let dateFormat = 'dd-MM-yyyy';
        let path = `/coins/${tokenId}/history`;
        let query = {
            date: $date.format(date, dateFormat),
            localization: false
        }
        let data = await this.fetch<ICoingeckoHistoryPrice>(path, query);
        let price = data.market_data.current_price.usd;
        return {
            price,
            date: date
        }
    }

    private async fetch <TResult> (path: string, query?: { [key: string]: string | number | boolean }) {
        let headers = {};
        if (this.config.key != null) {
            headers['x-cg-pro-api-key'] = this.config.key;
        }
        let resp = await axios.get<TResult>(`${this.config.root}${path}`, {
            params: query,
            headers
        });
        return resp.data;
    }
}


interface ICoingeckoHistoryPrice {
    id: string
    symbol: string
    name: string
    image: { thumb }
    market_data: {
        current_price: {
            usd: number
        }
    }
}


interface ICoingeckoCurrentPrice {
    [id: string]: {
        usd: number
        last_updated_at: number
    }
}
