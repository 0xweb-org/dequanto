import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { $str } from '@dequanto/solidity/utils/$str';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $address } from '@dequanto/utils/$address';
import { $bigint } from '@dequanto/utils/$bigint';
import { $contract } from '@dequanto/utils/$contract';
import { $hex } from '@dequanto/utils/$hex';
import { $is } from '@dequanto/utils/$is';
import { $require } from '@dequanto/utils/$require';
import { ISlotVarDefinition } from '../SlotsParser/models';
import { TEth } from '@dequanto/models/TEth';

export interface ISlotsStorageTransport {
    getStorageAt (slot: string | number | bigint, position: number, size: number): Promise<string>
    setStorageAt (slot: string | number | bigint, position: number, size: number, buffer: string | number | bigint | boolean): Promise<void>

    extractMappingKeys (ctx: {
        slot: ISlotVarDefinition
    }): Promise<{ keys: (string | number | bigint)[][] }>

    mapToGlobalSlot (slot?: string | number | bigint): bigint

    transport?: ISlotsStorageTransport;
}


export class SlotsCursorTransport implements ISlotsStorageTransport {

    constructor(private cursor: {
        slot: number | bigint,
        position?: number,
        size?: number,
    } , public transport: SlotsStorageTransport | ISlotsStorageTransport) {

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

    extractMappingKeys (ctx): Promise<{ keys: (string | number | bigint)[][] }> {
        return this.transport.extractMappingKeys(ctx)
    }

    mapToGlobalSlot (slot = 0) {
        return BigInt(this.cursor.slot) + BigInt(slot);
    }
}

export class SlotsStorageTransport implements ISlotsStorageTransport {

    constructor (public client: Web3Client, public address: TAddress, public params?: {
        blockNumber?: number
    }) {

    }

    async getStorageAt (slot: number | bigint | TEth.Hex, position: number, size: number) {
        slot = $hex.toHex(slot);

        let mem  = await this.getStorageAtInner(slot);
        if (size != null && size < 256) {
            mem = ('0x' + $str.sliceFromEnd(mem, position, size)) as TEth.Hex;
        }
        return mem;
    }

    async setStorageAt (
        slot: string | number | bigint | TEth.Hex
        , position: number | bigint | TEth.Hex
        , size: number
        , value: string | number | bigint | boolean | TEth.Hex
    ) {
        $require.notNull(slot, `Slot position is undefined`);
        $require.notNull(value, `Slot value is undefined`);

        let slotHex = $hex.toHex(slot);
        let buffer = $hex.toHexBuffer(value);

        let SLOT_SIZE = 256;
        if (size != null && size < SLOT_SIZE) {
            let current = await this.client.getStorageAt(this.address, slotHex);
            let bytesLen = size / 8;

            buffer = $hex.padBytes(buffer, bytesLen);
            buffer = $str.writeFromEnd(current, buffer, Number(position), size)
            buffer = $hex.ensure(buffer);
        }

        buffer = $hex.padBytes(buffer, 32);
        await this.client.debug.setStorageAt(this.address, slot, buffer);
    }

    extractMappingKeys (ctx): Promise<{ keys: (string | number | bigint)[][] }> {
        throw new Error(`SlotMappingReader doesn't support fetchAll method, as size could be infinite`);
    }

    mapToGlobalSlot (slot = 0) {
        return BigInt(slot);
    }

    protected async getStorageAtInner (slot: number | bigint | TEth.Hex) {
        return await this.client.getStorageAt(this.address, slot, this.params?.blockNumber);
    }
}

export class SlotsStorageTransportForArray implements ISlotsStorageTransport {



    constructor (public transport: ISlotsStorageTransport, private slotNr: number | bigint, private elementI: number = 0, private slotsPerElement: number = 1, private slot?: ISlotVarDefinition) {

    }

    async getStorageAt (slot: string | number | bigint, position = 0, size = 256) {
        if (typeof slot !== 'number') {
            throw new Error(`Array Slot reader supports only numbers for position. Slot ${slot}`);
        }
        let location = this.mapToGlobalSlot(slot);
        let memory = await this.getUnderlyingTransport().getStorageAt(location, position, size);
        return memory;
    }

    async setStorageAt(slot: string | number | bigint, position: number, size: number, buffer: string | number | bigint | boolean): Promise<void> {
        let location = this.mapToGlobalSlot(Number(slot));
        let memory = await this.transport.setStorageAt(location, position, size, buffer);
        return memory;
    }

    mapToGlobalSlot (slotPositionNr: number | bigint = 0) {
        let packedRoot = this.transport?.mapToGlobalSlot(this.slotNr) ?? 0n;
        let packedNextHash = $abiUtils.encodePacked({
            value: $hex.padBytes($hex.toHexBuffer(packedRoot), 32),
            type: 'bytes32'
        });
        let slotRel = BigInt(this.elementI) * BigInt(this.slotsPerElement) + BigInt(slotPositionNr);
        let slotGlobal = BigInt($contract.keccak256(packedNextHash)) + BigInt(slotRel);
        return slotGlobal;
    }

    extractMappingKeys (ctx): Promise<{ keys: (string | number | bigint)[][] }> {
        return this.transport.extractMappingKeys(ctx)
    }
    private getUnderlyingTransport () {
        let cursor = this.transport;
        while (cursor.transport != null) {
            cursor = cursor.transport;
        }
        return cursor;
    }
}

export class SlotsStorageTransportForMapping implements ISlotsStorageTransport {
    constructor (public transport: ISlotsStorageTransport, private slotNr: number, private key: any, private slotsPerElement: number = 1) {

    }

    async getStorageAt (slot: string | number | bigint) {
        let isValidType = typeof slot === 'number' || typeof slot === 'bigint' || $is.Hex(slot);
        if (isValidType === false) {
            throw new Error(`Mapping Slot reader supports only numbers for position ${slot}`);
        }
        let location = this.mapToGlobalSlot(BigInt(slot));
        let memory = await this.getUnderlyingTransport().getStorageAt(location, 0, 256);
        return memory;
    }

    async setStorageAt(slot: string | number | bigint, position: number, size: number, buffer: string | number | bigint | boolean): Promise<void> {
        let location = this.mapToGlobalSlot(BigInt(slot));
        let memory = await this.getUnderlyingTransport().setStorageAt(location, position, size, buffer);
        return memory;
    }


    mapToGlobalSlot (slotPositionNr: number | string | bigint = 0) {
        let packedRootHash = this.transport.mapToGlobalSlot()
        let packedNext = $abiUtils.encodePacked({
            value: $hex.padBytes($hex.toHexBuffer(this.key), 32),
            type: 'bytes32'
        }, {
            value: $bigint.toHex(packedRootHash + BigInt(this.slotNr)),
            type: 'uint256'
        });

        let packedNextHash = BigInt($contract.keccak256(packedNext)) + BigInt(slotPositionNr);
        return packedNextHash;
    }

    extractMappingKeys (ctx): Promise<{ keys: (string | number | bigint)[][] }> {
        return this.transport.extractMappingKeys(ctx)
    }


    private getUnderlyingTransport () {
        let cursor = this.transport;
        while (cursor.transport != null) {
            cursor = cursor.transport;
        }
        return cursor;
    }
}
