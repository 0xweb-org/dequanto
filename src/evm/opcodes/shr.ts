import { EVM } from '../EVM';
import Opcode from '../interfaces/IOpcode';
import stringify from '../utils/stringify';
import { $is } from '@dequanto/utils/$is';

export class SHR {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly left: any;
    readonly right: any;

    constructor(left: any, right: any) {
        this.name = 'SHR';
        this.wrapped = true;
        this.left = left;
        this.right = right;
    }

    toString() {
        return stringify(this.left) + ' >>> ' + stringify(this.right);
    }
}

export default (opcode: Opcode, state: EVM): void => {
    const left = state.stack.pop();
    const right = state.stack.pop();
    if ($is.BigInt(left) && $is.BigInt(right)) {
        state.stack.push(left >> right);
    } else {
        state.stack.push(new SHR(left, right));
    }
};
