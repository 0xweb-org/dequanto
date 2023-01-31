"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$hex = void 0;
const _buffer_1 = require("./$buffer");
var $hex;
(function ($hex) {
    /**
     * Adds '00' bytes to the hex string.
     * @param hex
     * @param byteSize Min bytes count in the hex string
     */
    function padBytes(hex, byteSize, opts) {
        let length = byteSize * 2;
        hex = ensure(hex);
        if (hex.length === length + 2) {
            return hex;
        }
        hex = hex.substring(2)[opts?.padEnd ? 'padEnd' : 'padStart'](length, '0');
        return `0x${hex}`;
    }
    $hex.padBytes = padBytes;
    /**
     * Trims '00' bytes from start or end, e.g.  0x68656c6c6f000000 =>  0x68656c6c6f
     */
    function trimBytes(hex) {
        return hex.replace(/^0x(0{2})+/, '').replace(/(0{2})+$/, '');
    }
    $hex.trimBytes = trimBytes;
    function getNumber(hex, byteIndex, bytesCount = 1) {
        let start = hex.startsWith('0x') ? 2 : 0;
        let i = start + byteIndex * 2;
        return parseInt(hex.substring(i, i + 2 * bytesCount), 16);
    }
    $hex.getNumber = getNumber;
    function raw(hex) {
        return hex.startsWith('0x')
            ? hex.substring(2)
            : hex;
    }
    $hex.raw = raw;
    function toHex(value) {
        switch (typeof value) {
            case 'string': {
                if (value.startsWith('0x')) {
                    return value;
                }
                return _buffer_1.$buffer.toHex(_buffer_1.$buffer.fromString(value));
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
    $hex.toHex = toHex;
    function toHexBuffer(value) {
        value = toHex(value);
        if (value.length % 2 === 1) {
            value = '0x0' + value.substring(2);
        }
        return value;
    }
    $hex.toHexBuffer = toHexBuffer;
    /**
     * Adds `0x` to the start if not present
     */
    function ensure(mix) {
        if (mix.startsWith('0x')) {
            return mix;
        }
        return `0x${mix}`;
    }
    $hex.ensure = ensure;
})($hex = exports.$hex || (exports.$hex = {}));
