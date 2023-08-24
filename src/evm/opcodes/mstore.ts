import { $is } from '@dequanto/utils/$is';
import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';
import stringify from '../utils/stringify';

export class MSTORE {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly location: any;
    readonly data: any;

    constructor(location: any, data: any) {
        this.name = 'MSTORE';
        this.wrapped = true;
        this.location = location;
        this.data = data;
    }

    toString() {
        return 'memory[' + stringify(this.location) + '] = ' + stringify(this.data) + ';';
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    const storeLocation = state.stack.pop();
    const storeData = state.stack.pop();
    if ($is.BigInt(storeLocation)) {
        state.memory[Number(storeLocation)] = storeData;
    } else {
        state.instructions.push(new MSTORE(storeLocation, storeData));
    }
};
