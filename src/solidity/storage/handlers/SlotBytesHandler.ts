import alot from 'alot';
import { AbiDeserializer } from '@dequanto/contracts/utils/AbiDeserializer';
import { $abiParser } from '@dequanto/utils/$abiParser';
import { $buffer } from '@dequanto/utils/$buffer';
import { $require } from '@dequanto/utils/$require';
import { SlotsStorageTransportForArray } from '../SlotsStorageTransport';
import { ASlotsStorageHandler } from '../SlotsStorageHandler';
import { IAccessorItem } from '../Accessor';
import { $contract } from '@dequanto/utils/$contract';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $bigint } from '@dequanto/utils/$bigint';
import { $hex } from '@dequanto/utils/$hex';
import { ISlotVarDefinition } from '@dequanto/solidity/SlotsParser/models';

export class SlotBytesHandler extends ASlotsStorageHandler {

    static supports (slot: ISlotVarDefinition) {
        return slot.type === 'bytes';
    }

    async get (keys?: IAccessorItem[]){
        this.requireNoKeys(keys);

        let { slot } = this;
        let location = slot.slot;
        let memory = [];

        let slotValue = await this.transport.getStorageAt(location, 0, 256);
        /**
         * Per slot 32 bytes
         * At original slot position, the last n-bytes is the SIZE of the STRING
         *
         * If a string < 31 bytes then it takes the first 31 bytes of the original slot
         * otherwise take the SIZE of the STRING calculate how much slots it occupies and read dynamic bytes array
         */

        let arraySizeMatch = /0x0{2,}(?<size>[^0][\da-f]+)$/i.exec(slotValue);
        if (arraySizeMatch != null) {
            let size = parseInt(arraySizeMatch.groups.size, 16) - 1;
            memory = await this.readMultiSlot(size);
        } else {

            let length = parseInt(slotValue.substring(slotValue.length - 2), 16);
            let raw = $hex.raw(slotValue);

            slotValue = raw.substring(0, length);
            memory = [ slotValue ];
        }
        memory = memory.map(hex => $buffer.fromHex(hex));

        let value = $buffer.toHex($buffer.concat(memory));
        return value;
    }

    async set(keys: IAccessorItem[], value: string) {
        this.requireNoKeys(keys);

        let { slot } = this;

        let hex = $hex.toHexBuffer(value);

        let length = hex.length - 2;
        let bytesCount = length / 2;
        if (bytesCount > 31) {
            await this.writeMultiSlot(hex);
            return;
        }

        hex = $hex.concat([
            $hex.padBytes(hex, 31, { padEnd: true }),
            $hex.toHexBuffer(length)
        ]);
        await this.transport.setStorageAt(slot.slot, 0, 256, hex);
    }

    async fetchAll() {
        return this.get();
    }


    protected async readMultiSlot (size: number) {
        let SLOT_SIZE = 64;

        let slotCount = Math.ceil(size / SLOT_SIZE);

        $require.Number(slotCount, `Slots count is not a number for ${size}`);
        $require.True(slotCount < 50, `The string is too big. Prevented to make ${slotCount} requests in ${this.slot.name} at slot ${this.slot.slot}`);

        return await alot
            .fromRange(0, slotCount)
            .mapAsync(async i => {
                let reader = new SlotsStorageTransportForArray(this.transport, this.slot.slot, i, 1);
                let slotValue = await reader.getStorageAt(0);
                return slotValue;
            })
            .toArrayAsync()
    }

    protected requireNoKeys (keys: IAccessorItem[]) {
        if (keys?.length > 0) {
            throw new Error(`ValueTypes cann't have the nested accessors: ${ keys.map(x => x.key).join('.') }`);
        }
    }

    protected async writeMultiSlot (buffer: string) {
        let hex = $hex.raw(buffer);
        let SLOT_SIZE = 64;
        let slotCount = Math.ceil(hex.length / SLOT_SIZE);


        $require.True(slotCount < 50, `The string is too big. Prevented to make ${slotCount} requests`);

        //> Write length
        this.transport.setStorageAt(this.slot.slot, 0, 256, hex.length);

        //> Write all slots
        return await alot
            .fromRange(0, slotCount)
            .mapAsync(async i => {

                let buf = '0x' + hex.substring(i * SLOT_SIZE, i * SLOT_SIZE + SLOT_SIZE);
                let slotValue = await this.transport.setStorageAt(this.getSlot(i), 0, 256, buf);
                return slotValue;
            })
            .toArrayAsync({ threads: 1 })
    }

    protected getSlot (idx: number) {
        let slotArrNr = this.slot.slot;
        let x = BigInt($contract.keccak256($abiUtils.encodePacked(['uint256'], [slotArrNr])));
        let uint = x + BigInt(idx);
        return $bigint.toHex(uint);
    }
}

