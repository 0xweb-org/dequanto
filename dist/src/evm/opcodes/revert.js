"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REVERT = void 0;
const mload_1 = require("./mload");
const stringify_1 = __importDefault(require("../utils/stringify"));
const _is_1 = require("@dequanto/utils/$is");
class REVERT {
    constructor(items, memoryStart, memoryLength) {
        this.name = 'REVERT';
        this.wrapped = true;
        if (memoryStart && memoryLength) {
            this.memoryStart = memoryStart;
            this.memoryLength = memoryLength;
        }
        else {
            this.items = items;
        }
    }
    toString() {
        if (this.items) {
            return 'revert(' + this.items.map((item) => (0, stringify_1.default)(item)).join(', ') + ');';
        }
        else {
            return ('revert(memory[' +
                (0, stringify_1.default)(this.memoryStart) +
                ':(' +
                (0, stringify_1.default)(this.memoryStart) +
                '+' +
                (0, stringify_1.default)(this.memoryLength) +
                ')]);');
        }
    }
}
exports.REVERT = REVERT;
exports.default = (opcode, state) => {
    const memoryStart = state.stack.pop();
    const memoryLength = state.stack.pop();
    state.halted = true;
    if (_is_1.$is.BigInt(memoryStart) && _is_1.$is.BigInt(memoryLength)) {
        const items = [];
        for (let i = Number(memoryStart); i < Number(memoryStart + memoryLength); i += 32) {
            if (i in state.memory) {
                items.push(state.memory[i]);
            }
            else {
                items.push(new mload_1.MLOAD(i));
            }
        }
        state.instructions.push(new REVERT(items));
    }
    else {
        state.instructions.push(new REVERT([], memoryStart, memoryLength));
    }
};
