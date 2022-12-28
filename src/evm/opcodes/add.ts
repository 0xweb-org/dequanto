import { $is } from '@dequanto/utils/$is';
import { EVM } from '../EVM';
import Opcode from '../interfaces/IOpcode';
import { BigNumber } from '../utils/BigNumber';
import stringify from '../utils/stringify';

export class ADD {
    readonly name: string;
    readonly wrapped: boolean;
    readonly left: any;
    readonly right: any;

    constructor(left: any, right: any) {
        this.name = 'ADD';
        this.wrapped = true;
        this.left = left;
        this.right = right;
    }

    toString() {
        return stringify(this.left) + ' + ' + stringify(this.right);
    }

    get type() {
        if (this.left.type === this.right.type) {
            return this.left.type;
        } else if (!this.left.type && this.right.type) {
            return this.right.type;
        } else if (!this.right.type && this.left.type) {
            return this.left.type;
        } else {
            return false;
        }
    }
}

export default (opcode: Opcode, state: EVM): void => {
    const left = state.stack.pop();
    const right = state.stack.pop();
    if ($is.BigInt(left) && $is.BigInt(right)) {
        state.stack.push(left + right);
    } else if ($is.BigInt(left) && left === 0n) {
        state.stack.push(right);
    } else if ($is.BigInt(right) && right === 0n) {
        state.stack.push(left);
    } else {
        state.stack.push(new ADD(left, right));
    }
};
