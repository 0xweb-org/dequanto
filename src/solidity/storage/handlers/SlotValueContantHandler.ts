import { ISlotVarDefinition } from '@dequanto/solidity/SlotsParser/models';
import { IAccessorItem } from '../Accessor';
import { ASlotsStorageHandler } from '../SlotsStorageHandler';

export class SlotValueConstantHandler extends ASlotsStorageHandler {

    static supports (slot: ISlotVarDefinition): boolean {
        return slot.memory === 'constant';
    }

    async get (keys?: IAccessorItem[]){
        this.requireNoKeys(keys);
        let { slot } = this;
        return slot.value;
    }

    async set(keys: IAccessorItem[], value: any): Promise<any> {
        throw new Error(`Can't set a constant value ${this.slot.name}`);
    }

    async fetchAll() {
        return this.get();
    }

    private requireNoKeys (keys: IAccessorItem[]) {
        if (keys?.length > 0) {
            throw new Error(`ValueTypes can't have the nested accessors: ${ keys.map(x => x.key).join('.') }`);
        }
    }
}
