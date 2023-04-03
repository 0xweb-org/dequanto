import alot from 'alot';
import memd from 'memd';
import Web3 from 'web3';
import { $date } from '@dequanto/utils/$date';
import { $number } from '@dequanto/utils/$number';

import { PromiEventWrap } from './model/PromiEventWrap';
import { IWeb3ClientStatus } from './interfaces/IWeb3ClientStatus';
import { ClientStatus } from './model/ClientStatus';
import { ClientPoolTrace, ClientPoolTraceError } from './ClientPoolStats';
import { class_Dfr, obj_extendDefaults } from 'atma-utils';
import { ClientErrorUtil } from './utils/ClientErrorUtil';
import { IWeb3ClientOptions } from './interfaces/IWeb3Client';
import { $logger, l } from '@dequanto/utils/$logger';
import { $promise } from '@dequanto/utils/$promise';
import { $array } from '@dequanto/utils/$array';
import { RateLimitGuard } from './handlers/RateLimitGuard';
import { Web3BatchRequests } from './Web3BatchRequests';

import type { PromiEvent, WebsocketProvider, provider } from 'web3-core';
import type { HttpProviderOptions, WebsocketProviderOptions } from 'web3-core-helpers/types/index'

export interface IPoolClientConfig {
    url?: string
    options?: HttpProviderOptions | WebsocketProviderOptions

    /** Will be a pefered node for submitting transactions */
    safe?: boolean
    distinct?: boolean
    web3?: Web3 | provider
    name?: string
    /** Will be used only if manually requested with .getWeb3, or .getNodeUrl */
    manual?: boolean

    /** max block range per request when getting for example the past logs*/
    fetchableBlockRange?: number

    /** True if the node supports traceTransaction calls */
    traceable?: boolean

    // requestCout/timeSpan: e.g. 100/1min
    rateLimit?: string

    // the max block range to fetch per single request when getting Logs
    blockRangeLimit?: string | number

    // maximum of requests to be batched, otherwise batches will be paginated
    batchLimit?: number
}
export interface IPoolWeb3Request {
    ws?: boolean
    preferSafe?: boolean
    distinct?: boolean
    name?: string

    /** HTTP Web3 Client traces */
    trace?: ClientPoolTrace

    /** Supported node features */
    node?: {
        /** Supports traceTransaction */
        traceable?: boolean
    }

    // Amount of batch requests to be performed, sothat we can choose the appropriate wClient and handle the rate limits correctly
    batchRequestCount?: number

    // By fetching logs, specifies the desired block range to query
    blockRangeCount?: number
}

export class ClientPool {

    private discoveredPartial = false;
    private discoveredFull = false;
    private clients: WClient[];
    private ws: WClient;

    constructor(config: IWeb3ClientOptions) {

        if (config.endpoints != null && config.endpoints.length > 0) {
            this.clients = config.endpoints.map(cfg => new WClient(cfg))
        } else if (config.web3 || config.provider) {
            this.clients = [new WClient({ web3: config.web3 ?? config.provider })];
        } else {
            console.dir(config, { depth: null });
            throw new Error(`Neither Node endpoints nor Web3 instance`)
        }
        if (this.clients.length < 2) {
            this.discoveredPartial = true;
            this.discoveredFull = true;
        }
    }

    callSync<TResult>(fn: (web3: Web3) => TResult): TResult {

        let arr = this.clients.filter(x => x.status === 'ok');
        let wClient = arr[$number.randomInt(0, arr.length)];
        let { status, result } = wClient.callSync(fn);
        if (status == ClientStatus.Ok) {
            return result;
        }
        throw result;
    }

    async callBatched(args: {
        requests: (web3: Web3) => Promise<any[]>
        map?: (results: any[]) => any
    }, opts?: IPoolWeb3Request) {
        return this.call(async (web3, wClient) => {
            let requests = await args.requests(web3);
            let results = await wClient.callBatched(requests);
            let mapped = args?.map?.(results) ?? results;
            return mapped;
        }, {
            ...(opts ?? {}),

            /**
             * web3@1.6.0 has a bug with batch request via websockets, as the callback can stuck if a single response contains multiple IDs, as only the first one will be taken
             * https://github.com/web3/web3.js/blob/9238e106294784b4a6a20af020765973f0437022/packages/web3-providers-ws/src/index.js#L128
            */
            ws: false
        });
    }

