"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (opcode, state) => {
    const pushDataLength = parseInt(opcode.name.replace('PUSH', ''), 10);
    state.stack.push(BigInt('0x' + opcode.pushData.toString('hex')));
};
