"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ATokenProvider = void 0;
const _address_1 = require("@dequanto/utils/$address");
class ATokenProvider {
    async getByAddress(platform, address) {
        let tokens = await this.getTokens();
        let global = tokens.find(x => x.platforms?.some(y => y.platform === platform && _address_1.$address.eq(y.address, address)));
        if (global == null) {
            return null;
        }
        let p = global.platforms.find(x => x.platform === platform);
        return {
            symbol: global.symbol,
            name: global.name,
            platform: platform,
            address: p.address,
            decimals: p.decimals,
        };
    }
    async getBySymbol(platform, symbol) {
        let tokens = await this.getTokens();
        symbol = symbol.toLowerCase();
        let global = tokens.find(x => x.symbol.toLowerCase() === symbol && x.platforms?.some(y => y.platform === platform));
        if (global == null) {
            return null;
        }
        let p = global.platforms.find(x => x.platform === platform);
        return {
            symbol: global.symbol,
            name: global.name,
            platform: platform,
            address: p.address,
            decimals: p.decimals,
        };
    }
}
exports.ATokenProvider = ATokenProvider;
