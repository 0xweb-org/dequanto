"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractStream = void 0;
const EthWeb3Client_1 = require("@dequanto/clients/EthWeb3Client");
const a_di_1 = __importDefault(require("a-di"));
class ContractStream {
    constructor(address, abi, client = a_di_1.default.resolve(EthWeb3Client_1.EthWeb3Client)) {
        this.address = address;
        this.abi = abi;
        this.client = client;
    }
    on(event, cb) {
        let stream = this.client.getEventStream(this.address, this.abi, event);
        return stream.onData(cb);
    }
}
exports.ContractStream = ContractStream;
