import alot from 'alot';
import { $abiType } from '@dequanto/utils/$abiType';
import { ASlotFixedArray } from '../SlotFixedArray';
import { IAccessorItem } from '../Accessor';
import { SlotsStorage } from '@dequanto/solidity/SlotsStorage';
import { SlotsParser } from '@dequanto/solidity/SlotsParser';
import { SlotsCursorTransport } from '../SlotsStorageTransport';

export class SlotFixedArrayHandler extends ASlotFixedArray {

    async get (keys: IAccessorItem[]){
        if (keys == null || keys.length === 0) {
            return this.fetchAll();
        }
        let key = keys.shift();
        if (key.key === 'length') {
            return $abiType.array.getLength(this.slot.type);
        }

        let storage = await this.getStorageInner(key);
        return storage.get(keys);
    }

    async set(keys: IAccessorItem[], value: any): Promise<any> {
        if (keys == null || keys.length === 0) {
            throw new Error(`saveAll not implemented`);
        }
        let key = keys.shift();
        let storage = await this.getStorageInner(key);
        return storage.set(keys, value);
    }

    async fetchAll () {
        let slot = this.slot;
        let arrLength = $abiType.array.getLength(slot.type);

        return await alot.fromRange(0, arrLength).mapAsync(async i => {
            return this.get([
                { key: i, type: 'index' }
            ]);
        }).toArrayAsync()
    }


    private async getStorageInner (key: IAccessorItem) {

        if (key.type !== 'index') {
            throw new Error(`Expected to get the Array index as a Key got ${key.key} as ${key.type}`);
        }
        let cursor = await this.getCursorFor(key.key);
        let baseType = $abiType.array.getBaseType(this.slot.type);
        let baseSlots = await SlotsParser.slotsFromAbi(baseType);

        let transport = new SlotsCursorTransport(cursor, this.transport);
        let storage = new SlotsStorage(transport, baseSlots);
        return storage;
    }
}
