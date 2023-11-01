import { TEth } from '@dequanto/models/TEth';
import { $buffer } from '@dequanto/utils/$buffer';
import { $hex } from '@dequanto/utils/$hex';
import { $require } from '@dequanto/utils/$require';
import alot from 'alot';

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
    export function sliceFromEnd(hex: string, positionBits: number, bits: number) {
        let len = bits / 8 * 2;
        let position = positionBits / 8 * 2;
        let start = hex.length - len - position;
        if (start < 0) {
            throw new Error(`Not enough space to slice the buffer (${len}B) from position ${position / 8}B`);
        }
        let sliced = hex.substring(start, start + len);
        return sliced;
    }

    export function writeFromEnd(hex: TEth.Hex, hexIn: TEth.Hex | TEth.HexRaw, positionBits: number, bits: number): TEth.Hex {
        hexIn = hexIn.startsWith('0x')
            ? hexIn.substring(2)
            : hexIn;

        let len = bits / 8 * 2;
        let position = positionBits / 8 * 2;
        let start = hex.length - len - position;
        if (start < 0) {
            throw new Error(`Not enough space to write the buffer (${len}B) at position ${position / 8}B`);
        }
        let sliced = hex.substring(0, start) + hexIn + hex.substring(start + len);
        return sliced as TEth.Hex;
    }

    export function fromHex(hex: TEth.Hex) {
        let trimmed = $hex.trimBytes(hex);
        return $buffer.fromHex(trimmed).toString();
    }

    export function removeRgxMatches(str: string, ...matches: RegExpMatchArray[]) {
        matches = matches.filter(x => x != null);
        if (matches.length === 0) {
            return str;
        }
        if (matches.length === 1) {
            return removeRgxMatch(str, matches[0])
        }
        alot(matches)
            .sortBy(x => x.index, 'desc')
            .forEach(match => {
                str = removeRgxMatch(str, match);
            })
            .toArray();
        return str;
    }
    export function removeRgxMatch(str: string, match: RegExpMatchArray) {
        if (match == null) {
            return str;
        }
        return str.substring(0, match.index) + str.substring(match.index + match[0].length);
    }
}
