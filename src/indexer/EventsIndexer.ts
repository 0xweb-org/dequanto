import alot from 'alot';
import memd from 'memd';
import { ContractBase, TEventLogOptions } from '@dequanto/contracts/ContractBase';
import { ContractCreationResolver } from '@dequanto/contracts/ContractCreationResolver';
import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { $date } from '@dequanto/utils/$date';
import { $require } from '@dequanto/utils/$require';
import { TAddress } from '@dequanto/models/TAddress';
import { IEventsIndexerMetaStore, IEventsIndexerStore, TEventsIndexerItem } from './storage/interfaces';
import { FsEventsIndexerStore } from './storage/FsEventsIndexerStore';
import { FsEventsMetaStore } from './storage/FsEventsMetaStore';
import { class_Dfr } from 'atma-utils';
import { TLogsRangeProgress } from '@dequanto/clients/Web3Client';
import { WClient } from '@dequanto/clients/ClientPool';
import { TEth } from '@dequanto/models/TEth';
import { l } from '@dequanto/utils/$logger';


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
    }> {
        let contract = this.contract;
        let client = contract.client;
        let toBlock = filter?.toBlock ?? await client.getBlockNumber();
        let events = Array.isArray(event) ? event as string[] : [ event as string ];
        let filterKey = this.getFilterKey(filter?.params);
        let ranges = await this.getRanges(events, this.options.initialBlockNumber, toBlock, { filterKey });
        let logs = await this.getPastLogsRanges(ranges, events, toBlock, filter?.fromBlock, {
            params: filter?.params as any
        });
        return {
            logs: logs as any
        };
    }

    async * getPastLogsStream <
        TLogName extends GetEventLogNames<TContract>,
    > (
        event: TLogName | TLogName[] | '*',
        options?: {
            fromBlock?: number
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
        let toBlock = options?.toBlock ?? await client.getBlockNumber();
        let events = Array.isArray(event) ? event as string[] : [ event as string ];
        let filterKey = this.getFilterKey(options?.params);
        let ranges = await this.getRanges(events, options?.fromBlock ?? this.options.initialBlockNumber, toBlock, {
            filterKey
        });

        let dfrInner = new class_Dfr<any>();
        let dfrOuter = new class_Dfr<any>();

        this.getPastLogsRanges(ranges, events, toBlock, options?.fromBlock, {
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

    async removeCached (params: {
        fromBlock: number
    }) {
        let events = await this.store.fetch({ fromBlock: params.fromBlock });
        l`Removing ${events.length} from Block #${params.fromBlock}...`;
        await this.store.removeMany(events);

        let metas = await this.storeMeta.fetch();
        let lastBlock = params.fromBlock - 1;
        if (lastBlock < 0) {
            await this.storeMeta.removeMany(metas)
        } else {
            metas.forEach(x => {
                x.lastBlock = Math.min(x.lastBlock, lastBlock);
            });
            await this.storeMeta.upsertMany(metas);
        }
    }

    private async getRanges (events: string[], initialBlockNumber: number, toBlock: number, opts: {
        fromBlock?: number
        filterKey?: string
    }): Promise<TRange[]> {
        let logsMetaArr = await this.storeMeta.fetch();
        let eventsBlock = alot(logsMetaArr)
            .filter(x => x.filterKey == opts?.filterKey)
            .toDictionary(x => x.event, x => x.lastBlock);
        let logsMeta = events.map(event => {
            let blockNr = eventsBlock[event] ?? initialBlockNumber;
            return {
                event: event,
                lastBlock: blockNr
            }
        });
        let hasInitialBlock = logsMeta.every(x => x.lastBlock != null);
        if (hasInitialBlock === false) {
            let blockNr = opts?.fromBlock ?? await this.getInitialBlockNumber();
            logsMeta.filter(x => x.lastBlock == null).forEach(x => x.lastBlock = blockNr);
        };

        let ranges = [] as TRange[];
        let blockNumbers = [ ...logsMeta.map(x => x.lastBlock), toBlock ];
        let blockNumberSteps = alot(blockNumbers).distinct().sortBy(x => x).toArray();

        for (let i = 0; i < blockNumberSteps.length - 1; i++) {
            let from = blockNumberSteps[i];
            if (i > 0) {
                from += 1;
            }
            let to = blockNumberSteps[i + 1];
            let events = logsMeta.filter(x => x.lastBlock < to).map(x =>x.event);
            ranges.push({
                fromBlock: from,
                toBlock: to,
                events: events
            });
        }
        return ranges;
    }
    private async getPastLogsRanges (ranges: TRange[], events: string[], toBlock: number, fromBlock?: number, options?: TEventLogOptions<any>) {
        // Save indexed logs every 2 minutes
        const PERSIST_INTERVAL = $date.parseTimespan('2min');
        // Save indexed logs every 10k logs
        const PERSIST_COUNT = 10_000;

        let time = Date.now();
        let contract = this.contract;
        let buffer = [] as ITxLogItem<any>[];
        let isStreamed = options?.streamed ?? false

        if (isStreamed && typeof options?.onProgress === 'function') {
            let arr = await this.getItemsFromStore({
                fromBlock: fromBlock,
                toBlock: toBlock,
                events,
                params: options?.params,
            });
            if (arr?.length > 0) {
                let lastBlock = arr[arr.length - 1].blockNumber;
                await options.onProgress({
                    logs: arr,
                    paged: arr,
                    completed: false,
                    blocksPerSecond: 0,
                    blocks: { total: 0, loaded: 0 },
                    timeLeftSeconds: 0,
                    latestBlock: lastBlock
                });
                // if (fromBlock != null) {
                //     let latestFromStorage = alot(arr).max(x => x.blockNumber);
                //     fromBlock = latestFromStorage + 1;
                //     if (toBlock != null && fromBlock >= toBlock) {
                //         // we got all from storage
                //         return;
                //     }
                // }

                // Adjust ranges to skip blocks already in storage
                for (let i = 0; i < ranges.length; i++) {
                    let range = ranges[i];
                    if (range.toBlock <= lastBlock) {
                        ranges.splice(i, 1);
                        i--;
                        continue;
                    }
                    if (range.fromBlock < lastBlock) {
                        range.fromBlock = lastBlock + 1;
                    }
                }
            }
        }

        let bufferCount = 0;
        let savedCount = 0;
        let onProgressCount = 0;
        let nodeStats = Date.now();
        let uniqueCount = 0;
        let unique = {};

        for (let i = 0; i < ranges.length; i++) {
            let range = ranges[i];
            let { fromBlock, toBlock, events: rangeEvents } = range;

            let fetched = await contract.getPastLogs(rangeEvents?.length > 0 ? rangeEvents : events, {
                streamed: options?.streamed,
                addresses: this.options.addresses,
                fromBlock: fromBlock,
                toBlock: toBlock,
                blockRangeLimits: options?.blockRangeLimits,
                params: options?.params,
                onProgress: async info => {
                    onProgressCount++;

                    buffer.push(...info.logs);
                    bufferCount += info.logs.length;

                    for (let log of info.logs) {
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

                    let isCompleted = i < ranges.length - 1
                        ? false
                        : info.completed;

                    let now = Date.now();

                    let shouldPersist = isCompleted === true;
                    let shouldTimePersist = now - time >= PERSIST_INTERVAL;
                    let shouldCountPersist = buffer.length >= PERSIST_COUNT;

                    if (buffer.length > 0 && (shouldPersist || shouldTimePersist || shouldCountPersist)) {
                        let arr = buffer.slice();
                        buffer = [];
                        time = now;
                        savedCount += arr.length;
                        await this.upsert(arr, events, info.latestBlock, options);
                    }

                    if (options?.onProgress) {
                        // completed must be set to true only when the last Range completes
                        info.completed = isCompleted;
                        await options.onProgress(info);
                    }
                }
            });

            if (buffer.length > 0) {
                await this.upsert(buffer, events, toBlock, options);
            }
        }

        // Upsert final, if buffer is empty, we still persist the "toBlock" value
        await this.upsert(buffer, events, toBlock, options);

        if (isStreamed === true) {
            return;
        }

        let logs = await this.getItemsFromStore({
            fromBlock: fromBlock,
            toBlock: toBlock + 1,
            events: events,
            params: options?.params
        });

        return logs;
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
        return arr;
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
    private async upsert (logs: TEventsIndexerItem[], events: string[], latestBlock: number, options: { params? }) {
        let filterKey = this.getFilterKey(options?.params);
        if (logs?.length > 0) {
            for (let log of logs) {
                log.filterKey = filterKey;
            }
            await this.store.upsertMany(logs);
        }
        const logsMeta =  events.map(event => ({
            event,
            lastBlock: latestBlock,
            filterKey: filterKey,
        }));
        await this.storeMeta.upsertMany(logsMeta);
    }
}

type TRange = {
    events: string[]
    fromBlock: number
    toBlock: number
}


type GetEventLogNames<T extends ContractBase> = keyof T['Types']['Events'];
type GetTypes<T extends ContractBase> = T['Types'];
