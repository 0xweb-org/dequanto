import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

export class ORIGIN {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;

    constructor() {
        this.name = 'ORIGIN';
        this.wrapped = false;
    }

    toString() {
        return 'tx.origin';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    state.stack.push(new ORIGIN());
};
