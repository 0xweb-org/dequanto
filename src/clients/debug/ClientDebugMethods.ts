import { $bytecode } from '@dequanto/evm/utils/$bytecode';
import type { IWeb3ClientOptions } from '../interfaces/IWeb3Client';
import type { Web3Client } from '../Web3Client';
import { TAddress } from '@dequanto/models/TAddress'
import { $bigint } from '@dequanto/utils/$bigint';
import { $hex } from '@dequanto/utils/$hex';
import { TEth } from '@dequanto/models/TEth';
import { $array } from '@dequanto/utils/$array';
import { $date } from '@dequanto/utils/$date';


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

    /**
     * Mines a specified number of blocks at a given interval
     * @param blocks Number of blocks or amount of seconds parsed from a timespan, e.g. 1day, 5minutes, 3weeks, etc
     * @param intervalSeconds Default: 1 block in 1 second
     */
    mine (blocks?: number | bigint | string, intervalSeconds?: number | bigint) {
        if (typeof blocks ==='string') {
            blocks = $date.parseTimespan(blocks, { get: 's' });
        }
        let args = $array.trimEnd([ blocks, intervalSeconds ]);
        return this.call('mine', ...args);
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

    snapshot (): Promise<number> {
        return this.call('snapshot');
    }

    revert (snapId: number) {
        return this.call('revert', snapId);
    }

    setAutomine (enabled: boolean) {
        return this.call('autoMine', enabled);
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
