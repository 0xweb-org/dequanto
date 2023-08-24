import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

export class RETURNDATASIZE {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;

    constructor() {
        this.name = 'RETURNDATASIZE';
        this.wrapped = false;
    }

    toString() {
        return 'output.length';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    state.stack.push(new RETURNDATASIZE());
};
