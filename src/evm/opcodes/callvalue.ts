import { EVM } from '../EVM';
import Opcode from '../interfaces/IOpcode';

export class CALLVALUE {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;

    constructor() {
        this.name = 'CALLVALUE';
        this.wrapped = false;
    }

    toString() {
        return 'msg.value';
    }
}

export default (opcode: Opcode, state: EVM): void => {
    state.stack.push(new CALLVALUE());
};
