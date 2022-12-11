import { $buffer } from '@dequanto/utils/$buffer';
import { $hex } from '@dequanto/utils/$hex';

export namespace $str {
    export function sliceFromEnd (str: string, positionBits: number, bits: number) {
        let len = bits / 8 * 2;
        let position = positionBits / 8 * 2;
        let start = str.length - len - position;
        let sliced = str.substring(start, start + len);
        return sliced;
    }
    export function fromHex (hex: string) {
        let trimmed = $hex.trimBytes(hex);
        return $buffer.fromHex(trimmed).toString();
    }
}
