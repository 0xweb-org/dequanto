"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLOCKHASH = void 0;
const stringify_1 = __importDefault(require("../utils/stringify"));
class BLOCKHASH {
    constructor(blockNumber) {
        this.name = 'BLOCKHASH';
        this.wrapped = true;
        this.number = blockNumber;
    }
    toString() {
        return 'block.blockhash(' + (0, stringify_1.default)(this.number) + ')';
    }
}
exports.BLOCKHASH = BLOCKHASH;
exports.default = (opcode, state) => {
    const blockNumber = state.stack.pop();
    state.stack.push(new BLOCKHASH(blockNumber));
};
