import { Coder } from "./abstract-coder";

import type { Reader, Writer } from "./abstract-coder";

/**
 *  @_ignore
 */
export class BooleanCoder extends Coder {

    constructor(localName: string) {
        super("bool", "bool", localName, false);
    }

    defaultValue(): boolean {
        return false;
    }

    encode(writer: Writer, value: boolean): number {
        return writer.writeValue(value ? 1n: 0n);
    }

    decode(reader: Reader): any {
        return !!reader.readValue();
    }
}
