"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CODECOPY = void 0;
const stringify_1 = __importDefault(require("../utils/stringify"));
class CODECOPY {
    constructor(startLocation, copyLength) {
        this.name = 'CODECOPY';
        this.wrapped = true;
        this.startLocation = startLocation;
        this.copyLength = copyLength;
    }
    toString() {
        return ('this.code[' +
            (0, stringify_1.default)(this.startLocation) +
            ':(' +
            (0, stringify_1.default)(this.startLocation) +
            '+' +
            (0, stringify_1.default)(this.copyLength) +
            ')]');
    }
}
exports.CODECOPY = CODECOPY;
exports.default = (opcode, state) => {
    const memoryLocation = state.stack.pop();
    const startLocation = state.stack.pop();
    const copyLength = state.stack.pop();
    state.memory[memoryLocation] = new CODECOPY(startLocation, copyLength);
};
