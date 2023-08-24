import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';
import { MLOAD } from './mload';
import { hex2a } from '../utils/hex';
import stringify from '../utils/stringify';
import { $is } from '@dequanto/utils/$is';

export class RETURN {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly memoryStart?: any;
    readonly memoryLength?: any;
    readonly items: any;

    constructor(items: any, memoryStart?: any, memoryLength?: any) {
        this.name = 'RETURN';
        this.wrapped = true;
        if (memoryStart && memoryLength) {
            this.memoryStart = memoryStart;
            this.memoryLength = memoryLength;
        } else {
            this.items = items;
        }
    }

    toString() {
        if (this.memoryStart && this.memoryLength) {
            return (
                'return memory[' +
                stringify(this.memoryStart) +
                ':(' +
                stringify(this.memoryStart) +
                '+' +
                stringify(this.memoryLength) +
                ')];'
            );
        } else if (this.items.length === 0) {
            return 'return;';
        } else if (
            this.items.length === 1 &&
            ($is.BigInt(this.items[0]) || this.items[0].static)
        ) {
            return 'return ' + this.items[0] + ';';
        } else if (
            this.items.length === 3 &&
            this.items.every((item: any) => $is.BigInt(item)) &&
            this.items[0].equals(32)
        ) {
            return 'return "' + hex2a(this.items[2].toString(16)) + '";';
        } else {
            return 'return(' + this.items.map((item: any) => stringify(item)).join(', ') + ');';
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
            i < Number(memoryStart) + Number(memoryLength);
            i += 32
        ) {
            if (i in state.memory) {
                items.push(state.memory[i]);
            } else {
                items.push(new MLOAD(i));
            }
        }
        state.instructions.push(new RETURN(items));
    } else {
        state.instructions.push(new RETURN([], memoryStart, memoryLength));
    }
};
