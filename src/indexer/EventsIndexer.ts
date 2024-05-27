import alot from 'alot';
import memd from 'memd';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { ContractCreationResolver } from '@dequanto/contracts/ContractCreationResolver';
import { BlockChainExplorerProvider } from '@dequanto/explorer/BlockChainExplorerProvider';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { $date } from '@dequanto/utils/$date';
import { $require } from '@dequanto/utils/$require';
import { TAddress } from '@dequanto/models/TAddress';
import { IEventsIndexerMetaStore, IEventsIndexerStore } from './storage/interfaces';
import { FsEventsIndexerStore } from './storage/FsEventsIndexerStore';
import { FsEventsMetaStore } from './storage/FsEventsMetaStore';


export class EventsIndexer <T extends ContractBase> {

    public store: IEventsIndexerStore
    public storeMeta: IEventsIndexerMetaStore

    constructor(public contract: T, public options: {
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

    /** @deprecated For migration only */
    async fsEnsureMigrated () {
        $require.True(this.store instanceof FsEventsIndexerStore);
        $require.True(this.storeMeta instanceof FsEventsMetaStore);

        await (this.store as FsEventsIndexerStore<T>).ensureMigrated();
        await (this.storeMeta as FsEventsMetaStore<T>).ensureMigrated();
    }

    async getPastLogs <
        TLogName extends GetEventLogNames<T>,
    > (
        event: TLogName | TLogName[] | '*',
        // Fetch all logs and filter later if needed
        //- params?: T[TMethodName] extends (options: { params?: infer TParams }) => any ? TParams : never,
        filter?: {
            fromBlock?: number
            toBlock?: number
        }
    ): Promise<{
        logs: ITxLogItem<GetTypes<T>['Events'][TLogName]['outputParams']>[],
    }> {
        let contract = this.contract;
        let client = contract.client;
        let toBlock = filter?.toBlock ?? await client.getBlockNumber();
        let events = Array.isArray(event) ? event as string[] : [ event as string ];
        let ranges = await this.getRanges(events, this.options.initialBlockNumber, toBlock)
        let logs = await this.getPastLogsRanges(ranges, events, toBlock, filter?.fromBlock);

        return {
            logs: logs as any
        };
    }

    private async getRanges (events: string[], initialBlockNumber: number, toBlock: number, fromBlock?: number): Promise<TRange[]> {
        let logsMetaArr = await this.storeMeta.fetch();
        let eventsBlock = alot(logsMetaArr).toDictionary(x => x.event, x => x.lastBlock);
        let logsMeta = events.map(event => {
            let blockNr = eventsBlock[event] ?? initialBlockNumber;
            return {
                event: event,
                lastBlock: blockNr
            }
        });
        let hasInitialBlock = logsMeta.every(x => x.lastBlock != null);
        if (hasInitialBlock === false) {
            let blockNr = await this.getInitialBlockNumber();
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
    private async getPastLogsRanges (ranges: TRange[], events: string[], toBlock: number, fromBlock?: number) {
        // Save indexed logs every 2 minutes
        let PERSIST_INTERVAL = $date.parseTimespan('2min');
        let time = Date.now();
        let contract = this.contract;
        let buffer = [] as ITxLogItem<any>[];

        for (let i = 0; i < ranges.length; i++) {
            let range = ranges[i];
            let { fromBlock, toBlock, events } = range;

            let fetched = await contract.getPastLogs(events, {
                addresses: this.options.addresses,
                fromBlock: fromBlock,
                toBlock: toBlock,
                onProgress: async info => {
                    buffer.push(...info.paged);

                    let now = Date.now();
                    if (buffer.length > 0 && now - time > PERSIST_INTERVAL) {
                        let cloned = buffer.slice();
                        buffer = [];
                        time = now;

                        await this.upsert(cloned, events, info.latestBlock);
                    }
                }
            });

            await this.upsert(fetched, events, toBlock);
        }


        await this.upsert(buffer, events, toBlock);

        let requestedEvents = alot(events).toDictionary(x => x);
        let allLogs = await this.getItemsFromStore({
            fromBlock: fromBlock,
            toBlock: toBlock + 1,
        });

        let logs = events[0] === '*'
            ? allLogs
            : allLogs.filter(x => x.event in requestedEvents );
        return logs;
    }

    private async getItemsFromStore (filter: {
        fromBlock?: number
        toBlock?: number
    }) {
        return await this.store.fetch(filter);
    }

    private async getInitialBlockNumber () {
        let client = this.contract.client;
        if (client.platform !== 'hardhat') {
            let explorer = await BlockChainExplorerProvider.get(this.contract.client.platform);
            let deployment = new ContractCreationResolver(client, explorer);
            let contractInfo = await deployment.getInfo(this.contract.address);
            return $require.Number(contractInfo.block, `Contract deployment not resolved from the blockchain explorer`);
        }
        return 0;
    }

    @memd.deco.queued()
    private async upsert (logs, events: string[], latestBlock: number) {
        await this.store.upsertMany(logs);

        const logsMeta =  events.map(event => ({ event, lastBlock: latestBlock }));
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
