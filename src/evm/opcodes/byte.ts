import { $is } from '@dequanto/utils/$is';
import { EVM } from '../EVM';
import Opcode from '../interfaces/IOpcode';

import stringify from '../utils/stringify';

export class BYTE {
    readonly name: string;
    readonly type?: string;
    readonly wrapped: boolean;
    readonly position: any;
    readonly data: any;

    constructor(position: any, data: any) {
        this.name = 'BYTE';
        this.wrapped = true;
        this.position = position;
        this.data = data;
    }

    toString() {
        return '(' + stringify(this.data) + ' >> ' + stringify(this.position) + ') & 1';
    }
}

export default (opcode: Opcode, state: EVM): void => {
    const position = state.stack.pop();
    const data = state.stack.pop();
    if ($is.BigInt(data) && $is.BigInt(position)) {
        state.stack.push((data >> position) & 1n);
    } else {
        state.stack.push(new BYTE(position, data));
    }
};
