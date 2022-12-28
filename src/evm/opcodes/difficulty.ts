import { EVM } from '../EVM';
import Opcode from '../interfaces/IOpcode';

export class DIFFICULTY {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;

    constructor() {
        this.name = 'DIFFICULTY';
        this.wrapped = false;
    }

    toString() {
        return 'block.difficulty';
    }
}

export default (opcode: Opcode, state: EVM): void => {
    state.stack.push(new DIFFICULTY());
};
