import di from 'a-di';
import memd from 'memd';
import alot from 'alot';
import type { Web3Client } from '@dequanto/clients/Web3Client';
import type { ITxWriterOptions, TxWriter } from '@dequanto/txs/TxWriter';
import type { Log, PastLogsOptions, Transaction, TransactionReceipt } from 'web3-core';
import type { BufferLike } from 'ethereumjs-util';
import type { TAccount } from "@dequanto/models/TAccount";
import type { AbiItem } from 'web3-utils';
import type { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import type { TAddress } from '@dequanto/models/TAddress';
import type { ITxConfig } from '@dequanto/txs/ITxConfig';
import type { BlockTransactionString } from 'web3-eth';
import { utils } from 'ethers'
import { $contract } from '@dequanto/utils/$contract';
import { $class } from '@dequanto/utils/$class';
import { $block } from '@dequanto/utils/$block';
import { $abiParser } from '@dequanto/utils/$abiParser';
import { ContractReader, ContractReaderUtils } from './ContractReader';
import { ContractWriter } from './ContractWriter';
import { ContractStream } from './ContractStream';
import { TxTopicInMemoryProvider } from '@dequanto/txs/receipt/TxTopicInMemoryProvider';
import { BlocksTxIndexer, TBlockListener } from '@dequanto/indexer/BlocksTxIndexer';
import { SubjectStream } from '@dequanto/class/SubjectStream';
import { $logger } from '@dequanto/utils/$logger';
import { $address } from '@dequanto/utils/$address';


export abstract class ContractBase {
    private blockNumber?: number;
    private blockDate?: Date;
    //private from?: TAddress;

    /** 1.4 for medium*/
    private gasPriorityFee?: number
    private builderConfig?: ITxConfig;
    private writerConfig?: ITxWriterOptions;

    abstract abi?: AbiItem[]

    constructor (
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer
    ) {

    }

    public async getStorageAt (position: string | number | bigint)  {
        let reader = await this.getContractReader();
        return reader.getStorageAt(this.address, position);
    }
    public parseInputData (buffer: string | BufferLike, value?: string) {
        const inter = new utils.Interface(this.abi as any);
        const decodedInput = inter.parseTransaction({
            data: buffer as string,
            value: value,
        });
        return {
            name: decodedInput.name,
            args: $contract.normalizeArgs(Array.from(decodedInput.args))
        };
    }
    public async $executeBatch <T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }> {

        let reader = await this.getContractReader();
        return reader.executeBatch(values);
    }

    public $config (builderConfig?: ITxConfig, writerConfig?: ITxWriterOptions): this {
        let $contract = $class.curry(this, {
            builderConfig: builderConfig,
            writerConfig: writerConfig,
        });
        return $contract;
    }

    public forBlock (mix: number | undefined | Date): this {
        if (mix == null) {
            return this;
        }
        if (typeof mix === 'undefined' || typeof mix === 'number') {
            return this.forBlockNumber(mix);
        }
        return this.forBlockAt(mix);
    }
    protected forBlockNumber (blockNumber: number | undefined): this {
        let $contract = $class.curry(this, {
            blockNumber: blockNumber,
            blockDate: null
        })
        return $contract;
    }
    protected forBlockAt (date: Date | undefined): this {
        let $contract = $class.curry(this, {
            blockNumber: null,
            blockDate: date
        })
        return $contract;
    }

    protected $read (abi: string | AbiItem, ...params) {
        if (this.builderConfig?.send === 'manual') {
            let req = new ContractReaderUtils.DefferedRequest({
                address: this.address,
                abi,
                params,
                blockNumber: this.blockNumber ?? this.blockDate,
                options: {
                    from: this.builderConfig?.from
                }
            });
            return req;
        }
        let reader = this.getContractReader();
        return reader.readAsync(this.address, abi, ...params);
    }

    protected $onLog (event: string, cb?) {
        let stream = this.getContractStream();
        let events = stream.on(event);
        if (cb) {
            events.onData(cb);
        }
        return events;
    }

    protected $onTransaction (options?: BlockWalker.IBlockWalkerOptions): SubjectStream<{ tx: Transaction, block: BlockTransactionString, calldata: { method, arguments: any[] } }> {

        options ??= {};

        type TSubject =  { tx: Transaction, block: BlockTransactionString, calldata: { method, arguments: any[] } };
        let stream = new SubjectStream<TSubject>();

        BlockWalker.onBlock(this.client, options, async (client, block, { txs }) => {
            txs = txs.filter(x => $address.eq(x.to, this.address));
            if (txs.length === 0) {
                return;
            }

            txs.forEach(tx => {
                try {
                    let calldata = this.parseInputData(tx.input);
                    let method = options.filter?.method;
                    if (method != null && method !== '*') {
                        if (calldata.name !== method) {
                            return;
                        }
                    }
                    let args = options.filter?.arguments;
                    if (args != null) {
                        for (let i = 0; i < args.length; i++) {
                            let val = args[i];
                            if (val != null && val != calldata.args[i]) {
                                return;
                            }
                        }
                    }
                    stream.next({
                        block,
                        tx,
                        calldata: { method: calldata.name, arguments: calldata.args }
                    });
                } catch (error) {
                    $logger.log(`Unexpected exception onTx parser: ${error.message}`);
                    stream.error(error);
                }
            })
        });
        return stream;
    }

    protected async $write (abi: string | AbiItem, account: TAccount & {  value?: number | string | bigint }, ...params): Promise<TxWriter> {
        let writer = await this.getContractWriter();
        return writer.writeAsync(account, abi, params, {
            builderConfig: this.builderConfig,
            writerConfig: this.writerConfig,
        });
    }

    protected $getAbiItem (type: 'event' | 'function' | 'string', name: string, argsCount?: number) {
        let arr = this.abi.filter(x => x.type === type && x.name === name);
        if (arr.length === 0) {
            throw new Error(`AbiItem ${name} not found`);
        }
        if (arr.length === 1) {
            return arr[0];
        }
        if (argsCount == null) {
            throw new Error(`Found multiple AbiItems for ${name}. Args count not specified to pick one`);
        }
        return arr.find(x => (x.inputs?.length ?? 0) === argsCount)
    }

    protected $getAbiItemOverload (abis: string[], args: any[]) {
        let $abis = abis
            .map(methodAbi => $abiParser.parseMethod(methodAbi))
            .filter(x => (x.inputs?.length ?? 0) === args.length);

        if ($abis.length === 0) {
            throw new Error(`ABI not found in overloads \n${abis.join('\n')}\n by arguments count. Got ${args.length} arguments`);
        }
        if ($abis.length === 1) {
            return $abis[0];
        }
        throw new Error(`Not implemented exception. Got multiple overloads for the argument count ${args.length}. We should pick the ABI by parameters type.`)
    }

    protected $extractLogs (tx: TransactionReceipt, abiItem: AbiItem) {
        let logs = $contract.extractLogsForAbi(tx, abiItem);
        return logs;
    }
    protected $extractLog (log: Log, abiItem: AbiItem) {
        let parsed = $contract.parseLogWithAbi(log, abiItem);
        return parsed;
    }
    protected async $getPastLogs(filters: PastLogsOptions) {
        return this.client.getPastLogs(filters);
    }
    protected async $getPastLogsFilters(abi: AbiItem, options: {
        topic: string
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {
            [key: string]: any
        }
    }): Promise<PastLogsOptions> {
        let filters: PastLogsOptions = {};

        if (options.fromBlock != null) {
            filters.fromBlock = await $block.ensureNumber(options.fromBlock, this.client);
        }
        if (options.toBlock != null) {
            filters.toBlock = await $block.ensureNumber(options.toBlock, this.client);
        }

        let topics = [ options.topic ];
        alot(abi.inputs)
            .takeWhile(x => x.indexed)
            .forEach(arg => {
                let param = options.params?.[arg.name];
                if (param == null) {
                    topics.push(undefined);
                    return;
                }
                topics.push(param);
            })
            .toArray();

        filters.topics = topics;
        return filters;
    }

    private getContractReader () {
        let reader = this.getContractReaderInner();
        if (this.blockDate != null) {
            reader.forBlockAt(this.blockDate);
        }
        if (this.blockNumber != null) {
            reader.forBlockNumber(this.blockNumber);
        }
        let from = this.builderConfig?.from;
        if (from != null) {
            reader.withAddress(from);
        }
        return reader;
    }

    @memd.deco.memoize({ perInstance: true })
    private getContractReaderInner () {
        let reader = di.resolve(ContractReader, this.client);
        return reader;
    }

    @memd.deco.memoize({ perInstance: true })
    private async getContractWriter () {
        if (this.abi != null) {
            let logParser = di.resolve(TxTopicInMemoryProvider);
            logParser.register(this.abi);
        }
        let writer = di.resolve(ContractWriter, this.address, this.client);
        return writer;
    }

    @memd.deco.memoize({ perInstance: true })
    private getContractStream () {
        let stream = di.resolve(ContractStream, this.address, this.abi, this.client);
        return stream;
    }
}

namespace BlockWalker {

    export interface IBlockWalkerOptions {
        name?: string,
        persistance?: boolean,
        //mempool?: boolean,
        fromBlock?: number
        filter?: {
            method?: string,
            arguments?: any[]
        }
    }

    const indexers = {} as { [key: string]: BlocksTxIndexer } ;

    export function onBlock (client: Web3Client, options: IBlockWalkerOptions, cb: TBlockListener ) {

        let key = `${client.platform}_${options?.name ?? ''}_${options?.persistance ?? false}`;
        let current = indexers[key];
        if (current) {
            current.onBlock(cb);
            return current;
        }

        let indexer = new BlocksTxIndexer(client.platform, {
            name: options.name,
            persistance: options.persistance,
            loadTransactions: true,
            client: client,
        });

        indexers[key] = indexer;
        indexer.onBlock(cb);
        indexer.start();
        return indexer;
    }


}
