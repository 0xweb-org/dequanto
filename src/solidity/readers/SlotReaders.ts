import { TAddress } from '@dequanto/models/TAddress';
import { ISlotVarDefinition } from '../SlotsParser';
import { IDataReader } from './DataReaders';

export abstract class ASlotReader {
    constructor(public reader: IDataReader, public slot: ISlotVarDefinition) {

    }

    abstract read(...args): Promise<any>

    abstract fetchAll(): Promise<any>
}
