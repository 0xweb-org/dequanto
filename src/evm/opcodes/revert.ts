import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';
import { MLOAD } from './mload';
import stringify from '../utils/stringify';
import { $is } from '@dequanto/utils/$is';

export class REVERT {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly memoryStart?: any;
    readonly memoryLength?: any;
    readonly items: any;

    constructor(items: any, memoryStart?: any, memoryLength?: any) {
        this.name = 'REVERT';
        this.wrapped = true;
        if (memoryStart && memoryLength) {
            this.memoryStart = memoryStart;
            this.memoryLength = memoryLength;
        } else {
            this.items = items;
        }
    }

    toString() {
        if (this.items) {
            return 'revert(' + this.items.map((item: any) => stringify(item)).join(', ') + ');';
        } else {
            return (
                'revert(memory[' +
                stringify(this.memoryStart) +
                ':(' +
                stringify(this.memoryStart) +
                '+' +
                stringify(this.memoryLength) +
                ')]);'
            );
        }
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    const memoryStart = state.stack.pop();
    const memoryLength = state.stack.pop();
    state.halted = true;
    if ($is.BigInt(memoryStart) && $is.BigInt(memoryLength)) {
        const items = [];
        for (
            let i = Number(memoryStart);
            i < Number(memoryStart + memoryLength);
            i += 32
        ) {
            if (i in state.memory) {
                items.push(state.memory[i]);
            } else {
                items.push(new MLOAD(i));
            }
        }
        state.instructions.push(new REVERT(items));
    } else {
        state.instructions.push(new REVERT([], memoryStart, memoryLength));
    }
};
