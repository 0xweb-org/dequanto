"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MLOAD = void 0;
const _is_1 = require("@dequanto/utils/$is");
const stringify_1 = __importDefault(require("../utils/stringify"));
class MLOAD {
    constructor(location) {
        this.name = 'MLOAD';
        this.wrapped = true;
        this.location = location;
    }
    toString() {
        return 'memory[' + (0, stringify_1.default)(this.location) + ']';
    }
}
exports.MLOAD = MLOAD;
exports.default = (opcode, state) => {
    const memoryLocation = state.stack.pop();
    if (_is_1.$is.BigInt(memoryLocation) && Number(memoryLocation) in state.memory) {
        state.stack.push(state.memory[Number(memoryLocation)]);
    }
    else {
        state.stack.push(new MLOAD(memoryLocation));
    }
};
