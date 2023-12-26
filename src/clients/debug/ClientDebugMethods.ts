import { $bytecode } from '@dequanto/evm/utils/$bytecode';
import type { IWeb3ClientOptions } from '../interfaces/IWeb3Client';
import type { Web3Client } from '../Web3Client';
import { TAddress } from '@dequanto/models/TAddress'
import { TBufferLike } from '@dequanto/models/TBufferLike'
import { $bigint } from '@dequanto/utils/$bigint';
import { $hex } from '@dequanto/utils/$hex';
import { TEth } from '@dequanto/models/TEth';


export class ClientDebugMethods {

    constructor (public client: Web3Client, public methods: IWeb3ClientOptions['debug'] ) {

    }

    getTransactionTrace (hash: string) {
        return this.client.pool.call(async web3 => {
            return web3.rpc.request({
                method: 'debug_traceTransaction',
                params: [ hash, { tracer: 'callTracer' }]
            });
        }, {
            node: {
                traceable: true
            }
        });
    }

    setStorageAt (address: TAddress, location: string | number | bigint, buffer: TEth.Hex) {
        buffer = $hex.padBytes(buffer, 32);
        location = $hex.toHex(location);
        location = $hex.trimLeadingZerosFromNumber(location);
        return this.call('setStorageAt', address, location, buffer);
    }

    setCode (address: TAddress, buffer: TEth.Hex) {
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
    stopImpersonatingAccount (address: TAddress) {
        return this.call('stopImpersonatingAccount', address);
    }

    private call(method: keyof typeof this.methods, ...args: any[]) {
        let meta = this.methods[method];
        if (meta?.call == null) {
            throw new Error(`RPC method for ${method} is not configured in ${this.client.platform}`);
        }
        return this.client.pool.call(web3 => {
            //let eth = web3.eth as (typeof web3.eth & { [key in typeof method]: Function });

            return web3.rpc.request({
                method: meta.call,
                params: args
            });
            // if (eth[method] == null) {
            //     web3.eth.extend({
            //         methods: [
            //             {
            //                 name: method,
            //                 call: meta.call,
            //                 params: meta.params,
            //             }
            //         ]
            //     });
            // }
            // return eth[method](...args);
        })
    }
}
