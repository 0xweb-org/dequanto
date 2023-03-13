import { $buffer } from '@dequanto/utils/$buffer';
import { $hex } from '@dequanto/utils/$hex';
import { $require } from '@dequanto/utils/$require';

export namespace $str {
    export function isNullOrWhiteSpace(x: string) {
        if (x == null) {
            return true;
        }
        if (typeof x !== 'string') {
            throw new Error(`isNullOrWhiteSpace expects a string parameter, but got ${typeof x} - ${x}`);
        }
        if (x.trim() === '') {
            return true;
        }
        return false;
    }
    export function sliceFromEnd (hex: string, positionBits: number, bits: number) {
        let len = bits / 8 * 2;
        let position = positionBits / 8 * 2;
        let start = hex.length - len - position;
        if (start < 0) {
            throw new Error(`Not enough space to slice the buffer (${len}B) from position ${position/8}B`);
        }
        let sliced = hex.substring(start, start + len);
        return sliced;
    }

    export function writeFromEnd (hex: string, hexIn: string, positionBits: number, bits: number) {
        hexIn = hexIn.startsWith('0x')
            ? hexIn.substring(2)
            : hexIn;

        let len = bits / 8 * 2;
        let position = positionBits / 8 * 2;
        let start = hex.length - len - position;
        if (start < 0) {
            throw new Error(`Not enough space to write the buffer (${len}B) at position ${position/8}B`);
        }
        let sliced = hex.substring(0, start) + hexIn + hex.substring(start + len);
        return sliced;
    }

    export function fromHex (hex: string) {
        let trimmed = $hex.trimBytes(hex);
        return $buffer.fromHex(trimmed).toString();
    }
}
