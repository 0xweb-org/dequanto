"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RETURN = void 0;
const mload_1 = require("./mload");
const hex_1 = require("../utils/hex");
const stringify_1 = __importDefault(require("../utils/stringify"));
const _is_1 = require("@dequanto/utils/$is");
class RETURN {
    constructor(items, memoryStart, memoryLength) {
        this.name = 'RETURN';
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
        if (this.memoryStart && this.memoryLength) {
            return ('return memory[' +
                (0, stringify_1.default)(this.memoryStart) +
                ':(' +
                (0, stringify_1.default)(this.memoryStart) +
                '+' +
                (0, stringify_1.default)(this.memoryLength) +
                ')];');
        }
        else if (this.items.length === 0) {
            return 'return;';
        }
        else if (this.items.length === 1 &&
            (_is_1.$is.BigInt(this.items[0]) || this.items[0].static)) {
            return 'return ' + this.items[0] + ';';
        }
        else if (this.items.length === 3 &&
            this.items.every((item) => _is_1.$is.BigInt(item)) &&
            this.items[0].equals(32)) {
            return 'return "' + (0, hex_1.hex2a)(this.items[2].toString(16)) + '";';
        }
        else {
            return 'return(' + this.items.map((item) => (0, stringify_1.default)(item)).join(', ') + ');';
        }
    }
}
exports.RETURN = RETURN;
exports.default = (opcode, state) => {
    const memoryStart = state.stack.pop();
    const memoryLength = state.stack.pop();
    state.halted = true;
    if (_is_1.$is.BigInt(memoryStart) && _is_1.$is.BigInt(memoryLength)) {
        const items = [];
        for (let i = Number(memoryStart); i < Number(memoryStart) + Number(memoryLength); i += 32) {
            if (i in state.memory) {
                items.push(state.memory[i]);
            }
            else {
                items.push(new mload_1.MLOAD(i));
            }
        }
        state.instructions.push(new RETURN(items));
    }
    else {
        state.instructions.push(new RETURN([], memoryStart, memoryLength));
    }
};
