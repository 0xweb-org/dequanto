import di from 'a-di';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { type AbiItem } from 'web3-utils';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { $abiParser } from '../utils/$abiParser';
import { AbiDeserializer } from './utils/AbiDeserializer';
import { BlockDateResolver } from '@dequanto/blocks/BlockDateResolver';
import { TAddress } from '@dequanto/models/TAddress';


export interface IContractReader {
    forBlock (blockNumber: number | undefined): IContractReader
    forBlockAt (date: Date | undefined): IContractReader
    readAsync<T = any>(address: string, methodAbi: string | AbiItem, ...params: any[]): Promise<T>

}
export class ContractReader implements IContractReader {
    private blockNumberTask: Promise<number>;

    constructor(public client: Web3Client = di.resolve(EthWeb3Client)) {

    }
    forBlock (blockNumber: number | undefined): IContractReader {
        this.blockNumberTask = blockNumber == null
            ? null
            : Promise.resolve(blockNumber);
        return this;
    }
    forBlockAt (date: Date | undefined): IContractReader {
        if (date != null) {
            let resolver = new BlockDateResolver(this.client);
            this.blockNumberTask = resolver.getBlockNumberFor(date);
        } else {
            this.blockNumberTask = null;
        }
        return this;
    }

    async getStorageAt(address: TAddress, position: string | number | bigint) {
        let blockNumber: number = void 0;
        if (this.blockNumberTask != null) {
            blockNumber = await this.blockNumberTask;
        }
        return this.client.getStorageAt(address, position, blockNumber);
    }

    async readAsync(address: string, methodAbi: string | AbiItem, ...params: any[]) {
        let blockNumber: number = void 0;
        if (this.blockNumberTask != null) {
            blockNumber = await this.blockNumberTask;
        }

        let abi: AbiItem;
        if (typeof methodAbi === 'string') {
            abi = $abiParser.parseMethod(methodAbi);
        } else {
            abi = methodAbi;
        }

        let method = abi.name;
        let abiArr = [ abi ];

        try {
            let result = await this.client.readContract({
                address,
                abi: abiArr,
                method: method,
                arguments: params,
                blockNumber: blockNumber,
            });
            if (result == null) {
                throw new Error(`Function call returned undefined`);
            }
            return AbiDeserializer.process(result, abi.outputs);

        } catch (error) {
            let args = params.map((x, i) => `[${i}] ${x}`).join('\n');

            throw new Error(`Contract: ${address} ${methodAbi} with \n${args}\nfailed with ${error.message}`);
        }
    }

    async getLogs () {

    }

    static async read (client: Web3Client, address: TAddress, methodAbi: string){
        let reader = new ContractReader(client);
        return reader.readAsync(address, methodAbi);
    }
}
