import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

export class CALLDATACOPY {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly startLocation: any;
    readonly copyLength: any;

    constructor(startLocation: any, copyLength: any) {
        this.name = 'CALLDATACOPY';
        this.wrapped = true;
        this.startLocation = startLocation;
        this.copyLength = copyLength;
    }

    toString() {
        return (
            'msg.data[' +
            this.startLocation +
            ':(' +
            this.startLocation +
            '+' +
            this.copyLength +
            ')];'
        );
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    const memoryLocation = state.stack.pop();
    const startLocation = state.stack.pop();
    const copyLength = state.stack.pop();
    state.memory[memoryLocation] = new CALLDATACOPY(startLocation, copyLength);
};
