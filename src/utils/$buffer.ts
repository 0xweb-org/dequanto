import { is_NODE } from 'atma-utils/is';
import { type Bytes } from 'ethers';

interface IBufferUtils {
    fromHex (hex: string): Bytes
    toHex (buffer: Bytes): string

    fromString (string: string, encoding?: BufferEncoding): Bytes
    toString (buffer: Bytes, encoding?: BufferEncoding): string

    concat (buffers: Bytes[]): Bytes
}




class NodeBufferUtils implements IBufferUtils {
    fromString(str: string, encoding?: BufferEncoding): Bytes {
        return Buffer.from(str, encoding ?? 'utf8');
    }
    toString(buffer: Buffer, encoding?: BufferEncoding): string {
        return buffer.toString(encoding);
    }
    fromHex(hex: string): Bytes {
        return Buffer.from(utils.normalizeHex(hex), 'hex');
    }
    toHex(buffer: Buffer): string {
        return '0x' + (buffer as Buffer).toString('hex');
    }

    concat (buffers: Buffer[]) {
        return Buffer.concat(buffers);
    }
}

const HEX_CHARS = "0123456789abcdef";
const HEX_DIGITS = {
    0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15
  };

class WebBufferUtils implements IBufferUtils {
    fromString(string: string, encoding?: string): Bytes {
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
    fromHex(hex: string): Uint8Array {
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
    toHex(buffer: Uint8Array): string {
        let hex = '';
        for (let i = 0; i < buffer.length; i++) {
            let b = buffer[i];
            hex += HEX_CHARS[b >> 4] + HEX_CHARS[b & 15];
        }
        return '0x' + hex;
    }

    concat (buffers: Uint8Array[]) {
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
    export function normalizeHex (hex: string) {
        if (hex.startsWith('0x')) {
            hex = hex.substring(2);
        }
        if (hex.length % 2 !== 0) {
            throw new Error(`Not valid hex buffer. Char count not even: ${hex}`);
        }
        if (/^[\dabcdef]$/i.test(hex) === false) {
            throw new Error(`Not valid hex buffer. Invalid char in ${hex}`);
        }
        return hex;
    }
}


export const $buffer: IBufferUtils = is_NODE
    ? new NodeBufferUtils()
    : new WebBufferUtils()
    ;
