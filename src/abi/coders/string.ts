import type { Reader, Writer } from './abstract-coder';

import { DynamicBytesCoder } from './bytes';
import { $buffer } from '@dequanto/utils/$buffer';

export class StringCoder extends DynamicBytesCoder {

    constructor(localName: string) {
        super('string', localName);
    }

    defaultValue(): string {
        return '';
    }

    encode(writer: Writer, _value: string): number {
        return super.encode(writer, $buffer.fromString(_value));
    }

    decode(reader: Reader): any {
        return $buffer.toString(super.decode(reader));
    }
}
