"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shl_1 = require("./shl");
const sar_1 = require("./sar");
const sub_1 = require("./sub");
const _is_1 = require("@dequanto/utils/$is");
exports.default = (opcode, state) => {
    const left = state.stack.pop();
    const right = state.stack.pop();
    if (_is_1.$is.BigInt(left) && _is_1.$is.BigInt(right)) {
        state.stack.push((right << (32n - left)) >> (32n - left));
    }
    else if (_is_1.$is.BigInt(left)) {
        state.stack.push(new sar_1.SAR(new shl_1.SHL(right, 32n - left), 32n - left));
    }
    else {
        state.stack.push(new sar_1.SAR(new shl_1.SHL(right, new sub_1.SUB(32n, left)), new sub_1.SUB(32n, left)));
    }
};
