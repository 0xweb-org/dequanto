import alot from 'alot';
import memd from 'memd';
import { ContractBase, TEventLogOptions } from '@dequanto/contracts/ContractBase';
import { ContractCreationResolver } from '@dequanto/contracts/ContractCreationResolver';
import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { $date } from '@dequanto/utils/$date';
import { $require } from '@dequanto/utils/$require';
import { TAddress } from '@dequanto/models/TAddress';
import { IEventsIndexerMetaStore, IEventsIndexerStore, TEventsIndexerItem, TEventsIndexerMeta } from './storage/interfaces';
import { FsEventsIndexerStore } from './storage/FsEventsIndexerStore';
import { FsEventsMetaStore } from './storage/FsEventsMetaStore';
import { class_Dfr } from 'atma-utils';
import { TLogsRangeProgress } from '@dequanto/clients/Web3Client';
import { WClient } from '@dequanto/clients/ClientPool';
import { TEth } from '@dequanto/models/TEth';
import { l } from '@dequanto/utils/$logger';
import { PackedRanges } from '@dequanto/class/PackedRanges';


export class EventsIndexer <TContract extends ContractBase> {

    public store: IEventsIndexerStore
    public storeMeta: IEventsIndexerMetaStore

    constructor(public contract: TContract, public options: {
        // Load events from the contract that was deployed to multiple addresses
        addresses?: TAddress[]
        name?: string
        initialBlockNumber?: number
        store?: IEventsIndexerStore
        storeMeta?: IEventsIndexerMetaStore
        fs?: {
            /** Is used as a base directory. Later the ContractName and the address(es) hash will be appended */
            directory?: string

            /** The events will be splitted into multiple files by block range */
            // @default ~1week
            rangeSeconds?: number
            // @default is taken from Web3Client
            blockTimeAvg?: number
        }
    }) {
        let client = contract.client;

        this.store = options?.store ?? new FsEventsIndexerStore(contract, {
            addresses: this.options.addresses,
            name: this.options.name,
            initialBlockNumber: this.options.initialBlockNumber,
            fs: {
                directory: options?.fs?.directory,
                rangeSeconds: options?.fs?.rangeSeconds ?? $date.parseTimespan('1week', { get: 's' }),
                blockTimeAvg: options?.fs?.blockTimeAvg ?? client.blockTimeAvg
            }
        });

        this.storeMeta = options?.storeMeta ?? new FsEventsMetaStore(contract, {
            addresses: this.options.addresses,
            name: this.options.name,
            fs: {
                directory: options?.fs?.directory,
            }
        });
    }

    async mergeStorages (store: IEventsIndexerStore) {
        this.store.merge(store);
    }

    /** @deprecated For migration only */
    async fsEnsureMigrated () {
        $require.True(this.store instanceof FsEventsIndexerStore);
        $require.True(this.storeMeta instanceof FsEventsMetaStore);

        await (this.store as FsEventsIndexerStore<TContract>).ensureMigrated();
        await (this.storeMeta as FsEventsMetaStore<TContract>).ensureMigrated();
    }

    async getPastLogs <
        TLogName extends GetEventLogNames<TContract>,
    > (
        event: TLogName | TLogName[] | '*',
        filter?: {
            fromBlock?: number
            toBlock?: number
            params?: Partial<TContract['Types']['Events'][TLogName]['outputParams']>
        }
    ): Promise<{
        logs: ITxLogItem<GetTypes<TContract>['Events'][TLogName]['outputParams']>[],
        infos: {
            fetched: number,
            cached: number,
        }
    }> {
        let contract = this.contract;
        let client = contract.client;
        let fromBlock = filter?.fromBlock;
        let toBlock = filter?.toBlock ?? await client.getBlockNumber();
        let events = Array.isArray(event) ? event as string[] : [ event as string ];
        let filterKey = this.getFilterKey(filter?.params);
        let ranges = await this.getRanges(events, this.options.initialBlockNumber, toBlock, {
            fromBlock,
            filterKey
        });
        let { logs, infos } = await this.getPastLogsRanges(ranges, events, toBlock, fromBlock, {
            params: filter?.params as any
        });
        return {
            logs: logs as any,
            infos,
        };
    }

