import { EVM } from '../EVM';
import Opcode from '../interfaces/IOpcode';

export class TIMESTAMP {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;

    constructor() {
        this.name = 'TIMESTAMP';
        this.wrapped = false;
    }

    toString() {
        return 'block.timestamp';
    }
}

export default (opcode: Opcode, state: EVM): void => {
    state.stack.push(new TIMESTAMP());
};
