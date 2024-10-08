import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

export class CALLER {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;

    constructor() {
        this.name = 'CALLER';
        this.name = 'address';
        this.wrapped = false;
    }

    toString() {
        return 'msg.sender';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    state.stack.push(new CALLER());
};
