"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotsStorage = void 0;
const alot_1 = __importDefault(require("alot"));
const _require_1 = require("@dequanto/utils/$require");
const SlotValueHandler_1 = require("./storage/handlers/SlotValueHandler");
const SlotFixedArrayHandler_1 = require("./storage/handlers/SlotFixedArrayHandler");
const SlotDynamicArrayHandler_1 = require("./storage/handlers/SlotDynamicArrayHandler");
const SlotsStorageTransport_1 = require("./storage/SlotsStorageTransport");
const atma_utils_1 = require("atma-utils");
const SlotMappingHandler_1 = require("./storage/handlers/SlotMappingHandler");
const SlotStringHandler_1 = require("./storage/handlers/SlotStringHandler");
const Accessor_1 = require("./storage/Accessor");
const SlotStructHandler_1 = require("./storage/handlers/SlotStructHandler");
class SlotsStorage {
    constructor(transport, slots) {
        this.transport = transport;
        this.slots = slots;
    }
    static createWithClient(client, address, slots, params) {
        let reader = new SlotsStorageTransport_1.SlotsStorageTransport(client, address, params);
        return new SlotsStorage(reader, slots);
    }
    async get(path) {
        let keys = this.getKeys(path);
        if (keys.length === 0 && this.slots.length > 0) {
            return this.fetchAll();
        }
        let { handler } = await this.getStorageFor(keys);
        return handler.get(keys);
    }
    async set(path, value) {
        let keys = this.getKeys(path);
        if (keys.length === 0 && this.slots.length > 0) {
            await this.saveAll(value);
            return;
        }
        let { handler } = await this.getStorageFor(keys);
        await handler.set(keys, value);
    }
    // for(property: string) {
    //     let slot = this.slots.find(x => x.name === property);
    //     $require.notNull(slot, `StateVariable ${property} not found. Available: ${this.slots.map(x => x.name).join(', ')}`);
    //     const Ctor = this.getSlotStorage(slot);
    //     return new Ctor(this.transport, slot);
    // }
    async fetchAll() {
        let arr = await (0, alot_1.default)(this.slots)
            .mapAsync(async (slot, i) => {
            const Ctor = this.getSlotStorage(slot);
            const slotReader = new Ctor(this.transport, slot);
            const value = await slotReader.fetchAll();
            return {
                key: slot.name || null,
                value
            };
        })
            .toArrayAsync();
        if (arr.length === 0) {
            return null;
        }
        if (arr.length === 1 && arr[0].key == null) {
            return arr[0].value;
        }
        if (arr[0].key == null) {
            return arr.map(x => x.value);
        }
        let dict = (0, alot_1.default)(arr).toDictionary(x => x.key, x => x.value);
        return dict;
    }
    async saveAll(value) {
        if (value == null) {
            throw new Error(`Can't save the undefined value`);
        }
        if (this.slots.length === 0) {
            throw new Error(`Slots are empty to save ${value}`);
        }
        if ((0, atma_utils_1.is_Object)(value)) {
            // object
            await alot_1.default
                .fromObject(value)
                .mapAsync(async (entry) => {
                await this.set([{ key: entry.key, type: 'key' }], entry.value);
            })
                .toArrayAsync();
            return;
        }
        if (this.slots.length > 1) {
            throw new Error(`Value type (${value}) not possible to save to multiple slots: ${this.slots.map(x => x.name)}`);
        }
        const slot = this.slots[0];
        const Ctor = this.getSlotStorage(slot);
        const handler = new Ctor(this.transport, slot);
        await handler.set([], value);
    }
    getStorageFor(path) {
        let keys = this.getKeys(path);
        let slot;
        if (keys.length > 0) {
            let key = keys.shift();
            slot = this.slots.find(x => x.name === key.key);
            _require_1.$require.notNull(slot, `StateVariable ${key.key} not found. Available: ${this.slots.map(x => x.name).join(', ')}`);
        }
        else {
            if (this.slots.length !== 1) {
                throw new Error(`Key ${JSON.stringify(keys)} not specified for multiple slots: ${this.slots.map(x => x.name)}`);
            }
            slot = this.slots[0];
        }
        const Ctor = this.getSlotStorage(slot);
        const handler = new Ctor(this.transport, slot);
        return { keys, handler };
    }
    getSlotStorage(slot) {
        if (SlotFixedArrayHandler_1.SlotFixedArrayHandler.supports(slot)) {
            return SlotFixedArrayHandler_1.SlotFixedArrayHandler;
        }
        if (SlotStructHandler_1.SlotStructHandler.supports(slot)) {
            return SlotStructHandler_1.SlotStructHandler;
        }
        if (SlotDynamicArrayHandler_1.SlotDynamicArrayHandler.supports(slot)) {
            return SlotDynamicArrayHandler_1.SlotDynamicArrayHandler;
        }
        if (SlotMappingHandler_1.SlotMappingHandler.supports(slot)) {
            return SlotMappingHandler_1.SlotMappingHandler;
        }
        if (SlotStringHandler_1.SlotStringHandler.supports(slot)) {
            return SlotStringHandler_1.SlotStringHandler;
        }
        return SlotValueHandler_1.SlotValueHandler;
    }
    getKeys(path) {
        if (path == null) {
            return [];
        }
        if (typeof path === 'string') {
            return Accessor_1.Accessor.parse(path).keys;
        }
        function isValue(x) {
            switch (typeof x) {
                case 'number':
                case 'bigint':
                case 'string':
                    return true;
            }
            return false;
        }
        let isBreadcrumbs = path.every(isValue);
        if (isBreadcrumbs) {
            return path.map(key => ({ key, type: 'key' }));
        }
        return path;
    }
}
exports.SlotsStorage = SlotsStorage;
