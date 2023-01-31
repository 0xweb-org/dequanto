import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { $str } from '@dequanto/solidity/utils/$str';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $bigint } from '@dequanto/utils/$bigint';
import { $contract } from '@dequanto/utils/$contract';
import { $hex } from '@dequanto/utils/$hex';
import { $require } from '@dequanto/utils/$require';

export interface ISlotsStorageTransport {
    getStorageAt (slot: string | number | bigint, position: number, size: number): Promise<string>
    setStorageAt (slot: string | number | bigint, position: number, size: number, buffer: string | number | bigint | boolean): Promise<void>
}


export class SlotsCursorTransport implements ISlotsStorageTransport {

    constructor(private cursor: {
        slot: number | bigint,
        position?: number,
        size?: number,
    } , private transport: ISlotsStorageTransport) {

    }

    getStorageAt(slot: string | number | bigint, position: number, size: number): Promise<string> {
        let offsetSlot =  BigInt(this.cursor.slot);
        let offsetPosition = position + (this.cursor.position ?? 0)

        size ??= this.cursor.size;

        return this.transport.getStorageAt(BigInt(slot) + offsetSlot, offsetPosition, size);
    }

    setStorageAt(slot: string | number | bigint, position: number, size: number, buffer: string | number | bigint | boolean): Promise<void> {
        let offsetSlot =  BigInt(this.cursor.slot);
        let offsetPosition = position + (this.cursor.position ?? 0)
        return this.transport.setStorageAt(BigInt(slot) + offsetSlot, offsetPosition, size, buffer);
    }

}

export class SlotsStorageTransport implements ISlotsStorageTransport {

    constructor (private client: Web3Client, public address: TAddress, public params?: { blockNumber }) {

    }

    async getStorageAt (slot: string | number | bigint, position: number, size: number) {
        slot = $hex.toHex(slot);

        let mem  = await this.client.getStorageAt(this.address, slot, this.params?.blockNumber);
        if (size != null && size < 256) {
            mem = '0x' + $str.sliceFromEnd(mem, position, size);
        }
        return mem;
    }

    async setStorageAt (slot: string | number | bigint, position: number, size: number, buffer: string | number | bigint | boolean) {
        $require.notNull(slot, `Slot position is undefined`);
        $require.notNull(buffer, `Slot value is undefined`);

        slot = $hex.toHex(slot);
        buffer = $hex.toHexBuffer(buffer);

        let SLOT_SIZE = 256;
        if (size != null && size < SLOT_SIZE) {
            let current = await this.client.getStorageAt(this.address, slot);
            let bytesLen = size / 8;

            buffer = $hex.padBytes(buffer, bytesLen);
            buffer = $str.writeFromEnd(current, buffer, position, size)
            buffer = $hex.ensure(buffer);
        }

        buffer = $hex.padBytes(buffer, 32);
        await this.client.debug.setStorageAt(this.address, slot, buffer);
    }
}

export class SlotsStorageTransportForArray implements ISlotsStorageTransport {
    constructor (private storage: ISlotsStorageTransport, private slotNr: number | bigint, private elementI: number = 0, private slotsPerElement: number = 1) {

    }

    async getStorageAt (slot: string | number | bigint, position = 0, size = 256) {
        if (typeof slot !== 'number') {
            throw new Error(`Array Slot reader supports only numbers for position`);
        }
        let location = this.mapToGlobalSlot(slot);
        let memory = await this.storage.getStorageAt(location, position, size);
        return memory;
    }

    async setStorageAt(slot: string | number | bigint, position: number, size: number, buffer: string | number | bigint | boolean): Promise<void> {
        let location = this.mapToGlobalSlot(Number(slot));
        let memory = await this.storage.setStorageAt(location, position, size, buffer);
        return memory;
    }

    private mapToGlobalSlot (slot: number) {
        let slotPositionNr = this.elementI * this.slotsPerElement + slot;
        let x = BigInt($contract.keccak256($abiUtils.encodePacked(
            { value: $hex.toHex(this.slotNr), type: 'uint256' },
        )));
        let uint = x + BigInt(slotPositionNr);
        return $bigint.toHex(uint);
    }
}

export class SlotsStorageTransportForMapping implements ISlotsStorageTransport {
    constructor (private storage: ISlotsStorageTransport, private slotNr: number, private key: any, private slotsPerElement: number = 1) {

    }

    async getStorageAt (slot: string | number | bigint) {
        if (typeof slot !== 'number') {
            throw new Error(`Mapping Slot reader supports only numbers for position`);
        }
        let location = this.mapToGlobalSlot(BigInt(slot));
        let memory = await this.storage.getStorageAt(location, 0, 256);
        return memory;
    }

    async setStorageAt(slot: string | number | bigint, position: number, size: number, buffer: string | number | bigint | boolean): Promise<void> {
        let location = this.mapToGlobalSlot(BigInt(slot));
        let memory = await this.storage.setStorageAt(location, position, size, buffer);
        return memory;
    }


    private mapToGlobalSlot (slotPositionNr: bigint = 0n) {
        let key = this.key;
        let slotMappingNr = this.slotNr;

        if (typeof key === 'string' && /^\d+$/.test(key)) {
            key = Number(key);
        }

        let packed = $abiUtils.encodePacked({
            value: $hex.padBytes($hex.toHexBuffer(key), 32),
            type: 'bytes32'
        }, {
            value: slotMappingNr,
            type: 'uint256'
        });

        let x = BigInt($contract.keccak256(packed));
        let uint = x + BigInt(slotPositionNr);
        return $bigint.toHex(uint);
    }
}
