import alot from 'alot';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { $require } from '@dequanto/utils/$require';
import { ISlotVarDefinition } from './SlotsParser';
import { SlotValueHandler } from './storage/handlers/SlotValueHandler';
import { SlotFixedArrayHandler } from './storage/handlers/SlotFixedArrayHandler';
import { SlotDynamicArrayHandler } from './storage/handlers/SlotDynamicArrayHandler';
import { SlotsStorageTransport, ISlotsStorageTransport } from './storage/SlotsStorageTransport';
import { TAddress } from '@dequanto/models/TAddress';
import { ASlotsStorageHandler } from './storage/SlotsStorageHandler';
import { Constructor, is_Object } from 'atma-utils';
import { SlotMappingHandler } from './storage/handlers/SlotMappingHandler';
import { SlotStringHandler } from './storage/handlers/SlotStringHandler';
import { Accessor, IAccessorItem } from './storage/Accessor';
import { SlotStructHandler } from './storage/handlers/SlotStructHandler';

export class SlotsStorage {

    static createWithClient(client: Web3Client, address: TAddress, slots: ISlotVarDefinition[], params?: { blockNumber: number }) {
        let reader = new SlotsStorageTransport(client, address, params);
        return new SlotsStorage(reader, slots)
    }

    constructor(public transport: ISlotsStorageTransport, public slots: ISlotVarDefinition[]) {

    }

    async get<T = any>(path?: string | (string | number | bigint)[] |IAccessorItem[]): Promise<T> {
        let keys = this.getKeys(path)
        if (keys.length === 0 && this.slots.length > 0) {
            return this.fetchAll();
        }
        let { handler } = await this.getStorageFor(keys);
        return handler.get(keys);
    }

    async set(path: string | IAccessorItem[], value: any): Promise<void> {
        let keys = this.getKeys(path)
        if (keys.length === 0 && this.slots.length > 0) {
            await this.saveAll(value);
            return;
        }

        let { handler } = await this.getStorageFor(keys);
        await handler.set(keys, value);
    }

    // for(property: string) {
    //     let slot = this.slots.find(x => x.name === property);
    //     $require.notNull(slot, `StateVariable ${property} not found. Available: ${this.slots.map(x => x.name).join(', ')}`);

    //     const Ctor = this.getSlotStorage(slot);
    //     return new Ctor(this.transport, slot);
    // }

    async fetchAll() {

        let arr = await alot(this.slots)
            .mapAsync(async (slot, i) => {
                const Ctor = this.getSlotStorage(slot);
                const slotReader = new Ctor(this.transport, slot);
                const value = await slotReader.fetchAll();
                return {
                    key: slot.name || null,
                    value
                };
            })
            .toArrayAsync();

        if (arr.length === 0) {
            return null;
        }

        if (arr.length === 1 && arr[0].key == null) {
            return arr[0].value;
        }
        if (arr[0].key == null) {
            return arr.map(x => x.value);
        }

        let dict = alot(arr).toDictionary(x => x.key, x => x.value);
        return dict;
    }

    async saveAll(value: any) {
        if (value == null) {
            throw new Error(`Can't save the undefined value`);
        }
        if (this.slots.length === 0) {
            throw new Error(`Slots are empty to save ${value}`);
        }

        if (is_Object(value)) {
            // object
            await alot
                .fromObject(value)
                .mapAsync(async entry => {
                    await this.set([{ key: entry.key, type: 'key' }], entry.value);
                })
                .toArrayAsync();
            return;
        }

        if (this.slots.length > 1) {
            throw new Error(`Value type (${value}) not possible to save to multiple slots: ${this.slots.map(x => x.name)}`);
        }

        const slot = this.slots[0];
        const Ctor = this.getSlotStorage(slot);
        const handler = new Ctor(this.transport, slot);
        await handler.set([], value);
    }

    private getStorageFor(path: string | IAccessorItem[]) {
        let keys = this.getKeys(path);
        let slot: ISlotVarDefinition;
        if (keys.length > 0) {
            let key = keys.shift();
            slot = this.slots.find(x => x.name === key.key);
            $require.notNull(slot, `StateVariable ${key.key} not found. Available: ${this.slots.map(x => x.name).join(', ')}`);
        } else {
            if (this.slots.length !== 1) {
                throw new Error(`Key ${JSON.stringify(keys)} not specified for multiple slots: ${this.slots.map(x => x.name)}`);
            }
            slot = this.slots[0];
        }

        const Ctor = this.getSlotStorage(slot);
        const handler = new Ctor(this.transport, slot);

        return { keys, handler };
    }
    private getSlotStorage(slot: ISlotVarDefinition): Constructor<ASlotsStorageHandler> {
        if (SlotFixedArrayHandler.supports(slot)) {
            return SlotFixedArrayHandler;
        }
        if (SlotStructHandler.supports(slot)) {
            return SlotStructHandler;
        }
        if (SlotDynamicArrayHandler.supports(slot)) {
            return SlotDynamicArrayHandler;
        }
        if (SlotMappingHandler.supports(slot)) {
            return SlotMappingHandler;
        }
        if (SlotStringHandler.supports(slot)) {
            return SlotStringHandler;
        }
        return SlotValueHandler;
    }
    private getKeys(path?: string | (string | number | bigint)[] | IAccessorItem[]) {
        if (path == null) {
            return [];
        }
        if (typeof path === 'string') {
            return Accessor.parse(path).keys;
        }
        function isValue (x) {
            switch (typeof x) {
                case 'number':
                case 'bigint':
                case 'string':
                    return true;
            }
            return false;
        }

        let isBreadcrumbs = (path as any[]).every(isValue);
        if (isBreadcrumbs) {
            return path.map(key => (<IAccessorItem> { key, type: 'key' }))
        }
        return path as IAccessorItem[];
    }
}



