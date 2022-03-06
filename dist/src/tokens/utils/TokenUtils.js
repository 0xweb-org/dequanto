"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenUtils = void 0;
const _bigint_1 = require("@dequanto/utils/$bigint");
const _number_1 = require("@dequanto/utils/$number");
const alot_1 = __importDefault(require("alot"));
var TokenUtils;
(function (TokenUtils) {
    function isStable(symbol) {
        return /^[tb]?usd[tc]?$/i.test(symbol) || /^(dai)$/i.test(symbol);
    }
    TokenUtils.isStable = isStable;
    function calcUsdIfStable(amount, token) {
        if (isStable(token.symbol) === false) {
            return null;
        }
        let tokenBase = 10n ** BigInt(token.decimals);
        return _bigint_1.$bigint.divToFloat(amount, tokenBase, 10n ** 8n);
    }
    TokenUtils.calcUsdIfStable = calcUsdIfStable;
    function calcPrice(amount, token, usd) {
        if (usd == null) {
            return null;
        }
        let tokenBase = 10n ** BigInt(token.decimals);
        let tokenAmount = _bigint_1.$bigint.divToFloat(amount, tokenBase, 10n ** 8n);
        return _number_1.$number.div(usd, tokenAmount);
    }
    TokenUtils.calcPrice = calcPrice;
    function calcTotal(token, amount, price) {
        if (price == null) {
            return null;
        }
        let tokenBase = 10n ** BigInt(token.decimals);
        let tokenAmount = _bigint_1.$bigint.divToFloat(amount, tokenBase, 10n ** 8n);
        return tokenAmount * price;
    }
    TokenUtils.calcTotal = calcTotal;
    function merge(...tokens) {
        let all = (0, alot_1.default)(tokens)
            .mapMany(arr => arr)
            .groupBy(x => x.symbol)
            .map(group => {
            let logo = group.values.find(x => x.logo)?.logo;
            let token = group.values[0];
            return {
                symbol: token.symbol,
                name: token.name,
                logo: logo,
                platforms: group.values.map(t => {
                    return {
                        address: t.address,
                        decimals: t.decimals,
                        platform: t.platform,
                    };
                })
            };
        })
            .toArray();
        return all;
    }
    TokenUtils.merge = merge;
})(TokenUtils = exports.TokenUtils || (exports.TokenUtils = {}));
