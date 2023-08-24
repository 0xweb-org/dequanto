import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

export class ADDRESS {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;

    constructor() {
        this.name = 'ADDRESS';
        this.type = 'address';
        this.wrapped = false;
    }

    toString() {
        return 'this';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    state.stack.push(new ADDRESS());
};
