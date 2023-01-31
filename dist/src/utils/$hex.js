"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$hex = void 0;
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
        hex = hex.substring(2)[opts.padEnd ? 'padEnd' : 'padStart'](length, '0');
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
