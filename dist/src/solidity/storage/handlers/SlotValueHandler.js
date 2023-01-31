"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotValueHandler = void 0;
const AbiDeserializer_1 = require("@dequanto/contracts/utils/AbiDeserializer");
const _abiParser_1 = require("@dequanto/utils/$abiParser");
const SlotsStorageHandler_1 = require("../SlotsStorageHandler");
class SlotValueHandler extends SlotsStorageHandler_1.ASlotsStorageHandler {
    async get(keys) {
        this.requireNoKeys(keys);
        let { slot } = this;
        let value = await this.transport.getStorageAt(slot.slot, slot.position, slot.size);
        let abi = _abiParser_1.$abiParser.parseArguments(this.slot.type);
        let deserialized = AbiDeserializer_1.AbiDeserializer.process(value, abi);
        return deserialized;
    }
    async set(keys, value) {
        this.requireNoKeys(keys);
        let { slot } = this;
        await this.transport.setStorageAt(slot.slot, slot.position, slot.size, value);
    }
    async fetchAll() {
        return this.get();
    }
    requireNoKeys(keys) {
        if (keys?.length > 0) {
            throw new Error(`ValueTypes cann't have the nested accessors: ${keys.map(x => x.key).join('.')}`);
        }
    }
}
exports.SlotValueHandler = SlotValueHandler;
