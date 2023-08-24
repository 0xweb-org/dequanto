import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

export class CODESIZE {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;

    constructor() {
        this.name = 'CODESIZE';
        this.wrapped = false;
    }

    toString() {
        return 'this.code.length';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    state.stack.push(new CODESIZE());
};
