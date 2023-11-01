import { TEth } from '@dequanto/models/TEth';
import { $buffer } from './$buffer';
import { $require } from './$require';
export namespace $hex {

    /**
     * Adds '00' bytes to the hex string.
     * @param hex
     * @param byteSize Min bytes count in the hex string
     */
    export function padBytes(hex: TEth.Hex, byteSize: number, opts?: { padEnd?: boolean }): TEth.Hex {
        let length = byteSize * 2;
        hex = ensure(hex);
        if (hex.length === length + 2) {
            return hex;
        }
        hex = hex.substring(2)[ opts?.padEnd ? 'padEnd' : 'padStart' ](length, '0') as TEth.Hex;
        return `0x${hex}`;
    }

    /**
     * Trims '00' bytes from start or end, e.g.  0x68656c6c6f000000 =>  0x68656c6c6f
     */
    export function trimBytes(hex: TEth.Hex): TEth.Hex {
        if (hex.startsWith('0x00') === false && hex.endsWith('00') === false) {
            return hex;
        }
        return hex.replace(/^0x(0{2})+/, '').replace(/(0{2})+$/, '') as TEth.Hex;
    }
    export function trimLeadingZerosFromNumber(hex: string) {
        hex = hex.replace(/^0x0*/, '');
        return hex === ''? '0x0' : `0x${hex}`;
    }

    export function getBytes (hex: string, offset: number, length: number) {
        let start = hex.startsWith('0x') ? 2 : 0;
        let offsetChars = offset * 2;
        let lengthChars = length * 2;
        return `0x` + hex.substring(start + offsetChars, start + offsetChars + lengthChars);
    }
    export function getBytesLength (hex: string) {
        let pfx = hex.startsWith('0x') ? 2 : 0;
        let chars = hex.length - pfx;
        $require.True(chars % 2 === 0, `Expect buffer to have even length, got ${chars}`);
        return chars / 2;
    }

    export function getNumber (hex: string, byteIndex: number, bytesCount: number = 1): number {
        let start = hex.startsWith('0x') ? 2 : 0;
        let i = start + byteIndex * 2;
        return parseInt(hex.substring(i, i + 2 * bytesCount), 16);
    }

    export function raw (hex: string) {
        return hex.startsWith('0x')
            ? hex.substring(2)
            : hex;
    }

    export function concat (arr: (string | TEth.Hex | Uint8Array)[]) {
        return ('0x' + arr.map(ensure).map(raw).join('')) as TEth.Hex;
    }

    export function toHex (value: string | boolean | number | bigint): TEth.Hex {
        switch (typeof value) {
            case 'string': {
                if (value.startsWith('0x')) {
                    return value as TEth.Hex;
                }
                return $buffer.toHex($buffer.fromString(value));
            }
            case 'number':
            case 'bigint':
                let hex = value.toString(16);
                return ('0x' + hex) as TEth.Hex;
            case 'boolean':
                return value ? '0x1' : '0x0';
        }
        throw new Error(`Invalid value to convert to hex: ${value}`);
    }
    export function toHexBuffer (value: string | boolean | number | bigint): TEth.Hex {
        value = toHex(value);
        if (value.length % 2 === 1) {
            value = '0x0' + value.substring(2);
        }
        return value as TEth.Hex;
    }

    export function convert (hex: string, abiType: 'uint256' | 'address' | 'bool' | 'string' | string) {
        if (abiType === 'bool') {
            return Boolean(Number(hex));
        }
        let bigintMatch = /int(?<size>\d+)?$/.exec(abiType);
        if (bigintMatch) {
            let size = Number(bigintMatch.groups.size ?? 256);
            if (size < 16) {
                return Number(hex);
            }
            return BigInt(hex);
        }

        return hex;
    }


    /**
     * Adds `0x` to the start if not present
     */
    export function ensure (mix: string | number | boolean | bigint | Uint8Array): TEth.Hex {
        if (mix == null) {
            return '0x';
        }
        if (mix instanceof Uint8Array) {
            mix = $buffer.toHex(mix);
        }
        if (typeof mix === 'number' || typeof mix === 'bigint') {
            return `0x${mix.toString(16)}`;
        }
        if (typeof mix ==='boolean') {
            return mix ? '0x1' : '0x0';
        }
        if (mix.startsWith('0x')) {
            return mix as TEth.Hex;
        }
        return `0x${mix}`;
    }

    export function isEmpty (hex: string) {
        return hex == null || hex.length === 0 || hex === '0x';
    }
}
