import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

export class INVALID {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly opcode: any;

    constructor(opcode: any) {
        this.name = 'INVALID';
        this.wrapped = true;
        this.opcode = opcode;
    }

    toString() {
        return 'revert("Invalid instruction (0x' + this.opcode.toString(16) + ')");';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    state.halted = true;
    state.instructions.push(new INVALID(opcode.opcode));
};
