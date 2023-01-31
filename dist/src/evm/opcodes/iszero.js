"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISZERO = void 0;
const lt_1 = require("./lt");
const gt_1 = require("./gt");
const stringify_1 = __importDefault(require("../utils/stringify"));
const _is_1 = require("@dequanto/utils/$is");
class ISZERO {
    constructor(item) {
        this.name = 'ISZERO';
        this.wrapped = true;
        this.item = item;
    }
    toString() {
        return (0, stringify_1.default)(this.item) + ' == 0';
    }
}
exports.ISZERO = ISZERO;
exports.default = (opcode, state) => {
    const item = state.stack.pop();
    if (_is_1.$is.BigInt(item)) {
        state.stack.push(item === 0n ? 1n : 0n);
    }
    else if (item.name === 'LT') {
        if (item.equal) {
            state.stack.push(new gt_1.GT(item.left, item.right));
        }
        else {
            state.stack.push(new gt_1.GT(item.left, item.right, true));
        }
    }
    else if (item.name === 'GT') {
        if (item.equal) {
            state.stack.push(new lt_1.LT(item.left, item.right));
        }
        else {
            state.stack.push(new lt_1.LT(item.left, item.right, true));
        }
    }
    else if (item instanceof ISZERO) {
        state.stack.push(item.item);
    }
    else {
        state.stack.push(new ISZERO(item));
    }
    /* == -> != */
    /* != -> == */
};