    async * getPastLogsStream <
        TLogName extends GetEventLogNames<TContract>,
    > (
        event: TLogName | TLogName[] | '*',
        options?: {
            // includes block
            fromBlock?: number
            // includes block
            toBlock?: number
            blockRangeLimits?: WClient['blockRangeLimits']
            params?: Partial<TContract['Types']['Events'][TLogName]['outputParams']>
        },
    ): AsyncGenerator<
        TLogsRangeProgress<
            ITxLogItem<GetTypes<TContract>['Events'][TLogName]['outputParams'], string>
        >       // next result
        , void  // void returns
        , void  // next doesn't get any parameter
    > {
        let contract = this.contract;
        let client = contract.client;
        let fromBlock = options?.fromBlock;
        let toBlock = options?.toBlock ?? await client.getBlockNumber();
        let events = Array.isArray(event) ? event as string[] : [ event as string ];
        let filterKey = this.getFilterKey(options?.params);
        let ranges = await this.getRanges(events, this.options.initialBlockNumber, toBlock, {
            fromBlock,
            filterKey
        });

        let dfrInner = new class_Dfr<any>();
        let dfrOuter = new class_Dfr<any>();

        this.getPastLogsRanges(ranges, events, toBlock, fromBlock, {
            params: options?.params,
            blockRangeLimits: options?.blockRangeLimits,
            streamed: true,
            async onProgress (info) {
                dfrInner.resolve(info);
                await dfrOuter;
            }
        });

        while (true) {
            let result = await dfrInner;
            dfrOuter.defer();
            dfrInner.defer();

            try {
                yield result;
            } catch (err) {
                dfrOuter.reject(err);
                break;
            }

            dfrOuter.resolve();

            if (result.completed) {
                break;
            }
        }
    }

    async removeCached (params?: {
        fromBlock: number
    }) {
        let events = await this.store.fetch({ fromBlock: params.fromBlock });
        l`Removing ${events.length} from Block #${params.fromBlock}...`;
        await this.store.removeMany(events);

        let metas = await this.storeMeta.fetch();
        let lastBlock = (params?.fromBlock ?? 0) - 1;
        if (lastBlock < 0) {
            // remove all metas
            await this.storeMeta.removeMany(metas)
        } else {
            // adjust the lastBlock and the ranges
            metas.forEach(x => {
                x.lastBlock = Math.min(x.lastBlock, lastBlock);
                x.ranges = PackedRanges.pickTo(x.ranges, x.lastBlock);
            });
            await this.storeMeta.upsertMany(metas);
        }
    }

