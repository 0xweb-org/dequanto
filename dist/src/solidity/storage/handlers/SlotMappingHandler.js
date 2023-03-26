"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotMappingHandler = void 0;
const _abiType_1 = require("@dequanto/utils/$abiType");
const SlotsParser_1 = require("../../SlotsParser");
const SlotsStorage_1 = require("../../SlotsStorage");
const _types_1 = require("../../utils/$types");
const SlotsStorageTransport_1 = require("../SlotsStorageTransport");
const SlotsStorageHandler_1 = require("../SlotsStorageHandler");
const alot_1 = __importDefault(require("alot"));
const atma_io_1 = require("atma-io");
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
        let mapping = await this.transport.extractMappingKeys({
            slot: this.slot
        });
        let entries = await (0, alot_1.default)(mapping.keys)
            .mapAsync(async (key) => {
            let accessor = key.map(x => ({ type: 'key', key: x }));
            let value = await this.get(accessor);
            return { key, value };
        })
            // Load all keys at once. The underlying layer can handle the batching
            .toArrayAsync({ threads: mapping.keys.length });
        await atma_io_1.File.writeAsync(`./del/keys${this.slot.name}.json`, entries);
        return (0, alot_1.default)(entries).toDictionary(x => x.key, x => x.value);
    }
    async getStorageInner(accessor) {
        let { slot } = this;
        let mapValueType = _abiType_1.$abiType.mapping.getValueType(slot.type);
        let mapKeyType = _abiType_1.$abiType.mapping.getKeyType(slot.type);
        let mapValueSlots = await SlotsParser_1.SlotsParser.slotsFromAbi(mapValueType);
        let key = accessor.key;
        if (typeof key === 'string' && mapKeyType.includes('int') && isNaN(Number(key)) === false) {
            // just to fix the errors when we used string literals as the key, for example
            // mapping(uint => address) foo;
            // foo['5'] = 5
            key = Number(key);
        }
        let transport = new SlotsStorageTransport_1.SlotsStorageTransportForMapping(this.transport, this.slot.slot, key, mapValueSlots.length);
        let storage = new SlotsStorage_1.SlotsStorage(transport, mapValueSlots);
        return storage;
    }
}
exports.SlotMappingHandler = SlotMappingHandler;
