import { EVM } from '../EVM';
import Opcode from '../interfaces/IOpcode';

export default (opcode: Opcode, state: EVM): void => {
    state.stack.pop();
};
