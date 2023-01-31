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
const ClientErrorUtil_1 = require("./utils/ClientErrorUtil");
const _logger_1 = require("@dequanto/utils/$logger");
const _promise_1 = require("@dequanto/utils/$promise");
class ClientPool {
    constructor(config) {
        this.discoveredPartial = false;
        this.discoveredFull = false;
        if (config.endpoints != null && config.endpoints.length > 0) {
            this.clients = config.endpoints.map(cfg => new WClient(cfg));
        }
        else if (config.web3 || config.provider) {
            this.clients = [new WClient({ web3: config.web3 ?? config.provider })];
        }
        else {
            console.dir(config, { depth: null });
            throw new Error(`Neither Node endpoints nor Web3 instance`);
        }
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
                throw error;
                return result;
            }
        }
    }
    async getWeb3(options) {
        let wClient = await this.next(null, options, { manual: true });
        if (wClient == null) {
            throw new Error(`No client found in ${this.clients.length} Clients with options: ${JSON.stringify(options)}`);
        }
        return wClient?.web3;
    }
    async getNodeURL(options) {
        let wClient = await this.next(null, options, { manual: true });
        if (wClient == null) {
            let stats = await this.getNodeStats();
            let info = stats.map(x => `    ${x.url}. ERR: ${x.fail}; OK: ${x.success}; Ping: ${x.ping}`).join('\n');
            let requirements = JSON.stringify(options);
            throw new Error(`No alive node for ${requirements} found. \n ${info}`);
        }
        return wClient?.config.url;
    }
    async releaseWeb3() {
    }
    getOptionForFetchableRange() {
        const DEFAULT = null;
        let max = (0, alot_1.default)(this.clients).max(x => x.config?.fetchableBlockRange ?? 0);
        if (max === 0) {
            return DEFAULT;
        }
        return max;
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
                error.message += ` (RPC: ${wClient.config.url})`;
                if (ClientErrorUtil_1.ClientErrorUtil.isConnectionFailed(error)) {
                    this.callPromiEvent(fn, opts, used, errors, root);
                    return;
                }
                if (ClientErrorUtil_1.ClientErrorUtil.isAlreadyKnown(error)) {
                    _logger_1.$logger.log(`TxWriter ERROR ${error.message}. Check pending...`);
                    let web3 = await this.getWeb3();
                    let txs = await web3.eth.getPendingTransactions();
                    _logger_1.$logger.log('PENDING ', txs?.map(x => x.hash));
                    // throw anyway
                }
                root.emit('error', error);
                root.reject(error);
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
    // getEventStream (address: TAddress, abi: AbiItem[], event: string) {
    //     if (this.ws == null) {
    //         this.ws = this.clients.find(x => x.config.url?.startsWith('ws'));
    //     }
    //     let stream = this.ws.getEventStream(address, abi, event);
    //     return stream;
    // }
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
        async function peerCount(wClient) {
            /** @TODO Public nodes smt. do not allow net_peerCount methods. Allow to switch this on/off on node-url-config level */
            try {
                return await wClient.eth.net.getPeerCount();
            }
            catch (error) {
                return `ERROR: ${error.message}`;
            }
        }
        let nodes = await (0, alot_1.default)(this.clients).mapAsync(async (wClient, idx) => {
            let url = wClient.config.url;
            try {
                let start = Date.now();
                let [syncing, blockNumber, peers, node] = await Promise.all([
                    wClient.eth.isSyncing(),
                    wClient.eth.getBlockNumber(),
                    peerCount(wClient),
                    wClient.eth.getNodeInfo(),
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
                    node: node,
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
    async next(used, opts, params) {
        let clients = this.clients;
        if (params?.manual !== true) {
            clients = clients.filter(x => x.config.manual !== true);
        }
        if (opts?.ws === true) {
            if (this.ws == null) {
                this.ws = clients.find(x => x.config.url?.startsWith('ws'));
            }
            if (this.ws == null) {
                this.ws = clients.find(x => x.config.web3 != null);
            }
            return this.ws;
        }
        if (opts?.ws === false) {
            clients = clients.filter(x => x.config.url?.startsWith('http'));
        }
        if (opts?.node?.traceable === true) {
            clients = clients.filter(x => x.config.traceable === true);
        }
        if (this.discoveredPartial === false) {
            await this.discoverLive().ready;
            this.discoveredPartial = true;
        }
        // we check OK clients first
        let okClients = clients.filter(x => x.status === 'ok');
        if (okClients.length === 0) {
            // then switch to at least not off
            let notOffClients = clients.filter(x => x.status !== 'off');
            if (notOffClients) {
                clients = notOffClients;
            }
        }
        else {
            clients = okClients;
        }
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
                        blockNumber: await _promise_1.$promise.timeout(wClient.eth.getBlockNumber(), 20000)
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
            nodeInfos.forEach(info => {
                info.blockNumberBehind = info.blockNumber - blockLatest;
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
            const count = clientInfos.push(info);
            if (isReady === true) {
                return;
            }
            if (count < WAIT_POOL_OK) {
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
                    clients[info.i].status = info.status = 'ok';
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
    constructor(mix) {
        this.lastStatus = 0;
        this.lastDate = new Date(2000);
        this.status = 'ok';
        this.requests = {
            success: 0,
            fail: 0,
            ping: 0
        };
        const hasUrl = 'url' in mix && typeof mix.url === 'string';
        const hasWeb3 = 'web3' in mix && typeof mix.web3 != null;
        if (hasUrl || hasWeb3) {
            this.config = mix;
            if (mix.url) {
                // web3 object
                this.web3 = new web3_1.default(mix.url);
            }
            else if (mix.web3.eth != null) {
                this.web3 = mix.web3;
            }
            else {
                // provider
                this.web3 = new web3_1.default(mix.web3);
            }
        }
        else {
            throw new Error(`Neither Node URL nor Web3 Instance in argument`);
        }
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
    // getEventStream (address: TAddress, abi: AbiItem[], event: string, options = {}): ClientEventsStream {
    //     let eventAbi = abi.find(x => x.type === 'event' && x.name === event);
    //     if (eventAbi == null) {
    //         let events = abi.filter(x => x.type === 'event').map(x => x.name).join(', ');
    //         throw new Error(`Event "${event}" not present in ABI. Events: ${ events }`);
    //     }
    //     let stream = new ClientEventsStream(this.address, this.abi)
    //     this
    //         .client
    //         .subscribe('logs', {
    //             address: this.address,
    //             fromBlock: 'latest'
    //         })
    //         .then(subscription => {
    //             stream.fromSubscription(subscription);
    //         }, error => {
    //             stream.error(error);
    //         });
    //     return stream;
    //     // const contract = new this.eth.Contract(abi, address);
    //     // const stream =  contract
    //     //     .events
    //     //     [event](options);
    //     // const worker = new ClientEventsStream(address, eventAbi, stream)
    //     // return worker;
    // }
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
