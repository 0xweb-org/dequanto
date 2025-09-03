import type { Rpc } from './Rpc';
import { $promise } from '@dequanto/utils/$promise';
import { TEth } from '@dequanto/models/TEth';
import { $require } from '@dequanto/utils/$require';
import { TTransport } from './transports/ITransport';


export namespace $rpc {

    export enum ErrorCodes {
        ConnectionFailed = 1006
    }

    export function createConnectionErrorResponse (error: Error & { cause?: Error & { code?: number } }, opts?: { url: string}): TTransport.Response {
        let message =  error.message;
        if (error.cause != null) {
            message += ` Cause: ${error.cause.message} ${error.cause.code}`;
        }
        if (opts?.url != null) {
            message += ` [${opts.url}]`;
        }
        return {
            id: null,
            error: {
                reason: 'connection failed',
                code: ErrorCodes.ConnectionFailed,
                message: message,
            }
        };
    }

    // will wait for a receipt
    export async function waitForReceipt (rpc: Rpc, hash: TEth.Hex): Promise<TEth.TxReceipt> {
        let knownTx = false;
        let startedAt = Date.now();
        let MEM_POOL_TIMEOUT = 30_000;
        let TX_TIMEOUT = Infinity;
        let receipt = await $promise.waitForObject(async () => {
            if (knownTx === false) {
                let tx = await rpc.eth_getTransactionByHash(hash);
                if (tx == null) {
                    let ms = Date.now() - startedAt;
                    if (ms > MEM_POOL_TIMEOUT) {
                        return [ new Error(`Transaction [${hash}] not found in mempool after ${MEM_POOL_TIMEOUT}ms`) ];
                    }
                    return [ null ];
                }
                knownTx = true;
            }
            let receipt = await rpc.eth_getTransactionReceipt(hash);
            if (receipt == null) {
                let ms = Date.now() - startedAt;
                if (ms > TX_TIMEOUT) {
                    return [ new Error(`Transaction [${hash}] was not mined after ${TX_TIMEOUT}ms`) ];
                }
                return [ null ]
            }
            return [ null, receipt ];
        });
        return receipt;
    }

    export function deserialize (model: any, schema: string | string[] | { oneOf: string[] }, schemas) {
        if (model == null) {
            return model;
        }
        if (typeof schema === 'string' && schemas != null && schema in schemas) {
            schema = schemas[schema];
        }

        let type = schema;
        if (typeof schema === 'string') {
            switch (type) {
                case 'number':
                    return Number(model);
                case 'bigint':
                    return BigInt(model);
                case 'boolean':
                    return Boolean(model);
                case 'string':
                    return model;
            }
        }
        if (Array.isArray(schema)) {
            $require.True(schema.length === 1, `Schema length must be 1 (the type): ${schema}`);

            if (Array.isArray(model) === false) {
                throw new Error(`Result must be an array: ${JSON.stringify(model)}`);
            }
            return model.map(x => deserialize(x, schema[0], schemas));
        }
        if (typeof schema === 'object') {
            let modelType = typeof model;
            if ('oneOf' in schema) {
                let oneOf = schema.oneOf.find(x => {
                    if (Array.isArray(x) && Array.isArray(model)) {
                        let baseType = x[0];
                        if (baseType === modelType) {
                            return true;
                        }
                        if (modelType === 'object' && /^[A-Z]/.test(baseType)) {
                            return true;
                        }
                        return false;
                    }
                    return typeof x === modelType
                });
                if (oneOf) {
                    return deserialize(model, oneOf, schemas);
                }
                return model;
            }
            if (modelType === 'object') {
                let out = {};
                for (let key in model) {
                    out[key] = deserialize(model[key], schema[key], schemas);
                }
                return out;
            }
        }
        return model;
    }

}
