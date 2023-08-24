import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

export class GAS {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;

    constructor() {
        this.name = 'GAS';
        this.wrapped = false;
    }

    toString() {
        return 'gasleft()';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    state.stack.push(new GAS());
};
