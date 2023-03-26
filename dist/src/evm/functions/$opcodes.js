"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$opcodes = void 0;
var $opcodes;
(function ($opcodes) {
    $opcodes.UINT256_SIZE = 2n ** 256n;
    $opcodes.UINT256_MAX = $opcodes.UINT256_SIZE - 1n;
    $opcodes.UINT256_MIN = 0n;
    $opcodes.INT256_MAX = ($opcodes.UINT256_SIZE / 2n) - 1n;
    $opcodes.INT256_MIN = -$opcodes.UINT256_SIZE / 2n;
    function add(a, b) {
        return uint256(a + b);
    }
    $opcodes.add = add;
    function mul(a, b) {
        return uint256(a * b);
    }
    $opcodes.mul = mul;
    function sub(a, b) {
        return uint256(a - b);
    }
    $opcodes.sub = sub;
    function div(a, b) {
        if (b === 0n) {
            return b;
        }
        return uint256(a / b);
    }
    $opcodes.div = div;
    function sdiv(a, b) {
        if (b === 0n) {
            return b;
        }
        return int256(a) / int256(b);
    }
    $opcodes.sdiv = sdiv;
    function mod(a, b) {
        if (b === 0n) {
            return 0n;
        }
        return a % b;
    }
    $opcodes.mod = mod;
    function smod(a, b) {
        if (b === 0n) {
            return 0n;
        }
        return uint256(int256(a) % int256(b));
    }
    $opcodes.smod = smod;
    function addmod(a, b, N) {
        return mod(a + b, N);
    }
    $opcodes.addmod = addmod;
    function mulmod(a, b, N) {
        return mod(a * b, N);
    }
    $opcodes.mulmod = mulmod;
    function exp(a, exp) {
        return uint256(a ** exp);
    }
    $opcodes.exp = exp;
    function signextend(byteCount, x) {
        // @TODO as bigint is not byte limited, we can not/do not need to extend, return same value
        return x;
    }
    $opcodes.signextend = signextend;
    function lt(a, b) {
        return a < b ? 1n : 0n;
    }
    $opcodes.lt = lt;
    function gt(a, b) {
        return a > b ? 1n : 0n;
    }
    $opcodes.gt = gt;
    function slt(a, b) {
        return int256(a) < int256(b) ? 1n : 0n;
    }
    $opcodes.slt = slt;
    function sgt(a, b) {
        return int256(a) > int256(b) ? 1n : 0n;
    }
    $opcodes.sgt = sgt;
    function eq(a, b) {
        return a === b ? 1n : 0n;
    }
    $opcodes.eq = eq;
    function iszero(a) {
        return a === 0n ? 1n : 0n;
    }
    $opcodes.iszero = iszero;
    function and(a, b) {
        return a & b;
    }
    $opcodes.and = and;
    function or(a, b) {
        return a | b;
    }
    $opcodes.or = or;
    function xor(a, b) {
        return a ^ b;
    }
    $opcodes.xor = xor;
    function not(a) {
        return uint256(~a);
    }
    $opcodes.not = not;
    function byte(i, a) {
        // 0xFF === 0x00000000000000000000000000000000000000000000000000000000000000FF
        // Index 0 is the first Byte in the 32-byte WORD
        // ...
        // Index 31 is the last Byte in the 32-byte WORD
        const LENGTH = 32;
        const shifted = shr(8 * (LENGTH - i - 1), a);
        return shifted & 0xffn;
    }
    $opcodes.byte = byte;
    function shl(bits, a) {
        if (bits > 255) {
            return 0;
        }
        return uint256(a << BigInt(bits));
    }
    $opcodes.shl = shl;
    function shr(bits, a) {
        return uint256(a >> BigInt(bits));
    }
    $opcodes.shr = shr;
    function sar(bits, a) {
        return uint256(int256(a) >> BigInt(bits));
    }
    $opcodes.sar = sar;
    function uint256(x) {
        return unchecked(x, $opcodes.UINT256_SIZE, $opcodes.UINT256_MIN, $opcodes.UINT256_MAX);
    }
    $opcodes.uint256 = uint256;
    function int256(x) {
        return unchecked(x, $opcodes.UINT256_SIZE, $opcodes.INT256_MIN, $opcodes.INT256_MAX);
    }
    $opcodes.int256 = int256;
    function unchecked(a, size, min, max) {
        a = a % size;
        a = a > max ? (a - size) : a;
        a = a < min ? (a + size) : a;
        return a;
    }
    $opcodes.unchecked = unchecked;
})($opcodes = exports.$opcodes || (exports.$opcodes = {}));