    async call<TResult>(fn: (web3: Web3, wClient?: WClient) => Promise<TResult>, opts?: IPoolWeb3Request): Promise<TResult> {
        // Client - Retries
        let used = new Map<WClient, number>();
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
                throw ClientPoolTraceError.create(error, opts?.trace);
            }

            let wClientUsage = used.get(wClient);
            let { status, result, error, time } = await wClient.call(fn, opts);

            opts
                ?.trace
                ?.onComplete({ status, error, time, url: wClient.config.url })


            if (wClientUsage == null) {
                // per default NO_RETRIES
                used.set(wClient, 0);
            } else {
                // decrease retry count
                used.set(wClient, wClientUsage - 1);
            }

            errors.push(error ?? result);

            if (status == ClientStatus.Ok) {
                return result;
            }
            if (status == ClientStatus.RateLimited) {
                if (wClientUsage == null) {
                    const RETRIES = 5;
                    used.set(wClient, RETRIES);
                }
            }
            if (status === ClientStatus.CallError) {
                let error = ClientPoolTraceError.create(errors.pop(), opts?.trace);
                throw error;
                return result;
            }

            // if not the CallError, process the while loop to check another NodeProvider
        }
    }
    async getWeb3(options?: IPoolWeb3Request) {
        let wClient = await this.getWrappedWeb3(options);
        return wClient?.web3;
    }
    async getWrappedWeb3(options?: IPoolWeb3Request) {
        let wClient = await this.next(null, options, { manual: true });
        if (wClient == null) {
            throw new Error(`No client found in ${this.clients.length} Clients with options: ${JSON.stringify(options)}`);
        }
        return wClient;
    }
    async getNodeURL(options?: IPoolWeb3Request) {
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

    getOptionForFetchableRange(): number {
        const DEFAULT = null;
        let max = alot(this.clients).max(x => x.config?.fetchableBlockRange ?? 0);
        if (max === 0) {
            return DEFAULT;
        }
        return max;
    }

    callPromiEvent<TResult extends PromiEvent<any>>(
        fn: (web3: Web3) => TResult
        , opts?: { preferSafe?: boolean, parallel?: number, silent?: boolean, distinct?: boolean }
        , used: Map<WClient, number> = new Map<WClient, number>()
        , errors = []
        , root?: PromiEventWrap
    ): TResult {

        root = root ?? new PromiEventWrap();

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
                return root as any as TResult;
            }

            let promiEvent = wClient.callPromiEvent(fn);

            root.bind(promiEvent);

            promiEvent.on('error', async error => {
                error.message += ` (RPC: ${wClient.config.url})`;
                if (ClientErrorUtil.isConnectionFailed(error)) {
                    this.callPromiEvent(
                        fn, opts, used, errors, root
                    );
                    return;
                }
                if (ClientErrorUtil.isAlreadyKnown(error)) {
                    $logger.log(`TxWriter ERROR ${error.message}. Check pending...`);
                    let web3 = await this.getWeb3();
                    let txs = await web3.eth.getPendingTransactions();
                    $logger.log('PENDING ', txs?.map(x => x.hash));
                    // throw anyway
                }
                root.emit('error', error);
                root.reject(error);
            });


            used.set(wClient, 1);

            if (typeof opts?.parallel === 'number') {
                while (--opts.parallel > 0) {
                    this.callPromiEvent(
                        fn
                        , {
                            ...opts,
                            distinct: true,
                            parallel: null,
                            silent: true
                        }
                        , used
                        , errors
                        , root
                    );
                }
            }
        })();

        return root as any as TResult;
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

    async getNodeInfos(): Promise<IWeb3ClientStatus[]> {
        async function peerCount(wClient) {
            /** @TODO Public nodes smt. do not allow net_peerCount methods. Allow to switch this on/off on node-url-config level */
            try {
                return await wClient.eth.net.getPeerCount();
            } catch (error) {
                return `ERROR: ${error.message}`;
            }
        }
        let nodes = await alot(this.clients).mapAsync(async (wClient, idx) => {

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
                return <IWeb3ClientStatus>{
                    url: url,
                    status: 'live',
                    syncing: <any>syncData,
                    blockNumber: blockNumber,
                    blockNumberBehind: 0,
                    peers: peers,
                    pingMs: ping,
                    node: node,
                    i: idx,
                };

            } catch (error) {
                return <IWeb3ClientStatus>{
                    url,
                    status: 'error',
                    error: error,
                    peers: 0,
                    i: idx,
                };
            }
        }).toArrayAsync();

        let max = alot(nodes).max(x => x.syncing?.highestBlock ?? (x.syncing as any)?.HighestBlock ?? x.blockNumber);

        nodes.forEach(node => {
            node.blockNumberBehind = node.blockNumber - max;
        });
        return nodes;
    }

    private async next(used?: Map<WClient, number>, opts?: IPoolWeb3Request, params?: { manual?: boolean }): Promise<WClient> {
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
        } else {
            clients = okClients;
        }

        let available = used == null
            ? clients
            : clients.filter(x => used.has(x) === false || used.get(x) > 0);

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

        if (opts?.blockRangeCount != null) {
            let upperThreshold = alot(arr).max(x => x.blockRangeLimits.blocks) * .8;
            arr = arr.filter(x => x.blockRangeLimits.blocks >= upperThreshold)
        }
        return await this.getClientWithLowestWaitTime(arr);
    }


    private async getClientWithLowestWaitTime(clients: WClient[]): Promise<WClient> {
        if (clients.length === 0) {
            return null;
        }

        clients = $array.shuffle(clients);

        let minWait = Infinity;
        let minClient: WClient = null;
        for (let i = 0; i < clients.length; i++) {
            let client = clients[i];
            let waitMs = client.getRateLimitGuardTime();
            if (waitMs === 0) {
                return client;
            }
            if (minWait > waitMs) {
                minWait = waitMs;
                minClient = client;
            }
        }

        const MAX_WAIT = 60_000;
        if (minWait > MAX_WAIT) {
            throw new Error(`rate limit overflows. Waiting ${minWait}ms`);
        }
        return minClient;
    }

    /**
     * We may have tens of Nodes to communicate with. Discover LIVE and operating nodes.
     * Resolves when first 3 active nodes are discovered, to prevent waiting for all of them.
     * @returns
     * - Ready Promise - in case 3 clients look good
     * - Complete Promise - when all clients are resolved
     */
    @memd.deco.memoize({ perInstance: true })
    private discoverLive(): { ready: class_Dfr, completed: class_Dfr } {

        this.clients.forEach(x => x.status = 'ping');

        let ready = new class_Dfr();
        let completed = new class_Dfr();
        let clientInfos = [] as TClientInfo[];
        let isReady = false as boolean;
        let isCompleted = false;
        let clients = this.clients;

        type TClientInfo = {
            i: number
            error?: Error
            status?: WClient['status'],
            blockNumberBehind: number
            blockNumber: number
        };

        (async () => {
            let nodeInfosAsync = clients.map(async (wClient, idx) => {
                try {
                    let clientInfo = <TClientInfo>{
                        i: idx,
                        error: null,
                        status: null,
                        blockNumberBehind: 0,
                        blockNumber: await $promise.timeout(wClient.eth.getBlockNumber(), 20_000)
                    };
                    onIntermediateSuccess(clientInfo);
                    return clientInfo;
                } catch (error) {
                    return <TClientInfo>{
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

            const blockLatest = alot(nodeInfos).max(x => x.blockNumber);

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

        function isOk(info: TClientInfo): WClient['status'] {
            if (info.error) {
                return 'off';
            }
            if (isNaN(info.blockNumber) || info.blockNumberBehind < -200) {
                return 'off';
            }
            return 'ok';
        }
        function onIntermediateSuccess(info: TClientInfo) {
            const TOLERATE_BLOCK_COUNT = 5;
            const WAIT_POOL_OK = Math.min(3, clientInfos.length);
            const count = clientInfos.push(info);

            if (isReady === true) {
                return;
            }
            if (count < WAIT_POOL_OK) {
                return;
            }

            let maxBlockNumber = alot(clientInfos).max(x => x.blockNumber);
            let ok = [] as TClientInfo[];
            for (let info of clientInfos) {
                let diff = Math.abs(info.blockNumber - maxBlockNumber);
                if (diff <= TOLERATE_BLOCK_COUNT) {
                    ok.push(info)
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

export class WClient {
    lastStatus = 0;
    lastDate = new Date(2000).getTime();

    status: 'ok' | 'off' | 'ping' = 'ok'

    requests = {
        success: 0,
        fail: 0,
        ping: 0
    };

    web3: Web3
    eth: Web3['eth']
    config: IPoolClientConfig
    rateLimitGuard: RateLimitGuard

    /** For getLogs method, as some providers limit the range request or page result value */
    blockRangeLimits: {
        blocks?: number
        results?: number
    }

    // Max requests per single Web3 Batch request
    batchLimit?: number

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
        if (Date.now() - this.lastDate > $date.parseTimespan('10m')) {
            return true;
        }
        return false;
    }

    private updateRateLimitInfo(info: ReturnType<typeof RateLimitGuard['extractRateLimitFromError']>) {
        if (this.rateLimitGuard == null) {
            this.rateLimitGuard = new RateLimitGuard({
                id: this.config.url ?? 'web3',
                rates: []
            });
        }
        this.rateLimitGuard.updateRateLimitInfo(info);
    }
    public updateBlockRangeInfo(info: WClient['blockRangeLimits']) {
        if (this.blockRangeLimits == null) {
            this.blockRangeLimits = {};
        }
        if (info.blocks != null) {
            this.blockRangeLimits.blocks = info.blocks;
        }
        if (info.results != null) {
            this.blockRangeLimits.results = info.results;
        }
    }

    constructor(mix: IPoolClientConfig) {
        const hasUrl = 'url' in mix && typeof mix.url === 'string';
        const hasWeb3 = 'web3' in mix && typeof mix.web3 != null;
        if (hasUrl || hasWeb3) {
            this.config = mix;
            if (typeof mix.url === 'string') {
                let { url, options } = this.config;
                if (url.startsWith('ws')) {
                    options = obj_extendDefaults(options ?? {}, { clientConfig: {} });
                    obj_extendDefaults((options as WebsocketProviderOptions).clientConfig, {
                        // default frame size is too small
                        maxReceivedFrameSize:   50_000_000,
                        maxReceivedMessageSize: 50_000_000,
                    });

                    let provider = new Web3.providers.WebsocketProvider(url, options);
                    this.web3 = new Web3(provider);
                } else if (typeof url.startsWith('http')) {
                    let provider = new Web3.providers.HttpProvider(url, options);
                    this.web3 = new Web3(provider);
                } else {
                    this.web3 = new Web3(mix.url);
                }
            } else if ((mix.web3 as any).eth != null) {
                this.web3 = <Web3>mix.web3;
            } else {
                // provider
                this.web3 = new Web3(<provider>mix.web3);
            }
        } else {
            throw new Error(`Neither Node URL nor Web3 Instance in argument`);
        }
        this.web3.eth.handleRevert = true;
        this.eth = this.web3.eth;
        this.blockRangeLimits = { blocks: Infinity };

        if (mix.rateLimit) {
            let rates = RateLimitGuard.parseRateLimit(mix.rateLimit);
            this.rateLimitGuard = new RateLimitGuard({
                id: this.config?.url ?? 'web3',
                rates: rates
            })
        }
        if (mix.blockRangeLimit) {
            this.updateBlockRangeInfo({
                blocks: $number.parse(mix.blockRangeLimit)
            })
        }
        if (mix.batchLimit) {
            this.batchLimit = $number.parse(mix.batchLimit);
        }
    }

    async send<TResult>(fn: (web3: Web3) => PromiEvent<TResult>): Promise<{ status: ClientStatus, error?, result?: PromiEvent<TResult> }> {
        return new Promise((resolve, reject) => {
            let result = fn(this.web3);

            result.then(
                _ => {
                    this.lastStatus = ClientStatus.Ok;
                    this.requests.success++;
                    resolve({ status: ClientStatus.Ok, result })
                },
                error => {
                    if (ClientErrorUtil.isConnectionFailed(error)) {
                        this.lastStatus = ClientStatus.NetworkError;
                        this.requests.fail++;
                        resolve({ status: ClientStatus.NetworkError, error });
                    }
                    return resolve({ status: ClientStatus.CallError, result: error });
                }
            );
        });
    }

    async callBatched<TResult = any>(requests: (Web3BatchRequests.IContractRequest | Web3BatchRequests.IRequestBuilder)[]): Promise<TResult[]> {
        let spanLimit = Math.min(
            this.rateLimitGuard?.getSpanLimit() ?? Infinity,
            this.batchLimit ?? Infinity,
            requests.length
        );
        let output = [] as TResult[];
        let errors = [];
        while (requests.length > 0) {
            let page = requests.splice(0, spanLimit);
            let { status, error, result: pageResult } = await this.call(async (web3) => {
                let batch = new Web3BatchRequests.BatchRequest(web3, page);
                let results = await batch.execute();
                return results;
            });
            if (status === ClientStatus.Ok) {
                let batchResults = pageResult.map(x => x.result);
                output.push(...batchResults);
                continue;
            }
            if (status === ClientStatus.RateLimited) {
                spanLimit = this.rateLimitGuard?.getSpanLimit() ?? requests.length;
            }
            errors.push(error);
            if (errors.length > 2) {
                throw error;
            }
            requests.unshift(...page);
        }
        return output;
    }

    async call<TResult extends PromiseLike<any>>(fn: (web3: Web3, wClient?: WClient) => TResult, options?: {
        // For the rate limit guard, to make sure we wait enough time to proceed with batch request for example
        batchRequestCount?: number
    }): Promise<{ status: ClientStatus, error?, result?: Awaited<TResult>, time: number }> {
        let now = Date.now();
        await this.rateLimitGuard?.wait(options?.batchRequestCount ?? 1, now);

        let connectionError = await this.ensureConnected();
        if (connectionError) {
            return {
                status: ClientStatus.NetworkError,
                result: null,
                error: connectionError,
                time: Date.now() - now
            };
        }

        return new Promise((resolve, reject) => {
            let start = Date.now();
            let result = fn(this.web3, this);

            result.then(
                result => {
                    let time = Date.now() - start;
                    let status = ClientStatus.Ok;
                    this.onComplete(status, time);
                    this.rateLimitGuard?.onComplete(now);
                    resolve({ status, result, time })
                },
                error => {
                    let time = Date.now() - start;
                    let status = ClientStatus.CallError;

                    if (RateLimitGuard.isRateLimited(error)) {
                        status = ClientStatus.RateLimited;

                        let rateLimitInfo = RateLimitGuard.extractRateLimitFromError(error);
                        this.updateRateLimitInfo(rateLimitInfo);
                    } else if (ClientErrorUtil.isConnectionFailed(error)) {
                        status = ClientStatus.NetworkError;
                    }
                    this.onComplete(status, time);
                    resolve({ status, error, time })
                }
            );
        });
    }

    callPromiEvent<TResult extends PromiEvent<any>>(fn: (web3: Web3) => TResult): TResult {
        let result = fn(this.web3);
        result.on('error', error => {
            if (ClientErrorUtil.isConnectionFailed(error)) {
                this.lastStatus = ClientStatus.NetworkError;
                this.requests.fail++;
            }
        });
        result.on('transactionHash', hash => {
            this.lastStatus = ClientStatus.Ok;
            this.requests.success++;
        })
        return result;
    }
    callSubscription<TResult extends PromiEvent<any>>(fn: (web3: Web3) => TResult): TResult {
        let result = fn(this.web3);
        result.on('error', error => {
            if (ClientErrorUtil.isConnectionFailed(error)) {
                this.lastStatus = ClientStatus.NetworkError;
                this.requests.fail++;
            }
        });
        result.on('transactionHash', hash => {
            this.lastStatus = ClientStatus.Ok;
            this.requests.success++;
        })
        return result;
    }


    callSync<TResult>(fn: (web3: Web3) => TResult): { status: number, result?: TResult } {
        try {
            let result = fn(this.web3);
            return { status: ClientStatus.Ok, result };

        } catch (error) {
            return { status: ClientStatus.CallError, result: error }
        }
    }

    onComplete(status: ClientStatus, timeMs: number) {
        let callCount = this.getRequestCount();
        let ping = this.requests.ping;

        this.lastStatus = status;
        switch (status) {
            case ClientStatus.Ok:
                this.requests.success++;
                break;
            default:
                this.requests.fail++;
                break;
        }
        this.requests.ping = (ping * callCount + timeMs) / (callCount + 1);
    }

    async ensureConnected (): Promise<Error> {
        if (this.config.url?.startsWith('ws')) {
            let web3 = this.web3;
            let provider = web3.eth.currentProvider as WebsocketProvider & { url };
            if (provider.connected === false) {
                provider.connect();
                try {
                    await $promise.waitForTrue(() => provider.connected, {
                        intervalMs: 200,
                        timeoutMessage: `Couldn't connect to WS ${provider.url}`,
                        timeoutMs: 20_000
                    });
                    return null;
                } catch (error) {
                    return error;
                }
            }
        }
        return null;
    }

    getRequestCount() {
        return this.requests.success + this.requests.fail;
    }

    /**
     * Checks the rate limit wait time, so that the POOL can select the wClient with shortest wait time
     **/
    getRateLimitGuardTime() {
        return this.rateLimitGuard?.checkWaitTime() ?? 0;
    }

}



