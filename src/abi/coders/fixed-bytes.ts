import type { Reader, Writer } from "./abstract-coder";

import { Coder } from "./abstract-coder";
import { $buffer } from '@dequanto/utils/$buffer';

/**
 *  @_ignore
 */
export class FixedBytesCoder extends Coder {
    readonly size!: number;

    constructor(size: number, localName: string) {
        let name = "bytes" + String(size);
        super(name, name, localName, false);
        this.size = size;
    }

    defaultValue(): string {
        return ("0x0000000000000000000000000000000000000000000000000000000000000000").substring(0, 2 + this.size * 2);
    }

    encode(writer: Writer, value: Uint8Array | string): number {
        let data = $buffer.ensure(value);
        if (data.length !== this.size) {
            this._throwError(`incorrect data length ${data.length} !== ${this.size}`, data);
        }
        return writer.writeBytes(data);
    }

    decode(reader: Reader): any {
        return $buffer.toHex(reader.readBytes(this.size));
    }
}
