"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASlotDynamicArray = void 0;
const _types_1 = require("../utils/$types");
const SlotsStorageHandler_1 = require("./SlotsStorageHandler");
class ASlotDynamicArray extends SlotsStorageHandler_1.ASlotsStorageHandler {
    static supports(slot) {
        return _types_1.$types.isDynamicArray(slot.type);
    }
    async length() {
        let { slot } = this;
        let arrLengthHex = await this.transport.getStorageAt(slot.slot, 0, 256);
        let arrLength = Number(arrLengthHex);
        return arrLength;
    }
}
exports.ASlotDynamicArray = ASlotDynamicArray;
