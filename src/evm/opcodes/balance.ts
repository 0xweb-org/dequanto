import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';
import stringify from '../utils/stringify';

export class BALANCE {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly address: any;

    constructor(address: any) {
        this.name = 'BALANCE';
        this.wrapped = true;
        this.address = address;
    }

    toString() {
        return stringify(this.address) + '.balance';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    const address = state.stack.pop();
    state.stack.push(new BALANCE(address));
};
