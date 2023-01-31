"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotStructHandler = void 0;
const alot_1 = __importDefault(require("alot"));
const SlotsStorage_1 = require("@dequanto/solidity/SlotsStorage");
const SlotsParser_1 = require("@dequanto/solidity/SlotsParser");
const SlotsStorageTransport_1 = require("../SlotsStorageTransport");
const SlotsStorageHandler_1 = require("../SlotsStorageHandler");
const _types_1 = require("@dequanto/solidity/utils/$types");
class SlotStructHandler extends SlotsStorageHandler_1.ASlotsStorageHandler {
    static supports(slot) {
        return _types_1.$types.isStruct(slot.type);
    }
    async get(keys) {
        if (keys == null || keys.length == 0) {
            return this.fetchAll();
        }
        let storage = await this.getInnerStorage();
        return storage.get(keys);
    }
    async set(keys, value) {
        let storage = await this.getInnerStorage();
        await storage.set(keys, value);
    }
    async fetchAll() {
        let baseSlots = await SlotsParser_1.SlotsParser.slotsFromAbi(this.slot.type);
        let storage = await this.getInnerStorage();
        return await (0, alot_1.default)(baseSlots).mapAsync(async (slot) => {
            return {
                value: await storage.get(slot.name),
                key: slot.name
            };
        }).toDictionaryAsync(x => x.key, x => x.value);
    }
    async getInnerStorage() {
        let transport = new SlotsStorageTransport_1.SlotsCursorTransport(this.slot, this.transport);
        let baseSlots = await SlotsParser_1.SlotsParser.slotsFromAbi(this.slot.type);
        let storage = new SlotsStorage_1.SlotsStorage(transport, baseSlots);
        return storage;
    }
}
exports.SlotStructHandler = SlotStructHandler;
