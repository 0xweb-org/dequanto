import { TEth } from '@dequanto/models/TEth';
import { $hex } from './$hex';
import { $buffer } from './$buffer';

export namespace $base {
    // https://github.com/multiformats/js-multiformats/blob/139b3c2fa0d1afcba9f0aafde929fcf69f4d7804/vendor/base-x.js

    class Base {
        private BASE: number;
        private MAP: number[];
        constructor (public alphabet: string) {
            this.BASE = alphabet.length;
            this.MAP = new Array(256).fill(255);
            alphabet.split('').forEach((c, i) => {
                this.MAP[ c.charCodeAt(0) ] = i;
            });
        }

        public encode (hex: TEth.Hex): string {
            hex = $hex.toHexBuffer(hex);
            hex = $hex.trimBytes(hex);
            let buffer = $buffer.fromHex(hex);

            let result = [];
            let BASE = this.BASE;
            for (let byte of buffer) {
                let carry = byte;
                for (let j = 0; j < result.length; j++) {
                    carry += result[j] << 8;
                    result[j] = carry % BASE;
                    carry = (carry / BASE) | 0;
                }

                while (carry > 0) {
                    result.push(carry % BASE);
                    carry = (carry / BASE) | 0;
                }
            }
            result.reverse();
            return result.map(i => this.alphabet[i]).join('');
        }
        public decode (baseX: string): TEth.Hex {

            let b256 = [];
            let BASE = this.BASE;
            let MAP = this.MAP;
            for (let c of baseX) {
                let carry = MAP[ c.charCodeAt(0) ];

                for (let j = 0; j < b256.length; j++) {
                    carry += (BASE * b256[j]) >>> 0;
                    b256[j] = (carry % 256) >>> 0;
                    carry = (carry / 256) >>> 0;
                }
                while (carry > 0) {
                    b256.push(carry % 256);
                    carry = (carry / 256) | 0;
                }
            }
            b256.reverse();
            let buffer = Uint8Array.from(b256);
            return $buffer.toHex(buffer);
        }
    }

    export const $58 = new Base(`123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`)
}
