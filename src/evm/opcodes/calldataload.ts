import { $is } from '@dequanto/utils/$is';
import { EvmBytecode } from '../EvmBytecode';
import Opcode from '../interfaces/IOpcode';

import stringify from '../utils/stringify';

export class CALLDATALOAD {
    readonly name: string;
    readonly type?: string;
    readonly returntype?: string;
    readonly wrapped: boolean;
    readonly location: any;

    constructor(location: any) {
        this.name = 'CALLDATALOAD';
        this.wrapped = false;
        this.location = location;
    }

    toString() {
        if ($is.BigInt(this.location) && this.location === 0n) {
            return 'msg.data';
        } else if (
            $is.BigInt(this.location) &&
            (this.location - 4n) % 32n === 0n
        ) {
            return (
                '_arg' +
                ((this.location - 4n) / 32n).toString()
            );
        } else {
            return 'msg.data[' + stringify(this.location) + ']';
        }
    }
}

export default (opcode: Opcode, state: EvmBytecode): void => {
    const startLocation = state.stack.pop();
    state.stack.push(new CALLDATALOAD(startLocation));
};
