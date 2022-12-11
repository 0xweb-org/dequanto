import { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $bigint } from '@dequanto/utils/$bigint';
import { $contract } from '@dequanto/utils/$contract';

export interface IDataReader {

    getStorageAt (position: string | number | bigint): Promise<string>
}

export class DataReaderInner implements IDataReader {

    constructor (private client: Web3Client, public address: TAddress, public params?: { blockNumber }) {

    }

    getStorageAt (position: string | number | bigint) {
        return this.client.getStorageAt(this.address, position, this.params?.blockNumber);
    }
}

export class DataReaderArray implements IDataReader {
    constructor (private reader: IDataReader, private slotNr: number, private elementI: number = 0, private slotsPerElement: number = 1) {

    }

    async getStorageAt (slot: string | number | bigint) {
        if (typeof slot !== 'number') {
            throw new Error(`Array Slot reader supports only numbers for position`);
        }
        let slotPositionNr = this.elementI * this.slotsPerElement + slot;
        let location = this.getArrayLocation(this.slotNr, slotPositionNr);
        let memory = await this.reader.getStorageAt(location);

        return memory;
    }

    private getArrayLocation (slotArrNr: number, slotPositionNr: number) {

        let x = BigInt($contract.keccak256($abiUtils.encodePacked(slotArrNr)));
        let uint = x + BigInt(slotPositionNr);
        return $bigint.toHex(uint);
    }
}

export class DataReaderMapping implements IDataReader {
    constructor (private reader: IDataReader, private slotNr: number, private key: any) {

    }

    async getStorageAt (slot: string | number | bigint) {
        if (typeof slot !== 'number') {
            throw new Error(`Mapping Slot reader supports only numbers for position`);
        }
        let location = this.getMappingLocation(this.slotNr, this.key, slot);
        let memory = await this.reader.getStorageAt(location);
        return memory;
    }

    private getMappingLocation (slotMappingNr: number, key: string, slotPositionNr: number = 0) {

        let x = BigInt($contract.keccak256($abiUtils.encodePacked(key, slotMappingNr)));
        let uint = x + BigInt(slotPositionNr);
        return $bigint.toHex(uint);
    }
}
