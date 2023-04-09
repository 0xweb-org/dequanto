"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotDynamicArrayHandler = void 0;
const alot_1 = __importDefault(require("alot"));
const SlotsParser_1 = require("@dequanto/solidity/SlotsParser");
const _abiType_1 = require("@dequanto/utils/$abiType");
const SlotsStorage_1 = require("../../SlotsStorage");
const SlotsStorageTransport_1 = require("../SlotsStorageTransport");
const SlotDynamicArray_1 = require("../SlotDynamicArray");
class SlotDynamicArrayHandler extends SlotDynamicArray_1.ASlotDynamicArray {
    async get(keys) {
        if (keys == null || keys.length === 0) {
            return this.fetchAll();
        }
        let key = keys.shift();
        if (key.key === 'length') {
            return this.length();
        }
        let reader = await this.getStorageInner(key);
        return reader.get(keys);
    }
    async set(keys, value) {
        if (keys == null || keys.length === 0) {
            throw new Error(`saveAll not implemented`);
        }
        let key = keys.shift();
        let reader = await this.getStorageInner(key);
        reader.set(keys, value);
    }
    async fetchAll() {
        let arrLength = await this.length();
        return await alot_1.default.fromRange(0, arrLength).mapAsync(async (i) => {
            return this.get([{ key: i, type: 'index' }]);
        }).toArrayAsync();
    }
    async getStorageInner(key) {
        if (key.type !== 'index') {
            throw new Error(`Expected to get the Array index as a Key got ${key.key} as ${key.type}`);
        }
        let baseType = _abiType_1.$abiType.array.getBaseType(this.slot.type);
        let baseSlots = await SlotsParser_1.SlotsParser.slotsFromAbi(baseType);
        // take the last slot index as that one will give us the TOTAL SLOTs per element
        let slotsPerElement = baseSlots[baseSlots.length - 1].slot + 1;
        let transport = new SlotsStorageTransport_1.SlotsStorageTransportForArray(this.transport, this.slot.slot, key.key, slotsPerElement, this.slot);
        let storage = new SlotsStorage_1.SlotsStorage(transport, baseSlots);
        return storage;
    }
}
exports.SlotDynamicArrayHandler = SlotDynamicArrayHandler;
