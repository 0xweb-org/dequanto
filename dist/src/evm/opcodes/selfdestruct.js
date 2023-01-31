"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SELFDESTRUCT = void 0;
const stringify_1 = __importDefault(require("../utils/stringify"));
class SELFDESTRUCT {
    constructor(address) {
        this.name = 'SELFDESTRUCT';
        this.wrapped = true;
        this.address = address;
    }
    toString() {
        return 'selfdestruct(' + (0, stringify_1.default)(this.address) + ');';
    }
}
exports.SELFDESTRUCT = SELFDESTRUCT;
exports.default = (opcode, state) => {
    const address = state.stack.pop();
    state.halted = true;
    state.instructions.push(new SELFDESTRUCT(address));
};
