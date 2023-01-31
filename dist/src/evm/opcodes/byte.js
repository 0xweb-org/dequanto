"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BYTE = void 0;
const _is_1 = require("@dequanto/utils/$is");
const stringify_1 = __importDefault(require("../utils/stringify"));
class BYTE {
    constructor(position, data) {
        this.name = 'BYTE';
        this.wrapped = true;
        this.position = position;
        this.data = data;
    }
    toString() {
        return '(' + (0, stringify_1.default)(this.data) + ' >> ' + (0, stringify_1.default)(this.position) + ') & 1';
    }
}
exports.BYTE = BYTE;
exports.default = (opcode, state) => {
    const position = state.stack.pop();
    const data = state.stack.pop();
    if (_is_1.$is.BigInt(data) && _is_1.$is.BigInt(position)) {
        state.stack.push((data >> position) & 1n);
    }
    else {
        state.stack.push(new BYTE(position, data));
    }
};
