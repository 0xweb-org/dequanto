import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';


export default (opcode: Opcode, state: EvmBytecode): void => {
    const pushDataLength = parseInt(opcode.name.replace('PUSH', ''), 10);
    state.stack.push(BigInt('0x' + opcode.pushData.toString('hex')));
};
