import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

export class MSIZE {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;

    constructor() {
        this.name = 'MSIZE';
        this.wrapped = false;
    }

    toString() {
        return 'memory.length';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    state.stack.push(new MSIZE());
};
