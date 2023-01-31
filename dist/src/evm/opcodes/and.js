"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AND = void 0;
const _is_1 = require("@dequanto/utils/$is");
const stringify_1 = __importDefault(require("../utils/stringify"));
class AND {
    constructor(left, right) {
        this.name = 'AND';
        this.wrapped = true;
        this.left = left;
        this.right = right;
    }
    toString() {
        return (0, stringify_1.default)(this.left) + ' && ' + (0, stringify_1.default)(this.right);
    }
}
exports.AND = AND;
exports.default = (opcode, state) => {
    const left = state.stack.pop();
    const right = state.stack.pop();
    if (_is_1.$is.BigInt(left) && _is_1.$is.BigInt(right)) {
        state.stack.push(left & right);
    }
    else if (_is_1.$is.BigInt(left) && /^[f]+$/.test(left.toString(16))) {
        right.size = left.toString(16).length;
        state.stack.push(right);
    }
    else if (_is_1.$is.BigInt(right) && /^[f]+$/.test(right.toString(16))) {
        left.size = right.toString(16).length;
        state.stack.push(left);
        /*} else if (
        $is.BigInt(left) &&
        left.equals('1461501637330902918203684832716283019655932542975')
    ) {*/
        /* 2 ** 160 */
        /*    state.stack.push(right);
    } else if (
        $is.BigInt(right) &&
        right.equals('1461501637330902918203684832716283019655932542975')
    ) {*/
        /* 2 ** 160 */
        /*    state.stack.push(left);*/
    }
    else if (_is_1.$is.BigInt(left) &&
        right instanceof AND &&
        _is_1.$is.BigInt(right.left) &&
        left === right.left) {
        state.stack.push(right.right);
    }
    else {
        state.stack.push(new AND(left, right));
    }
};
