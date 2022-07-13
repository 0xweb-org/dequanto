"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TPConfig = void 0;
const ATokenProvider_1 = require("./ATokenProvider");
const Config_1 = require("@dequanto/Config");
const _require_1 = require("@dequanto/utils/$require");
class TPConfig extends ATokenProvider_1.ATokenProvider {
    async getTokens() {
        return Config_1.config.tokens ?? [];
    }
    async addToken(token) {
        _require_1.$require.Address(token.address);
        _require_1.$require.Number(token.decimals);
        _require_1.$require.notNull(token.platform, 'Not possible to add the token - platform is undefined');
        let tokens = await this.getTokens();
        let current = tokens.find(t => t.symbol === token.symbol);
        if (current == null) {
            current = {
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
        }
        else {
            currentPlatform.decimals = token.decimals;
            currentPlatform.address = token.address;
        }
        await Config_1.Config.extend({
            tokens
        });
    }
    async redownloadTokens() {
    }
}
exports.TPConfig = TPConfig;
