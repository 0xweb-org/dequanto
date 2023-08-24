import { $is } from '@dequanto/utils/$is';
import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';
import stringify from '../utils/stringify';

export class SIG {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly hash: string;

    constructor(hash: string) {
        this.name = 'SIG';
        this.wrapped = false;
        this.hash = hash;
    }

    toString() {
        return 'msg.sig == ' + this.hash;
    }
}

export class EQ {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly left: any;
    readonly right: any;

    constructor(left: any, right: any) {
        this.name = 'EQ';
        this.wrapped = true;
        this.left = left;
        this.right = right;
    }

    toString() {
        return stringify(this.left) + ' == ' + stringify(this.right);
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    let left = state.stack.pop();
    let right = state.stack.pop();
    if ($is.BigInt(left) && $is.BigInt(right)) {
        state.stack.push(left === right ? 1n : 0n);
    } else {
        if (
            $is.BigInt(left) &&
            right.name === 'DIV' &&
            $is.BigInt(right.right)
        ) {
            left = left * right.right;
            right = right.left;
        }
        if (
            $is.BigInt(right) &&
            left.name === 'DIV' &&
            $is.BigInt(left.right)
        ) {
            right = right * left.right;
            left = left.left;
        }
        if (
            $is.BigInt(left) &&
            /^[0]+$/.test(left.toString(16).substring(8)) &&
            right.name === 'CALLDATALOAD' &&
            right.location.equals(0)
        ) {
            state.stack.push(
                new SIG(
                    '0'.repeat(64 - left.toString(16).length) +
                        left.toString(16).substring(0, 8 - (64 - left.toString(16).length))
                )
            );
        } else if (
            $is.BigInt(right) &&
            /^[0]+$/.test(right.toString(16).substring(8)) &&
            left.name === 'CALLDATALOAD' &&
            left.location.equals(0)
        ) {
            state.stack.push(
                new SIG(
                    '0'.repeat(64 - right.toString(16).length) +
                        right.toString(16).substring(0, 8 - (64 - right.toString(16).length))
                )
            );
        } else {
            state.stack.push(new EQ(left, right));
        }
    }
};
