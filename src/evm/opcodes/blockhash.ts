import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';
import stringify from '../utils/stringify';

export class BLOCKHASH {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly number: any;

    constructor(blockNumber: any) {
        this.name = 'BLOCKHASH';
        this.wrapped = true;
        this.number = blockNumber;
    }

    toString() {
        return 'block.blockhash(' + stringify(this.number) + ')';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    const blockNumber = state.stack.pop();
    state.stack.push(new BLOCKHASH(blockNumber));
};
