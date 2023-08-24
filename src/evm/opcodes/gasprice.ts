import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

export class GASPRICE {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;

    constructor() {
        this.name = 'GASPRICE';
        this.wrapped = false;
    }

    toString() {
        return 'tx.gasprice';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    state.stack.push(new GASPRICE());
};
