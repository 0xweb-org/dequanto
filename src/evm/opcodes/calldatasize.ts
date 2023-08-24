import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

export class CALLDATASIZE {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;

    constructor() {
        this.name = 'CALLDATASIZE';
        this.wrapped = false;
    }

    toString() {
        return 'msg.data.length';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    state.stack.push(new CALLDATASIZE());
};
