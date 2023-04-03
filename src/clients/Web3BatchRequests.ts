import alot from 'alot';
import Web3 from 'web3';
import type { AbiItem } from 'web3-utils';
import { TAddress } from '@dequanto/models/TAddress';
import { class_Dfr } from 'atma-utils';
import { $web3Provider } from './utils/$web3Provider';
import { $logger, l } from '@dequanto/utils/$logger';
import { $web3Abi } from './utils/$web3Abi';
import { $date } from '@dequanto/utils/$date';
import { RateLimitGuard } from './handlers/RateLimitGuard';

export namespace Web3BatchRequests {

    export interface IContractRequest {
        address: TAddress;
        abi: string | AbiItem | AbiItem[];
        method: string;
        arguments?: any[];
        options?: {
            from?: TAddress;
        };
        blockNumber?: number;
    }
    export type IRequestBuilder = (cb?: Function) => IRPCRequest;

    export interface IRPCRequest {
        method: string;
        params: any;
        callback: Function;
    }

    export function contractRequest(web3: Web3, request: IContractRequest, onComplete: Function) {
        let { contract, method, params, callArgs } = prepair(web3, request);
        return contract.methods[method](...params).call.request(...callArgs, onComplete);
    }


    export function call(web3: Web3, request: IContractRequest) {
        let { contract, method, params, callArgs } = prepair(web3, request);
        return contract.methods[method](...params).call(...callArgs);
    }

    export class BatchRequest<TReturnItem = any> {
        private promise = new class_Dfr();
        private results = new Array(this.requests.length) as { error?: Error; result?: any; }[];
        private awaitables: number;
        private cursor = -1;
        //-private wasCompleted = false;
        constructor(private web3: Web3, private requests: (IContractRequest | IRequestBuilder)[]) {
        }

        async execute(): Promise<{ result?: TReturnItem; error?: Error; }[]> {
            if (this.requests.length === 0) {
                return this.promise.resolve(this.results);
            }

            let web3 = this.web3;
            let batch = new web3.BatchRequest();
            let arr = this.requests.map((req, i) => {

                const cb = (err, result) => {
                    this.onCompletedOne(i, err, result);
                };
                if (typeof req === 'function') {
                    return req(cb);
                }
                return contractRequest(web3, req, cb);
            });

            arr.forEach(req => {
                if (req != null) {
                    batch.add(req);
                }
            });

            this.awaitables = this.requests.length;

            batch.execute();
            return this.promise;
        }

        private onCompletedOne(i: number, error: Error, result?) {
            this.results[i] = {
                error: error,
                result: result
            };

            if (--this.awaitables === 0) {
                this.onCompleted();
            }
        }
        private onCompleted() {
            let allErrored = this.results.every(x => x.error != null);
            if (allErrored) {
                let error = this.results[0]?.error;
                if (RateLimitGuard.isBatchLimit(error)) {
                    let num = RateLimitGuard.extractBatchLimitFromError(error);
                    if (num && num < this.requests.length) {
                        // if got the batch limit lower than current batch, throw to make the wClient to reread the batch limit, and the pool to retry
                        this.promise.reject(error);
                        return;
                    }
                }
                l`Web3BatchRequest failed for ${this.results.length} Batch with error "${ this.results[0]?.error?.message }". Fallback to single calls.`;
                this.results = new Array(this.requests.length);
                this.awaitables = this.requests.length;
                this.callByOne();
                return;
            }
            this.promise.resolve(this.results);
        }
        private async callByOne() {

            let index = -1;
            let started = Date.now();
            try {
                let results = await alot(this.requests)
                    .mapAsync(async (req, i) => {
                        let reqData = typeof req === 'function'
                            ? req()
                            : req;

                        let result = await $web3Provider.call(this.web3, reqData as any);
                        index++;

                        let avgTime = (Date.now() - started) / index;
                        let avgLeft = (this.requests.length - index) * avgTime;
                        let avgLeftFormatted = $date.formatTimespan(avgLeft);
                        $logger.throttled(`Web3BatchRequest: single call completed ${index}/${this.requests.length}. Approx left: ${ avgLeftFormatted }`);
                        return result;
                    })
                    .mapAsync(resp => ({ result: resp }))
                    .toArrayAsync({ threads: 1 });

                this.promise.resolve(results);

            } catch (error) {
                if (index > -1) {
                    l`BatchRequester when processing by one request errored after ${index + 1} requests`;
                }
                this.promise.reject(error);
            }
        }
    }

    function prepair(web3: Web3, request: IContractRequest) {
        let { address, method, abi: abiMix, options, blockNumber, arguments: params } = request;
        let abi = $web3Abi.ensureAbis(abiMix);
        let contract = new web3.eth.Contract(abi, address);
        let callArgs = [];
        if (options != null) {
            callArgs[0] = options;
        }
        if (blockNumber != null) {
            callArgs[0] = null;
            callArgs[1] = blockNumber;
        }
        return { contract, method, params, callArgs };
    }
}
