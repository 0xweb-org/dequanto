"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RETURNDATACOPY = void 0;
const stringify_1 = __importDefault(require("../utils/stringify"));
class RETURNDATACOPY {
    constructor(returnDataPosition, returnDataSize) {
        this.name = 'RETURNDATACOPY';
        this.wrapped = true;
        this.returnDataPosition = returnDataPosition;
        this.returnDataSize = returnDataSize;
    }
    toString() {
        return ('output[' +
            (0, stringify_1.default)(this.returnDataPosition) +
            ':(' +
            (0, stringify_1.default)(this.returnDataPosition) +
            '+' +
            (0, stringify_1.default)(this.returnDataSize) +
            ')]');
    }
}
exports.RETURNDATACOPY = RETURNDATACOPY;
exports.default = (opcode, state) => {
    const memoryPosition = state.stack.pop();
    const returnDataPosition = state.stack.pop();
    const returnDataSize = state.stack.pop();
    state.memory[memoryPosition] = new RETURNDATACOPY(returnDataPosition, returnDataSize);
};
