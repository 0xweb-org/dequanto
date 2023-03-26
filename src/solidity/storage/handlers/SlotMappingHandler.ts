import { $abiType } from '@dequanto/utils/$abiType';
import { SlotsParser } from '../../SlotsParser';
import { SlotsStorage } from '../../SlotsStorage';
import { $types } from '../../utils/$types';
import { SlotsStorageTransportForMapping } from '../SlotsStorageTransport';
import { ASlotsStorageHandler } from '../SlotsStorageHandler';
import { IAccessorItem } from '../Accessor';
import { ISlotVarDefinition } from '@dequanto/solidity/SlotsParser/models';
import alot from 'alot';
import { File } from 'atma-io';

export class SlotMappingHandler extends ASlotsStorageHandler {

    static supports (slot: ISlotVarDefinition): boolean {
        return $types.isMapping(slot.type);
    }

    async get(keys: IAccessorItem[]): Promise<any> {
        if (keys == null || keys.length === 0) {
            return this.fetchAll();
        }
        let key = keys.shift();
        let reader = await this.getStorageInner(key);
        return reader.get(keys);
    }

    async set(keys: IAccessorItem[], value: any): Promise<any> {
        if (keys == null || keys.length === 0) {
            throw new Error(`saveAll not implemented`);
        }
        let key = keys.shift();
        let storage = await this.getStorageInner(key);
        storage.set(keys, value);
    }

    async fetchAll () {
        let mapping = await this.transport.extractMappingKeys({
            slot: this.slot
        });
        let entries = await alot(mapping.keys)
            .mapAsync(async key => {
                let accessor = key.map(x => ({ type: 'key', key: x }));
                let value = await this.get(accessor as any[]);
                return { key, value }
            })
            // Load all keys at once. The underlying layer can handle the batching
            .toArrayAsync({ threads: mapping.keys.length });

        return alot(entries).toDictionary(x => x.key, x => x.value);
    }

    private async getStorageInner(accessor: IAccessorItem): Promise<SlotsStorage> {

        let { slot } = this;
        let mapValueType = $abiType.mapping.getValueType(slot.type);
        let mapKeyType = $abiType.mapping.getKeyType(slot.type);
        let mapValueSlots = await SlotsParser.slotsFromAbi(mapValueType);
        let key = accessor.key;
        if (typeof key === 'string' && mapKeyType.includes('int') && isNaN(Number(key)) === false) {
            // just to fix the errors when we used string literals as the key, for example
            // mapping(uint => address) foo;
            // foo['5'] = 5
            key = Number(key);
        }

        let transport = new SlotsStorageTransportForMapping(
            this.transport,
            this.slot.slot,
            key,
            mapValueSlots.length
        );
        let storage = new SlotsStorage(transport, mapValueSlots);
        return storage;
    }
}
