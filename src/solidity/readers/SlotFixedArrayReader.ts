import alot from 'alot';
import { AbiDeserializer } from '@dequanto/contracts/utils/AbiDeserializer';
import { $abiParser } from '@dequanto/utils/$abiParser';
import { $require } from '@dequanto/utils/$require';
import { ISlotVarDefinition } from '../SlotsParser';
import { $str } from '../utils/$str';
import { $types } from '../utils/$types';
import { ASlotReader } from './SlotReaders';

export class SlotFixedArrayReader extends ASlotReader {

    static supports (slot: ISlotVarDefinition): boolean {
        return $types.isFixedArray(slot.type);
    }

    async read(idx: number = 0) {
        let { slot } = this;
        let arrLength = $types.array.getLength(slot.type);
        $require.True(idx < arrLength, `${idx} is out of bounds for the array[${arrLength}]`);

        let itemSize = slot.size / arrLength;
        let memory = await this.reader.getStorageAt(slot.slot + idx);
        let value = memory;
        if (itemSize !== 0 && slot.size < 256) {
            value = '0x' + $str.sliceFromEnd(memory, slot.position, itemSize);
        }
        let baseType = $types.array.getBaseType(slot.type);
        let abi = $abiParser.parseArguments(baseType);
        let deserialized = AbiDeserializer.process(value, abi);
        return deserialized;
    }

    async fetchAll () {
        let slot = this.slot;
        let arrLength = $types.array.getLength(slot.type);

        return await alot.fromRange(0, arrLength).mapAsync(async i => {
            return this.read(i);
        }).toArrayAsync()
    }
}
