import { TAddress } from '@dequanto/models/TAddress'
import { IEventsIndexerMetaStore, TEventsIndexerMeta } from './interfaces'
import { JsonArrayStore } from '@dequanto/json/JsonArrayStore'
import { ContractBase } from '@dequanto/contracts/ContractBase'
import { FsEventsStoreUtils } from './FsEventsStoreUtils'
import { File } from 'atma-io'


export class FsEventsMetaStore <T extends ContractBase> implements IEventsIndexerMetaStore {
    private store: JsonArrayStore<TEventsIndexerMeta>

    /** @deprecated For migration only */
    private storeV0: JsonArrayStore<TEventsIndexerMeta>


    constructor(private contract: T, private options: {
        // Load events from the contract that was deployed to multiple addresses
        addresses?: TAddress[]
        name?: string
        fs?: {
            directory?: string,

            singleFile?: boolean
        }
    }) {

        let directory = FsEventsStoreUtils.getDirectory(contract, {
            name: options.name,
            addresses: options.addresses,
            directory: options.fs?.directory
        });


        this.store = new JsonArrayStore<TEventsIndexerMeta>({
            path: `${directory}meta-arr.json`,
            key: x => x.event
        });

        this.storeV0 = new JsonArrayStore<TEventsIndexerMeta>({
            path: `${directory.replace(/\/$/, '')}-meta-arr.json`,
            key: x => x.event
        });
    }

    /** @deprecated For migration only */
    async ensureMigrated () {
        if (await File.existsAsync(this.storeV0.options.path)) {
            let arr = await this.storeV0.getAll();
            await this.store.upsertMany(arr);
            await File.removeAsync(this.storeV0.options.path);
        }
    }

    async upsertMany(meta: TEventsIndexerMeta[]): Promise<TEventsIndexerMeta[]> {
        return await this.store.upsertMany(meta);
    }

    async fetch(): Promise<TEventsIndexerMeta[]> {
        return await this.store.getAll();
    }

    async removeMany (meta: TEventsIndexerMeta[]) {
        await this.store.removeMany(meta.map(x => x.event));
    }

}


