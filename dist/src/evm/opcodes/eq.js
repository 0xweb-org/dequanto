"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EQ = exports.SIG = void 0;
const _is_1 = require("@dequanto/utils/$is");
const stringify_1 = __importDefault(require("../utils/stringify"));
class SIG {
    constructor(hash) {
        this.name = 'SIG';
        this.wrapped = false;
        this.hash = hash;
    }
    toString() {
        return 'msg.sig == ' + this.hash;
    }
}
exports.SIG = SIG;
class EQ {
    constructor(left, right) {
        this.name = 'EQ';
        this.wrapped = true;
        this.left = left;
        this.right = right;
    }
    toString() {
        return (0, stringify_1.default)(this.left) + ' == ' + (0, stringify_1.default)(this.right);
    }
}
exports.EQ = EQ;
exports.default = (opcode, state) => {
    let left = state.stack.pop();
    let right = state.stack.pop();
    if (_is_1.$is.BigInt(left) && _is_1.$is.BigInt(right)) {
        state.stack.push(left === right ? 1n : 0n);
    }
    else {
        if (_is_1.$is.BigInt(left) &&
            right.name === 'DIV' &&
            _is_1.$is.BigInt(right.right)) {
            left = left * right.right;
            right = right.left;
        }
        if (_is_1.$is.BigInt(right) &&
            left.name === 'DIV' &&
            _is_1.$is.BigInt(left.right)) {
            right = right * left.right;
            left = left.left;
        }
        if (_is_1.$is.BigInt(left) &&
            /^[0]+$/.test(left.toString(16).substring(8)) &&
            right.name === 'CALLDATALOAD' &&
            right.location.equals(0)) {
            state.stack.push(new SIG('0'.repeat(64 - left.toString(16).length) +
                left.toString(16).substring(0, 8 - (64 - left.toString(16).length))));
        }
        else if (_is_1.$is.BigInt(right) &&
            /^[0]+$/.test(right.toString(16).substring(8)) &&
            left.name === 'CALLDATALOAD' &&
            left.location.equals(0)) {
            state.stack.push(new SIG('0'.repeat(64 - right.toString(16).length) +
                right.toString(16).substring(0, 8 - (64 - right.toString(16).length))));
        }
        else {
            state.stack.push(new EQ(left, right));
        }
    }
};
