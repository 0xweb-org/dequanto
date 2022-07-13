"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoingeckoOracle = void 0;
const _config_1 = require("@dequanto/utils/$config");
class CoingeckoOracle {
    constructor() {
        this.key = _config_1.$config.get('coingecko.key');
    }
    getToken(name) {
    }
}
exports.CoingeckoOracle = CoingeckoOracle;
