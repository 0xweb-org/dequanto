import alot from 'alot';
import { AbiDeserializer } from '@dequanto/contracts/utils/AbiDeserializer';
import { $abiParser } from '@dequanto/utils/$abiParser';
import { $buffer } from '@dequanto/utils/$buffer';
import { $require } from '@dequanto/utils/$require';
import { ISlotVarDefinition } from '../SlotsParser';
import { DataReaderArray } from './DataReaders';
import { ASlotReader } from './SlotReaders';

export class SlotStringReader extends ASlotReader {

    static supports (slot: ISlotVarDefinition) {
        return slot.type === 'string';
    }

    async read() {
        let { slot } = this;
        let location = slot.slot;
        let memory = [];

        let slotValue = await this.reader.getStorageAt(location);

        /**
         * Per slot 32 bytes
         * At original slot position, the last n-bytes is the SIZE of the STRING
         *
         * If a string < 31 bytes then it takes the first 31 bytes of the original slot
         * otherwise take the SIZE of the STRING calculate how much slots it occupies and read dynamic bytes array
         */

        let arraySizeMatch = /0x0+(?<size>[^0][\da-f]+)$/i.exec(slotValue);
        if (arraySizeMatch != null) {
            let size = parseInt(arraySizeMatch.groups.size, 16) - 1;
            memory = await this.readMultiSlot(size);
        } else {
            slotValue = slotValue.replace(/[\da-f]{2}$/i, '');
            memory = [ slotValue ];
        }
        memory = memory.map(hex => $buffer.fromHex(hex));

        let value = $buffer.toHex($buffer.concat(memory));
        let abi = $abiParser.parseArguments(this.slot.type);
        let deserialized = AbiDeserializer.process(value, abi);
        return deserialized;
    }

    async fetchAll() {
        return this.read();
    }


    private async readMultiSlot (size: number) {
        let SLOT_SIZE = 64;

        let slotCount = Math.ceil(size / SLOT_SIZE);

        $require.Number(slotCount, `Slots count is not a number for ${size}`);
        $require.True(slotCount < 50, `The string is too big. Prevented to make ${slotCount} requests`);

        return await alot
            .fromRange(0, slotCount)
            .mapAsync(async i => {
                let reader = new DataReaderArray(this.reader, this.slot.slot, i, 1);
                let slotValue = await reader.getStorageAt(0);
                return slotValue;
            })
            .toArrayAsync()
    }
}

