import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

export class GASLIMIT {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;

    constructor() {
        this.name = 'GASLIMIT';
        this.wrapped = false;
    }

    toString() {
        return 'block.gaslimit';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    state.stack.push(new GASLIMIT());
};
