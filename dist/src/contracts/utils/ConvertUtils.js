"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertUtils = void 0;
var ConvertUtils;
(function (ConvertUtils) {
    function toWei(amount, dec = 18) {
        let decimals = BigInt(dec);
        return BigInt(amount) * 10n ** decimals;
    }
    ConvertUtils.toWei = toWei;
    function toEther(amount, dec = 18) {
        const round = 100000n;
        let decimals = BigInt(dec);
        let val = BigInt(amount) * round / 10n ** decimals;
        if (val < Number.MAX_SAFE_INTEGER) {
            return Number(val) / Number(round);
        }
        return val / round;
    }
    ConvertUtils.toEther = toEther;
})(ConvertUtils = exports.ConvertUtils || (exports.ConvertUtils = {}));
