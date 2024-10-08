import { $is } from '@dequanto/utils/$is';
import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';
import stringify from '../utils/stringify';

export class JUMP {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly valid: boolean;
    readonly location: any;

    constructor(location: any, bad?: boolean) {
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
        } else {
            return 'goto(' + stringify(this.location) + ');';
        }
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    const jumpLocation = state.stack.pop();
    if (!$is.BigInt(jumpLocation)) {
        state.halted = true;
        state.instructions.push(new JUMP(jumpLocation, true));
    } else {
        const opcodes = state.getOpcodes();
        const jumpLocationData = opcodes.find((o: any) => o.pc === Number(jumpLocation));
        if (!jumpLocationData) {
            state.halted = true;
            state.instructions.push(new JUMP(jumpLocation, true));
        } else {
            const jumpIndex = opcodes.indexOf(jumpLocationData);
            if (!(opcode.pc + ':' + Number(jumpLocation) in state.jumps)) {
                if (!jumpLocationData || jumpLocationData.name !== 'JUMPDEST') {
                    state.halted = true;
                    state.instructions.push(new JUMP(jumpLocation, true));
                } else if (
                    jumpLocationData &&
                    jumpIndex >= 0 &&
                    jumpLocationData.name === 'JUMPDEST'
                ) {
                    state.jumps[opcode.pc + ':' + Number(jumpLocation)] = true;
                    state.pc = jumpIndex;
                } else {
                    state.halted = true;
                    state.instructions.push(new JUMP(jumpLocation, true));
                }
            } else {
                state.halted = true;
                state.instructions.push(new JUMP(jumpLocation));
            }
        }
    }
};
