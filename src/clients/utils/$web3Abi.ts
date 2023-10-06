import { $abiParser } from '@dequanto/utils/$abiParser';
import type { TAbiItem } from '@dequanto/types/TAbi';

export namespace $web3Abi {

    /** Normalize user input by normalizing to the array of TAbiItems */
    export function ensureAbis(abi: string | TAbiItem | TAbiItem[]): (TAbiItem & { signature? })[] {
        let arr: TAbiItem[];
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
