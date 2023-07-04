import { $bytecode } from '@dequanto/evm/utils/$bytecode';
import type { IWeb3ClientOptions } from '../interfaces/IWeb3Client';
import type { Web3Client } from '../Web3Client';
import { TAddress } from '@dequanto/models/TAddress'
import { TBufferLike } from '@dequanto/models/TBufferLike'
import { $bigint } from '@dequanto/utils/$bigint';
import { $hex } from '@dequanto/utils/$hex';


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

    setStorageAt (address: TAddress, location: string | number | bigint, buffer: string) {
        buffer = $hex.padBytes(buffer, 32);
        location = $hex.toHex(location);
        location = $hex.trimLeadingZerosFromNumber(location);
        return this.call('setStorageAt', address, location, buffer);
    }

    setCode (address: TAddress, buffer: string) {
        buffer = $bytecode.trimConstructorCode(buffer);
        return this.call('setCode', address, buffer);
    }

    setBalance (address: TAddress, amount: bigint | string) {
        if (typeof amount === 'bigint') {
            amount = $bigint.toHex(amount);
        }
        return this.call('setBalance', address, amount);
    }

    reset (params?: { forking?: { jsonRpcUrl?, blockNumber? }}) {
        return this.call('reset', params);
    }

    impersonateAccount (address: TAddress) {
        return this.call('impersonateAccount', address);
    }
    stopImpersonatingAccount () {
        return this.call('stopImpersonatingAccount');
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
