"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOT = void 0;
const _is_1 = require("@dequanto/utils/$is");
const stringify_1 = __importDefault(require("../utils/stringify"));
class NOT {
    constructor(item) {
        this.name = 'AND';
        this.wrapped = true;
        this.item = item;
    }
    toString() {
        return '~' + (0, stringify_1.default)(this.item);
    }
}
exports.NOT = NOT;
exports.default = (opcode, state) => {
    const item = state.stack.pop();
    if (_is_1.$is.BigInt(item)) {
        state.stack.push(!item);
    }
    else {
        state.stack.push(new NOT(item));
    }
};
