import { $abiType } from '@dequanto/utils/$abiType';
import { $require } from '@dequanto/utils/$require';
import { SlotsParser } from '../SlotsParser';
import { ISlotVarDefinition } from '../SlotsParser/models';
import { $types } from '../utils/$types';
import { ASlotsStorageHandler } from './SlotsStorageHandler';

export abstract class ASlotDynamicArray extends ASlotsStorageHandler {

    static supports (slot: ISlotVarDefinition): boolean {
        return $types.isDynamicArray(slot.type);
    }

    async length () {
        let { slot } = this;
        let arrLengthHex = await this.transport.getStorageAt(slot.slot, 0, 256);
        let arrLength = Number(arrLengthHex);
        return arrLength;
    }


    // /** @TODO doesnt support complex arrays  */
    // protected async getCursorFor (idx: number): Promise<{
    //     slot: number | bigint,
    //     position: number,
    //     size: number,
    //     slots: ISlotVarDefinition[]
    // }> {
    //     let { slot } = this;
    //     let arrLength = $abiType.array.getLength(slot.type);
    //     $require.True(idx < arrLength, `${idx} is out of bounds for the array[${arrLength}]`);

    //     let arrBaseType = $abiType.array.getBaseType(slot.type);
    //     let arrBaseTypeSlots = await SlotsParser.slotsFromAbi(arrBaseType);
    //     let arrSlotCountPerItem = 1 + arrBaseTypeSlots[arrBaseTypeSlots.length - 1].slot;


    //     let cursor = {
    //         slot: BigInt(slot.slot) + BigInt(arrSlotCountPerItem) * BigInt(idx),
    //         position: 0,
    //         size: arrSlotCountPerItem * 256,
    //         slots: arrBaseTypeSlots,
    //     };
    //     return cursor;
    // }
}
