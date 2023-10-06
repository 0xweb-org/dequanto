import { TEth } from '@dequanto/models/TEth';
import { $bigint } from './$bigint';

export namespace $txData {
    export function getJson(txData: TEth.TxLike, defaults?: { defaultTxType?: number, chainId?: number}): TEth.TxLike {
        let json = <TEth.TxLike> {
            ...txData,
            type: txData.type ?? defaults?.defaultTxType,
            chainId: txData.chainId ?? defaults?.chainId
        };
        if (json.type === 1) {
            // delete `type` field in case old tx type. Some old nodes may reject type field presence
            delete json.type;
        }
        for (let key in json) {
            let value = json[key];
            if (typeof value === 'bigint') {
                json[key] = $bigint.toHex(value);
            }
        }
        return json;
    }
}
