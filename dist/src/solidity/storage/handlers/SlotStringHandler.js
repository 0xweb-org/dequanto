"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotStringHandler = void 0;
const alot_1 = __importDefault(require("alot"));
const AbiDeserializer_1 = require("@dequanto/contracts/utils/AbiDeserializer");
const _abiParser_1 = require("@dequanto/utils/$abiParser");
const _buffer_1 = require("@dequanto/utils/$buffer");
const _require_1 = require("@dequanto/utils/$require");
const SlotsStorageTransport_1 = require("../SlotsStorageTransport");
const SlotsStorageHandler_1 = require("../SlotsStorageHandler");
const _contract_1 = require("@dequanto/utils/$contract");
const _abiUtils_1 = require("@dequanto/utils/$abiUtils");
const _bigint_1 = require("@dequanto/utils/$bigint");
const _hex_1 = require("@dequanto/utils/$hex");
class SlotStringHandler extends SlotsStorageHandler_1.ASlotsStorageHandler {
    static supports(slot) {
        return slot.type === 'string';
    }
    async get(keys) {
        this.requireNoKeys(keys);
        let { slot } = this;
        let location = slot.slot;
        let memory = [];
        let slotValue = await this.transport.getStorageAt(location, 0, 256);
        /**
         * Per slot 32 bytes
         * At original slot position, the last n-bytes is the SIZE of the STRING
         *
         * If a string < 31 bytes then it takes the first 31 bytes of the original slot
         * otherwise take the SIZE of the STRING calculate how much slots it occupies and read dynamic bytes array
         */
        let arraySizeMatch = /0x0{2,}(?<size>[^0][\da-f]+)$/i.exec(slotValue);
        if (arraySizeMatch != null) {
            let size = parseInt(arraySizeMatch.groups.size, 16) - 1;
            memory = await this.readMultiSlot(size);
        }
        else {
            slotValue = slotValue.replace(/[\da-f]{2}$/i, '');
            memory = [slotValue];
        }
        memory = memory.map(hex => _buffer_1.$buffer.fromHex(hex));
        let value = _buffer_1.$buffer.toHex(_buffer_1.$buffer.concat(memory));
        let abi = _abiParser_1.$abiParser.parseArguments(this.slot.type);
        let deserialized = AbiDeserializer_1.AbiDeserializer.process(value, abi);
        return deserialized;
    }
    async set(keys, value) {
        this.requireNoKeys(keys);
        let { slot } = this;
        let hex = _hex_1.$hex.toHexBuffer(value);
        let length = hex.length - 2;
        let bytesCount = length / 2;
        if (bytesCount > 31) {
            await this.writeMultiSlot(hex);
            return;
        }
        hex = _hex_1.$hex.padBytes(hex, 31, { padEnd: true }) + _hex_1.$hex.raw(_hex_1.$hex.toHexBuffer(length));
        this.transport.setStorageAt(slot.slot, 0, 256, hex);
    }
    async fetchAll() {
        return this.get();
    }
    async readMultiSlot(size) {
        let SLOT_SIZE = 64;
        let slotCount = Math.ceil(size / SLOT_SIZE);
        _require_1.$require.Number(slotCount, `Slots count is not a number for ${size}`);
        _require_1.$require.True(slotCount < 50, `The string is too big. Prevented to make ${slotCount} requests`);
        return await alot_1.default
            .fromRange(0, slotCount)
            .mapAsync(async (i) => {
            let reader = new SlotsStorageTransport_1.SlotsStorageTransportForArray(this.transport, this.slot.slot, i, 1);
            let slotValue = await reader.getStorageAt(0);
            return slotValue;
        })
            .toArrayAsync();
    }
    requireNoKeys(keys) {
        if (keys?.length > 0) {
            throw new Error(`ValueTypes cann't have the nested accessors: ${keys.map(x => x.key).join('.')}`);
        }
    }
    async writeMultiSlot(buffer) {
        let hex = _hex_1.$hex.raw(buffer);
        let SLOT_SIZE = 64;
        let slotCount = Math.ceil(hex.length / SLOT_SIZE);
        _require_1.$require.True(slotCount < 50, `The string is too big. Prevented to make ${slotCount} requests`);
        //> Write length
        this.transport.setStorageAt(this.slot.slot, 0, 256, hex.length);
        //> Write all slots
        return await alot_1.default
            .fromRange(0, slotCount)
            .mapAsync(async (i) => {
            let buf = '0x' + hex.substring(i * SLOT_SIZE, i * SLOT_SIZE + SLOT_SIZE);
            let slotValue = await this.transport.setStorageAt(this.getSlot(i), 0, 256, buf);
            return slotValue;
        })
            .toArrayAsync();
    }
    getSlot(idx) {
        let slotArrNr = this.slot.slot;
        let x = BigInt(_contract_1.$contract.keccak256(_abiUtils_1.$abiUtils.encodePacked(slotArrNr)));
        let uint = x + BigInt(idx);
        return _bigint_1.$bigint.toHex(uint);
    }
}
exports.SlotStringHandler = SlotStringHandler;
