"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CALLCODE = void 0;
const stringify_1 = __importDefault(require("../utils/stringify"));
class CALLCODE {
    constructor(gas, address, value, memoryStart, memoryLength, outputStart, outputLength) {
        this.name = 'CALLCODE';
        this.wrapped = true;
        this.gas = gas;
        this.address = address;
        this.value = value;
        this.memoryStart = memoryStart;
        this.memoryLength = memoryLength;
        this.outputStart = outputStart;
        this.outputLength = outputLength;
    }
    toString() {
        return ('callcode(' +
            (0, stringify_1.default)(this.gas) +
            ',' +
            (0, stringify_1.default)(this.address) +
            ',' +
            (0, stringify_1.default)(this.value) +
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
exports.CALLCODE = CALLCODE;
exports.default = (opcode, state) => {
    const gas = state.stack.pop();
    const address = state.stack.pop();
    const value = state.stack.pop();
    const memoryStart = state.stack.pop();
    const memoryLength = state.stack.pop();
    const outputStart = state.stack.pop();
    const outputLength = state.stack.pop();
    state.stack.push(new CALLCODE(gas, address, value, memoryStart, memoryLength, outputStart, outputLength));
};
