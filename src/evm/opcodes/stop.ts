import { EVM } from '../EVM';
import Opcode from '../interfaces/IOpcode';

export class STOP {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;

    constructor() {
        this.name = 'STOP';
        this.wrapped = false;
    }

    toString() {
        return 'return;';
    }
}

export default (opcode: Opcode, state: EVM): void => {
    state.halted = true;
    state.instructions.push(new STOP());
};
