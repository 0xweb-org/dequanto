export namespace $opcodes {
    export const UINT256_SIZE = 2n**256n;
    export const UINT256_MAX = UINT256_SIZE - 1n;
    export const UINT256_MIN = 0n;

    export const INT256_MAX = (UINT256_SIZE / 2n) - 1n;
    export const INT256_MIN = -UINT256_SIZE / 2n;

    export function add (a: bigint, b: bigint): bigint {
        return uint256(a + b);
    }
    export function mul (a: bigint, b: bigint): bigint {
        return uint256(a * b);
    }
    export function sub (a: bigint, b: bigint): bigint {
        return uint256(a - b);
    }
    export function div (a: bigint, b: bigint): bigint {
        if (b === 0n) {
            return b;
        }
        return uint256(a / b);
    }
    export function sdiv (a: bigint, b: bigint): bigint {
        if (b === 0n) {
            return b;
        }
        return int256(a) / int256(b);
    }
    export function mod (a: bigint, b: bigint): bigint {
        if (b === 0n) {
            return 0n;
        }
        return a % b;
    }
    export function smod (a: bigint, b: bigint): bigint {
        if (b === 0n) {
            return 0n;
        }
        return uint256(int256(a) % int256(b));
    }
    export function addmod(a: bigint, b: bigint, N: bigint): bigint {
        return mod(a + b, N);
    }
    export function mulmod(a: bigint, b: bigint, N: bigint): bigint {
        return mod(a * b, N);
    }
    export function exp (a: bigint, exp: bigint) {
        return uint256(a ** exp);
    }

    export function signextend (byteCount: bigint, x: bigint) {
        // @TODO as bigint is not byte limited, we can not/do not need to extend, return same value
        return x;
    }
    export function lt (a: bigint, b: bigint) {
        return a < b ? 1n : 0n;
    }
    export function gt (a: bigint, b: bigint) {
        return a > b ? 1n : 0n;
    }
    export function slt (a: bigint, b: bigint) {
        return int256(a) < int256(b) ? 1n : 0n;
    }
    export function sgt (a: bigint, b: bigint) {
        return int256(a) > int256(b) ? 1n : 0n;
    }
    export function eq (a: bigint, b: bigint) {
        return a === b ? 1n : 0n;
    }
    export function iszero (a: bigint) {
        return a === 0n ? 1n : 0n;
    }
    export function and (a: bigint, b: bigint) {
        return a & b;
    }
    export function or (a: bigint, b: bigint) {
        return a | b;
    }
    export function xor (a: bigint, b: bigint) {
        return a ^ b;
    }
    export function not (a: bigint) {
        return uint256(~a);
    }
    export function byte (i: number, a: bigint) {
        // 0xFF === 0x00000000000000000000000000000000000000000000000000000000000000FF
        // Index 0 is the first Byte in the 32-byte WORD
        // ...
        // Index 31 is the last Byte in the 32-byte WORD
        const LENGTH = 32;
        const shifted = shr(8 * (LENGTH - i - 1), a);
        return shifted & 0xFFn;
    }
    export function shl (bits: number, a: bigint) {
        if (bits > 255) {
            return 0;
        }
        return uint256(a << BigInt(bits));
    }
    export function shr (bits: number, a: bigint) {
        return uint256(a >> BigInt(bits));
    }
    export function sar (bits: number, a: bigint) {
        return uint256(int256(a) >> BigInt(bits));
    }


    export function uint256(x: bigint): bigint {
        return unchecked(x, UINT256_SIZE, UINT256_MIN, UINT256_MAX);
    }
    export function int256(x: bigint): bigint {
        return unchecked(x, UINT256_SIZE, INT256_MIN, INT256_MAX);
    }

    export function unchecked (a: bigint, size: bigint, min: bigint, max: bigint) {
        a = a % size;
        a = a > max ? (a - size) : a;
        a = a < min ? (a + size) : a;
        return a;
    }
}