    private async getRanges (events: string[], initialBlockNumber: number, toBlock: number, opts: {
        fromBlock?: number
        filterKey?: string
    }): Promise<TRangeLoader> {
        let fromBlock = opts?.fromBlock ?? initialBlockNumber ?? await this.getInitialBlockNumber();
        if (fromBlock != null) {
            $require.lte(fromBlock, toBlock, `Invalid block range order`);
        }
        let logsMetaArr = await this.storeMeta.fetch();
        let eventsBlock = alot(logsMetaArr)
            .filter(x => x.filterKey == opts?.filterKey)
            .toDictionary(x => x.event, x => x);

        let logsMeta = await alot(events).mapAsync(async event => {
            let lastBlock = eventsBlock[event]?.lastBlock ?? initialBlockNumber ?? await this.getInitialBlockNumber();
            let ranges = eventsBlock[event]?.ranges ?? [];
            return {
                event: event,
                lastBlock: lastBlock,
                ranges: ranges,
                filterKey: opts?.filterKey
            };
        }).toArrayAsync();

        let intersactionRange = PackedRanges.intersection(logsMeta.map(x => x.ranges));
        let rangesToLoad = PackedRanges.subtract([[fromBlock, toBlock]], intersactionRange);

        let ranges = rangesToLoad.map(([from, to]) => {
            return {
                fromBlock: from,
                toBlock: to,
                events: events,
                filterKey: opts?.filterKey
            } as TRange
        });

        return {
            fromBlock,
            load: ranges,
            current: logsMeta,
        };
    }
    // Save indexed logs every 2 minutes
    private async getPastLogsRanges (ranges: TRangeLoader, events: string[], toBlock: number, fromBlock?: number, options?: TEventLogOptions<any>) {
        const PERSIST_INTERVAL = $date.parseTimespan('2min');
        // Save indexed logs every 10k logs
        const PERSIST_COUNT = 10_000;

        fromBlock ??= ranges.fromBlock ?? 0;

        let time = Date.now();
        let contract = this.contract;
        let buffer = [] as ITxLogItem<any>[];
        let isStreamed = options?.streamed ?? false;
        let infos = {
            cached: 0,
            fetched: 0,
        };

        let cachedStreamedBuffer = [];
        if (isStreamed && typeof options?.onProgress === 'function') {
            cachedStreamedBuffer = await this.getItemsFromStore({
                fromBlock: fromBlock,
                toBlock: toBlock + 1,
                events,
                params: options?.params,
            });
            infos.cached = cachedStreamedBuffer.length;
            // Note: we don't emit progress right away to keep the order in progress callback
            // Consider: we have blocks [100-150] in cache
            // Requesting range: [50-200]
            // Later we fetch [50-100) and (150-200]
            // The cached response will be inserted after block.100 to keep consistent order
            // if (arr?.length > 0) {
            //     let lastBlock = arr[arr.length - 1].blockNumber;
            //     await options.onProgress({
            //         logs: arr,
            //         paged: arr,
            //         completed: false,
            //         blocksPerSecond: 0,
            //         blocks: { total: 0, loaded: 0 },
            //         timeLeftSeconds: 0,
            //         latestBlock: lastBlock
            //     });
            // }
        }

        let bufferCount = 0;
        let savedCount = 0;
        let onProgressCount = 0;
        let nodeStats = Date.now();
        let uniqueCount = 0;
        let unique = {};

        for (let i = 0; i < ranges.load.length; i++) {
            let range = ranges.load[i];
            let { fromBlock, toBlock, events: rangeEvents } = range;

            let fetched = await contract.getPastLogs(rangeEvents?.length > 0 ? rangeEvents : events, {
                streamed: options?.streamed,
                addresses: this.options.addresses,
                fromBlock: fromBlock,
                toBlock: toBlock,
                blockRangeLimits: options?.blockRangeLimits,
                params: options?.params,
                onProgress: async chunk => {
                    onProgressCount++;

                    buffer.push(...chunk.logs);
                    bufferCount += chunk.logs.length;
                    infos.fetched += chunk.logs.length;

                    for (let log of chunk.logs) {
                        let key = log.id + '';
                        if (key in unique) {
                            uniqueCount += 1;
                        }
                        unique[key] = 1;
                    }

                    let lastNodeStats = Date.now() - nodeStats;
                    if (lastNodeStats > 10 * 1000) {
                        nodeStats = Date.now();

                        l`OnProgressCalled cyan<${ onProgressCount}> BufferCount cyan<${bufferCount}> SavedCount cyan<${savedCount}> Unique `
                    }

                    let isCompleted = i < ranges.load.length - 1
                        ? false
                        : chunk.completed;

                    let now = Date.now();

                    let shouldPersist = isCompleted === true;
                    let shouldTimePersist = now - time >= PERSIST_INTERVAL;
                    let shouldCountPersist = buffer.length >= PERSIST_COUNT;

                    if (buffer.length > 0 && (shouldPersist || shouldTimePersist || shouldCountPersist)) {
                        let arr = buffer.slice();
                        buffer = [];
                        time = now;
                        savedCount += arr.length;
                        await this.upsert(arr, events, ranges, fromBlock, chunk.latestBlock, options);
                    }

                    if (options?.onProgress) {
                        // completed must be set to true only when the last Range completes
                        chunk.completed = isCompleted;
                        if (cachedStreamedBuffer.length > 0) {
                            if (chunk.logs.length > 0) {
                                // Preserve the order of logs in progress callback:
                                // insert cached.blockNumber < fetched.blockNumber first
                                let [ first ] = chunk.logs;
                                let i = 0;
                                for (; i < cachedStreamedBuffer.length; i++) {
                                    let x = cachedStreamedBuffer[i];
                                    if (x.blockNumber > first.blockNumber) {
                                        break;
                                    }
                                }
                                if (i > 0) {
                                    let before = cachedStreamedBuffer.splice(0, i);
                                    chunk.logs = before.concat(chunk.logs);
                                }
                            }
                            if (isCompleted) {
                                // insert everything left from cache
                                chunk.logs = chunk.logs.concat(cachedStreamedBuffer);
                                cachedStreamedBuffer = [];
                            }
                        }
                        await options.onProgress({
                            ...chunk,
                            infos,
                        });
                    }
                }
            });

            if (buffer.length > 0) {
                await this.upsert(buffer, events, ranges, fromBlock, toBlock, options);
            }
        }

        // Upsert final, if buffer is empty, we still persist the "toBlock" value and the ranges
        await this.upsert(buffer, events, ranges, fromBlock, toBlock, options);

        if (isStreamed && typeof options?.onProgress === 'function' && cachedStreamedBuffer.length > 0) {
            let lastBlock = cachedStreamedBuffer[cachedStreamedBuffer.length - 1].blockNumber;
            await options.onProgress({
                logs: cachedStreamedBuffer,
                paged: cachedStreamedBuffer,
                completed: true,
                blocksPerSecond: 0,
                blocks: { total: 0, loaded: 0 },
                timeLeftSeconds: 0,
                latestBlock: lastBlock,
                infos,
            });
        }

        if (isStreamed === true) {
            return;
        }

        let logs = await this.getItemsFromStore({
            fromBlock: fromBlock,
            toBlock: toBlock + 1,
            events: events,
            params: options?.params
        });

        infos.fetched = bufferCount;
        infos.cached = logs.length - infos.fetched;

        return {
            logs,
            infos,
        };
    }


