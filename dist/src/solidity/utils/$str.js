"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$str = void 0;
const _buffer_1 = require("@dequanto/utils/$buffer");
const _hex_1 = require("@dequanto/utils/$hex");
var $str;
(function ($str) {
    function sliceFromEnd(hex, positionBits, bits) {
        let len = bits / 8 * 2;
        let position = positionBits / 8 * 2;
        let start = hex.length - len - position;
        if (start < 0) {
            throw new Error(`Not enough space to slice the buffer (${len}B) from position ${position / 8}B`);
        }
        let sliced = hex.substring(start, start + len);
        return sliced;
    }
    $str.sliceFromEnd = sliceFromEnd;
    function writeFromEnd(hex, hexIn, positionBits, bits) {
        hexIn = hexIn.startsWith('0x')
            ? hexIn.substring(2)
            : hexIn;
        let len = bits / 8 * 2;
        let position = positionBits / 8 * 2;
        let start = hex.length - len - position;
        if (start < 0) {
            throw new Error(`Not enough space to write the buffer (${len}B) at position ${position / 8}B`);
        }
        let sliced = hex.substring(0, start) + hexIn + hex.substring(start + len);
        return sliced;
    }
    $str.writeFromEnd = writeFromEnd;
    function fromHex(hex) {
        let trimmed = _hex_1.$hex.trimBytes(hex);
        return _buffer_1.$buffer.fromHex(trimmed).toString();
    }
    $str.fromHex = fromHex;
})($str = exports.$str || (exports.$str = {}));
