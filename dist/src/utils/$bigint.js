"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$bigint = void 0;
const _require_1 = require("./$require");
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
        throw new Error(`Ether overflow: ${val}. Decimals: ${decimals}`);
    }
    $bigint_1.toEther = toEther;
    function toEtherSafe(amount, decimals = $bigint_1.ETHER_DECIMALS, round = 100000n) {
        let $decimals = BigInt(decimals);
        let $amount = BigInt(amount);
        let val = $amount * round / 10n ** $decimals;
        if (val < Number.MAX_SAFE_INTEGER) {
            return Number(val) / Number(round);
        }
        return val / round;
    }
    $bigint_1.toEtherSafe = toEtherSafe;
    function toHex(num) {
        if (num == null) {
            return '0x0';
        }
        ;
        if (typeof num === 'string') {
            if (num.startsWith('0x')) {
                return num;
            }
            try {
                num = BigInt(num);
            }
            catch (error) {
                throw new Error(`Invalid BigInt ${num}`);
            }
        }
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
        _require_1.$require.BigInt(a);
        _require_1.$require.BigInt(b);
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
    function sign(value) {
        if (value > 0n) {
            return 1n;
        }
        if (value < 0n) {
            return -1n;
        }
        return 0n;
    }
    $bigint_1.sign = sign;
    function abs(value) {
        if (sign(value) === -1n) {
            return -value;
        }
        return value;
    }
    $bigint_1.abs = abs;
    function sqrt(value) {
        return rootNth(value);
    }
    $bigint_1.sqrt = sqrt;
    function rootNth(value, k = 2n) {
        if (value < 0n) {
            throw Error(`Sqrt of ${value} is not allowed`);
        }
        let o = 0n;
        let x = value;
        let limit = 100;
        while (x ** k !== k && x !== o && --limit) {
            o = x;
            x = ((k - 1n) * x + value / x ** (k - 1n)) / k;
        }
        return x;
    }
})($bigint = exports.$bigint || (exports.$bigint = {}));
