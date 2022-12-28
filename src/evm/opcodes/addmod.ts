import { $is } from '@dequanto/utils/$is';
import { EVM } from '../EVM';
import Opcode from '../interfaces/IOpcode';
import { ADD } from './add';
import { MOD } from './mod';


export default (opcode: Opcode, state: EVM): void => {
    const left = state.stack.pop();
    const right = state.stack.pop();
    const mod = state.stack.pop();
    if ($is.BigInt(left) && $is.BigInt(right) && $is.BigInt(mod)) {
        state.stack.push((left + right) % mod);
    } else if ($is.BigInt(left) && $is.BigInt(right)) {
        state.stack.push(new MOD(left + right, mod));
    } else {
        state.stack.push(new MOD(new ADD(left, right), mod));
    }
};
