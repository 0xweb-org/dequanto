"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTCODECOPY = void 0;
const stringify_1 = __importDefault(require("../utils/stringify"));
class EXTCODECOPY {
    constructor(address, startLocation, copyLength) {
        this.name = 'EXTCODECOPY';
        this.wrapped = true;
        this.address = address;
        this.startLocation = startLocation;
        this.copyLength = copyLength;
    }
    toString() {
        return ('address(' +
            (0, stringify_1.default)(this.address) +
            ').code[' +
            (0, stringify_1.default)(this.startLocation) +
            ':(' +
            (0, stringify_1.default)(this.startLocation) +
            '+' +
            (0, stringify_1.default)(this.copyLength) +
            ')]');
    }
}
exports.EXTCODECOPY = EXTCODECOPY;
exports.default = (opcode, state) => {
    const address = state.stack.pop();
    const memoryLocation = state.stack.pop();
    const startLocation = state.stack.pop();
    const copyLength = state.stack.pop();
    state.memory[memoryLocation] = new EXTCODECOPY(address, startLocation, copyLength);
};
