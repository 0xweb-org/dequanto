import { JsonObjectStore } from '@dequanto/json/JsonObjectStore';
import { TTxWriterJson } from '../TxWriter';
import { GasWatcherTx, IGasWatcherCondition } from './GasWatcherTx';

export interface IGasWatcherStore {
    savePrice (enty: {date: Date, price: bigint}): Promise<any>
    loadPrices (from: Date, toDate): Promise<{ date: Date, price: bigint }[]>

    saveTxs (pending: ReturnType<GasWatcherTx['toJSON']>[]): Promise<any>
    loadTxs (): Promise<ReturnType<GasWatcherTx['toJSON']>[]>
}

type GasWatcherTxJson = {
    condition: IGasWatcherCondition
    writer: TTxWriterJson
}

export class GasWatcherStore implements IGasWatcherStore {
    protected jsonStore: JsonObjectStore<GasWatcherTxJson[]>

    constructor (public name = '') {
        this.jsonStore =  new JsonObjectStore<GasWatcherTxJson[]>({
            path: `./db/gaswatcher/txs${this.name}.json`,
            format: true,
        })
    }

    async savePrice(enty: { date: Date; price: bigint; }): Promise<any> {

    }
    async loadPrices(from: Date, toDate: any): Promise<{ date: Date; price: bigint; }[]> {
        return [];
    }
    async saveTxs(txs: GasWatcherTxJson[]): Promise<any> {
        return this.jsonStore.save(txs);
    }
    async loadTxs(): Promise<GasWatcherTxJson[]> {
        return this.jsonStore.get();
    }

}
