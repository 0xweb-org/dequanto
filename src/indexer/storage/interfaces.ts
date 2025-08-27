import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem'

export type TEventsIndexerItem = ITxLogItem<any> & {
    filterKey?: string
}

export type TEventsIndexerMeta = {
    event: string
    lastBlock: number
    filterKey?: string
}

export interface IEventsIndexerStore {
    upsertMany(logs: TEventsIndexerItem[]): Promise<TEventsIndexerItem[]>
    removeMany(logs: TEventsIndexerItem[]): Promise<any>

    fetch (options?: {
        fromBlock?: number
        toBlock?: number
    }): Promise<TEventsIndexerItem[]>

    merge (store: IEventsIndexerStore): Promise<any>
}

export interface IEventsIndexerMetaStore {
    upsertMany(meta: TEventsIndexerMeta[]): Promise<TEventsIndexerMeta[]>
    fetch (): Promise<TEventsIndexerMeta[]>
    removeMany(meta: TEventsIndexerMeta[]): Promise<any>
}
