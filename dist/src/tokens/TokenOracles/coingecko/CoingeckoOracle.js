"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoingeckoOracle = void 0;
const axios_1 = __importDefault(require("axios"));
const _config_1 = require("@dequanto/utils/$config");
const _date_1 = require("@dequanto/utils/$date");
const CoingeckoTokenProvider_1 = require("./CoingeckoTokenProvider");
const Web3ClientFactory_1 = require("@dequanto/clients/Web3ClientFactory");
const _block_1 = require("@dequanto/utils/$block");
const _require_1 = require("@dequanto/utils/$require");
class CoingeckoOracle {
    constructor() {
        this.config = _config_1.$config.get('oracles.coingecko');
    }
    async getPrice(token, opts) {
        _require_1.$require.notNull(this.config?.root, `Coingecko api root path not found in config`);
        opts ?? (opts = {});
        let coingeckoProvider = new CoingeckoTokenProvider_1.CoingeckoTokenProvider();
        let coingeckoToken = await coingeckoProvider.getCoingeckoToken(token);
        if (coingeckoToken == null) {
            return { error: new Error(`NOT_FOUND: Token ${token.symbol} not found`) };
        }
        let date = opts.date;
        if (date == null && opts.block) {
            let platform = token.platform ?? 'eth';
            let client = Web3ClientFactory_1.Web3ClientFactory.get(platform);
            let block = await client.getBlock(opts.block);
            date = _block_1.$block.getDate(block);
        }
        let priceInfo;
        if (date) {
            priceInfo = await this.getHistorical(coingeckoToken.id, date);
        }
        else {
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
    async getCurrent(tokenId) {
        let path = `/simple/price`;
        let query = {
            ids: tokenId,
            vs_currencies: 'usd',
            include_market_cap: false,
            include_24hr_vol: false,
            include_24hr_change: false,
            include_last_updated_at: true,
            precision: 'full'
        };
        let resp = await this.fetch(path, query);
        let data = resp[tokenId];
        return {
            price: data.usd,
            date: new Date(data.last_updated_at * 1000),
        };
    }
    async getHistorical(tokenId, date) {
        let dateFormat = 'dd-MM-yyyy';
        let path = `/coins/${tokenId}/history`;
        let query = {
            date: _date_1.$date.format(date, dateFormat),
            localization: false
        };
        let data = await this.fetch(path, query);
        let price = data.market_data.current_price.usd;
        return {
            price,
            date: date
        };
    }
    async fetch(path, query) {
        let headers = {};
        if (this.config.key != null) {
            headers['x-cg-pro-api-key'] = this.config.key;
        }
        let resp = await axios_1.default.get(`${this.config.root}${path}`, {
            params: query,
            headers
        });
        return resp.data;
    }
}
exports.CoingeckoOracle = CoingeckoOracle;
