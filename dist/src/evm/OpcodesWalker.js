"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsOpcode = exports.OpcodesWalker = void 0;
const _abiUtils_1 = require("@dequanto/utils/$abiUtils");
const Stack_1 = __importDefault(require("./Stack"));
const opcodes_1 = __importDefault(require("./utils/opcodes"));
class OpcodesWalker {
    constructor(evm, opcodes) {
        this.evm = evm;
        this.opcodes = opcodes;
        this.stack = new Stack_1.default();
    }
    getMethodOpcodes(mix) {
        let sig = typeof mix === 'string'
            ? _abiUtils_1.$abiUtils.getMethodSignature(mix)
            : mix.sig;
        let method = this.opcodes.find(x => x.name === 'PUSH4' && x.pushData?.toString('hex') === sig.substring(2));
        if (method == null) {
            throw new Error(`ABI ${JSON.stringify(mix)} not found in bytecode`);
        }
        this.evm.pc = method.pc;
        this.current = method;
        while (this.next() != null) {
            if (IsOpcode.ofType(this.current, 'JUMP') === false) {
                opcodes_1.default[this.current.name](this.current, this.evm);
                continue;
            }
            let dest = this.evm.stack.pop();
            let destOpcode = this.next(dest);
            if (IsOpcode.ofType(destOpcode, 'JUMPDEST') === false) {
                throw new Error(`Jump to ${dest} should be a destination opcode, got ${destOpcode?.name}`);
            }
            break;
        }
        let { opcodes, exit } = this.goToExit();
        return { opcodes, exit };
    }
    goToExit(prev) {
        if (prev != null) {
            this.current = prev;
            this.evm.pc = prev.pc;
        }
        let visited = [];
        let seen = 0;
        while (this.next() != null) {
            if (visited.includes(this.current)) {
                seen++;
                const MAX_LOOP_DEPTH = 100;
                if (seen > MAX_LOOP_DEPTH) {
                    return {
                        opcodes: visited,
                        exit: 'LOOP'
                    };
                }
            }
            else {
                seen = 0;
                visited.push(this.current);
            }
            let name = this.current.name;
            if (name === 'RETURN' || name === 'STOP') {
                return {
                    opcodes: visited,
                    exit: name
                };
            }
            if (name === 'REVERT' || name === 'INVALID') {
                return {
                    opcodes: visited,
                    exit: name,
                };
            }
            // process any non-jump opcodes
            if (IsOpcode.ofType(this.current, 'JUMP') === false) {
                opcodes_1.default[this.current.name](this.current, this.evm);
                continue;
            }
            let destination = this.evm.stack.pop();
            if (this.current.name === 'JUMPI') {
                // Is Conditional
                this.evm.stack.pop();
                // Visit falsy leaf (as if the jump not occured)
                let evm = this.evm.clone();
                let walker = new OpcodesWalker(evm, this.opcodes);
                let { opcodes } = walker.goToExit(this.current);
                visited.push(...opcodes);
            }
            let destOpcode = this.next(destination);
            if (IsOpcode.ofType(destOpcode, 'JUMPDEST') === false) {
                throw new Error(`Jump to ${destination} should be a destination opcode, got ${destOpcode?.name}`);
            }
        }
        return {
            opcodes: visited,
            exit: 'END'
        };
    }
    next(dest) {
        if (dest != null) {
            if (typeof dest === 'bigint') {
                dest = Number(dest);
            }
            if (typeof dest === 'number') {
                let opcode = this.opcodes.find(x => x.pc === dest);
                if (opcode == null) {
                    console.log(this.opcodes.map(x => `${x.pc.toString(16)} ${x.name}`).join('\n'));
                    throw new Error(`No OPCODE found at ${dest.toString(16)}`);
                }
                this.current = opcode;
                this.evm.pc = this.current.pc;
                return this.current;
            }
        }
        let i = this.opcodes.indexOf(this.current);
        this.current = this.opcodes[i + 1];
        this.evm.pc = this.current.pc;
        return this.current;
    }
}
exports.OpcodesWalker = OpcodesWalker;
var IsOpcode;
(function (IsOpcode) {
    function ofType(opcode, name) {
        if (opcode == null) {
            return false;
        }
        if (typeof name === 'string') {
            let rgx = new RegExp(name, 'i');
            return rgx.test(opcode.name);
        }
        return false;
    }
    IsOpcode.ofType = ofType;
})(IsOpcode = exports.IsOpcode || (exports.IsOpcode = {}));
