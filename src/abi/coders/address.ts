

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
        return "0x0000000000000000000000000000000000000000";
    }

    encode(writer: Writer, _value: string): number {

        // try {
        //     value = getAddress(value);
        // } catch (error: any) {
        //     return this._throwError(error.message, _value);
        // }
        return writer.writeValue(BigInt(_value));
    }

    decode(reader: Reader): any {
        return $address.toChecksum($hex.padBytes($bigint.toHex(reader.readValue()), 20));
    }
}
