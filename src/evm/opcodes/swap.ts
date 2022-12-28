import { EVM } from '../EVM';
import Opcode from '../interfaces/IOpcode';

export default (opcode: Opcode, state: EVM): void => {
    const swapLocation = parseInt(opcode.name.replace('SWAP', ''), 10);
    state.stack.swap(swapLocation);
};
