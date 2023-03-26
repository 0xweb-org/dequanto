"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3BatchRequests = void 0;
const alot_1 = __importDefault(require("alot"));
const atma_utils_1 = require("atma-utils");
const _web3Provider_1 = require("./utils/$web3Provider");
const _logger_1 = require("@dequanto/utils/$logger");
var Web3BatchRequests;
(function (Web3BatchRequests) {
    function contractRequest(web3, request, onComplete) {
        let { contract, method, params, callArgs } = prepair(web3, request);
        return contract.methods[method](...params).call.request(...callArgs, onComplete);
    }
    Web3BatchRequests.contractRequest = contractRequest;
    function call(web3, request) {
        let { contract, method, params, callArgs } = prepair(web3, request);
        return contract.methods[method](...params).call(...callArgs);
    }
    Web3BatchRequests.call = call;
    class BatchRequest {
        //-private wasCompleted = false;
        constructor(web3, requests) {
            this.web3 = web3;
            this.requests = requests;
            this.promise = new atma_utils_1.class_Dfr();
            this.results = new Array(this.requests.length);
            this.cursor = -1;
        }
        async execute(startFromIdx = 0) {
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
        onCompletedOne(i, error, result) {
            this.results[i] = {
                error: error,
                result: result
            };
            if (--this.awaitables === 0) {
                this.onCompleted();
            }
        }
        onCompleted() {
            let allErrored = this.results.every(x => x.error != null);
            if (allErrored) {
                this.results = new Array(this.requests.length);
                this.awaitables = this.requests.length;
                this.callByOne();
                return;
            }
            this.promise.resolve(this.results);
        }
        async callByOne() {
            let index = -1;
            try {
                let results = await (0, alot_1.default)(this.requests)
                    .mapAsync(async (req) => {
                    let reqData = typeof req === 'function'
                        ? req()
                        : req;
                    let result = await _web3Provider_1.$web3Provider.call(this.web3, reqData);
                    index++;
                    return result;
                })
                    .mapAsync(resp => ({ result: resp }))
                    .toArrayAsync({ threads: 1 });
                this.promise.resolve(results);
            }
            catch (error) {
                if (index > -1) {
                    (0, _logger_1.l) `BatchRequester when processing by one request errored after ${index + 1} requests`;
                }
                this.promise.reject(error);
            }
        }
    }
    Web3BatchRequests.BatchRequest = BatchRequest;
    function prepair(web3, request) {
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
})(Web3BatchRequests = exports.Web3BatchRequests || (exports.Web3BatchRequests = {}));
