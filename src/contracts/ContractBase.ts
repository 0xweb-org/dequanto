import di from 'a-di';
import memd from 'memd';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import type { Web3Client } from '@dequanto/clients/Web3Client';
import { TAddress } from '@dequanto/models/TAddress';
import { ContractReader } from './ContractReader';
import { ContractWriter } from './ContractWriter';
import { type AbiItem } from 'web3-utils';
import type { ITxWriterOptions, TxWriter } from '@dequanto/txs/TxWriter';
import { $contract } from '@dequanto/utils/$contract';
import { utils } from 'ethers'
import { ContractStream } from './ContractStream';
import type { Log, PastLogsOptions, TransactionReceipt } from 'web3-core';
import { ITxConfig } from '@dequanto/txs/ITxConfig';
import type { BufferLike } from 'ethereumjs-util';
import { TxTopicInMemoryProvider } from '@dequanto/txs/receipt/TxTopicInMemoryProvider';
import { $class } from '@dequanto/utils/$class';
import { ChainAccount, SafeAccount, TAccount } from "@dequanto/models/TAccount";
import { ChainAccountsService } from '@dequanto/ChainAccountsService';
import { $block } from '@dequanto/utils/$block';
import alot from 'alot';


export abstract class ContractBase {
    private blockNumber?: number;
    private blockDate?: Date;

    /** 1.4 for medium*/
    private gasPriorityFee?: number
    private builderConfig?: ITxConfig;
    private writerConfig?: ITxWriterOptions;

    abstract abi?: any

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
        const inter = new utils.Interface(this.abi);
        const decodedInput = inter.parseTransaction({
            data: buffer as string,
            value: value,
        });
        return {
            name: decodedInput.name,
            args: $contract.normalizeArgs(Array.from(decodedInput.args))
        };
    }

    public $config (builderConfig?: ITxConfig, writerConfig?: ITxWriterOptions): this {
        let $contract = $class.curry(this, {
            builderConfig: builderConfig,
            writerConfig: writerConfig,
        });
        return $contract;
    }

    public forBlock (mix: number | undefined | Date): this {
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

    protected async $read (abi: string | AbiItem, ...params) {
        let reader = await this.getContractReader();
        return reader.readAsync(this.address, abi, ...params);
    }

    protected $on (event: string, cb) {
        let stream = this.getContractStream();
        return stream.on(event, cb);
    }


    protected async $write (abi: string | AbiItem, account: TAccount & {  value?: number | string | bigint }, ...params): Promise<TxWriter> {

        let writer = await this.getContractWriter();
        return writer.writeAsync(account, abi, params, {
            builderConfig: this.builderConfig,
            writerConfig: this.writerConfig,
        });
    }


    protected $getAbiItem (type: 'event' | 'function' | 'string', name: string) {
        return this.abi.find(x => x.type === type && x.name === name);
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

        if (options.fromBlock) {
            filters.fromBlock = await $block.ensureNumber(options.fromBlock, this.client);
        }
        if (options.toBlock) {
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

    private async getContractReader () {
        let reader = await this.getContractReaderInner();
        if (this.blockDate != null) {
            reader.forBlockAt(this.blockDate);
        }
        if (this.blockNumber != null) {
            reader.forBlock(this.blockNumber);
        }
        return reader;
    }

    @memd.deco.memoize({ perInstance: true })
    private async getContractReaderInner () {
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
