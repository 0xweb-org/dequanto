"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotsStorageTransportForMapping = exports.SlotsStorageTransportForArray = exports.SlotsStorageTransport = exports.SlotsCursorTransport = void 0;
const _str_1 = require("@dequanto/solidity/utils/$str");
const _abiUtils_1 = require("@dequanto/utils/$abiUtils");
const _bigint_1 = require("@dequanto/utils/$bigint");
const _contract_1 = require("@dequanto/utils/$contract");
const _hex_1 = require("@dequanto/utils/$hex");
const _require_1 = require("@dequanto/utils/$require");
class SlotsCursorTransport {
    constructor(cursor, transport) {
        this.cursor = cursor;
        this.transport = transport;
    }
    getStorageAt(slot, position, size) {
        let offsetSlot = BigInt(this.cursor.slot);
        let offsetPosition = position + (this.cursor.position ?? 0);
        size ?? (size = this.cursor.size);
        return this.transport.getStorageAt(BigInt(slot) + offsetSlot, offsetPosition, size);
    }
    setStorageAt(slot, position, size, buffer) {
        let offsetSlot = BigInt(this.cursor.slot);
        let offsetPosition = position + (this.cursor.position ?? 0);
        return this.transport.setStorageAt(BigInt(slot) + offsetSlot, offsetPosition, size, buffer);
    }
}
exports.SlotsCursorTransport = SlotsCursorTransport;
class SlotsStorageTransport {
    constructor(client, address, params) {
        this.client = client;
        this.address = address;
        this.params = params;
    }
    async getStorageAt(slot, position, size) {
        slot = _hex_1.$hex.toHex(slot);
        let mem = await this.client.getStorageAt(this.address, slot, this.params?.blockNumber);
        if (size != null && size < 256) {
            mem = '0x' + _str_1.$str.sliceFromEnd(mem, position, size);
        }
        return mem;
    }
    async setStorageAt(slot, position, size, buffer) {
        _require_1.$require.notNull(slot, `Slot position is undefined`);
        _require_1.$require.notNull(buffer, `Slot value is undefined`);
        slot = _hex_1.$hex.toHex(slot);
        buffer = _hex_1.$hex.toHexBuffer(buffer);
        let SLOT_SIZE = 256;
        if (size != null && size < SLOT_SIZE) {
            let current = await this.client.getStorageAt(this.address, slot);
            let bytesLen = size / 8;
            buffer = _hex_1.$hex.padBytes(buffer, bytesLen);
            buffer = _str_1.$str.writeFromEnd(current, buffer, position, size);
            buffer = _hex_1.$hex.ensure(buffer);
        }
        buffer = _hex_1.$hex.padBytes(buffer, 32);
        await this.client.debug.setStorageAt(this.address, slot, buffer);
    }
}
exports.SlotsStorageTransport = SlotsStorageTransport;
class SlotsStorageTransportForArray {
    constructor(storage, slotNr, elementI = 0, slotsPerElement = 1) {
        this.storage = storage;
        this.slotNr = slotNr;
        this.elementI = elementI;
        this.slotsPerElement = slotsPerElement;
    }
    async getStorageAt(slot, position = 0, size = 256) {
        if (typeof slot !== 'number') {
            throw new Error(`Array Slot reader supports only numbers for position`);
        }
        let location = this.mapToGlobalSlot(slot);
        let memory = await this.storage.getStorageAt(location, position, size);
        return memory;
    }
    async setStorageAt(slot, position, size, buffer) {
        let location = this.mapToGlobalSlot(Number(slot));
        let memory = await this.storage.setStorageAt(location, position, size, buffer);
        return memory;
    }
    mapToGlobalSlot(slot) {
        let slotPositionNr = this.elementI * this.slotsPerElement + slot;
        let x = BigInt(_contract_1.$contract.keccak256(_abiUtils_1.$abiUtils.encodePacked({ value: _hex_1.$hex.toHex(this.slotNr), type: 'uint256' })));
        let uint = x + BigInt(slotPositionNr);
        return _bigint_1.$bigint.toHex(uint);
    }
}
exports.SlotsStorageTransportForArray = SlotsStorageTransportForArray;
class SlotsStorageTransportForMapping {
    constructor(storage, slotNr, key, slotsPerElement = 1) {
        this.storage = storage;
        this.slotNr = slotNr;
        this.key = key;
        this.slotsPerElement = slotsPerElement;
    }
    async getStorageAt(slot) {
        if (typeof slot !== 'number') {
            throw new Error(`Mapping Slot reader supports only numbers for position`);
        }
        let location = this.mapToGlobalSlot(BigInt(slot));
        let memory = await this.storage.getStorageAt(location, 0, 256);
        return memory;
    }
    async setStorageAt(slot, position, size, buffer) {
        let location = this.mapToGlobalSlot(BigInt(slot));
        let memory = await this.storage.setStorageAt(location, position, size, buffer);
        return memory;
    }
    mapToGlobalSlot(slotPositionNr = 0n) {
        let key = this.key;
        let slotMappingNr = this.slotNr;
        if (typeof key === 'string' && /^\d+$/.test(key)) {
            key = Number(key);
        }
        let packed = _abiUtils_1.$abiUtils.encodePacked({
            value: _hex_1.$hex.padBytes(_hex_1.$hex.toHexBuffer(key), 32),
            type: 'bytes32'
        }, {
            value: slotMappingNr,
            type: 'uint256'
        });
        let x = BigInt(_contract_1.$contract.keccak256(packed));
        let uint = x + BigInt(slotPositionNr);
        return _bigint_1.$bigint.toHex(uint);
    }
}
exports.SlotsStorageTransportForMapping = SlotsStorageTransportForMapping;
