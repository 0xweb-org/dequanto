import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';
import { SHL } from './shl';
import { SAR } from './sar';
import { SUB } from './sub';
import { $is } from '@dequanto/utils/$is';


export default (opcode: Opcode, state: EvmBytecode): void => {
    const left = state.stack.pop();
    const right = state.stack.pop();
    if ($is.BigInt(left) && $is.BigInt(right)) {
        state.stack.push(
            (right << (32n - left)) >> (32n - left)
        );
    } else if ($is.BigInt(left)) {
        state.stack.push(
            new SAR(new SHL(right, 32n - left), 32n - left)
        );
    } else {
        state.stack.push(
            new SAR(new SHL(right, new SUB(32n, left)), new SUB(32n, left))
        );
    }
};
