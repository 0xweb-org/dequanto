import { $abiParser } from '@dequanto/utils/$abiParser';
import type { AbiItem } from 'web3-utils';

export namespace $web3Abi {
    export function ensureAbis(abi: string | AbiItem | AbiItem[]): (AbiItem & { signature? })[] {
        let arr: AbiItem[];
        if (typeof abi === 'string') {
            arr = [ $abiParser.parseMethod(abi) ];
        } else  if (Array.isArray(abi)) {
            arr = abi;
        } else {
            arr = [ abi ];
        }

        let first = abi[0];
        if (first.outputs == null || first.outputs.length === 0) {
            // Normalize outputs, to read at least bytes if nothing set
            first.outputs = [
                {
                    type: 'bytes32',
                    name: '',
                }
            ];
        }
        return arr;
    }
}
