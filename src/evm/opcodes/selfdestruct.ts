import { EVM } from '../EVM';
import Opcode from '../interfaces/IOpcode';
import stringify from '../utils/stringify';

export class SELFDESTRUCT {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly address: any;

    constructor(address: any) {
        this.name = 'SELFDESTRUCT';
        this.wrapped = true;
        this.address = address;
    }

    toString() {
        return 'selfdestruct(' + stringify(this.address) + ');';
    }
}

export default (opcode: Opcode, state: EVM): void => {
    const address = state.stack.pop();
    state.halted = true;
    state.instructions.push(new SELFDESTRUCT(address));
};
