"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTCODEHASH = void 0;
const stringify_1 = __importDefault(require("../utils/stringify"));
class EXTCODEHASH {
    constructor(address) {
        this.name = 'EXTCODEHASH';
        this.wrapped = true;
        this.address = address;
    }
    toString() {
        return 'keccak256(address(' + (0, stringify_1.default)(this.address) + ').code)';
    }
}
exports.EXTCODEHASH = EXTCODEHASH;
exports.default = (opcode, state) => {
    const address = state.stack.pop();
    state.stack.push(new EXTCODEHASH(address));
};
