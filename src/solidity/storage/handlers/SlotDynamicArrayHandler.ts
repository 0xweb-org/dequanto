import alot from 'alot';
import { SlotsParser } from '@dequanto/solidity/SlotsParser';
import { $abiType } from '@dequanto/utils/$abiType';
import { SlotsStorage } from '../../SlotsStorage';
import { IAccessorItem } from '../Accessor';
import { SlotsStorageTransportForArray } from '../SlotsStorageTransport';
import { ASlotDynamicArray } from '../SlotDynamicArray';

export class SlotDynamicArrayHandler extends ASlotDynamicArray {

    async get(keys: IAccessorItem[]): Promise<any> {
        if (keys == null || keys.length === 0) {
            return this.fetchAll();
        }
        let key = keys.shift();
        if (key.key === 'length') {
            return this.length();
        }
        let reader = await this.getStorageInner(key);
        return reader.get(keys);
    }

    async set(keys: IAccessorItem[], value: any): Promise<any> {
        if (keys == null || keys.length === 0) {
            throw new Error(`saveAll not implemented`);
        }
        let key = keys.shift();
        let reader = await this.getStorageInner(key);
        reader.set(keys, value);
    }

    async fetchAll () {
        let arrLength = await this.length();

        return await alot.fromRange(0, arrLength).mapAsync(async i => {
            return this.get([{ key: i, type: 'index' }]);
        }).toArrayAsync()
    }


    private async getStorageInner(key: IAccessorItem): Promise<any> {

        if (key.type !== 'index') {
            throw new Error(`Expected to get the Array index as a Key got ${key.key} as ${key.type}`);
        }

        let baseType = $abiType.array.getBaseType(this.slot.type);
        let baseSlots = await SlotsParser.slotsFromAbi(baseType);

        // take the last slot index as that one will give us the TOTAL SLOTs per element
        let slotsPerElement = baseSlots[baseSlots.length - 1].slot + 1;

        let transport = new SlotsStorageTransportForArray(this.transport, this.slot.slot, key.key, slotsPerElement, this.slot);
        let storage = new SlotsStorage(transport, baseSlots);
        return storage;
    }

}
