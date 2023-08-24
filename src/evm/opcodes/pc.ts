import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';


export default (opcode: Opcode, state: EvmBytecode): void => {
    state.stack.push(BigInt(opcode.pc));
};
