import alot from 'alot';
import memd from 'memd';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { $date } from '@dequanto/utils/$date';
import { $number } from '@dequanto/utils/$number';
import { $fn } from '@dequanto/utils/$fn';
import { PromiEvent } from 'web3-core';
import { PromiEventWrap } from './model/PromiEventWrap';
import { IWeb3ClientStatus } from './interfaces/IWeb3ClientStatus';
import { ClientStatus } from './model/ClientStatus';
import { ClientPoolTrace, ClientPoolTraceError } from './ClientPoolStats';
import { class_Dfr } from 'atma-utils';
import { TAddress } from '@dequanto/models/TAddress';
import { ClientEventsStream } from './ClientEventsStream';
import { ClientErrorUtil } from './utils/ClientErrorUtil';
import { IWeb3ClientOptions } from './interfaces/IWeb3Client';


export interface IPoolClientConfig {
    url?: string
    safe?: boolean
    distinct?: boolean
    web3?: Web3
    name?: string
    /** Will be used only if manually requested with .getWeb3, or .getNodeUrl */
    manual?: boolean
}
export interface IPoolWeb3Request {
    ws?: boolean
    preferSafe?: boolean
    distinct?: boolean
    name?: string
    trace?: ClientPoolTrace
}
export class ClientPool {

    private discoveredPartial = false;
    private discoveredFull = false;
    private clients: WClient[] ;
    private ws: WClient;

    constructor (config: IWeb3ClientOptions) {

        if (config.endpoints != null && config.endpoints.length > 0) {
            this.clients = config.endpoints.map(cfg => new WClient(cfg))
        } else if (config.web3) {
            this.clients = [ new WClient({ web3: config.web3 }) ];
        } else {
            console.dir(config, { depth: null });
            throw new Error(`Neither Node endpoints nor Web3 instance`)
        }
        if (this.clients.length < 2) {
            this.discoveredPartial = true;
            this.discoveredFull = true;
        }
    }

    callSync <TResult> (fn: (web3: Web3) => TResult ): TResult {

        let arr = this.clients.filter(x => x.status === 'ok');
        let wClient = arr[ $number.randomInt(0, arr.length) ];
        let { status, result } = wClient.callSync(fn);
        if (status == ClientStatus.Ok) {
            return result;
        }
        throw result;
    }

