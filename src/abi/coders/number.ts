import { Coder, WordSize } from "./abstract-coder";

import type { Reader, Writer } from "./abstract-coder";
import { $bigint } from '@dequanto/utils/$bigint';



/**
 *  @_ignore
 */
export class NumberCoder extends Coder {
    readonly size!: number;
    readonly signed!: boolean;

    constructor(size: number, signed: boolean, localName: string) {
        const name = ((signed ? "int": "uint") + (size * 8));
        super(name, name, localName, false);

        this.size = size;
        this.signed = signed;
    }

    defaultValue(): number {
        return 0;
    }

    encode(writer: Writer, _value: bigint | number | string): number {
        let value = $bigint.toBigInt(_value);

        // Check bounds are safe for encoding
        let maxUintValue = $bigint.mask($bigint.MAX_UINT256, WordSize * 8);
        if (this.signed) {
            let bounds = $bigint.mask(maxUintValue, (this.size * 8) - 1);
            if (value > bounds || value < -(bounds + 1n)) {
                this._throwError("value out-of-bounds", _value);
            }
            value = $bigint.toTwos(value, 8 * WordSize);
        } else if (value < 0n || value > $bigint.mask(maxUintValue, this.size * 8)) {
            this._throwError("value out-of-bounds", _value);
        }

        return writer.writeValue(value);
    }

    decode(reader: Reader): any {
        let SIZE = this.size * 8;
        let value = $bigint.mask(reader.readValue(), SIZE);

        if (this.signed) {
            value = $bigint.fromTwos(value, SIZE);
        }
        if (SIZE <= 32) {
            return Number(value);
        }

        return value;
    }
}

