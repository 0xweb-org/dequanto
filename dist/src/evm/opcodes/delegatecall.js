"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELEGATECALL = void 0;
const stringify_1 = __importDefault(require("../utils/stringify"));
class DELEGATECALL {
    constructor(gas, address, memoryStart, memoryLength, outputStart, outputLength) {
        this.name = 'DELEGATECALL';
        this.wrapped = true;
        this.gas = gas;
        this.address = address;
        this.memoryStart = memoryStart;
        this.memoryLength = memoryLength;
        this.outputStart = outputStart;
        this.outputLength = outputLength;
    }
    toString() {
        return ('delegatecall(' +
            (0, stringify_1.default)(this.gas) +
            ',' +
            (0, stringify_1.default)(this.address) +
            ',' +
            (0, stringify_1.default)(this.memoryStart) +
            ',' +
            (0, stringify_1.default)(this.memoryLength) +
            ',' +
            (0, stringify_1.default)(this.outputStart) +
            ',' +
            (0, stringify_1.default)(this.outputLength) +
            ')');
    }
}
exports.DELEGATECALL = DELEGATECALL;
exports.default = (opcode, state) => {
    const gas = state.stack.pop();
    const address = state.stack.pop();
    const memoryStart = state.stack.pop();
    const memoryLength = state.stack.pop();
    const outputStart = state.stack.pop();
    const outputLength = state.stack.pop();
    state.stack.push(new DELEGATECALL(gas, address, memoryStart, memoryLength, outputStart, outputLength));
};
