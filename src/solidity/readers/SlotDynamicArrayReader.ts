import alot from 'alot';
import { $require } from '@dequanto/utils/$require';
import { ISlotVarDefinition, SlotsParser } from '../SlotsParser';
import { SlotsReader } from '../SlotsReader';
import { $types } from '../utils/$types';
import { DataReaderArray } from './DataReaders';
import { ASlotReader } from './SlotReaders';
import { $abiType } from '@dequanto/utils/$abiType';

export class SlotDynamicArrayReader extends ASlotReader {

    static supports (slot: ISlotVarDefinition): boolean {
        return $types.isDynamicArray(slot.type);
    }

    private _length: number;
    private _slotIdx: number;
    private _slotsPerItem: number;


    async length () {
        let { slot } = this;

        let arrLengthHex = await this.reader.getStorageAt(slot.slot);
        let arrLength = Number(arrLengthHex);
        return arrLength;
    }
    async read(idx: number = 0) {
        let { slot } = this;

        this._slotIdx = slot.slot;
        this._length = await this.length();
        $require.True(idx < this._length, `${idx} is out of bounds for the array[${this._length}]`);

        let arrBaseType = $abiType.array.getBaseType(slot.type);
        let arrBaseTypeSlots = await SlotsParser.slotsFromAbi(arrBaseType);

        let slotsCountPerItem = 1 + arrBaseTypeSlots[arrBaseTypeSlots.length - 1].slot;


        let dataReader = new DataReaderArray(this.reader, slot.slot, idx, slotsCountPerItem);
        let slotsReader = new SlotsReader(dataReader, arrBaseTypeSlots);

        return slotsReader.fetchAll();
    }

    async fetchAll () {
        let arrLength = await this.length();

        return await alot.fromRange(0, arrLength).mapAsync(async i => {
            return this.read(i);
        }).toArrayAsync()
    }

}
