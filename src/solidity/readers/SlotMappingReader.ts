import { $abiType } from '@dequanto/utils/$abiType';
import { ISlotVarDefinition, SlotsParser } from '../SlotsParser';
import { SlotsReader } from '../SlotsReader';
import { $types } from '../utils/$types';
import { DataReaderMapping } from './DataReaders';
import { ASlotReader } from './SlotReaders';

export class SlotMappingReader extends ASlotReader {

    static supports (slot: ISlotVarDefinition): boolean {
        return $types.isMapping(slot.type);
    }


    async read(key: string | number | bigint) {
        let { slot } = this;


        let mapValueType = $abiType.mapping.getValueType(slot.type);
        let mapValueSlots = await SlotsParser.slotsFromAbi(mapValueType);


        let dataReader = new DataReaderMapping(this.reader, slot.slot, key);
        let slotsReader = new SlotsReader(dataReader, mapValueSlots);


        return slotsReader.fetchAll();
    }

    async fetchAll () {
        throw new Error(`SlotMappingReader doesn't support fetchAll method, as size could be infinite`);
    }

}
