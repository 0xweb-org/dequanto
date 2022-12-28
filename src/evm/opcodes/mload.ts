import { $is } from '@dequanto/utils/$is';
import { EVM } from '../EVM';
import Opcode from '../interfaces/IOpcode';
import stringify from '../utils/stringify';

export class MLOAD {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly location: any;

    constructor(location: any) {
        this.name = 'MLOAD';
        this.wrapped = true;
        this.location = location;
    }

    toString() {
        return 'memory[' + stringify(this.location) + ']';
    }
}

export default (opcode: Opcode, state: EVM): void => {
    const memoryLocation = state.stack.pop();
    if ($is.BigInt(memoryLocation) && Number(memoryLocation) in state.memory) {
        state.stack.push(state.memory[Number(memoryLocation)]);
    } else {
        state.stack.push(new MLOAD(memoryLocation));
    }
};
