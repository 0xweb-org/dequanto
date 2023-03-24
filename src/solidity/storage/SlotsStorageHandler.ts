import { TAddress } from '@dequanto/models/TAddress';
import { ISlotVarDefinition } from '../SlotsParser/models';
import { IAccessorItem } from './Accessor';
import { ISlotsStorageTransport } from './SlotsStorageTransport';

export abstract class ASlotsStorageHandler {
    constructor(public transport: ISlotsStorageTransport, public slot: ISlotVarDefinition) {

    }

    abstract get (keys: IAccessorItem[]): Promise<any>
    abstract set (keys: IAccessorItem[], value): Promise<any>

    //abstract read(...args): Promise<any>

    abstract fetchAll(): Promise<any>
}
