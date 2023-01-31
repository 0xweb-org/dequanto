"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHA3 = void 0;
const mload_1 = require("./mload");
const stringify_1 = __importDefault(require("../utils/stringify"));
const _is_1 = require("@dequanto/utils/$is");
class SHA3 {
    constructor(items, memoryStart, memoryLength) {
        this.name = 'SHA3';
        this.wrapped = false;
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
            return 'keccak256(' + this.items.map((item) => (0, stringify_1.default)(item)).join(', ') + ')';
        }
        else {
            return ('keccak256(memory[' +
                (0, stringify_1.default)(this.memoryStart) +
                ':(' +
                (0, stringify_1.default)(this.memoryStart) +
                '+' +
                (0, stringify_1.default)(this.memoryLength) +
                ')])');
        }
    }
}
exports.SHA3 = SHA3;
exports.default = (opcode, state) => {
    const memoryStart = state.stack.pop();
    const memoryLength = state.stack.pop();
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
        state.stack.push(new SHA3(items));
    }
    else {
        state.stack.push(new SHA3([], memoryStart, memoryLength));
    }
};
