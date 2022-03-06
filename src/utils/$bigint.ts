import { $is } from './$is';

export namespace $bigint {

    export const ETHER_DECIMALS = 18;
    export const GWEI_DECIMALS = 9;

    export function max(...args: bigint[]): bigint {
        let max: bigint = null;
        for (let i = 0; i < args.length; i++) {
            let val = args[i];
            if (max == null || max < val) {
                max = val;
            }
        }
        return max;
    }
    export function min(...args: bigint[]): bigint {
        let min:bigint = null;
        for (let i = 0; i < args.length; i++) {
            let val = args[i];
            if (min == null || min > val) {
                min = val;
            }
        }
        return min;
    }

    export function toBigInt (amount: string | number | bigint): bigint {
        if (typeof amount === 'bigint') {
            return amount;
        }
        if (typeof amount === 'string') {
            amount = Number(amount);
        }
        return BigInt(Math.round(amount));
    }

    export function ensureWei (amount: number | bigint, decimals: number) {
        if (typeof amount === 'number') {
            return toWei(amount, decimals);
        }
        return amount;
    }
    export function toWei (amount: string | number | bigint, decimals: number | string = ETHER_DECIMALS) {
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
    export function toWeiFromGwei(amount: string | number | bigint) {
        return toWei(amount, GWEI_DECIMALS);
    }

    export function toEther (amount: string | number | bigint, decimals: number | string = ETHER_DECIMALS, round = 100000n): number {
        let $decimals = BigInt(decimals);
        let $amount = BigInt(amount);
        let val = $amount * round / 10n ** $decimals;
        if (val < Number.MAX_SAFE_INTEGER) {
            return Number(val) / Number(round);
        }
        throw new Error(`Ether overflow: ${val}. Decimals: ${decimals}`);
    }

    export function toEtherSafe (amount: string | number | bigint, decimals: number | string = ETHER_DECIMALS, round = 100000n): number | bigint {
        let $decimals = BigInt(decimals);
        let $amount = BigInt(amount);
        let val = $amount * round / 10n ** $decimals;
        if (val < Number.MAX_SAFE_INTEGER) {
            return Number(val) / Number(round);
        }
        return val / round;
    }

    export function toHex (num: bigint) {
        return `0x${num.toString(16)}`;
    }

    export function toGweiFromWei (val: bigint) {
        return toEther(val, GWEI_DECIMALS);
    }
    export function toGweiFromEther (val: number) {
        return toWei(val, GWEI_DECIMALS);
    }

    export function multWithFloat (bigInt: bigint, float: number) {
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

    export function divToFloat (a: bigint, b: bigint, precision = 100_000n): number {
        $is.BigInt(a);
        $is.BigInt(b);

        let r = (a * precision) / b;
        if (r < Number.MAX_SAFE_INTEGER) {
            return Number(r) / Number(precision);
        }
        throw new Error(`divToFloat failed by MAX_SAFE_INTEGER result ${r}. ${a}/${b}`)
    }

    export function pow (basis: bigint | number, exponent: number | bigint): bigint {
        let $base = typeof basis === 'number' ? BigInt(Math.round(basis)) : basis;
        let $exp = typeof exponent === 'number' ? BigInt(exponent) : exponent;

        return $base ** $exp;
    }
}
