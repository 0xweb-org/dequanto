"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASlotFixedArray = void 0;
const _abiType_1 = require("@dequanto/utils/$abiType");
const _require_1 = require("@dequanto/utils/$require");
const _types_1 = require("../utils/$types");
const SlotsStorageHandler_1 = require("./SlotsStorageHandler");
class ASlotFixedArray extends SlotsStorageHandler_1.ASlotsStorageHandler {
    static supports(slot) {
        return _types_1.$types.isFixedArray(slot.type);
    }
    /** @TODO doesnt support complex arrays  */
    async getCursorFor(idx) {
        let { slot } = this;
        let arrLength = _abiType_1.$abiType.array.getLength(slot.type);
        _require_1.$require.True(idx < arrLength, `${idx} is out of bounds for the array[${arrLength}]`);
        let itemSize = slot.size / arrLength;
        let offset = slot.position + itemSize * idx;
        let offsetSlots = Math.floor(offset / 256);
        let cursor = {
            slot: BigInt(slot.slot) + BigInt(offsetSlots),
            position: offset % 256,
            size: itemSize,
        };
        return cursor;
    }
}
exports.ASlotFixedArray = ASlotFixedArray;
