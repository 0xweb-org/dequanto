import { $abiType } from '@dequanto/utils/$abiType';
import { ISlotVarDefinition, SlotsParser } from '../../SlotsParser';
import { SlotsStorage } from '../../SlotsStorage';
import { $types } from '../../utils/$types';
import { SlotsStorageTransportForMapping } from '../SlotsStorageTransport';
import { ASlotsStorageHandler } from '../SlotsStorageHandler';
import { IAccessorItem } from '../Accessor';

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
        throw new Error(`SlotMappingReader doesn't support fetchAll method, as size could be infinite`);
    }

    private async getStorageInner(key: IAccessorItem): Promise<any> {

        let { slot } = this;
        let mapValueType = $abiType.mapping.getValueType(slot.type);
        let mapValueSlots = await SlotsParser.slotsFromAbi(mapValueType);

        let transport = new SlotsStorageTransportForMapping(
            this.transport,
            this.slot.slot,
            key.key,
            mapValueSlots.length
        );
        let storage = new SlotsStorage(transport, mapValueSlots);
        return storage;
    }
}
