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
exports.ClientPool = void 0;
const alot_1 = __importDefault(require("alot"));
const memd_1 = __importDefault(require("memd"));
const web3_1 = __importDefault(require("web3"));
const _date_1 = require("@dequanto/utils/$date");
const _number_1 = require("@dequanto/utils/$number");
const PromiEventWrap_1 = require("./model/PromiEventWrap");
const ClientStatus_1 = require("./model/ClientStatus");
const ClientPoolStats_1 = require("./ClientPoolStats");
const atma_utils_1 = require("atma-utils");
const ClientEventsStream_1 = require("./ClientEventsStream");
const ClientErrorUtil_1 = require("./utils/ClientErrorUtil");
const _fn_1 = require("@dequanto/utils/$fn");
class ClientPool {
    constructor(config) {
        this.config = config;
        this.discoveredPartial = false;
        this.discoveredFull = false;
        this.clients = this.config.map(cfg => new WClient(cfg));
        if (this.clients.length < 2) {
            this.discoveredPartial = true;
            this.discoveredFull = true;
        }
    }
    callSync(fn) {
        let arr = this.clients.filter(x => x.status === 'ok');
        let wClient = arr[_number_1.$number.randomInt(0, arr.length)];
        let { status, result } = wClient.callSync(fn);
        if (status == ClientStatus_1.ClientStatus.Ok) {
            return result;
        }
        throw result;
    }
    async call(fn, opts) {
        let used = new Map();
        let errors = [];
        while (true) {
            let wClient = await this.next(used, opts);
            if (wClient == null) {
                let error = errors.pop();
                if (error == null) {
                    let urls = this
                        .clients
                        .map(x => `    ${x.config.url}`)
                        .join('\n');
                    error = new Error(`Live clients not found in \n${urls}`);
                }
                throw ClientPoolStats_1.ClientPoolTraceError.create(error, opts?.trace);
            }
            let { status, result, error, time } = await wClient.call(fn);
            opts
                ?.trace
                ?.onComplete({ status, error, time, url: wClient.config.url });
            used.set(wClient, 1);
            errors.push(error ?? result);
            if (status == ClientStatus_1.ClientStatus.Ok) {
                return result;
            }
            if (status === ClientStatus_1.ClientStatus.CallError) {
                let error = ClientPoolStats_1.ClientPoolTraceError.create(errors.pop(), opts?.trace);
                //console.log(`Errored ${error.message}`);
                throw error;
                return result;
            }
        }
    }
    async getWeb3(options) {
        let wClient = await this.next(null, options);
        if (wClient == null) {
            throw new Error(`Not client found in ${this.clients.length} Clients`);
        }
        return wClient?.web3;
    }
    async getNodeURL(options) {
        let wClient = await this.next(null, options);
        if (wClient == null) {
            throw new Error(`Not client found in ${this.clients.length} Clients`);
        }
        return wClient?.config.url;
    }
    async releaseWeb3() {
    }
    callPromiEvent(fn, opts, used = new Map(), errors = [], root) {
        root = root ?? new PromiEventWrap_1.PromiEventWrap();
        (async () => {
            let wClient = await this.next(used, opts);
            if (wClient == null) {
                if (opts?.silent) {
                    return root;
                }
                setTimeout(() => {
                    let urls = this
                        .clients
                        .map(x => `    ${x.config.url}`)
                        .join('\n');
                    let error = new Error(`Live clients not found in \n${urls}`);
                    root.emit('error', error);
                    root.reject(error);
                });
                return root;
            }
            let promiEvent = wClient.callPromiEvent(fn);
            root.bind(promiEvent);
            promiEvent.on('error', async (error) => {
                console.log('!!client ERROR', error);
                error.message += ` (RPC: ${wClient.config.url})`;
                if (ClientErrorUtil_1.ClientErrorUtil.isConnectionFailed(error)) {
                    this.callPromiEvent(fn, opts, used, errors, root);
                    return;
                }
                if (ClientErrorUtil_1.ClientErrorUtil.isAlreadyKnown(error)) {
                    console.log(`TxWriter ERROR ${error.message}. Check pending...`);
                    let web3 = await this.getWeb3();
                    let txs = await web3.eth.getPendingTransactions();
                    console.log('PENDING ', txs?.map(x => x.hash));
                    // throw anyways
                    // this.callPromiEvent(
                    //     fn, opts, used, errors, root
                    // );
                    // return;
                }
                root.emit('error', error);
                root.reject(error);
            });
            promiEvent.catch(error => {
                console.log('!!client CATCH', error);
                //root.reject(error);
            });
            used.set(wClient, 1);
            if (typeof opts?.parallel === 'number') {
                while (--opts.parallel > 0) {
                    this.callPromiEvent(fn, {
                        ...opts,
                        distinct: true,
                        parallel: null,
                        silent: true
                    }, used, errors, root);
                }
            }
        })();
        return root;
    }
    getEventStream(address, abi, event) {
        if (this.ws == null) {
            this.ws = this.clients.find(x => x.config.url.startsWith('ws'));
        }
        let stream = this.ws.getEventStream(address, abi, event);
        return stream;
    }
    getNodeStats() {
        return this
            .clients
            .filter(client => client.getRequestCount() > 0)
            .map(client => {
            return {
                url: client.config.url,
                ...client.requests
            };
        });
    }
    async getNodeInfos() {
        let nodes = await (0, alot_1.default)(this.clients).mapAsync(async (wClient, idx) => {
            let url = wClient.config.url;
            try {
                let start = Date.now();
                let [syncing, blockNumber, peers] = await Promise.all([
                    wClient.eth.isSyncing(),
                    wClient.eth.getBlockNumber(),
                    /** @TODO Public nodes smt. do not allow net_peerCount methods. Allow to switch this on/off on node-url-config level */
                    wClient.eth.net.getPeerCount(),
                ]);
                let ping = Math.round((Date.now() - start) / 3);
                let syncData = typeof syncing === 'boolean' ? null : syncing;
                return {
                    url: url,
                    status: 'live',
                    syncing: syncData,
                    blockNumber: blockNumber,
                    blockNumberBehind: 0,
                    peers: peers,
                    pingMs: ping,
                    i: idx,
                };
            }
            catch (error) {
                return {
                    url,
                    status: 'error',
                    error: error,
                    peers: 0,
                    i: idx,
                };
            }
        }).toArrayAsync();
        let max = (0, alot_1.default)(nodes).max(x => x.syncing?.highestBlock ?? x.syncing?.HighestBlock ?? x.blockNumber);
        nodes.forEach(node => {
            node.blockNumberBehind = node.blockNumber - max;
        });
        return nodes;
    }
    // callSubscribtion <TResult> (
    //     event: any
    //     , cb: (error, result) => void
    //     , opts?: { preferSafe?: boolean }
    //     , used:  Map<WClient, number> = new  Map<WClient, number>()
    //     , errors = []
    //     , root?: PromiEventWrap
    // ) {
    //     root = root ?? new PromiEventWrap();
    //     let wClient = this.next(used);
    //     if (wClient == null) {
    //         setTimeout(() => {
    //             let error = new Error('Clients not found');
    //             root.emit('error', error);
    //             root.reject(error);
    //         });
    //         return root as any as TResult;
    //     }
    //     let promiEvent = wClient.callSubscription(fn);
    //     root.bind(promiEvent);
    //     promiEvent.on('error', error => {
    //         if (ErrorUtil.isConnectionFailed(error)) {
    //             this.callPromiEvent(
    //                 fn, opts, used, errors, root
    //             );
    //             return;
    //         }
    //         root.emit('error', error);
    //         root.reject(error);
    //     });
    //     used.set(wClient, 1);
    //     return root as any as TResult;
    // }
    async next(used, opts) {
        if (opts?.ws === true) {
            if (this.ws == null) {
                this.ws = this.clients.find(x => x.config.url.startsWith('ws'));
            }
            return this.ws;
        }
        if (opts?.ws === false) {
            return this.clients.find(x => x.config.url.startsWith('http'));
        }
        if (this.discoveredPartial === false) {
            await this.discoverLive().ready;
            this.discoveredPartial = true;
        }
        let clients = this.clients.filter(x => x.status === 'ok');
        let available = used == null
            ? clients
            : clients.filter(x => used.has(x) === false);
        if (available.length === 0) {
            if (this.discoveredFull === false) {
                await this.discoverLive().completed;
                this.discoveredFull = true;
                return this.next(used, opts);
            }
            return null;
        }
        let healthy = available.filter(x => x.healthy());
        if (opts?.preferSafe === true) {
            let safe = healthy.filter(x => x.config.safe === true);
            if (safe.length > 0) {
                healthy = safe;
            }
        }
        if (opts?.distinct === true) {
            let safe = healthy.filter(x => x.config.distinct === true);
            if (safe.length > 0) {
                healthy = safe;
            }
        }
        let arr = healthy.length > 0
            ? healthy
            : available;
        let i = _number_1.$number.randomInt(0, arr.length);
        let client = arr[i];
        return client;
    }
    /**
     * We may have tens of Nodes to communicate with. Discover LIVE and operating nodes.
     * Resolves when first 3 active nodes are discovered, to prevent waiting for all of them.
     * @returns
     * - Ready Promise - in case 3 clients look good
     * - Complete Promise - when all clients are resolved
     */
    discoverLive() {
        this.clients.forEach(x => x.status = 'ping');
        let ready = new atma_utils_1.class_Dfr();
        let completed = new atma_utils_1.class_Dfr();
        let clientInfos = [];
        let isReady = false;
        let isCompleted = false;
        let clients = this.clients;
        (async () => {
            let nodeInfosAsync = clients.map(async (wClient, idx) => {
                try {
                    let clientInfo = {
                        i: idx,
                        error: null,
                        status: null,
                        blockNumberBehind: 0,
                        blockNumber: await _fn_1.$fn.timeoutPromise(wClient.eth.getBlockNumber(), 20000)
                    };
                    onIntermediateSuccess(clientInfo);
                    return clientInfo;
                }
                catch (error) {
                    return {
                        i: idx,
                        error: error,
                        status: 'off',
                        blockNumberBehind: 0,
                        blockNumber: 0
                    };
                }
            });
            let nodeInfos = await Promise.all(nodeInfosAsync);
            let hasLive = nodeInfos.some(x => x.status === 'ok');
            if (hasLive === false) {
                let messages = nodeInfos.map(x => {
                    let url = clients[x.i]?.config.url;
                    let message = x.error?.message;
                    return `  ${url}: ${message}`;
                }).join('\n');
                let fullMessage = `No live nodes found: \n ${messages}`;
                let error = new Error(fullMessage);
                completed.reject(error);
                ready.reject(error);
                return;
            }
            const blockLatest = (0, alot_1.default)(nodeInfos).max(x => x.blockNumber);
            nodeInfos.forEach(node => {
                node.blockNumberBehind = node.blockNumber - blockLatest;
            });
            nodeInfos.forEach(info => {
                this.clients[info.i].status = isOk(info);
            });
            isCompleted = true;
            completed.resolve();
            if (isReady !== true) {
                isReady = true;
                ready.resolve();
            }
        })();
        function isOk(info) {
            if (info.error) {
                return 'off';
            }
            if (isNaN(info.blockNumber) || info.blockNumberBehind < -200) {
                return 'off';
            }
            return 'ok';
        }
        function onIntermediateSuccess(info) {
            const TOLERATE_BLOCK_COUNT = 5;
            const WAIT_POOL_OK = Math.min(3, clientInfos.length);
            if (isReady === true) {
                return;
            }
            if (clientInfos.push(info) < WAIT_POOL_OK) {
                return;
            }
            let maxBlockNumber = (0, alot_1.default)(clientInfos).max(x => x.blockNumber);
            let ok = [];
            for (let info of clientInfos) {
                let diff = Math.abs(info.blockNumber - maxBlockNumber);
                if (diff <= TOLERATE_BLOCK_COUNT) {
                    ok.push(info);
                }
            }
            if (ok.length >= WAIT_POOL_OK) {
                ok.forEach(info => {
                    clients[info.i].status = 'ok';
                });
                isReady = true;
                ready.resolve();
            }
        }
        return { ready, completed };
    }
}
__decorate([
    memd_1.default.deco.memoize({ perInstance: true })
], ClientPool.prototype, "discoverLive", null);
exports.ClientPool = ClientPool;
class WClient {
    constructor(config) {
        this.config = config;
        this.lastStatus = 0;
        this.lastDate = new Date(2000);
        this.status = 'ok';
        this.requests = {
            success: 0,
            fail: 0,
            ping: 0
        };
        this.web3 = new web3_1.default(config.url);
        this.web3.eth.handleRevert = true;
        this.eth = this.web3.eth;
    }
    healthy() {
        if (this.getRequestCount() === 0) {
            return true;
        }
        if (this.requests.fail === 0) {
            return true;
        }
        let health = this.requests.fail / this.getRequestCount();
        if (health > .5) {
            return true;
        }
        if (Date.now() - this.lastDate.getTime() > _date_1.$date.parseTimespan('10m')) {
            return true;
        }
        return false;
    }
    async send(fn) {
        return new Promise((resolve, reject) => {
            let result = fn(this.web3);
            result.then(_ => {
                this.lastStatus = ClientStatus_1.ClientStatus.Ok;
                this.requests.success++;
                resolve({ status: ClientStatus_1.ClientStatus.Ok, result });
            }, error => {
                if (ClientErrorUtil_1.ClientErrorUtil.isConnectionFailed(error)) {
                    this.lastStatus = ClientStatus_1.ClientStatus.NetworkError;
                    this.requests.fail++;
                    resolve({ status: ClientStatus_1.ClientStatus.NetworkError, error });
                }
                return resolve({ status: ClientStatus_1.ClientStatus.CallError, result: error });
            });
        });
    }
    // async call <TResult> (fn: (web3: Web3) => Promise<TResult> ): Promise<{ status: number, result?: TResult }> {
    //     try {
    //         let result = await fn(this.web3);
    //         this.lastStatus = Status.Ok;
    //         this.requests.success++;
    //         return { status: Status.Ok, result };
    //     } catch (error) {
    //         console.log(error);
    //         if (this.isConnectionFailed (error)) {
    //             this.lastStatus = Status.NetworkError;
    //             this.requests.fail++;
    //             return { status: Status.NetworkError, result: error };
    //         }
    //         return { status: Status.CallError, result: error }
    //     }
    // }
    async call(fn) {
        return new Promise((resolve, reject) => {
            let start = Date.now();
            let result = fn(this.web3);
            result.then(_ => {
                let time = Date.now() - start;
                let status = ClientStatus_1.ClientStatus.Ok;
                this.onComplete(status, time);
                resolve({ status, result, time });
            }, error => {
                let time = Date.now() - start;
                let status = ClientStatus_1.ClientStatus.CallError;
                if (ClientErrorUtil_1.ClientErrorUtil.isConnectionFailed(error)) {
                    status = ClientStatus_1.ClientStatus.NetworkError;
                }
                this.onComplete(status, time);
                resolve({ status, error, time });
            });
        });
    }
    callPromiEvent(fn) {
        let result = fn(this.web3);
        result.on('error', error => {
            if (ClientErrorUtil_1.ClientErrorUtil.isConnectionFailed(error)) {
                this.lastStatus = ClientStatus_1.ClientStatus.NetworkError;
                this.requests.fail++;
            }
        });
        result.on('transactionHash', hash => {
            this.lastStatus = ClientStatus_1.ClientStatus.Ok;
            this.requests.success++;
        });
        return result;
    }
    callSubscription(fn) {
        let result = fn(this.web3);
        result.on('error', error => {
            if (ClientErrorUtil_1.ClientErrorUtil.isConnectionFailed(error)) {
                this.lastStatus = ClientStatus_1.ClientStatus.NetworkError;
                this.requests.fail++;
            }
        });
        result.on('transactionHash', hash => {
            this.lastStatus = ClientStatus_1.ClientStatus.Ok;
            this.requests.success++;
        });
        return result;
    }
    getEventStream(address, abi, event, options = {}) {
        let eventAbi = abi.find(x => x.type === 'event' && x.name === event);
        if (eventAbi == null) {
            let events = abi.filter(x => x.type === 'event').map(x => x.name).join(', ');
            throw new Error(`Event "${event}" not present in ABI. Events: ${events}`);
        }
        const contract = new this.eth.Contract(abi, address);
        const stream = contract
            .events[event](options);
        const worker = new ClientEventsStream_1.ClientEventsStream(contract, eventAbi, stream);
        return worker;
    }
    callSync(fn) {
        try {
            let result = fn(this.web3);
            return { status: ClientStatus_1.ClientStatus.Ok, result };
        }
        catch (error) {
            return { status: ClientStatus_1.ClientStatus.CallError, result: error };
        }
    }
    onComplete(status, timeMs) {
        let callCount = this.getRequestCount();
        let ping = this.requests.ping;
        this.lastStatus = status;
        switch (status) {
            case ClientStatus_1.ClientStatus.Ok:
                this.requests.success++;
                break;
            default:
                this.requests.fail++;
                break;
        }
        this.requests.ping = (ping * callCount + timeMs) / (callCount + 1);
    }
    getRequestCount() {
        return this.requests.success + this.requests.fail;
    }
}
