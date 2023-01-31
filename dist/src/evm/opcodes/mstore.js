"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSTORE = void 0;
const _is_1 = require("@dequanto/utils/$is");
const stringify_1 = __importDefault(require("../utils/stringify"));
class MSTORE {
    constructor(location, data) {
        this.name = 'MSTORE';
        this.wrapped = true;
        this.location = location;
        this.data = data;
    }
    toString() {
        return 'memory[' + (0, stringify_1.default)(this.location) + '] = ' + (0, stringify_1.default)(this.data) + ';';
    }
}
exports.MSTORE = MSTORE;
exports.default = (opcode, state) => {
    const storeLocation = state.stack.pop();
    const storeData = state.stack.pop();
    if (_is_1.$is.BigInt(storeLocation)) {
        state.memory[Number(storeLocation)] = storeData;
    }
    else {
        state.instructions.push(new MSTORE(storeLocation, storeData));
    }
};
