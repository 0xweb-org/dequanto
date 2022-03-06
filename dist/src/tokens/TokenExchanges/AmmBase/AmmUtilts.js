"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmmUtils = void 0;
var AmmUtils;
(function (AmmUtils) {
    function toSameBase(a, b, aAmount, bAmount) {
        return [aAmount, bAmount];
        let diff = (a.decimals ?? 18) - (b.decimals ?? 18);
        if (diff === 0) {
            return [aAmount, bAmount];
        }
        let aAmountOut = diff > 0 ? aAmount : (aAmount * 10n ** BigInt(diff * -1));
        let bAmountOut = diff < 0 ? bAmount : (bAmount * 10n ** BigInt(diff));
        return [aAmountOut, bAmountOut];
    }
    AmmUtils.toSameBase = toSameBase;
})(AmmUtils = exports.AmmUtils || (exports.AmmUtils = {}));
