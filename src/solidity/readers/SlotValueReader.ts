import { AbiDeserializer } from '@dequanto/contracts/utils/AbiDeserializer';
import { $abiParser } from '@dequanto/utils/$abiParser';
import { $str } from '../utils/$str';
import { ASlotReader } from './SlotReaders';

export class SlotValueReader extends ASlotReader {

    async read() {
        let { slot } = this;
        let slotValue = await this.reader.getStorageAt(slot.slot);
        let value = slotValue;
        if (slot.size !== 0 && slot.size < 256) {
            value = '0x' + $str.sliceFromEnd(slotValue, slot.position, slot.size);
        }
        let abi = $abiParser.parseArguments(this.slot.type);
        let deserialized = AbiDeserializer.process(value, abi);
        return deserialized;
    }

    async fetchAll() {
        return this.read();
    }
}
