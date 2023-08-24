import { $is } from '@dequanto/utils/$is';
import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';
import stringify from '../utils/stringify';

export class AND {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly left: any;
    readonly right: any;

    constructor(left: any, right: any) {
        this.name = 'AND';
        this.wrapped = true;
        this.left = left;
        this.right = right;
    }

    toString() {
        return stringify(this.left) + ' && ' + stringify(this.right);
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    const left = state.stack.pop();
    const right = state.stack.pop();
    if ($is.BigInt(left) && $is.BigInt(right)) {
        state.stack.push(left & right);
    } else if ($is.BigInt(left) && /^[f]+$/.test(left.toString(16))) {
        right.size = left.toString(16).length;
        state.stack.push(right);
    } else if ($is.BigInt(right) && /^[f]+$/.test(right.toString(16))) {
        left.size = right.toString(16).length;
        state.stack.push(left);
        /*} else if (
        $is.BigInt(left) &&
        left.equals('1461501637330902918203684832716283019655932542975')
    ) {*/
        /* 2 ** 160 */
        /*    state.stack.push(right);
    } else if (
        $is.BigInt(right) &&
        right.equals('1461501637330902918203684832716283019655932542975')
    ) {*/
        /* 2 ** 160 */
        /*    state.stack.push(left);*/
    } else if (
        $is.BigInt(left) &&
        right instanceof AND &&
        $is.BigInt(right.left) &&
        left === right.left
    ) {
        state.stack.push(right.right);
    } else {
        state.stack.push(new AND(left, right));
    }
};
