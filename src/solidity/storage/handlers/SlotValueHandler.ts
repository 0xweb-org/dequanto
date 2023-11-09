import { AbiDeserializer } from '@dequanto/contracts/utils/AbiDeserializer';
import { $abiParser } from '@dequanto/utils/$abiParser';
import { IAccessorItem } from '../Accessor';
import { ASlotsStorageHandler } from '../SlotsStorageHandler';

export class SlotValueHandler extends ASlotsStorageHandler {


    async get (keys?: IAccessorItem[]){
        this.requireNoKeys(keys);

        let { slot } = this;

        let value = await this.transport.getStorageAt(slot.slot, slot.position, slot.size);
        let abi = $abiParser.parseArguments(this.slot.type);
        let deserialized = AbiDeserializer.process(value, abi);
        return deserialized;
    }

    async set(keys: IAccessorItem[], value: any): Promise<any> {
        this.requireNoKeys(keys);

        let { slot } = this;
        await this.transport.setStorageAt(slot.slot, slot.position, slot.size, value);
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
