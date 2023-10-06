import { TEth } from '@dequanto/models/TEth';
import { $buffer } from '@dequanto/utils/$buffer';
import { $hex } from '@dequanto/utils/$hex';

// https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/

export namespace $rlp {
    export type RecursiveArray<T> = T | RecursiveArray<T>[]

    export function encode(arr: RecursiveArray<TEth.Hex | Uint8Array>): TEth.Hex {
        let bytes = toAllBytes(arr);
        let buffer = bytesToRlp(bytes);
        return $buffer.toHex(buffer);
    }

    export function decode(value: Uint8Array | TEth.Hex, to?: 'hex'): RecursiveArray<Uint8Array>
    export function decode(value: Uint8Array | TEth.Hex, to: 'bytes'): RecursiveArray<TEth.Hex>
    export function decode(value: Uint8Array | TEth.Hex, to: 'bytes' | 'hex' = 'hex'): RecursiveArray<TEth.Hex | Uint8Array> {
        const bytes = $buffer.ensure(value)
        const [data, consumed] = rlpToBytes(bytes)
        if (consumed < bytes.length) {
            throw new Error(`DataLengthTooLong: ${consumed} < ${bytes.length}`)
        }
        if (to === 'bytes') {
            return data;
        }
        return toAllHex(data)
    }

    function toAllBytes(mix: RecursiveArray<TEth.Hex | Uint8Array>): RecursiveArray<Uint8Array> {
        return Array.isArray(mix)
            ? mix.map(toAllBytes)
            : $buffer.ensure(mix)
            ;
    }
    function toAllHex(mix: RecursiveArray<TEth.Hex | Uint8Array>): RecursiveArray<TEth.Hex> {
        return Array.isArray(mix)
            ? mix.map(toAllHex)
            : $hex.ensure(mix)
            ;
    }

    export function bytesToRlp(bytes: RecursiveArray<Uint8Array>): Uint8Array {
        if (Array.isArray(bytes)) {
            const encoded = $buffer.concat(bytes.map(bytesToRlp))
            return new Uint8Array([...encodeLength(encoded.length, 0xc0), ...encoded])
        }

        if (bytes.length === 1 && bytes[0] < 0x80) {
            return bytes
        }
        return new Uint8Array([...encodeLength(bytes.length, 0x80), ...bytes])
    }

    function encodeLength(length: number, offset: number) {
        if (length < 56) {
            return [offset + length]
        }
        let lengthBytes = $buffer.fromBigInt(BigInt(length));
        return [lengthBytes.length + offset + 55, ...lengthBytes];
    }

    function rlpToBytes(bytes: Uint8Array, offset = 0): [result: RecursiveArray<Uint8Array>, consumed: number] {
        if (bytes.length === 0) {
            return [new Uint8Array([]), 0]
        }

        let prefix = bytes[offset]
        if (prefix <= 0x7f) {
            return [new Uint8Array([bytes[offset]]), 1];
        }

        if (prefix <= 0xb7) {
            const length = prefix - 0x80
            const offset_ = offset + 1

            if (offset_ + length > bytes.length) {
                throw new Error(`Data length too short: ${offset_ + length} > ${bytes.length} (${prefix} <= 0xb7)`)
            }

            return [bytes.slice(offset_, offset_ + length), 1 + length]
        }

        if (prefix <= 0xbf) {
            const lengthOfLength = prefix - 0xb7
            const offset_ = offset + 1
            const length = Number($buffer.toBigInt(bytes.slice(offset_, offset_ + lengthOfLength)))

            if (offset_ + lengthOfLength + length > bytes.length) {
                throw new Error(`Data length too short: ${lengthOfLength + length} > ${bytes.length - lengthOfLength} (${prefix} <= 0xbf)`);
            }

            return [
                bytes.slice(offset_ + lengthOfLength, offset_ + lengthOfLength + length),
                1 + lengthOfLength + length,
            ]
        }

        let lengthOfLength = 0
        let length = prefix - 0xc0
        if (prefix > 0xf7) {
            lengthOfLength = prefix - 0xf7
            length = Number($buffer.toBigInt(bytes.slice(offset + 1, offset + 1 + lengthOfLength)));
        }

        let nextOffset = offset + 1 + lengthOfLength
        if (nextOffset > bytes.length) {
            throw new Error(`Data length too short: ${nextOffset} > ${bytes.length} (nextOffset)`);
        }

        const consumed = 1 + lengthOfLength + length
        const result = []
        while (nextOffset < offset + consumed) {
            const decoded = rlpToBytes(bytes, nextOffset)
            result.push(decoded[0])
            nextOffset += decoded[1]
            if (nextOffset > offset + consumed) {
                throw new Error(`OffsetOutOfBoundsError: ${nextOffset} > ${offset + consumed}`);
            }
        }

        return [result, consumed]
    }


}
