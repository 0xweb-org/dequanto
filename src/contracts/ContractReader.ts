import di from 'a-di';
import alot from 'alot';
import type { PastLogsOptions } from 'web3-core';
import type { AbiItem } from 'web3-utils';
import type { Web3Client } from '@dequanto/clients/Web3Client';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { AbiDeserializer } from './utils/AbiDeserializer';
import { BlockDateResolver } from '@dequanto/blocks/BlockDateResolver';
import { TAddress } from '@dequanto/models/TAddress';
import { class_Dfr } from 'atma-utils';
import { $is } from '@dequanto/utils/$is';
import { $logger } from '@dequanto/utils/$logger';
import { $abiParser } from '../utils/$abiParser';
import { $block } from '@dequanto/utils/$block';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { ContractCreationResolver } from './ContractCreationResolver';
import { BlockChainExplorerProvider } from '@dequanto/BlockchainExplorer/BlockChainExplorerProvider';



export interface IContractReader {
    forBlock (mix: number | Date | undefined): IContractReader
    forBlockNumber (blockNumber: number | undefined): IContractReader
    forBlockAt (date: Date | undefined): IContractReader
    readAsync<T = any>(address: string, methodAbi: string | AbiItem, ...params: any[]): Promise<T>

}
export class ContractReader implements IContractReader {
    private blockNumberTask: Promise<number>;
    private options: Parameters<Web3Client['readContract']>[0]['options'] = {};

    constructor(public client: Web3Client = di.resolve(EthWeb3Client)) {

    }
    forBlock (mix: number | Date | undefined) {
        if (mix == null) {
            return this
        }
        if (typeof mix === 'number') {
            return this.forBlockNumber(mix);
        }
        return this.forBlockAt(mix);
    }
    forBlockNumber (blockNumber: number | undefined): IContractReader {
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
    withAddress (address: TAddress): IContractReader {
        this.options.from = address;
        return this;
    }

    async getStorageAt(address: TAddress, position: string | number | bigint) {
        let blockNumber: number = void 0;
        if (this.blockNumberTask != null) {
            blockNumber = await this.blockNumberTask;
        }
        return this.client.getStorageAt(address, position, blockNumber);
    }

    async readAsync <TResult = any> (address: string, methodAbi: string | AbiItem, ...params: any[]) {
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
                options: this.options
            });
            if (result == null) {
                throw new Error(`Function call returned undefined`);
            }
            return AbiDeserializer.process(result, abi.outputs) as TResult;

        } catch (error) {
            let args = params.map((x, i) => `[${i}] ${x}`).join('\n');

            throw new Error(`Contract: ${address} ${methodAbi} with \n${args}\nfailed with ${error.message}`);
        }
    }

    public async executeBatch <T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }> {

        let requests = await alot(values as any[])
            .mapAsync(async x => await x)
            .toArrayAsync() as ContractReaderUtils.DefferedRequest[];

        // all inputs should be deferred requests
        let invalid = requests.find(x => $is.Address(x.request?.address) === false);
        if (invalid != null) {
            $logger.error('Invalid object', invalid);
            throw new Error(`Invalid Deferred Request at position ${ requests.indexOf(invalid) }`);
        }

        let inputs = await alot(requests).mapAsync(async req => {
            return {
                address: req.request.address,
                abi: req.request.abi,
                params: req.request.params,
                blockNumber: req.request.blockNumber,
                options: req.request.options,
            } as ContractReaderUtils.IContractReadParams;
        }).toArrayAsync();

        let results = await ContractReaderUtils.readAsyncBatch(this.client, inputs);
        return results as any;
    }

    async getLogs (filters: PastLogsOptions) {
        return this.client.getPastLogs(filters);
    }

    async getLogsFilter(address: TAddress, abi: AbiItem, options: {
        /**
         * "deployment": get the contracts deployment date to skip lots of blocks (in case we use pagination to fetch logs)
         */
        fromBlock?: number | Date | 'deployment'
        toBlock?: number | Date
        params?: { [key: string]: any } | any[]

    }): Promise<PastLogsOptions> {
        let filters: PastLogsOptions = {
            address: address,
        };

        if (options.fromBlock != null) {
            if (options.fromBlock === 'deployment') {
                try {
                    let explorer = BlockChainExplorerProvider.get(this.client.platform);
                    let dateResolver = new ContractCreationResolver(this.client, explorer);
                    let info = await dateResolver.getInfo(address);
                    filters.fromBlock = info.block - 1;
                } catch (error) {
                    // Skip any explorer errors and look from block 0
                }
            } else {
                filters.fromBlock = await $block.ensureNumber(options.fromBlock, this.client);
            }
        }
        if (options.toBlock != null) {
            filters.toBlock = await $block.ensureNumber(options.toBlock, this.client);
        }

        let topic = $abiUtils.getTopicSignature(abi);
        let topics = [ topic ];
        if (options.params != null) {
            alot(abi.inputs)
                .takeWhile(x => x.indexed)
                .forEach((arg, i) => {
                    let param = Array.isArray(options.params)
                        ? options.params[i]
                        : options.params?.[arg.name];
                    if (param == null) {
                        topics.push(undefined);
                        return;
                    }
                    topics.push(param);
                })
                .toArray();
        }

        filters.topics = topics;
        return filters;
    }

    static async read (client: Web3Client, address: TAddress, methodAbi: string){
        let reader = new ContractReader(client);
        return reader.readAsync(address, methodAbi);
    }
}

export namespace ContractReaderUtils {


    export class DefferedRequest<T = any> {

        public promise: class_Dfr<T> & {
            request: DefferedRequest
        }

        constructor (
            public request: {
                address: TAddress,
                abi: string | AbiItem,
                params: any[],
                blockNumber?: Date | number,
                options?: {
                    from?: TAddress
                },
            }
        ) {

            this.promise = Object.assign(new class_Dfr(), {
                request: this
            });
        }
    }


    export interface IContractReadParams {
        address: TAddress,
        abi: string | AbiItem
        params?: any[]

        blockNumber?: number | Date
        options?: {
            from?: TAddress
        }
    }

    export async function readAsyncBatch(client: Web3Client, requests: IContractReadParams[]) {

        let reqs = await alot(requests).map(async request => {
            let abi = request.abi;
            if (typeof abi === 'string') {
                abi = $abiParser.parseMethod(abi);
            }
            let blockNumber = request.blockNumber;
            if (blockNumber instanceof Date) {
                let resolver = di.resolve(BlockDateResolver, client);
                blockNumber = await resolver.getBlockNumberFor(blockNumber);
            }
            return {
                address: request.address,
                abi: [ abi ],
                method: abi.name,
                arguments: request.params,
                blockNumber: blockNumber,
                options: request.options
            };
        }).toArrayAsync();

        let outputs = await client.readContractBatch(reqs);
        return outputs.map(({result, error}, i) => {
            if (result == null || error != null) {
                return { error: error ?? new Error(`Empty output`) };
            }
            let outputs = reqs[i].abi[0].outputs;
            return AbiDeserializer.process(result, outputs);
        });
    }
}
