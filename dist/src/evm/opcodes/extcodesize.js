"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTCODESIZE = void 0;
const stringify_1 = __importDefault(require("../utils/stringify"));
class EXTCODESIZE {
    constructor(address) {
        this.name = 'EXTCODESIZE';
        this.wrapped = true;
        this.address = address;
    }
    toString() {
        return 'address(' + (0, stringify_1.default)(this.address) + ').code.length';
    }
}
exports.EXTCODESIZE = EXTCODESIZE;
exports.default = (opcode, state) => {
    const address = state.stack.pop();
    state.stack.push(new EXTCODESIZE(address));
};
