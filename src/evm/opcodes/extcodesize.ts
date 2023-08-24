import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';
import stringify from '../utils/stringify';

export class EXTCODESIZE {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly address: any;

    constructor(address: any) {
        this.name = 'EXTCODESIZE';
        this.wrapped = true;
        this.address = address;
    }

    toString() {
        return 'address(' + stringify(this.address) + ').code.length';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    const address = state.stack.pop();
    state.stack.push(new EXTCODESIZE(address));
};
