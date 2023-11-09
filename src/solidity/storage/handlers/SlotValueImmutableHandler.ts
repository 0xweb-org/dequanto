import { ISlotVarDefinition } from '@dequanto/solidity/SlotsParser/models';
import { IAccessorItem } from '../Accessor';
import { ASlotsStorageHandler } from '../SlotsStorageHandler';
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { ISlotsStorageTransport, SlotsStorageTransport } from '../SlotsStorageTransport';

export class SlotValueImmutableHandler extends ASlotsStorageHandler {

    static supports (slot: ISlotVarDefinition): boolean {
        return slot.memory === 'immutable';
    }

    // We will read the public getter if any or skip for now
    // @TODO: implement deployment tx reader
    async get (keys?: IAccessorItem[]){
        this.requireNoKeys(keys);

        let transport = getBaseTransport(this.transport);
        let reader = new ContractReader(transport.client);
        try {
            return await reader.readAsync(transport.address, `${this.slot.name}() returns (${this.slot.type})`);
        } catch (e) {

        }
        return null;
    }

    async set(keys: IAccessorItem[], value: any): Promise<any> {
        throw new Error(`Can't set a immutable value ${this.slot.name}`);
    }

    async fetchAll() {
        return this.get();
    }

    private requireNoKeys (keys: IAccessorItem[]) {
        if (keys?.length > 0) {
            throw new Error(`ValueTypes can't have the nested accessors: ${ keys.map(x => x.key).join('.') }`);
        }
    }
}


function getBaseTransport (transport: ISlotsStorageTransport): SlotsStorageTransport {
    while (transport.transport != null) {
        transport = transport.transport;
    }
    return transport as SlotsStorageTransport;
}
