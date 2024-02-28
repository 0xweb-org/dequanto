import alot from 'alot';
import memd from 'memd';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { ContractCreationResolver } from '@dequanto/contracts/ContractCreationResolver';
import { BlockChainExplorerProvider } from '@dequanto/explorer/BlockChainExplorerProvider';
import { JsonArrayStore } from '@dequanto/json/JsonArrayStore';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { $date } from '@dequanto/utils/$date';
import { $require } from '@dequanto/utils/$require';
import type { Alot } from 'alot/alot';


type TItem = ITxLogItem<any>
type TMeta = {
    event: string
    lastBlock: number
}

export interface IEventsIndexerStore {
    upsertMany(logs: TItem[]): Promise<TItem[]>
    query (): Promise<Alot<TItem>>
}

export interface IMetaStore {
    upsertMany(meta: TMeta[]): Promise<TMeta[]>
    getAll (): Promise<TMeta[]>
}

export class EventsIndexer <T extends ContractBase> {

    public store: IEventsIndexerStore
    public storeMeta: IMetaStore

    constructor(public contract: T, public options: {
        name?: string
        initialBlockNumber?: number
        store?: IEventsIndexerStore
        storeMeta?: IMetaStore
        fs?: {
            directory?: string
        }
    }) {
        let client = contract.client;
        let key = client.network.replace(':', '-');
        let directly = options?.fs?.directory ?? `./data/tx-logs`;
        this.store = options?.store ?? new JsonArrayStore<ITxLogItem<any>>({
            path: `${directly}/${key}/${options.name}-${contract.address}.json`,
            key: x => x.id
        });

        this.storeMeta = options?.storeMeta ?? new JsonArrayStore<TMeta>({
            path: `${directly}/${key}/${options.name}-${contract.address}-meta-arr.json`,
            key: x => x.event
        });
    }

    async getPastLogs <
        TLogName extends GetEventLogNames<T>,
    > (
        event: TLogName | TLogName[],
        // Fetch all logs and filter later if needed
        //- params?: T[TMethodName] extends (options: { params?: infer TParams }) => any ? TParams : never
    ): Promise<{
        logs: ITxLogItem<GetTypes<T>['Events'][TLogName]['outputParams']>[],
    }> {
        let contract = this.contract;
        let client = contract.client;
        let latestBlock = await client.getBlockNumber();
        let events = Array.isArray(event) ? event as string[] : [ event as string ];
        let ranges = await this.getRanges(events, this.options.initialBlockNumber, latestBlock)
        let logs = await this.getPastLogsRanges(ranges, events, latestBlock);

        return {
            logs: logs as any
        };
    }

    private async getRanges (events: string[], initialBlockNumber: number, toBlock: number): Promise<TRange[]> {
        let logsMetaArr = await this.storeMeta.getAll();
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
    private async getPastLogsRanges (ranges: TRange[], events: string[], toBlock: number) {
        // Save indexed logs every 2 minutes
        let PERSIST_INTERVAL = $date.parseTimespan('2min');
        let time = Date.now();
        let contract = this.contract;
        let buffer = [] as TItem[];

        for (let i = 0; i < ranges.length; i++) {
            let range = ranges[i];
            let { fromBlock, toBlock, events } = range;

            let fetched = await contract.getPastLogs(events, {
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
        let allLogs = await this.getItemsFromStore();

        let logs = allLogs.filter(x => x.event in requestedEvents );
        return logs;
    }

    private async getItemsFromStore () {
        return (await this.store.query()).toArray();
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

