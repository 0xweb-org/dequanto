import { EVM } from '../EVM';
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

export default (opcode: Opcode, state: EVM): void => {
    state.stack.push(new ORIGIN());
};
