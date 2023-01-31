import { $buffer } from './$buffer';
export namespace $hex {

    /**
     * Adds '00' bytes to the hex string.
     * @param hex
     * @param byteSize Min bytes count in the hex string
     */
    export function padBytes(hex: string, byteSize: number, opts?: {padEnd?: boolean}) {
        let length = byteSize * 2;
        hex = ensure(hex);
        if (hex.length === length + 2) {
            return hex;
        }
        hex = hex.substring(2)[ opts?.padEnd ? 'padEnd' : 'padStart' ](length, '0');
        return `0x${hex}`;
    }

    /**
     * Trims '00' bytes from start or end, e.g.  0x68656c6c6f000000 =>  0x68656c6c6f
     */
    export function trimBytes(hex: string) {
        return hex.replace(/^0x(0{2})+/, '').replace(/(0{2})+$/, '');
    }

    export function getNumber (hex: string, byteIndex: number, bytesCount: number = 1): number {
        let start = hex.startsWith('0x') ? 2 : 0;
        let i = start + byteIndex * 2;
        return parseInt(hex.substring(i, i + 2 * bytesCount), 16);
    }

    export function raw (hex: string) {
        return hex.startsWith('0x')
            ? hex.substring(2)
            : hex;
    }

    export function toHex (value: string | boolean | number | bigint): string {
        switch (typeof value) {
            case 'string': {
                if (value.startsWith('0x')) {
                    return value;
                }
                return $buffer.toHex($buffer.fromString(value));
            }
            case 'number':
            case 'bigint':
                let hex = value.toString(16);
                return '0x' + hex;
            case 'boolean':
                return value ? '0x1' : '0x0';
        }
        throw new Error(`Invalid value to convert to hex: ${value}`);
    }
    export function toHexBuffer (value: string | boolean | number | bigint): string {
        value = toHex(value);
        if (value.length % 2 === 1) {
            value = '0x0' + value.substring(2);
        }
        return value;
    }

    /**
     * Adds `0x` to the start if not present
     */
    export function ensure (mix: string) {
        if (mix.startsWith('0x')) {
            return mix;
        }
        return `0x${mix}`;
    }
}
