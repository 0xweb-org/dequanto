import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

export default (opcode: Opcode, state: EvmBytecode): void => {
    const duplicateLocation = parseInt(opcode.name.replace('DUP', ''), 10) - 1;
    state.stack.duplicate(duplicateLocation);
};
