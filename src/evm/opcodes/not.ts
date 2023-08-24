import { $is } from '@dequanto/utils/$is';
import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';
import stringify from '../utils/stringify';

export class NOT {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly item: any;

    constructor(item: any) {
        this.name = 'AND';
        this.wrapped = true;
        this.item = item;
    }

    toString() {
        return '~' + stringify(this.item);
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    const item = state.stack.pop();
    if ($is.BigInt(item)) {
        state.stack.push(!item);
    } else {
        state.stack.push(new NOT(item));
    }
};
