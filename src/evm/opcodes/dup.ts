import { EVM } from '../EVM';
import Opcode from '../interfaces/IOpcode';

export default (opcode: Opcode, state: EVM): void => {
    const duplicateLocation = parseInt(opcode.name.replace('DUP', ''), 10) - 1;
    state.stack.duplicate(duplicateLocation);
};