    private async getItemsFromStore (filter: {
        fromBlock?: number
        toBlock?: number
        events?: string[]
        params?: Record<string, any>
    }) {
        let arr = await this.store.fetch(filter);
        let events = filter.events;
        if (events?.[0] !== '*') {
            let requestedEvents = alot(events).toDictionary(x => x);
            arr = arr.filter(x => x.event in requestedEvents);
        }
        let filterKey = this.getFilterKey(filter.params);
        arr = arr.filter(x => x.filterKey == filterKey);
        return alot(arr).sortBy(x => x.id).toArray();
    }
    private getFilterKey (params) {
        if (params == null) {
            return;
        }
        let arr = Array.isArray(params)
            ? params
            : Object.keys(params).map(key => `${key}=${params[key]}`);
        return arr.join('_');
    }

    private async getInitialBlockNumber () {
        let client = this.contract.client;
        if (client.platform !== 'hardhat') {
            let explorer = await BlockchainExplorerFactory.get(this.contract.client.platform);
            let deployment = new ContractCreationResolver(client, explorer);
            let contractInfo = await deployment.getInfo(this.contract.address);
            return $require.Number(contractInfo.block, `Contract deployment not resolved from the blockchain explorer`);
        }
        return 0;
    }

    @memd.deco.queued()
    private async upsert (
        logs: TEventsIndexerItem[],
        events: string[],
        ranges: TRangeLoader,
        fromBlock: number,
        latestBlock: number,
        options: { params? }
    ) {
        let filterKey = this.getFilterKey(options?.params);
        if (logs?.length > 0) {
            for (let log of logs) {
                log.filterKey = filterKey;
            }
            await this.store.upsertMany(logs);
        }
        const logsMeta =  events.map(event => {
            let currentMeta = ranges
                .current
                .find(x => x.event === event);

            let arr = PackedRanges.union([
                currentMeta?.ranges ?? [],
                [[fromBlock, latestBlock]]
            ]);
            return {
                event,
                lastBlock: latestBlock,
                filterKey: filterKey,
                ranges: arr,
            };
        });
        await this.storeMeta.upsertMany(logsMeta);
    }
}

type TRange = {
    events: string[]
    fromBlock: number
    toBlock: number
    filterKey?: string
}


type TRangeLoader = {
    fromBlock: number
    current: TEventsIndexerMeta[]
    load: TRange[]
}

type GetEventLogNames<T extends ContractBase> = keyof T['Types']['Events'];
type GetTypes<T extends ContractBase> = T['Types'];
