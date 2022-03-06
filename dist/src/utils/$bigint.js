"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$bigint = void 0;
const _is_1 = require("./$is");
var $bigint;
(function ($bigint_1) {
    $bigint_1.ETHER_DECIMALS = 18;
    $bigint_1.GWEI_DECIMALS = 9;
    function max(...args) {
        let max = null;
        for (let i = 0; i < args.length; i++) {
            let val = args[i];
            if (max == null || max < val) {
                max = val;
            }
        }
        return max;
    }
    $bigint_1.max = max;
    function min(...args) {
        let min = null;
        for (let i = 0; i < args.length; i++) {
            let val = args[i];
            if (min == null || min > val) {
                min = val;
            }
        }
        return min;
    }
    $bigint_1.min = min;
    function toBigInt(amount) {
        if (typeof amount === 'bigint') {
            return amount;
        }
        if (typeof amount === 'string') {
            amount = Number(amount);
        }
        return BigInt(Math.round(amount));
    }
    $bigint_1.toBigInt = toBigInt;
    function ensureWei(amount, decimals) {
        if (typeof amount === 'number') {
            return toWei(amount, decimals);
        }
        return amount;
    }
    $bigint_1.ensureWei = ensureWei;
    function toWei(amount, decimals = $bigint_1.ETHER_DECIMALS) {
        let decimalsCount = Number(decimals);
        if (typeof amount === 'number') {
            let $exp = 0;
            while ((amount * 10 ** $exp) % 1 !== 0 && $exp < decimalsCount) {
                $exp++;
            }
            decimalsCount -= $exp;
            amount *= 10 ** $exp;
            if (amount % 1 !== 0) {
                amount = Math.round(amount);
            }
        }
        let $amount = BigInt(amount);
        let $decimals = BigInt(decimalsCount);
        return $amount * 10n ** $decimals;
    }
    $bigint_1.toWei = toWei;
    function toWeiFromGwei(amount) {
        return toWei(amount, $bigint_1.GWEI_DECIMALS);
    }
    $bigint_1.toWeiFromGwei = toWeiFromGwei;
    function toEther(amount, decimals = $bigint_1.ETHER_DECIMALS, round = 100000n) {
        let $decimals = BigInt(decimals);
        let $amount = BigInt(amount);
        let val = $amount * round / 10n ** $decimals;
        if (val < Number.MAX_SAFE_INTEGER) {
            return Number(val) / Number(round);
        }
        throw new Error(`Ether overflow: ${val}`);
    }
    $bigint_1.toEther = toEther;
    function toHex(num) {
        return `0x${num.toString(16)}`;
    }
    $bigint_1.toHex = toHex;
    function toGweiFromWei(val) {
        return toEther(val, $bigint_1.GWEI_DECIMALS);
    }
    $bigint_1.toGweiFromWei = toGweiFromWei;
    function toGweiFromEther(val) {
        return toWei(val, $bigint_1.GWEI_DECIMALS);
    }
    $bigint_1.toGweiFromEther = toGweiFromEther;
    function multWithFloat(bigInt, float) {
        let $bigint = bigInt;
        let $number = float;
        let value = 1n;
        while (Math.floor($number) !== $number) {
            $number *= 10;
            $bigint *= 10n;
            value *= 100n;
        }
        return $bigint * BigInt(Math.floor($number)) / value;
    }
    $bigint_1.multWithFloat = multWithFloat;
    function divToFloat(a, b, precision = 100000n) {
        _is_1.$is.BigInt(a);
        _is_1.$is.BigInt(b);
        let r = (a * precision) / b;
        if (r < Number.MAX_SAFE_INTEGER) {
            return Number(r) / Number(precision);
        }
        throw new Error(`divToFloat failed by MAX_SAFE_INTEGER result ${r}. ${a}/${b}`);
    }
    $bigint_1.divToFloat = divToFloat;
    function pow(basis, exponent) {
        let $base = typeof basis === 'number' ? BigInt(Math.round(basis)) : basis;
        let $exp = typeof exponent === 'number' ? BigInt(exponent) : exponent;
        return $base ** $exp;
    }
    $bigint_1.pow = pow;
})($bigint = exports.$bigint || (exports.$bigint = {}));
