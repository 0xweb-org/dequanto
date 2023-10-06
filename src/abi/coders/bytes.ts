import { $buffer } from '@dequanto/utils/$buffer';
import { Coder } from "./abstract-coder";
import type { Reader, Writer } from "./abstract-coder";


/**
 *  @_ignore
 */
export class DynamicBytesCoder extends Coder {
    constructor(type: string, localName: string) {
       super(type, type, localName, true);
    }

    defaultValue(): string {
        return "0x";
    }

    encode(writer: Writer, value: any): number {
        value = $buffer.ensure(value);
        let length = writer.writeValue(value.length);
        length += writer.writeBytes(value);
        return length;
    }

    decode(reader: Reader): Uint8Array {
        return reader.readBytes(reader.readIndex(), true);
    }
}

/**
 *  @_ignore
 */
export class BytesCoder extends DynamicBytesCoder {
    constructor(localName: string) {
        super("bytes", localName);
    }

    decode(reader: Reader): any {
        return $buffer.toHex(super.decode(reader));
    }
}
