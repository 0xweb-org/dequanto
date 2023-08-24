import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

export class NUMBER {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;

    constructor() {
        this.name = 'NUMBER';
        this.wrapped = false;
    }

    toString() {
        return 'block.number';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    state.stack.push(new NUMBER());
};