    async call <TResult> (fn: (web3: Web3) => Promise<TResult>, opts?: IPoolWeb3Request): Promise<TResult> {
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
            let { status, result, error, time } = await wClient.call(fn);

            opts
                ?.trace
                ?.onComplete({ status, error, time, url: wClient.config.url })

            used.set(wClient, 1);
            errors.push(error ?? result);

            if (status == ClientStatus.Ok) {
                return result;
            }
            if (status === ClientStatus.CallError) {
                let error = ClientPoolTraceError.create(errors.pop(), opts?.trace);
                //console.log(`Errored ${error.message}`);
                throw error;
                return result;
            }
        }
    }
    async getWeb3 (options?: IPoolWeb3Request) {
        let wClient = await this.next(null, options, { manual: true });
        if (wClient == null) {
            throw new Error(`Not client found in ${this.clients.length} Clients`);
        }
        return wClient?.web3;
    }
    async getNodeURL (options?: IPoolWeb3Request) {
        let wClient = await this.next(null, options, { manual: true });
        if (wClient == null) {
            let stats = await this.getNodeStats();
            let info = stats.map(x => `    ${x.url}. ERR: ${x.fail}; OK: ${x.success}; Ping: ${x.ping}`).join('\n');
            let requirements = JSON.stringify(options);
            throw new Error(`No alive node for ${requirements} found. \n ${info}`);
        }
        return wClient?.config.url;
    }
    async releaseWeb3 () {

    }

    callPromiEvent <TResult extends PromiEvent<any>> (
        fn: (web3: Web3) => TResult
        , opts?: { preferSafe?: boolean, parallel?: number, silent?: boolean, distinct?: boolean }
        , used:  Map<WClient, number> = new  Map<WClient, number>()
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
                console.log('!!client ERROR', error);
                error.message += ` (RPC: ${wClient.config.url})`;
                if (ClientErrorUtil.isConnectionFailed(error)) {
                    this.callPromiEvent(
                        fn, opts, used, errors, root
                    );
                    return;
                }
                if (ClientErrorUtil.isAlreadyKnown(error)) {
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

    getEventStream (address: TAddress, abi: any, event: string) {
        if (this.ws == null) {
            this.ws = this.clients.find(x => x.config.url.startsWith('ws'));
        }
        let stream = this.ws.getEventStream(address, abi, event);
        return stream;
    }

    getNodeStats () {
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

    async getNodeInfos (): Promise<IWeb3ClientStatus[]> {
        let nodes = await alot(this.clients).mapAsync(async (wClient, idx) => {

            let url = wClient.config.url;
            try {
                let start = Date.now();
                let [ syncing, blockNumber, peers ] = await Promise.all([
                    wClient.eth.isSyncing(),
                    wClient.eth.getBlockNumber(),
                    /** @TODO Public nodes smt. do not allow net_peerCount methods. Allow to switch this on/off on node-url-config level */
                    wClient.eth.net.getPeerCount(),
                ]);

                let ping = Math.round((Date.now() - start) / 3);
                let syncData = typeof syncing === 'boolean' ? null : syncing;
                return <IWeb3ClientStatus>  {
                    url: url,
                    status: 'live',
                    syncing: <any> syncData,
                    blockNumber: blockNumber,
                    blockNumberBehind: 0,
                    peers: peers,
                    pingMs: ping,
                    i: idx,
                };

            } catch (error) {
                return <IWeb3ClientStatus> {
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

    private async next (used?: Map<WClient, number>, opts?: IPoolWeb3Request, params?: { manual?: boolean }): Promise<WClient> {
        let clients = this.clients;
        if (params?.manual !== true) {
            clients = clients.filter(x => x.config.manual !== true);
        }

        if (opts?.ws === true) {
            if (this.ws == null) {
                this.ws = clients.find(x => x.config.url.startsWith('ws'));
            }
            return this.ws;
        }

        if (opts?.ws === false) {
            clients = clients.filter(x => x.config.url.startsWith('http'));
        }

        if (this.discoveredPartial === false) {
            await this.discoverLive().ready;
            this.discoveredPartial = true;
        }

        // we check OK clients first
        let okClients = clients.filter(x => x.status === 'ok' );
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
            : clients.filter(x => used.has(x) === false);

        if (available.length === 0) {
            if (this.discoveredFull === false) {
                await this.discoverLive().completed;
                this.discoveredFull = true;

                return this.next(used, opts);
            }
            return null;
        }
        let healthy = available.filter(x =>  x.healthy());

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
        let i = $number.randomInt(0, arr.length);
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
    @memd.deco.memoize({ perInstance: true })
    private discoverLive (): { ready: class_Dfr, completed: class_Dfr } {

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
                    let clientInfo = {
                        i: idx,
                        error: null,
                        status: null,
                        blockNumberBehind: 0,
                        blockNumber: await $fn.timeoutPromise(wClient.eth.getBlockNumber(), 20_000)
                    };
                    onIntermediateSuccess(clientInfo);
                    return clientInfo;
                } catch (error) {
                    return <TClientInfo> {
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

        function isOk (info: TClientInfo): WClient['status'] {
            if (info.error) {
                return 'off';
            }
            if (isNaN(info.blockNumber) || info.blockNumberBehind < -200) {
                return 'off';
            }
            return 'ok';
        }
        function onIntermediateSuccess (info: TClientInfo) {
            const TOLERATE_BLOCK_COUNT = 5;
            const WAIT_POOL_OK = Math.min(3, clientInfos.length);

            if (isReady === true) {
                return;
            }
            if (clientInfos.push(info) < WAIT_POOL_OK) {
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
                    clients[info.i].status = 'ok';
                });
                isReady = true;
                ready.resolve();
            }
        }

        return { ready, completed };
    }
}

class WClient {
    lastStatus = 0;
    lastDate: Date = new Date(2000);

    status: 'ok' | 'off' | 'ping' = 'ok'

    requests = {
        success: 0,
        fail: 0,
        ping: 0
    };

    web3: Web3
    eth: Web3['eth']
    config: IPoolClientConfig

    healthy () {
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
        if (Date.now() - this.lastDate.getTime() > $date.parseTimespan('10m')) {
            return true;
        }
        return false;
    }

    constructor (mix: IPoolClientConfig) {
        const hasUrl = 'url' in mix && typeof mix.url === 'string';
        const hasWeb3 = 'web3' in mix && typeof mix.web3 != null;
        if (hasUrl || hasWeb3) {
            this.config = mix;
            this.web3 = mix.web3 ?? new Web3(mix.url);
        } else {
            throw new Error(`Neither Node URL nor Web3 Instance in argument`);
        }
        this.web3.eth.handleRevert = true;
        this.eth = this.web3.eth;
    }

    async send <TResult> (fn: (web3: Web3) => PromiEvent<TResult> ): Promise<{ status: ClientStatus, error?, result?: PromiEvent<TResult> }> {
        return new Promise((resolve, reject) => {
            let result = fn(this.web3);

            result.then(
                _ => {
                    this.lastStatus = ClientStatus.Ok;
                    this.requests.success++;
                    resolve({ status: ClientStatus.Ok, result })
                },
                error => {
                    if (ClientErrorUtil.isConnectionFailed (error)) {
                        this.lastStatus = ClientStatus.NetworkError;
                        this.requests.fail++;
                        resolve({ status: ClientStatus.NetworkError, error });
                    }
                    return resolve({ status: ClientStatus.CallError, result: error });
                }
            );
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
    async call <TResult extends PromiseLike<any>> (fn: (web3: Web3) => TResult ): Promise<{ status: ClientStatus, error?, result?: TResult, time: number }> {
        return new Promise((resolve, reject) => {
            let start = Date.now();
            let result = fn(this.web3);

            result.then(
                _ => {
                    let time = Date.now() - start;
                    let status = ClientStatus.Ok;
                    this.onComplete(status, time);
                    resolve({ status, result, time })
                },
                error => {
                    let time = Date.now() - start;
                    let status =  ClientStatus.CallError;

                    if (ClientErrorUtil.isConnectionFailed (error)) {
                        status = ClientStatus.NetworkError;
                    }
                    this.onComplete(status, time);
                    resolve({ status, error, time })
                }
            );
        });
    }

    callPromiEvent <TResult extends PromiEvent<any>> (fn: (web3: Web3) => TResult ): TResult {
        let result = fn(this.web3);
        result.on('error', error => {
            if (ClientErrorUtil.isConnectionFailed (error)) {
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
    callSubscription <TResult extends PromiEvent<any>> (fn: (web3: Web3) => TResult ): TResult {
        let result = fn(this.web3);
        result.on('error', error => {
            if (ClientErrorUtil.isConnectionFailed (error)) {
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

    getEventStream (address: TAddress, abi: AbiItem[], event: string, options = {}): ClientEventsStream {
        let eventAbi = abi.find(x => x.type === 'event' && x.name === event);
        if (eventAbi == null) {
            let events = abi.filter(x => x.type === 'event').map(x => x.name).join(', ');
            throw new Error(`Event "${event}" not present in ABI. Events: ${ events }`);
        }
        const contract = new this.eth.Contract(abi, address);
        const stream =  contract
            .events
            [event](options);

        const worker = new ClientEventsStream(contract, eventAbi, stream)
        return worker;
    }

    callSync <TResult> (fn: (web3: Web3) => TResult ): { status: number, result?: TResult } {
        try {
            let result = fn(this.web3);
            return { status: ClientStatus.Ok, result };

        } catch (error) {
            return { status: ClientStatus.CallError, result: error }
        }
    }

    onComplete (status: ClientStatus, timeMs: number) {
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

    getRequestCount () {
        return this.requests.success + this.requests.fail;
    }

}
