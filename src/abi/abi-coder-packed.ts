import { $hex } from '@dequanto/utils/$hex';
import { $bigint } from '@dequanto/utils/$bigint';
import { $buffer } from '@dequanto/utils/$buffer';
import { $require } from '@dequanto/utils/$require';


const regexBytes = /^bytes([0-9]+)$/;
const regexNumber = /^(u?int)([0-9]*)$/;
const regexArray = /^(?<baseType>.*)\[(?<size>[0-9]*)\]$/;


function _pack(type: string, value: any, isArray?: boolean): Uint8Array {
    switch(type) {
        case "address":
            if (isArray) {
                return $buffer.ensure($hex.padBytes(value, 32));
            }
            return $buffer.ensure($hex.padBytes(value, 20));
        case "string":
            return $buffer.fromString(value);
        case "bytes":
            return $buffer.ensure(value);
        case "bool":
            value = (!!value ? "0x01": "0x00");
            if (isArray) {
                return $buffer.ensure($hex.padBytes(value, 32));
            }
            return $buffer.ensure(value);
    }

    let numberMatch =  type.match(regexNumber);
    if (numberMatch) {
        let signed = (numberMatch[1] === "int");
        let size = parseInt(numberMatch[2] || "256")
        if (isArray) {
            size = 256;
        }
        value = $bigint.toBigInt(value);

        if (signed && value < 0n) {
            value = $bigint.toTwos(value, size);
        }
        return $buffer.ensure($hex.padBytes($bigint.toHex(value), size / 8));
    }

    let bytesMatch = type.match(regexBytes);
    if (bytesMatch) {
        if (isArray) {
            return $buffer.ensure($hex.padBytes(value, 32, { padEnd: true }));
        }
        return value;
    }

    let arrayMatch = type.match(regexArray);
    if (arrayMatch && Array.isArray(value)) {
        const baseType = arrayMatch.groups.baseType;
        if (arrayMatch.groups.size) {
            const size = parseInt(arrayMatch.groups.size);
            $require.eq(size, value.length)
        }
        const arr = value;
        const buffers = arr.map(x => _pack(baseType, x, true));
        return $buffer.concat(buffers);
    }

    throw new Error(`AbiCoder: Invalid type ${type}`);
}

// @TODO: Array Enum

/**
 *   Computes the [[link-solc-packed]] representation of %%values%%
 *   respectively to their %%types%%.
 *
 *   @example:
 *       addr = "0x8ba1f109551bd432803012645ac136ddd64dba72"
 *       solidityPacked([ "address", "uint" ], [ addr, 45 ]);
 *       //_result:
 */
export function solidityPacked(types: string[], values: ReadonlyArray<any>): string {
    $require.eq(types.length, values.length, `types.length (${types.length}) != values.length (${values.length})`);

    const buffers = types.map((type, index) => {
        let result = _pack(type, values[index]);
        return $buffer.ensure(result);
    });

    const buffer = $buffer.concat(buffers);
    return $buffer.toHex(buffer);
}
