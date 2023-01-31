"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BALANCE = void 0;
const stringify_1 = __importDefault(require("../utils/stringify"));
class BALANCE {
    constructor(address) {
        this.name = 'BALANCE';
        this.wrapped = true;
        this.address = address;
    }
    toString() {
        return (0, stringify_1.default)(this.address) + '.balance';
    }
}
exports.BALANCE = BALANCE;
exports.default = (opcode, state) => {
    const address = state.stack.pop();
    state.stack.push(new BALANCE(address));
};
