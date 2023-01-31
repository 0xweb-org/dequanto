"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JUMP = void 0;
const _is_1 = require("@dequanto/utils/$is");
const stringify_1 = __importDefault(require("../utils/stringify"));
class JUMP {
    constructor(location, bad) {
        this.name = 'JUMP';
        this.wrapped = false;
        this.location = location;
        this.valid = true;
        if (bad) {
            this.valid = false;
        }
    }
    toString() {
        if (!this.valid) {
            return "revert(\"Bad jump destination\");";
        }
        else {
            return 'goto(' + (0, stringify_1.default)(this.location) + ');';
        }
    }
}
exports.JUMP = JUMP;
exports.default = (opcode, state) => {
    const jumpLocation = state.stack.pop();
    if (!_is_1.$is.BigInt(jumpLocation)) {
        state.halted = true;
        state.instructions.push(new JUMP(jumpLocation, true));
    }
    else {
        const opcodes = state.getOpcodes();
        const jumpLocationData = opcodes.find((o) => o.pc === Number(jumpLocation));
        if (!jumpLocationData) {
            state.halted = true;
            state.instructions.push(new JUMP(jumpLocation, true));
        }
        else {
            const jumpIndex = opcodes.indexOf(jumpLocationData);
            if (!(opcode.pc + ':' + Number(jumpLocation) in state.jumps)) {
                if (!jumpLocationData || jumpLocationData.name !== 'JUMPDEST') {
                    state.halted = true;
                    state.instructions.push(new JUMP(jumpLocation, true));
                }
                else if (jumpLocationData &&
                    jumpIndex >= 0 &&
                    jumpLocationData.name === 'JUMPDEST') {
                    state.jumps[opcode.pc + ':' + Number(jumpLocation)] = true;
                    state.pc = jumpIndex;
                }
                else {
                    state.halted = true;
                    state.instructions.push(new JUMP(jumpLocation, true));
                }
            }
            else {
                state.halted = true;
                state.instructions.push(new JUMP(jumpLocation));
            }
        }
    }
};
