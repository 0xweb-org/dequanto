import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';
import { MUL } from './mul';
import { MOD } from './mod';
import { $is } from '@dequanto/utils/$is';


export default (opcode: Opcode, state: EvmBytecode): void => {
    const left = state.stack.pop();
    const right = state.stack.pop();
    const mod = state.stack.pop();
    if ($is.BigInt(left) && $is.BigInt(right) && $is.BigInt(mod)) {
        state.stack.push(left * right % mod);
    } else if ($is.BigInt(left) && $is.BigInt(right)) {
        state.stack.push(new MOD(left * right, mod));
    } else {
        state.stack.push(new MOD(new MUL(left, right), mod));
    }
};
