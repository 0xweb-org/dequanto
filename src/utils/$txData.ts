import type { TransactionRequest } from '@ethersproject/abstract-provider';

export namespace $txData {
    export function getJson(txData: TransactionRequest, defaults?: { defaultTxType?: number, chainId?: number}): TransactionRequest {
        let json = <TransactionRequest> {
            ...txData,
            type: txData.type ?? defaults?.defaultTxType,
            chainId: txData.chainId ?? defaults?.chainId
        };
        if (json.type === 1) {
            // delete `type` field in case old tx type. Some old nodes may reject type field presence
            delete json.type;
        }
        return json;
    }
}
