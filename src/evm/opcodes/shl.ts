import { $is } from '@dequanto/utils/$is';
import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';
import stringify from '../utils/stringify';

export class SHL {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly left: any;
    readonly right: any;

    constructor(left: any, right: any) {
        this.name = 'SHL';
        this.wrapped = true;
        this.left = left;
        this.right = right;
    }

    toString() {
        return stringify(this.left) + ' << ' + stringify(this.right);
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {

    const shift = state.stack.pop();
    const value = state.stack.pop();

    if ($is.BigInt(shift) && $is.BigInt(value)) {
        if (shift > 255n) {
            state.stack.push(0n);
            return;
        }
        let result = value << shift;
        let trimmed = BigInt('0x' + result.toString(16).slice(-64));
        state.stack.push(trimmed);
        return;
    }

    state.stack.push(new SHL(shift, value));
};
