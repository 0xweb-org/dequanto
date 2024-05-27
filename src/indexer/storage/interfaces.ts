import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem'

type TItem = ITxLogItem<any>

export type TEventsIndexerMeta = {
    event: string
    lastBlock: number
}

export interface IEventsIndexerStore {
    upsertMany(logs: TItem[]): Promise<TItem[]>
    fetch (options?: {
        fromBlock?: number
        toBlock?: number
    }): Promise<TItem[]>
}

export interface IEventsIndexerMetaStore {
    upsertMany(meta: TEventsIndexerMeta[]): Promise<TEventsIndexerMeta[]>
    fetch (): Promise<TEventsIndexerMeta[]>
}
