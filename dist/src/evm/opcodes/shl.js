"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHL = void 0;
const _is_1 = require("@dequanto/utils/$is");
const stringify_1 = __importDefault(require("../utils/stringify"));
class SHL {
    constructor(left, right) {
        this.name = 'SHL';
        this.wrapped = true;
        this.left = left;
        this.right = right;
    }
    toString() {
        return (0, stringify_1.default)(this.left) + ' << ' + (0, stringify_1.default)(this.right);
    }
}
exports.SHL = SHL;
exports.default = (opcode, state) => {
    const shift = state.stack.pop();
    const value = state.stack.pop();
    if (_is_1.$is.BigInt(shift) && _is_1.$is.BigInt(value)) {
        if (shift > 255n) {
            state.stack.push(0n);
            return;
        }
        let result = value << shift;
        let trimmed = BigInt('0x' + result.toString(16).slice(-64));
        state.stack.push(trimmed);
        return;
    }
    state.stack.push(new SHL(shift, value));
};
