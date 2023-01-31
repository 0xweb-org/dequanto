"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LT = void 0;
const _is_1 = require("@dequanto/utils/$is");
const stringify_1 = __importDefault(require("../utils/stringify"));
class LT {
    constructor(left, right, equal = false) {
        this.name = 'LT';
        this.wrapped = true;
        this.left = left;
        this.right = right;
        this.equal = equal;
    }
    toString() {
        if (this.equal) {
            return (0, stringify_1.default)(this.left) + ' <= ' + (0, stringify_1.default)(this.right);
        }
        else {
            return (0, stringify_1.default)(this.left) + ' < ' + (0, stringify_1.default)(this.right);
        }
    }
}
exports.LT = LT;
exports.default = (opcode, state) => {
    const left = state.stack.pop();
    const right = state.stack.pop();
    if (_is_1.$is.BigInt(left) && _is_1.$is.BigInt(right)) {
        state.stack.push(left < right ? 1n : 0n);
    }
    else {
        state.stack.push(new LT(left, right));
    }
};
