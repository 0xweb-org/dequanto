import type { IWeb3ClientOptions } from '../interfaces/IWeb3Client';
import type { Web3Client } from '../Web3Client';
import { TAddress } from '@dequanto/models/TAddress'
import { TBufferLike } from '@dequanto/models/TBufferLike'
import { $bigint } from '@dequanto/utils/$bigint';


export class ClientDebugMethods {

    constructor (public client: Web3Client, public methods: IWeb3ClientOptions['debug'] ) {

    }

    getTransactionTrace (hash: string) {
        return this.client.pool.call(async web3 => {
            let eth = web3.eth as (typeof web3.eth & { traceTransaction });

            if (typeof eth.traceTransaction !== 'function') {
                web3.eth.extend({
                    methods: [
                        {
                            name: 'traceTransaction',
                            call: 'debug_traceTransaction',
                            params: 2,
                        }
                    ]
                })
            }

            let result = await eth.traceTransaction(hash, {
                tracer: 'callTracer'
            });
            return result;

        }, {
            node: {
                traceable: true
            }
        });
    }

    setStorageAt (address: TAddress, location: string | number | bigint, buffer: TBufferLike) {
        return this.call('setStorageAt', ...arguments);
    }

    setCode (address: TAddress, buffer: TBufferLike) {
        return this.call('setCode', ...arguments);
    }

    setBalance (address: TAddress, amount: bigint | string) {
        if (typeof amount === 'bigint') {
            amount = $bigint.toHex(amount);
        }
        return this.call('setBalance', address, amount);
    }

    private call(method: keyof typeof this.methods, ...args: any[]) {
        let meta = this.methods[method];
        if (meta?.call == null) {
            throw new Error(`RPC method for ${method} is not configured in ${this.client.platform}`);
        }
        return this.client.pool.call(web3 => {
            let eth = web3.eth as (typeof web3.eth & { [key in typeof method]: Function });
            if (eth[method] == null) {
                web3.eth.extend({
                    methods: [
                        {
                            name: method,
                            call: meta.call,
                            params: meta.params,
                        }
                    ]
                });
            }
            return eth[method](...args);
        })
    }
}
