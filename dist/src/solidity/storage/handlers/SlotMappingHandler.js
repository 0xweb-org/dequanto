"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotMappingHandler = void 0;
const _abiType_1 = require("@dequanto/utils/$abiType");
const SlotsParser_1 = require("../../SlotsParser");
const SlotsStorage_1 = require("../../SlotsStorage");
const _types_1 = require("../../utils/$types");
const SlotsStorageTransport_1 = require("../SlotsStorageTransport");
const SlotsStorageHandler_1 = require("../SlotsStorageHandler");
class SlotMappingHandler extends SlotsStorageHandler_1.ASlotsStorageHandler {
    static supports(slot) {
        return _types_1.$types.isMapping(slot.type);
    }
    async get(keys) {
        if (keys == null || keys.length === 0) {
            return this.fetchAll();
        }
        let key = keys.shift();
        let reader = await this.getStorageInner(key);
        return reader.get(keys);
    }
    async set(keys, value) {
        if (keys == null || keys.length === 0) {
            throw new Error(`saveAll not implemented`);
        }
        let key = keys.shift();
        let storage = await this.getStorageInner(key);
        storage.set(keys, value);
    }
    async fetchAll() {
        throw new Error(`SlotMappingReader doesn't support fetchAll method, as size could be infinite`);
    }
    async getStorageInner(key) {
        let { slot } = this;
        let mapValueType = _abiType_1.$abiType.mapping.getValueType(slot.type);
        let mapValueSlots = await SlotsParser_1.SlotsParser.slotsFromAbi(mapValueType);
        let transport = new SlotsStorageTransport_1.SlotsStorageTransportForMapping(this.transport, this.slot.slot, key.key, mapValueSlots.length);
        let storage = new SlotsStorage_1.SlotsStorage(transport, mapValueSlots);
        return storage;
    }
}
exports.SlotMappingHandler = SlotMappingHandler;
