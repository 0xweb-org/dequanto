import { $is } from '@dequanto/utils/$is';
import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';
import stringify from '../utils/stringify';

export class SUB {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly left: any;
    readonly right: any;

    constructor(left: any, right: any) {
        this.name = 'SUB';
        this.wrapped = true;
        this.left = left;
        this.right = right;
    }

    toString() {
        return stringify(this.left) + ' - ' + stringify(this.right);
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    const left = state.stack.pop();
    const right = state.stack.pop();
    if ($is.BigInt(left) && $is.BigInt(right)) {
        state.stack.push(left - right);
    } else {
        state.stack.push(new SUB(left, right));
    }
};
