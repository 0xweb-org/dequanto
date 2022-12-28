import { EVM } from '../EVM';
import Opcode from '../interfaces/IOpcode';
import { MLOAD } from './mload';
import stringify from '../utils/stringify';
import { $is } from '@dequanto/utils/$is';

export class SHA3 {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly memoryStart?: any;
    readonly memoryLength?: any;
    readonly items: any;

    constructor(items: any, memoryStart?: any, memoryLength?: any) {
        this.name = 'SHA3';
        this.wrapped = false;
        if (memoryStart && memoryLength) {
            this.memoryStart = memoryStart;
            this.memoryLength = memoryLength;
        } else {
            this.items = items;
        }
    }

    toString() {
        if (this.items) {
            return 'keccak256(' + this.items.map((item: any) => stringify(item)).join(', ') + ')';
        } else {
            return (
                'keccak256(memory[' +
                stringify(this.memoryStart) +
                ':(' +
                stringify(this.memoryStart) +
                '+' +
                stringify(this.memoryLength) +
                ')])'
            );
        }
    }
}

export default (opcode: Opcode, state: EVM): void => {
    const memoryStart = state.stack.pop();
    const memoryLength = state.stack.pop();
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
        state.stack.push(new SHA3(items));
    } else {
        state.stack.push(new SHA3([], memoryStart, memoryLength));
    }
};
