import type { TAbiItem } from '@dequanto/types/TAbi';
import { TAddress } from '@dequanto/models/TAddress';
import { $web3Abi } from './utils/$web3Abi';
import { Rpc } from '@dequanto/rpc/Rpc';
import { TEth } from '@dequanto/models/TEth';
import { TRpc } from '@dequanto/rpc/RpcBase';

export namespace Web3BatchRequests {


    export type IRpcRequest = {
        address: TAddress;
        method: string;
        arguments?: any[];
    }

    export type IRequestBuilder = (cb?: Function) => IRPCRequest;


    export interface IRPCRequest {
        method: string;
        params: any;
    }

    // export function contractRequest(web3: Web3, request: IContractRequest, onComplete: Function) {
    //     let { address, abi, method, params, callArgs } = prepare(request);
    //     return contract.methods[method](...params).call.request(...callArgs, onComplete);
    // }


    // export function call(web3: Web3, request: IContractRequest) {
    //     let { contract, method, params, callArgs } = prepare(web3, request);
    //     return contract.methods[method](...params).call(...callArgs);
    // }

    export class BatchRequest<TReturnItem = any> {

        constructor(private rpc: Rpc, private requests: TRpc.IRpcAction[]) {
        }

        async execute(): Promise<any[]> {
            if (this.requests.length === 0) {
                return [];
            }

            let rpc = this.rpc;
            let response = await rpc.batch(this.requests);
           return response;
        }


        // private onCompleted() {
        //     let allErrored = this.results.every(x => x.error != null);
        //     if (allErrored) {
        //         let error = this.results[0]?.error;
        //         if (RateLimitGuard.isBatchLimit(error)) {
        //             let num = RateLimitGuard.extractBatchLimitFromError(error);
        //             if (num && num < this.requests.length) {
        //                 // if got the batch limit lower than current batch, throw to make the wClient to reread the batch limit, and the pool to retry
        //                 this.promise.reject(error);
        //                 return;
        //             }
        //         }
        //         l`Web3BatchRequest failed for ${this.results.length} Batch with error "${ this.results[0]?.error?.message }". Fallback to single calls.`;
        //         this.results = new Array(this.requests.length);
        //         this.awaitables = this.requests.length;
        //         this.callByOne();
        //         return;
        //     }
        //     this.promise.resolve(this.results);
        // }
        // private async callByOne() {

        //     let index = -1;
        //     let started = Date.now();
        //     try {
        //         let results = await alot(this.requests)
        //             .mapAsync(async (req, i) => {
        //                 let reqData = typeof req === 'function'
        //                     ? req()
        //                     : req;

        //                 let result = await $web3Provider.call(this.rpc, reqData as any);
        //                 index++;

        //                 let avgTime = (Date.now() - started) / index;
        //                 let avgLeft = (this.requests.length - index) * avgTime;
        //                 let avgLeftFormatted = $date.formatTimespan(avgLeft);
        //                 $logger.throttled(`Web3BatchRequest: single call completed ${index}/${this.requests.length}. Approx left: ${ avgLeftFormatted }`);
        //                 return result;
        //             })
        //             .mapAsync(resp => ({ result: resp }))
        //             .toArrayAsync({ threads: 1 });

        //         this.promise.resolve(results);

        //     } catch (error) {
        //         if (index > -1) {
        //             l`BatchRequester when processing by one request errored after ${index + 1} requests`;
        //         }
        //         this.promise.reject(error);
        //     }
        // }
    }

    // function prepare(request: IContractRequest) {
    //     let { address, method, abi: abiMix, options, blockNumber, arguments: params } = request;
    //     let abi = $web3Abi.ensureAbis(abiMix);
    //     let callArgs = [];
    //     if (options != null) {
    //         callArgs[0] = options;
    //     }
    //     if (blockNumber != null) {
    //         callArgs[0] = null;
    //         callArgs[1] = blockNumber;
    //     }
    //     return { address, abi, method, params, callArgs };
    // }
}
