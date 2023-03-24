import alot from 'alot';
import Web3 from 'web3';
import { TAddress } from '@dequanto/models/TAddress';
import { class_Dfr } from 'atma-utils';
import { $web3Provider } from './utils/$web3Provider';
import { l } from '@dequanto/utils/$logger';

export namespace Web3BatchRequests {

    export interface IContractRequest {
        address: TAddress;
        abi: any;
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

        async execute(startFromIdx = 0): Promise<{ result?: TReturnItem; error?: Error; }[]> {
            if (this.requests.length === 0) {
                return this.promise.resolve(this.results);
            }

            let web3 = this.web3;
            let batch = new web3.BatchRequest();
            let arr = this.requests.map((req, i) => {
                if (i < startFromIdx) {
                    // skip request
                    return null;
                }

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

            this.awaitables = this.requests.length - startFromIdx;

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
                this.results = new Array(this.requests.length);
                this.awaitables = this.requests.length;
                this.callByOne();
                return;
            }
            this.promise.resolve(this.results);
        }
        private async callByOne() {

            let index = -1;
            try {
                let results = await alot(this.requests)
                    .mapAsync(async (req) => {
                        let reqData = typeof req === 'function'
                            ? req()
                            : req;


                        let result = await $web3Provider.call(this.web3, reqData as any);
                        index++;
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
        let { address, method, abi, options, blockNumber, arguments: params } = request;
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
