"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (opcode, state) => {
    state.stack.push(BigInt(opcode.pc));
};