import { $is } from '@dequanto/utils/$is';
import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';
import stringify from '../utils/stringify';

export class GT {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly left: any;
    readonly right: any;
    readonly equal: boolean;

    constructor(left: any, right: any, equal: boolean = false) {
        this.name = 'GT';
        this.wrapped = true;
        this.left = left;
        this.right = right;
        this.equal = equal;
    }

    toString() {
        if (this.equal) {
            return stringify(this.left) + ' >= ' + stringify(this.right);
        } else {
            return stringify(this.left) + ' > ' + stringify(this.right);
        }
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    const left = state.stack.pop();
    const right = state.stack.pop();
    if ($is.BigInt(left) && $is.BigInt(right)) {
        state.stack.push(left > right ? 1n : 0n);
    } else {
        state.stack.push(new GT(left, right));
    }
};
