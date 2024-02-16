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
import { JsonObjectStore } from '@dequanto/json/JsonObjectStore';


type TItem = ITxLogItem<any>
type TMeta = {
    lastBlock: number
}

export interface IEventsIndexerStore {
    upsertMany(logs: TItem[]): Promise<TItem[]>
    query (): Promise<Alot<TItem>>
}

export interface IMetaStore {
    get(): Promise<TMeta>
    save (meta: TMeta): Promise<TMeta>
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

        this.storeMeta = options?.storeMeta ?? new JsonObjectStore<TMeta>({
            path: `${directly}/${key}/${options.name}-${contract.address}-meta.json`
        });
    }

    async getPastLogs <
        TMethodName extends GetPastLogsMethods<T>,
    > (
        method: TMethodName,
        // Fetch all logs and filter later if needed
        //- params?: T[TMethodName] extends (options: { params?: infer TParams }) => any ? TParams : never
    ): Promise<{
        logs: T[TMethodName] extends (options: { params?: any }) => Promise<infer TReturn> ? (TReturn extends unknown ? TItem[] : TReturn) : never
    }> {
        let contract = this.contract;
        let client = contract.client;
        let meta = await this.storeMeta.get();
        let fromBlock = Math.max(0, meta?.lastBlock ?? ((this.options.initialBlockNumber ?? 0) - 1));
        if (fromBlock > 0) {
            fromBlock = fromBlock + 1;
        } else if (client.platform !== 'hardhat') {
            let explorer = await BlockChainExplorerProvider.get(this.contract.client.platform);
            let deployment = new ContractCreationResolver(client, explorer);
            let contractInfo = await deployment.getInfo(this.contract.address);
            fromBlock = $require.Number(contractInfo.block, `Contract deployment not resolved from the blockchain explorer`);
        }

        let latestBlock = await client.getBlockNumber();
        let event = (method as string).replace('getPastLogs', '');
        let PERSIST_INTERVAL = $date.parseTimespan('2min');
        let time = Date.now();
        let buffer = [] as TItem[];

        let fetched = await contract.$getPastLogsParsed(event, {
            fromBlock: fromBlock,
            toBlock: latestBlock,
            onProgress: async info => {
                buffer.push(...info.paged);

                let now = Date.now();
                if (buffer.length > 0 && now - time > PERSIST_INTERVAL) {
                    let cloned = buffer.slice();
                    buffer = [];
                    time = now;
                    let maxBlock = alot(buffer).max(x => x.blockNumber);
                    await this.upsert(cloned);
                    await this.storeMeta.save({
                        ...meta,
                        lastBlock: maxBlock
                    });
                }
            }
        });

        await this.upsert(fetched);
        await this.storeMeta.save({
            ...meta,
            lastBlock: latestBlock
        });

        let allLogs = await this.getItemsFromStore();
        return {
            logs: allLogs as any
        };
    }

    private async getItemsFromStore () {
        return (await this.store.query()).toArray();
    }

    @memd.deco.queued()
    private async upsert (logs) {
        await this.store.upsertMany(logs);
    }
}

type GetPastLogsMethods<T> = {
    [P in keyof T]: T[P] extends ((options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: any
    }) => Promise<ITxLogItem<any>[]>) ? P : never;
}[keyof T];
