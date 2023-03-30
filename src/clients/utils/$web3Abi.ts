import { $abiParser } from '@dequanto/utils/$abiParser';
import type { AbiItem } from 'web3-utils';

export namespace $web3Abi {
    export function ensureFirstMethod(abi: string | AbiItem | AbiItem[]): AbiItem & { signature? } {
        if (typeof abi === 'string') {
            abi = $abiParser.parseMethod(abi);
        }
        if (Array.isArray(abi)) {
            abi = abi[0];
        }

        if (abi.outputs == null || abi.outputs.length === 0) {
            // Normalize outputs, to read at least bytes if nothing set
            abi.outputs = [
                {
                    type: 'bytes32',
                    name: '',
                }
            ];
        }

        return abi;
    }
}
