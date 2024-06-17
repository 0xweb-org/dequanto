import alot from 'alot'
import { TAddress } from '@dequanto/models/TAddress'
import { IEventsIndexerStore } from './interfaces'
import { TAbiInput, TAbiItem } from '@dequanto/types/TAbi'
import { ContractBase } from '@dequanto/contracts/ContractBase'
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem'
import { $date } from '@dequanto/utils/$date'
import { JsonArrayMultiStore } from '@dequanto/json/JsonArrayMultiStore'
import { FsEventsStoreUtils } from './FsEventsStoreUtils'
import { $require } from '@dequanto/utils/$require'
import { JsonArrayStore } from '@dequanto/json/JsonArrayStore'
import { File } from 'atma-io'


export class FsEventsIndexerStore <T extends ContractBase> implements IEventsIndexerStore {
    private store: JsonArrayMultiStore<ITxLogItem<any>>

    /** @deprecated For migration only */
    private storeV0: JsonArrayStore<ITxLogItem<any>>
    private range: number;
    private abi: Record<string, TAbiItem>;


    constructor(public contract: T, public options: {
        // Load events from the contract that was deployed to multiple addresses
        addresses?: TAddress[]
        name?: string
        initialBlockNumber?: number
        fs?: {
            directory?: string

            // the events will be splitted into multiple files by block range
            // default ~1week
            rangeSeconds?: number
            // default is taken from Web3Client
            blockTimeAvg?: number

            // Use a single file. Deprecated, used for migration only
            singleFile?: boolean
        }
    }) {
        let client = contract.client;
        let blockTimeAvg = options?.fs?.blockTimeAvg ?? client.options.blockTimeAvg;
        let rangeSeconds = options?.fs?.rangeSeconds ?? $date.parseTimespan('1week',  {  get: 's' });

        this.range = Math.floor(rangeSeconds / blockTimeAvg);
        this.abi = alot(this.contract.abi).filter(x => x.type === 'event').toDictionary(x => x.name, x => x);

        let path = FsEventsStoreUtils.getDirectory(contract, {
            name: options.name,
            addresses: options.addresses,
            directory: options.fs?.directory,
        });

        this.store = new JsonArrayMultiStore<ITxLogItem<any>>({
            path: path,
            key: x => x.id,
            map: x => this.map(x),
            serialize: x => this.serialize(x),
            groupKey: x => x.blockNumber,
            groupSize: this.range
        });

        this.storeV0 = new JsonArrayStore<ITxLogItem<any>>({
            path: path.replace(/\/$/, '.json'),
            key: x => x.id,
            map: x => this.map(x),
            serialize: x => this.serialize(x),
        });
    }
    async upsertMany(logs: ITxLogItem<any, string>[]): Promise<ITxLogItem<any, string>[]> {
        return await this.store.upsertMany(logs);
    }
    async removeMany(logs: ITxLogItem<any, string>[]): Promise<any> {
        return await this.store.removeMany(logs);
    }

    async fetch(filter?: {
        fromBlock?: number
        toBlock?: number
    }): Promise<ITxLogItem<any, string>[]> {
        return await this.store.fetch({
            groupKey: {
                from: filter?.fromBlock,
                to: filter?.toBlock
            }
        });
    }

    /** @deprecated For migration only */
    async ensureMigrated () {
        let arr = await this.storeV0.getAll();
        if (arr.length > 0) {
            await this.upsertMany(arr);
            await File.removeAsync(this.storeV0.options.path);
        }
    }

    private map (x): ITxLogItem<any> {

        let abi = this.abi[x.event];
        $require.notNull(abi, `Abi for ${x.event} not found.`)

        let blockNumber = Math.floor(x.id / 100000);
        let logIndex = x.id % 100000;
        x.params = EventAbiInputs.deserialize(x.params, abi);
        return {
            ...x,
            blockNumber,
            logIndex,
            arguments: abi.inputs.map(input => {
                return x.params[input.name];
            })
        };
    }
    private serialize (x: ITxLogItem<any>) {
        return {
            ...x,
            // remove redundant data
            arguments: void 0,
            blockNumber: void 0,
            logIndex: void 0,
        };
    }

}




namespace EventAbiInputs {
    // primary to convert BigInt from JSON

    export function deserialize (params: Record<string, any>, abi: TAbiItem): Record<string, any> {
        let inputs = alot(abi.inputs).toDictionary(x => x.name, x => x);
        for (let key in params) {
            let abiInput = inputs[key];
            if (abiInput) {
                params[key] = deserializeValue(params[key], abiInput);
            }
        }
        return params;
    }

    function deserializeValue (value: any, abiInput: TAbiInput): any {
        if (value == null || abiInput == null) {
            return value;
        }
        if (typeof value === 'string' && abiInput.type.startsWith('uint')) {
            return BigInt(value);
        }

        let arrayRgx = /\[\d*\]$/;
        let isArrayType = arrayRgx.test(abiInput.type);
        if (isArrayType && Array.isArray(value)) {
            let type = abiInput.type.replace(arrayRgx, '');
            let abiItem = { ...abiInput, type };
            return value.map(x => deserializeValue(x, abiItem));
        }

        if (abiInput.type === 'tuple' && abiInput.components != null && typeof value === 'object') {
            let result = {};
            let abiComponents = alot(abiInput.components).toDictionary(x => x.name, x => x);
            for (let key in value) {
                let abiItem = abiComponents[key];
                result[key] = deserializeValue(value[key], abiItem);
            }
            return result;
        }
        return value;
    }
}
