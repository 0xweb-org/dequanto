"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE2 = void 0;
const stringify_1 = __importDefault(require("../utils/stringify"));
class CREATE2 {
    constructor(memoryStart, memoryLength, value) {
        this.name = 'CREATE2';
        this.wrapped = true;
        this.memoryStart = memoryStart;
        this.memoryLength = memoryLength;
        this.value = value;
    }
    toString() {
        return ('(new Contract(memory[' +
            (0, stringify_1.default)(this.memoryStart) +
            ':(' +
            (0, stringify_1.default)(this.memoryStart) +
            '+' +
            (0, stringify_1.default)(this.memoryLength) +
            ')]).value(' +
            (0, stringify_1.default)(this.value) +
            ')).address');
    }
}
exports.CREATE2 = CREATE2;
exports.default = (opcode, state) => {
    const value = state.stack.pop();
    const memoryStart = state.stack.pop();
    const memoryLength = state.stack.pop();
    state.stack.push(new CREATE2(memoryStart, memoryLength, value));
};
