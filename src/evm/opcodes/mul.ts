import { $is } from '@dequanto/utils/$is';
import { EVM } from '../EVM';
import Opcode from '../interfaces/IOpcode';
import stringify from '../utils/stringify';

export class MUL {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly left: any;
    readonly right: any;

    constructor(left: any, right: any) {
        this.name = 'MUL';
        this.wrapped = true;
        this.left = left;
        this.right = right;
    }

    toString() {
        return stringify(this.left) + ' * ' + stringify(this.right);
    }
}

export default (opcode: Opcode, state: EVM): void => {
    const left = state.stack.pop();
    const right = state.stack.pop();
    if ($is.BigInt(left) && $is.BigInt(right)) {
        state.stack.push(left * right);
    } else if (
        ($is.BigInt(left) && left === 0n) ||
        ($is.BigInt(right) && right === 0n)
    ) {
        state.stack.push(0n);
    } else {
        state.stack.push(new MUL(left, right));
    }
};
