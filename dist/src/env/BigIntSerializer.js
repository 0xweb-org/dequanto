"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigIntSerializer = void 0;
const _buffer_1 = require("@dequanto/utils/$buffer");
BigInt.prototype.toJSON = function () { return this.toString(); };
BigInt.prototype.toBuffer = function () {
    let hex = this.toString(16);
    if (hex.length % 2 !== 0) {
        hex = `0${hex}`;
    }
    return _buffer_1.$buffer.fromHex(hex);
};
BigInt.prototype.valueOf = function () {
    if (this > BigInt(Number.MAX_VALUE)) {
        throw new Error(`BigInt to Number overfows: ${this}`);
    }
    return Number(this);
};
function BigIntSerializer() { }
exports.BigIntSerializer = BigIntSerializer;
