"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotFixedArrayHandler = void 0;
const alot_1 = __importDefault(require("alot"));
const _abiType_1 = require("@dequanto/utils/$abiType");
const SlotFixedArray_1 = require("../SlotFixedArray");
const SlotsStorage_1 = require("@dequanto/solidity/SlotsStorage");
const SlotsParser_1 = require("@dequanto/solidity/SlotsParser");
const SlotsStorageTransport_1 = require("../SlotsStorageTransport");
class SlotFixedArrayHandler extends SlotFixedArray_1.ASlotFixedArray {
    async get(keys) {
        if (keys == null || keys.length === 0) {
            return this.fetchAll();
        }
        let storage = await this.getStorageInner(keys);
        return storage.get(keys);
    }
    async set(keys, value) {
        if (keys == null || keys.length === 0) {
            throw new Error(`saveAll not implemented`);
        }
        let storage = await this.getStorageInner(keys);
        return storage.set(keys, value);
    }
    async fetchAll() {
        let slot = this.slot;
        let arrLength = _abiType_1.$abiType.array.getLength(slot.type);
        return await alot_1.default.fromRange(0, arrLength).mapAsync(async (i) => {
            return this.get([
                { key: i, type: 'index' }
            ]);
        }).toArrayAsync();
    }
    async getStorageInner(keys) {
        let key = keys.shift();
        if (key.type !== 'index') {
            throw new Error(`Expected to get the Array index as a Key got ${key.key} as ${key.type}`);
        }
        let cursor = await this.getCursorFor(key.key);
        let baseType = _abiType_1.$abiType.array.getBaseType(this.slot.type);
        let baseSlots = await SlotsParser_1.SlotsParser.slotsFromAbi(baseType);
        let transport = new SlotsStorageTransport_1.SlotsCursorTransport(cursor, this.transport);
        let storage = new SlotsStorage_1.SlotsStorage(transport, baseSlots);
        return storage;
    }
}
exports.SlotFixedArrayHandler = SlotFixedArrayHandler;
