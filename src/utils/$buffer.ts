import { is_NODE } from 'atma-utils';
import { TEth } from '@dequanto/models/TEth';


interface IBufferUtils {
    fromHex(hex: string | TEth.Hex): Uint8Array
    toHex(buffer: Uint8Array): TEth.Hex

    fromString(string: string, encoding?: BufferEncoding): Uint8Array
    toString(buffer: Uint8Array, encoding?: BufferEncoding): string

    fromBigInt(value: bigint): Uint8Array
    toBigInt(buffer: Uint8Array): bigint

    concat(buffers: Uint8Array[]): Uint8Array
    ensure(mix: string | boolean | bigint | number | Uint8Array): Uint8Array
}

export type TBytes = Uint8Array;

abstract class BufferBase implements IBufferUtils {
    abstract fromHex(hex: string | TEth.Hex): Uint8Array
    abstract toHex(buffer: Uint8Array): TEth.Hex

    abstract fromString(string: string, encoding?: BufferEncoding): Uint8Array
    abstract toString(buffer: Uint8Array, encoding?: BufferEncoding): string

    abstract concat(buffers: Uint8Array[]): Uint8Array

    ensure (mix: string | boolean | bigint | number | Uint8Array) {
        if (mix == null) {
            return new Uint8Array(0);
        }
        if (typeof mix === 'string') {
            let str = mix.startsWith('0x') ? mix.substring(2) : mix;
            if (str.length % 2 !== 0) {
                str = '0' + str;
            }
            return this.fromHex(str);
        }
        if (mix instanceof Uint8Array) {
            return mix;
        }
        if (typeof mix === 'boolean') {
            return new Uint8Array(mix ? [1] : [0]);
        }
        if (typeof mix === 'number') {
            if (Math.floor(mix) !== mix) {
                throw new Error('Floats are not supported for buffer array');
            }
            mix = BigInt(mix);
        }
        if (typeof mix === 'bigint') {
            return $buffer.fromBigInt(mix);
        }

        console.error(mix);
        throw new Error(`Unexpected buffer type: ${mix} (${typeof mix})`);
    }
    toBigInt(buffer: Uint8Array): bigint {
        let result = 0n;
        let length = buffer.length;
        for (let i = 0; i < length; i++) {
            result = (result << 8n) | BigInt(buffer[i]);
        }
        return result;
    }
    fromBigInt(value: bigint | number | string): Uint8Array {
        if (typeof value === 'number' || typeof value === 'string') {
            value = BigInt(value)
        }

        if (value < 0n) {
            throw new Error(`Cannot convert negative ${value} to Uint8Array`);
        }
        if (value === 0n) {
            return new Uint8Array([ 0 ]);
        }
        // Determine the number of bytes needed to represent the BigInt
        let byteCount = 0;
        let tempValue = value;
        while (tempValue > 0n) {
            byteCount++;
            tempValue >>= 8n; // Right-shift by 8 bits to check the next byte
        }
        const uint8Array = new Uint8Array(byteCount);

        // Fill the Uint8Array with the bytes from the BigInt
        for (let i = byteCount - 1; i >= 0; i--) {
            uint8Array[i] = Number(value & 0xFFn); // Extract the least significant byte
            value >>= 8n; // Right-shift by 8 bits to get the next byte
        }
        return uint8Array;
    }
}


class NodeBufferUtils extends BufferBase {
    fromString(str: string, encoding?: BufferEncoding): Uint8Array {
        return Buffer.from(str, encoding ?? 'utf8');
    }
    toString(buffer: Uint8Array, encoding: BufferEncoding = 'utf8'): string {
        return Buffer.from(buffer).toString(encoding);
    }
    fromHex(hex: string): Uint8Array {
        return Buffer.from(utils.normalizeHex(hex), 'hex');
    }
    toHex(buffer: Uint8Array | Buffer): TEth.Hex {
        if (buffer instanceof Buffer) {
            return (`0x` + buffer.toString('hex')) as TEth.Hex;
        }
        return (`0x` + buffer.reduce((hex, x) => {
            return hex + x.toString(16).padStart(2, '0');
        }, '')) as TEth.Hex;
    }
    concat(buffers: Uint8Array[]) {
        return Buffer.concat(buffers);
    }
}

const HEX_CHARS = "0123456789abcdef";
const HEX_DIGITS = {
    0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15
};

class WebBufferUtils extends BufferBase  {
    fromString(string: string, encoding?: string): Uint8Array {
        if (encoding != null && /utf\-?8/.test(encoding) === false) {
            throw new Error(`Only UTF8 Encoding supported`);
        }
        return new TextEncoder().encode(string);
    }
    toString(buffer: Uint8Array, encoding?: BufferEncoding): string {
        if (encoding != null && /utf\-?8/.test(encoding) === false) {
            throw new Error(`Only UTF8 Encoding supported`);
        }
        return new TextDecoder().decode(buffer);
    }
    fromHex(hex: string | TEth.Hex): Uint8Array {
        hex = utils.normalizeHex(hex);

        let bytes = new Uint8Array(Math.floor(hex.length / 2));
        let i = 0;
        for (; i < bytes.length; i++) {
            const a = HEX_DIGITS[hex[i * 2]];
            const b = HEX_DIGITS[hex[i * 2 + 1]];
            if (a == null || b == null) {
                break;
            }
            bytes[i] = (a << 4) | b;
        }
        return i === bytes.length
            ? bytes
            : bytes.slice(0, i);
    }
    toHex(buffer: Uint8Array): TEth.Hex {
        let hex = '';
        for (let i = 0; i < buffer.length; i++) {
            let b = buffer[i];
            hex += HEX_CHARS[b >> 4] + HEX_CHARS[b & 15];
        }
        return ('0x' + hex) as TEth.Hex;
    }
    concat(buffers: Uint8Array[]) {
        let size = buffers.reduce((a, x) => a + x.length, 0);
        let buffer = new Uint8Array(size);
        let offset = 0;
        for (let i = 0; i < buffers.length; i++) {
            let buf = buffers[i];
            buffer.set(buf, offset);
            offset += buf.length;
        }
        return buffer;
    }
}

namespace utils {
    export function normalizeHex(hex: string) {
        if (hex.startsWith('0x')) {
            hex = hex.substring(2);
        }
        if (hex.length % 2 !== 0) {
            throw new Error(`Not valid hex buffer. Char count not even: ${hex}`);
        }
        if (hex.length > 0 && /^[\da-f]+$/i.test(hex) === false) {
            throw new Error(`Not valid hex buffer. Invalid char in ${hex}`);
        }
        return hex;
    }
}


export const $buffer: IBufferUtils = is_NODE
    ? new NodeBufferUtils()
    : new WebBufferUtils()
    ;
