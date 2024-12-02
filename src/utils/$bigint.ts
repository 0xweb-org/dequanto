import { TEth } from '@dequanto/models/TEth';
import { $buffer } from './$buffer';
import { $require } from './$require';
import { $is } from '@dequanto/utils/$is';

export namespace $bigint {

    export const ETHER_DECIMALS = 18;
    export const GWEI_DECIMALS = 9;
    export const MAX_UINT256 = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn;

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

    export function toBigInt (amount: string | number | bigint | Uint8Array): bigint {
        if (typeof amount === 'bigint') {
            return amount;
        }
        if (typeof amount === 'string') {
            if (amount.includes('.')) {
                amount = amount.substring(0, amount.indexOf('.'));
            }
            if (amount[0] === '-') {
                return -BigInt(amount.substring(1));
            }
            return BigInt(amount);
        }
        if (amount instanceof Uint8Array) {
            return $buffer.toBigInt(amount);
        }
        return BigInt(Math.round(amount));
    }

    /**
     * @param amount e.g "2.4 ether", "10 gwei", "1.7^18", "123456"
     */
    export function parse (amount: string): bigint {
        if (/^\d+$/.test(amount) || $is.Hex(amount) ) {
            return BigInt(amount);
        }
        let rgxName = /^(?<number>[\d.]+)\s*(?<name>ether|gwei|wei)$/i;
        let rgxMatch = rgxName.exec(amount);
        if (rgxMatch != null) {
            let number = Number(rgxMatch.groups.number);
            if (isNaN(number)) {
                throw new Error(`Invalid format: ${amount}`);
            }
            let name = rgxMatch.groups.name;
            if (name === 'ether') {
                return toWei(number, ETHER_DECIMALS);
            }
            if (name === 'gwei') {
                return toWei(number, GWEI_DECIMALS);
            }
            if (name === 'wei') {
                return BigInt(number);
            }
        }

        // 2.5^18
        let rgxMantissa = /^(?<number>[\d.]+)\s*\^\s*(?<decimals>\d+)$/;
        let rgxMantissaMatch = rgxMantissa.exec(amount);
        if (rgxMantissaMatch != null) {
            let number = Number(rgxMantissaMatch.groups.number);
            let decimals = Number(rgxMantissaMatch.groups.decimals);
            if (isNaN(number) || isNaN(decimals)) {
                throw new Error(`Invalid format: ${amount}`);
            }
            return toWei(number, decimals);
        }
        throw new Error(`Unsupported format: ${amount}`);
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
        throw new Error(`Ether overflow: ${val}. Amount: ${amount} Decimals: ${decimals}`);
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

    export function toHex (num: string | bigint | number): TEth.Hex {
        if (num == null) {
            num = 0n;
        };
        if (typeof num === 'string') {
            try {
                let negative = false;
                if (num[0] === '-') {
                    num = num.substring(1);
                    negative = true;
                }
                num = BigInt(num);
                if (negative === true) {
                    num = -num;
                }

            } catch (error) {
                throw new Error(`Invalid BigInt ${num}`)
            }
        }
        if (typeof num === 'number') {
            num = BigInt(num);
        }
        let isNegative = num < 0n;
        if (isNegative) {
            num = -num;
        }
        let hex = `0x${num.toString(16)}`;
        if (isNegative) {
            hex = `-${hex}`;
        }
        return hex as TEth.Hex;
    }

    export function toTwos (value: bigint, bits: number) {
        const width = BigInt(bits);
        const limit = (1n << (width - 1n));

        if (value < 0n) {
            value = -value;
            $require.True(value <= limit, `NUMERIC_FAULT: too low ${value} <= ${limit}`);
            const mask = (1n << width) - 1n;
            return ((~value) & mask) + 1n;
        } else {
            $require.True(value < limit, `NUMERIC_FAULT: too high ${value} < ${limit}`);
        }

        return value;
    }
    export function fromTwos (value: bigint, bits: number) {
        const width = BigInt(bits);
        $require.True((value >> width) === 0n, `NUMERIC_FAULT: overflow ${value}`);

        // Top bit set; treat as a negative value
        if (value >> (width - 1n)) {
            const mask = (1n << width) - 1n;
            return -(((~value) & mask) + 1n);
        }
        return value;
    }
    export function mask (value: bigint, _bits: number) {
        const bits = BigInt(_bits);
        return value & ((1n << bits) - 1n);
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
        $require.BigInt(a);
        $require.BigInt(b);

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

    export function sign(value: bigint) {
        if (value > 0n) {
            return 1n;
        }
        if (value < 0n) {
            return -1n;
        }
        return 0n;
    }

    export function abs(value: bigint) {
        if (sign(value) === -1n) {
            return -value;
        }
        return value;
    }

    export function sqrt(value: bigint) {
        return rootNth(value);
    }

    function rootNth(value: bigint, k = 2n) {
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


}
