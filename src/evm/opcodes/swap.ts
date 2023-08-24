import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

export default (opcode: Opcode, state: EvmBytecode): void => {
    const swapLocation = parseInt(opcode.name.replace('SWAP', ''), 10);
    state.stack.swap(swapLocation);
};
