"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _is_1 = require("@dequanto/utils/$is");
const add_1 = require("./add");
const mod_1 = require("./mod");
exports.default = (opcode, state) => {
    const left = state.stack.pop();
    const right = state.stack.pop();
    const mod = state.stack.pop();
    if (_is_1.$is.BigInt(left) && _is_1.$is.BigInt(right) && _is_1.$is.BigInt(mod)) {
        state.stack.push((left + right) % mod);
    }
    else if (_is_1.$is.BigInt(left) && _is_1.$is.BigInt(right)) {
        state.stack.push(new mod_1.MOD(left + right, mod));
    }
    else {
        state.stack.push(new mod_1.MOD(new add_1.ADD(left, right), mod));
    }
};
