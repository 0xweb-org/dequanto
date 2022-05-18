import { $buffer } from '@dequanto/utils/$buffer';

(BigInt as any).prototype.toJSON = function () { return this.toString() };
(BigInt as any).prototype.toBuffer = function () {
    let hex = (this as bigint).toString(16);
    if (hex.length % 2 !== 0) {
        hex = `0${hex}`;
    }
    return $buffer.fromHex(hex);
};

(BigInt as any).prototype.valueOf = function () {
    if (this > BigInt(Number.MAX_VALUE)) {
        throw new Error(`BigInt to Number overfows: ${this}`)
    }
    return Number(this);
};

export function BigIntSerializer () {}

