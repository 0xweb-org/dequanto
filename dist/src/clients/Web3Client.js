"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Client = void 0;
const a_di_1 = __importDefault(require("a-di"));
const memd_1 = __importDefault(require("memd"));
const ethers_1 = require("ethers");
const ClientPool_1 = require("./ClientPool");
const ClientPoolStats_1 = require("./ClientPoolStats");
const BlockDateResolver_1 = require("@dequanto/blocks/BlockDateResolver");
const _number_1 = require("@dequanto/utils/$number");
const _txData_1 = require("@dequanto/utils/$txData");
const _logger_1 = require("@dequanto/utils/$logger");
const atma_utils_1 = require("atma-utils");
const _promise_1 = require("@dequanto/utils/$promise");
const ClientEventsStream_1 = require("./ClientEventsStream");
const _abiUtils_1 = require("@dequanto/utils/$abiUtils");
const ClientDebugMethods_1 = require("./debug/ClientDebugMethods");
class Web3Client {
    constructor(mix) {
        this.TIMEOUT = 3 * 60 * 1000;
        this.defaultTxType = 2;
        if (Array.isArray(mix)) {
            this.options = { endpoints: mix };
        }
        else if (mix != null) {
            this.options = mix;
        }
        if (this.options.endpoints == null && this.options.web3 == null) {
            console.dir(this.options, { depth: null });
            throw new Error(`Neither Node endpoints nor web3 instance provided`);
        }
        this.pool = new ClientPool_1.ClientPool(this.options);
        this.debug = new ClientDebugMethods_1.ClientDebugMethods(this, this.options.debug);
    }
    async sign(txData, privateKey) {
        let wallet = new ethers_1.Wallet(privateKey);
        let json = _txData_1.$txData.getJson(txData, this);
        let tx = await wallet.signTransaction(json);
        return tx;
    }
    getEventStream(address, abi, event) {
        let eventAbi = abi.find(x => x.type === 'event' && x.name === event);
        if (eventAbi == null) {
            let events = abi.filter(x => x.type === 'event').map(x => x.name).join(', ');
            throw new Error(`Event "${event}" not present in ABI. Events: ${events}`);
        }
        let stream = new ClientEventsStream_1.ClientEventsStream(address, eventAbi);
        this
            .subscribe('logs', {
            address: address,
            fromBlock: 'latest',
            topics: [
                _abiUtils_1.$abiUtils.getMethodHash(eventAbi)
            ]
        })
            .then(subscription => {
            stream.fromSubscription(subscription);
        }, error => {
            stream.error(error);
        });
        return stream;
    }
    with(fn) {
        return this.pool.call(fn);
    }
    withSync(fn) {
        return this.pool.callSync(fn);
    }
    async getWeb3(options) {
        return await this.pool.getWeb3(options);
    }
    async getNodeURL(options) {
        return await this.pool.getNodeURL(options);
    }
    async subscribe(...args) {
        let web3 = await this.getWeb3({ ws: true });
        let provider = web3.eth.currentProvider;
        if (provider.connected === false) {
            provider.connect();
            await _promise_1.$promise.waitForTrue(() => provider.connected, {
                intervalMs: 200,
                timeoutMessage: `Can not connect to ${provider.url}`,
                timeoutMs: 20000
            });
        }
        return web3.eth.subscribe(...args);
    }
    readContract(data) {
        let { address, method, abi, options, blockNumber, arguments: params } = data;
        return this.pool.call(async (web3) => {
            let contract = new web3.eth.Contract(abi, address);
            let callArgs = [];
            if (options != null) {
                callArgs[0] = options;
            }
            if (blockNumber != null) {
                callArgs[0] = null;
                callArgs[1] = blockNumber;
            }
            let result = await contract.methods[method](...params).call(...callArgs);
            return result;
        }, {
            trace: ClientPoolStats_1.ClientPoolTrace.createContractCall(address, method, params)
        });
    }
    readContractBatch(requests) {
        let trace = new ClientPoolStats_1.ClientPoolTrace();
        trace.action = `Batch requests: ${requests.map(x => x.address)}`;
        return this.pool.call(async (web3) => {
            let batch = new Web3BatchRequests.BatchRequest(web3, requests);
            return batch.execute();
        }, {
            trace
        });
    }
    encodeParameters(types, paramaters) {
        return this.pool.callSync(web3 => {
            return web3.eth.abi.encodeParameters(types, paramaters);
        });
    }
    getBalance(address, blockNumber) {
        return this.pool.call(async (web3) => {
            let weiStr = await web3.eth.getBalance(address, blockNumber);
            return BigInt(weiStr);
        });
    }
    getBalances(addresses, blockNumber) {
        return this.pool.call(async (web3) => {
            let reqs = addresses.map(address => cb => web3.eth.getBalance.request(address, blockNumber, cb));
            let batch = new Web3BatchRequests.BatchRequest(web3, reqs);
            let weiStrings = await batch.execute();
            return weiStrings.map(weiStr => BigInt(weiStr));
        });
    }
    getTransactionCount(address, type) {
        return this.pool.call(web3 => {
            return web3.eth.getTransactionCount(address, type);
        });
    }
    isSyncing() {
        return this.pool.call(web3 => {
            return web3.eth.isSyncing();
        });
    }
    getTransaction(txHash, opts) {
        return this.pool.call(web3 => {
            return web3.eth.getTransaction(txHash);
        }, opts);
    }
    getTransactions(hashes, opts) {
        return this.pool.call(web3 => {
            let reqs = hashes.map(hash => cb => web3.eth.getTransaction.request(hash, cb));
            let batch = new Web3BatchRequests.BatchRequest(web3, reqs);
            return batch.execute();
        }, opts);
    }
    getTransactionReceipt(txHash) {
        return this.pool.call(web3 => {
            return web3.eth.getTransactionReceipt(txHash);
        });
    }
    getTransactionReceipts(hashes) {
        return this.pool.call(web3 => {
            let reqs = hashes.map(hash => cb => web3.eth.getTransactionReceipt.request(hash, cb));
            let batch = new Web3BatchRequests.BatchRequest(web3, reqs);
            return batch.execute();
        });
    }
    getTransactionTrace(hash) {
        return this.pool.call(async (web3) => {
            let eth = web3.eth;
            if (typeof eth.traceTransaction !== 'function') {
                web3.eth.extend({
                    methods: [
                        {
                            name: 'traceTransaction',
                            call: 'debug_traceTransaction',
                            params: 1,
                        }
                    ]
                });
            }
            let result = await eth.traceTransaction(hash);
            return result;
        }, {
            node: {
                traceable: true
            }
        });
    }
    getBlock(nr) {
        return this.pool.call(web3 => {
            return web3.eth.getBlock(nr);
        });
    }
    getBlocks(nrs) {
        return this.pool.call(web3 => {
            let reqs = nrs.map(nr => cb => web3.eth.getBlock.request(nr, cb));
            let batch = new Web3BatchRequests.BatchRequest(web3, reqs);
            return batch.execute();
        });
    }
    getPendingTransactions() {
        return this.pool.call(web3 => {
            return web3.eth.getPendingTransactions();
        });
    }
    getPoolStatus() {
        return this.pool.call(async (web3) => {
            let eth = web3.eth;
            if (eth.txpool == null) {
                eth.extend({
                    property: 'txpool',
                    methods: [{
                            name: 'content',
                            call: 'txpool_content'
                        }, {
                            name: 'inspect',
                            call: 'txpool_inspect'
                        }, {
                            name: 'status',
                            call: 'txpool_status'
                        }]
                });
            }
            let status = await eth.txpool.status();
            return {
                baseFee: BigInt(status.baseFee),
                pending: Number(status.pending),
                queued: Number(status.queued),
            };
        });
    }
    getStorageAt(address, position, blockNumber) {
        return this.pool.call(web3 => {
            return web3.eth.getStorageAt(address, position, blockNumber);
        });
    }
    getGasPrice() {
        return this.pool.call(web3 => {
            return web3.eth.getGasPrice().then(x => {
                return {
                    price: BigInt(x)
                };
            });
        });
    }
    getGasEstimation(from, tx) {
        return this.pool.call(async (web3) => {
            let txData = {
                from: from,
                to: tx.to,
                value: tx.value,
                data: tx.data,
                nonce: tx.nonce,
            };
            let gasAmount = await web3.eth.estimateGas(txData);
            return gasAmount;
        });
    }
    async getAccounts(options) {
        let web3 = await this.getWeb3(options);
        return web3.eth.getAccounts();
    }
    async getChainId(options) {
        let web3 = await this.getWeb3(options);
        return web3.eth.getChainId();
    }
    async switchChain(params, options) {
        let web3 = await this.getWeb3(options);
        if (typeof web3.eth.currentProvider.request !== 'function') {
            throw new Error(`Current provider doesn't have request method`);
        }
        return web3.eth.currentProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: _number_1.$number.toHex(params.chainId) }],
        });
    }
    sendSignedTransaction(signedTxBuffer) {
        return this.pool.callPromiEvent(web3 => {
            return web3.eth.sendSignedTransaction(signedTxBuffer);
        }, { preferSafe: true, distinct: true });
    }
    sendTransaction(data) {
        return this.pool.callPromiEvent(web3 => {
            return web3.eth.sendTransaction(data);
        }, { preferSafe: true, distinct: true });
    }
    getBlockNumber() {
        return this.pool.call(web3 => {
            return web3.eth.getBlockNumber();
        });
    }
    getBlockNumberCached() {
        return this.pool.call(web3 => {
            return web3.eth.getBlockNumber();
        });
    }
    async getPastLogs(options) {
        const getBlock = async (block, $default) => {
            if (block == null) {
                return $default;
            }
            if (block instanceof Date) {
                let resolver = a_di_1.default.resolve(BlockDateResolver_1.BlockDateResolver, this);
                return resolver.getBlockNumberFor(block);
            }
            return block;
        };
        const getBlockNumber = async (block) => {
            if (typeof block === 'number') {
                return block;
            }
            if (block == null || block === 'latest') {
                return this.getBlockNumber();
            }
            if (block.startsWith('0x')) {
                return Number(block);
            }
            throw new Error(`Invalid block number`);
        };
        options.fromBlock = await getBlock(options.fromBlock, 0);
        options.toBlock = await getBlock(options.toBlock, 'latest');
        options.topics = options.topics?.map(topic => {
            if (typeof topic === 'string' && topic.startsWith('0x')) {
                return '0x' + topic.substring(2).padStart(64, '0');
            }
            return topic;
        });
        let MAX = this.pool.getOptionForFetchableRange();
        let [fromBlock, toBlock] = await Promise.all([
            getBlockNumber(options.fromBlock),
            getBlockNumber(options.toBlock),
        ]);
        return await RangeWorker.fetchWithLimits(this, options, {
            maxBlockRange: MAX,
            maxResultCount: null,
        }, {
            fromBlock,
            toBlock
        });
    }
    getNodeInfos() {
        return this.pool.getNodeInfos();
    }
    getNodeStats() {
        return this.pool.getNodeStats();
    }
    static url(mix, opts) {
        const Ctor = this;
        let options;
        if (typeof mix === 'string') {
            options = { endpoints: [{ url: mix }] };
        }
        else if (Array.isArray(mix)) {
            options = { endpoints: mix };
        }
        else {
            options = mix;
        }
        const param = {
            ...options,
            ...(opts ?? {})
        };
        return new Ctor(param);
    }
}
__decorate([
    memd_1.default.deco.memoize({ maxAge: 30 })
], Web3Client.prototype, "getBlockNumberCached", null);
exports.Web3Client = Web3Client;
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
            this.awaitables = this.requests.length;
        }
        async execute() {
            if (this.requests.length === 0) {
                return this.promise.resolve(this.results);
            }
            let web3 = this.web3;
            let batch = new web3.BatchRequest();
            let arr = this.requests.map((req, i) => {
                const cb = (err, result) => {
                    this.onCompleted(i, err, result);
                };
                if (typeof req === 'function') {
                    return req(cb);
                }
                return contractRequest(web3, req, cb);
            });
            arr.forEach(req => {
                batch.add(req);
            });
            batch.execute();
            return this.promise;
        }
        onCompleted(i, error, result) {
            this.results[i] = result ?? error;
            if (--this.awaitables === 0) {
                this.promise.resolve(this.results);
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
})(Web3BatchRequests || (Web3BatchRequests = {}));
var RangeWorker;
(function (RangeWorker) {
    async function fetchWithLimits(client, options, limits, ranges) {
        let { fromBlock, toBlock } = ranges;
        let { maxBlockRange } = limits;
        let range = toBlock - fromBlock;
        if (maxBlockRange == null || range <= maxBlockRange) {
            return fetch(client, options, ranges, limits);
        }
        let logs = [];
        let cursor = fromBlock;
        let pages = Math.ceil(range / maxBlockRange);
        let page = 0;
        let complete = false;
        while (complete === false) {
            ++page;
            let end = cursor + maxBlockRange;
            if (end > toBlock) {
                end = options.toBlock;
                complete = true;
            }
            _logger_1.$logger.log(`Get past logs paged: ${page}/${pages} (Block start: ${cursor}). Loaded ${logs.length}`);
            let paged = await fetch(client, options, {
                fromBlock: cursor,
                toBlock: end ?? undefined,
            }, limits);
            logs.push(...paged);
            cursor += maxBlockRange + 1;
        }
        return logs;
    }
    RangeWorker.fetchWithLimits = fetchWithLimits;
    ;
    async function fetch(client, options, range, knownLimits) {
        try {
            let paged = await client.pool.call(web3 => web3.eth.getPastLogs({
                ...options,
                fromBlock: range.fromBlock,
                toBlock: range.toBlock ?? undefined,
            }));
            return paged;
        }
        catch (error) {
            /**
             * query returned more than 10000 results
             */
            _logger_1.$logger.log(`Range worker request: ${range.fromBlock}-${range.toBlock}. ${error.message.trim()}. Splitting range.`);
            let matchCountLimit = /(?<count>\d+) results/.exec(error.message);
            if (matchCountLimit) {
                let count = Number(matchCountLimit.groups.count);
                let half = Math.floor((range.toBlock - range.fromBlock) / 2);
                let rangeA = {
                    fromBlock: range.fromBlock,
                    toBlock: range.fromBlock + half
                };
                let arr1 = await fetchWithLimits(client, options, {
                    ...knownLimits,
                    maxResultCount: count
                }, rangeA);
                let rangeB = {
                    fromBlock: range.fromBlock + half,
                    toBlock: range.toBlock
                };
                let arr2 = await fetchWithLimits(client, options, {
                    ...knownLimits,
                    maxResultCount: count
                }, rangeB);
                return [...(arr1 ?? []), ...(arr2 ?? [])];
            }
            let maxRangeMatch = /\b(?<maxRange>\d+)\b/.exec(error.message);
            if (maxRangeMatch && knownLimits.maxBlockRange == null) {
                // handle unknown range, otherwise throw
                let rangeLimit = Number(maxRangeMatch.groups.maxRange);
                return await fetchWithLimits(client, options, {
                    ...knownLimits,
                    maxBlockRange: rangeLimit
                }, range);
            }
            throw error;
        }
    }
})(RangeWorker || (RangeWorker = {}));
