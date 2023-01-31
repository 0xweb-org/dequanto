"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractStorageReaderBase = void 0;
const SlotsStorage_1 = require("@dequanto/solidity/SlotsStorage");
class ContractStorageReaderBase {
    constructor(address, client, explorer) {
        this.address = address;
        this.client = client;
        this.explorer = explorer;
    }
    $createHandler(slots) {
        this.$storage = SlotsStorage_1.SlotsStorage.createWithClient(this.client, this.address, slots);
    }
}
exports.ContractStorageReaderBase = ContractStorageReaderBase;
