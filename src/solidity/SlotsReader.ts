import alot from 'alot';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { $require } from '@dequanto/utils/$require';
import { ISlotVarDefinition } from './SlotsParser';
import { SlotValueReader } from './readers/SlotValueReader';
import { SlotFixedArrayReader } from './readers/SlotFixedArrayReader';
import { SlotDynamicArrayReader } from './readers/SlotDynamicArrayReader';
import { DataReaderInner, IDataReader } from './readers/DataReaders';
import { TAddress } from '@dequanto/models/TAddress';
import { ASlotReader } from './readers/SlotReaders';
import { Constructor } from 'atma-utils';
import { SlotMappingReader } from './readers/SlotMappingReader';
import { SlotStringReader } from './readers/SlotStringValue';

export class SlotsReader {

    static createWithClient (client: Web3Client, address: TAddress, slots: ISlotVarDefinition[], params?: { blockNumber: number }) {
        let reader = new DataReaderInner(client, address, params);
        return new SlotsReader(reader, slots)
    }

    constructor (public reader: IDataReader, public slots: ISlotVarDefinition[]) {

    }

    for(property: string) {
        let slot = this.slots.find(x => x.name === property);
        $require.notNull(slot, `StateVariable ${property} not found. Available: ${ this.slots.map(x => x.name).join(', ') }`);

        const Ctor = this.getSlotReader(slot);
        return new Ctor(this.reader, slot);
    }

    async fetchAll() {

        let dict = await alot(this.slots).mapAsync(async (slot, i) => {
            const Ctor = this.getSlotReader(slot);
            const slotReader = new Ctor(this.reader, slot);
            const value = await slotReader.fetchAll();
            return {
                key: slot.name ?? i,
                value
            };
        }).toDictionaryAsync(x => x.key, x => x.value);

        return dict;
    }

    private getSlotReader(slot: ISlotVarDefinition): Constructor<ASlotReader> {
        if (SlotFixedArrayReader.supports(slot)) {
            return SlotFixedArrayReader;
        }
        if (SlotDynamicArrayReader.supports(slot)) {
            return SlotDynamicArrayReader;
        }
        if (SlotMappingReader.supports(slot)) {
            return SlotMappingReader;
        }
        if (SlotStringReader.supports(slot)) {
            return SlotStringReader;
        }
        return SlotValueReader;
    }
}


