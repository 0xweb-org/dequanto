import alot from 'alot';
import { IAccessorItem } from '../Accessor';
import { SlotsStorage } from '@dequanto/solidity/SlotsStorage';
import { SlotsParser } from '@dequanto/solidity/SlotsParser';
import { SlotsCursorTransport } from '../SlotsStorageTransport';
import { ASlotsStorageHandler } from '../SlotsStorageHandler';
import { $types } from '@dequanto/solidity/utils/$types';
import { ISlotVarDefinition } from '@dequanto/solidity/SlotsParser/models';

export class SlotStructHandler extends ASlotsStorageHandler {

    static supports (slot: ISlotVarDefinition): boolean {
        return $types.isStruct(slot.type);
    }

    async get (keys?: IAccessorItem[]){
        if (keys == null || keys.length == 0) {
            return this.fetchAll();
        }
        let storage = await this.getInnerStorage();
        return storage.get(keys);
    }

    async set(keys: IAccessorItem[], value: any): Promise<any> {
        let storage = await this.getInnerStorage();
        await storage.set(keys, value);
    }

    async fetchAll () {
        let baseSlots = await SlotsParser.slotsFromAbi(this.slot.type);
        let storage = await this.getInnerStorage();

        return await alot(baseSlots).mapAsync(async slot => {
            return {
                value: await storage.get(slot.name),
                key: slot.name
            };
        }).toDictionaryAsync(x => x.key, x => x.value);
    }

    private async getInnerStorage () {
        let transport = new SlotsCursorTransport(this.slot, this.transport);
        let baseSlots = await SlotsParser.slotsFromAbi(this.slot.type);
        let storage = new SlotsStorage(transport, baseSlots);
        return storage;
    }
}
