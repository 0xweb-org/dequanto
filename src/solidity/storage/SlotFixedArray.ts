import { $abiType } from '@dequanto/utils/$abiType';
import { $require } from '@dequanto/utils/$require';
import { ISlotVarDefinition } from '../SlotsParser/models';
import { $types } from '../utils/$types';
import { ASlotsStorageHandler } from './SlotsStorageHandler';

export abstract class ASlotFixedArray extends ASlotsStorageHandler {

    static supports (slot: ISlotVarDefinition): boolean {
        return $types.isFixedArray(slot.type);
    }

    /** @TODO doesnt support complex arrays  */
    protected async getCursorFor (idx: number): Promise<{ slot: number | bigint, position: number, size: number }> {
        let { slot } = this;
        let arrLength = $abiType.array.getLength(slot.type);
        $require.True(idx < arrLength, `${idx} is out of bounds for the array[${arrLength}]`);

        let itemSize = slot.size / arrLength;
        let offset = slot.position + itemSize * idx;

        let offsetSlots = Math.floor(offset / 256);

        let cursor = {
            slot: BigInt(slot.slot) + BigInt(offsetSlots),
            position: offset % 256,
            size: itemSize,
        };
        return cursor;
    }
}
