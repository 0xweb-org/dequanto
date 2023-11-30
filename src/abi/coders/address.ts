

import type { Reader, Writer } from "./abstract-coder";

import { Coder } from "./abstract-coder";

import { $hex } from '@dequanto/utils/$hex';
import { $bigint } from '@dequanto/utils/$bigint';
import { $address } from '@dequanto/utils/$address';


/**
 *  @_ignore
 */
export class AddressCoder extends Coder {

    constructor(localName: string) {
        super("address", "address", localName, false);
    }

    defaultValue(): string {
        return $address.ZERO;
    }

    encode(writer: Writer, _value: string): number {

        // try {
        //     value = getAddress(value);
        // } catch (error: any) {
        //     return this._throwError(error.message, _value);
        // }

        return writer.writeValue($hex.isEmpty(_value) ? 0n : BigInt(_value));
    }

    decode(reader: Reader): any {
        return $address.toChecksum($hex.padBytes($bigint.toHex(reader.readValue()), 20));
    }
}
