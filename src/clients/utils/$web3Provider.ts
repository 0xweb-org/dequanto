import { $number } from '@dequanto/utils/$number';
import Web3 from 'web3';
import type { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers'

export namespace $web3Provider {

    export async function call (web3: Web3, json: JsonRpcPayload): Promise<JsonRpcResponse> {
        return new Promise((resolve, reject) => {
            if (json.id == null) {
                // Generate the ID, as some nodes require it
                json.id = $number.randomInt(10**5, 10**11);
            }
            let provider = web3.currentProvider;
            if (provider == null || typeof provider !== 'object' || typeof provider.send !== 'function') {
                reject(new Error(`Invalid Web3 current RPC Provider. Has no "send" method`));
                return;
            }

            provider.send(json, (err, result) => {
                if (err != null) {
                    reject(err);
                    return;
                }
                if (result.error) {
                    let err = result.error as any;
                    let message = err.message ?? err.details ?? JSON.stringify(err);
                    let error = new Error(message) as (Error & { data });
                    error.data = err;

                    reject(error);
                    return;
                }
                resolve(result.result);
            });

        });
    }
}
