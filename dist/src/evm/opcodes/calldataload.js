"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CALLDATALOAD = void 0;
const _is_1 = require("@dequanto/utils/$is");
const stringify_1 = __importDefault(require("../utils/stringify"));
class CALLDATALOAD {
    constructor(location) {
        this.name = 'CALLDATALOAD';
        this.wrapped = false;
        this.location = location;
    }
    toString() {
        if (_is_1.$is.BigInt(this.location) && this.location === 0n) {
            return 'msg.data';
        }
        else if (_is_1.$is.BigInt(this.location) &&
            (this.location - 4n) % 32n === 0n) {
            return ('_arg' +
                ((this.location - 4n) / 32n).toString());
        }
        else {
            return 'msg.data[' + (0, stringify_1.default)(this.location) + ']';
        }
    }
}
exports.CALLDATALOAD = CALLDATALOAD;
exports.default = (opcode, state) => {
    const startLocation = state.stack.pop();
    state.stack.push(new CALLDATALOAD(startLocation));
};
