import di from 'a-di';
import memd from 'memd';
import alot from 'alot';
import type { Web3Client } from '@dequanto/clients/Web3Client';
import type { ITxWriterOptions, TxWriter } from '@dequanto/txs/TxWriter';

import type { IAccount, TAccount } from "@dequanto/models/TAccount";
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import type { TAddress } from '@dequanto/models/TAddress';
import type { ITxBuilderOptions } from '@dequanto/txs/ITxBuilderOptions';

import { $contract } from '@dequanto/utils/$contract';
import { $class } from '@dequanto/utils/$class';
import { $abiParser } from '@dequanto/utils/$abiParser';
import { ContractReader, ContractReaderUtils } from './ContractReader';
import { ContractWriter } from './ContractWriter';
import { ContractStream } from './ContractStream';
import { TxTopicInMemoryProvider } from '@dequanto/txs/receipt/TxTopicInMemoryProvider';
import { BlocksTxIndexer, TBlockListener } from '@dequanto/indexer/BlocksTxIndexer';
import { SubjectStream } from '@dequanto/class/SubjectStream';
import { $logger } from '@dequanto/utils/$logger';
import { $address } from '@dequanto/utils/$address';
import { TEth } from '@dequanto/models/TEth';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { RpcTypes } from '@dequanto/rpc/Rpc';
import { ContractStorageReaderBase } from './ContractStorageReaderBase';
import { ContractBaseUtils } from './utils/ContractBaseUtils';
import { FnSignedWrapper } from './wrappers/FnSignedWrapper';


export abstract class ContractBase {
    private blockNumber?: number;
    private blockDate?: Date;
    //private from?: TAddress;

    /** 1.4 for medium*/
    private gasPriorityFee?: number
    protected builderConfig?: ITxBuilderOptions;
    protected writerConfig?: ITxWriterOptions;

    abstract abi?: TAbiItem[]

    $meta?: {
        // Path to the compiled JSON artifact file (exists when the contract was generated from artifact JSON)
        artifact?: string
        // Path to the generated TS/JS class filename
        class?: string
        // Path to the SOL file (exists when the contract was generated from SOL)
        source?: string
    }

    storage?: ContractStorageReaderBase

    constructor (
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer
    ) {

    }

    public async $getStorageAt (position: number | bigint | TEth.Hex)  {
        let reader = await this.getContractReader();
        return reader.getStorageAt(this.address, position);
    }
    public $parseInputData (buffer: TEth.BufferLike, value?: string) {
        return $abiUtils.parseMethodCallData(this.abi, buffer);
    }
    public async $executeBatch <T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }> {

        let reader = await this.getContractReader();
        return reader.executeBatch(values);
    }

    public $config (builderConfig?: ITxBuilderOptions, writerConfig?: ITxWriterOptions): this {
        let $contract = $class.curry(this, {
            builderConfig: builderConfig,
            writerConfig: writerConfig,
        });
        return $contract;
    }

    public $address<T extends this>(this: T, address: TAddress): T {
        let Ctor = this.constructor as any;
        let x = new Ctor(address, this.client, this.explorer);
        return x;
    }

    @memd.deco.memoize({ perInstance: true })
    public $call () {
        let abiArr = this.abi;
        let writer = this.getContractWriter();

        let methods = this.abi.filter(abi => abi.type === 'function' && $abiUtils.isReadMethod(abi) === false);
        let fns = alot(methods).map(abiMethod => {
            return {
                name: abiMethod.name,
                async fn (sender: TAccount,...args: any[]) {
                    return ContractBaseUtils.$call(
                        writer,
                        abiMethod,
                        abiArr,
                        sender,
                        ...args
                    );
                }
            }
        }).toDictionary(x => x.name, x => x.fn);

        let $contract = $class.curry(this, {
            ...fns
        });
        return $contract as any;
    }

    @memd.deco.memoize({ perInstance: true })
    public $data () {
        let $top = this;
        let writeMethods = this.abi.filter(abi => abi.type === 'function' && $abiUtils.isReadMethod(abi) === false);
        let writeFns = alot(writeMethods).map(method => {
            return {
                name: method.name,
                async fn (sender: TAccount,...args: any[]) {
                    let writer: TxWriter = await $top
                        .$config({
                            send: 'manual',
                            gasEstimation: false,
                            nonce: 0,
                        })
                        [method.name](sender, ...args);

                    return writer.builder.data as any as TEth.Tx;
                }
            }
        }).toDictionary(x => x.name, x => x.fn);

        let readMethods = this.abi.filter(abi => abi.type === 'function' && $abiUtils.isReadMethod(abi) === true);
        let readFns = alot(readMethods).map(method => {
            return {
                name: method.name,
                async fn (...args: any[]) {
                    return {
                        to: $top.address,
                        input: $abiUtils.serializeMethodCallData(method, args)
                    }
                }
            }
        }).toDictionary(x => x.name, x => x.fn);

        let $contract = $class.curry(this, {
            ...writeFns,
            ...readFns
        });
        return $contract as any;
    }

    @memd.deco.memoize({ perInstance: true })
    public $gas () {
        let abiArr = this.abi;
        let writer = this.getContractWriter();

        let methods = this.abi.filter(abi => abi.type === 'function' && $abiUtils.isReadMethod(abi) === false);
        let fns = alot(methods).map(abiMethod => {
            return {
                name: abiMethod.name,
                async fn (sender: IAccount,...args: any[]) {
                    return ContractBaseUtils.$gas(
                        writer,
                        abiMethod,
                        abiArr,
                        sender,
                        ...args
                    );
                }
            }
        }).toDictionary(x => x.name, x => x.fn);

        let $contract = $class.curry(this, {
            ...fns
        });
        return $contract as any;
    }

    public $signed (builderConfig?: ITxBuilderOptions, writerConfig?: ITxWriterOptions) {
        let instance = this.$signedCreate();
        if (builderConfig != null || writerConfig != null) {
            instance = instance.$config(builderConfig, writerConfig);
        }
        return instance;
    }

    @memd.deco.memoize({ perInstance: true })
    private $signedCreate () {
        return FnSignedWrapper.create(this);
    }

    @memd.deco.memoize({ perInstance: true })
    public $receipt <T extends this> (this: T): T {
        let $top = this;
        let methods = this.abi.filter(abi => abi.type === 'function' && $abiUtils.isReadMethod(abi) === false);
        let fns = alot(methods).map(abiMethod => {
            return {
                name: abiMethod.name,
                async fn (sender: IAccount,...args: any[]) {
                    return await (await ($top[abiMethod.name](sender, ...args))).wait();
                }
            }
        }).toDictionary(x => x.name, x => x.fn);

        let $contract = $class.curry(this, {
            ...fns
        });
        return $contract as any;
    }

    public forBlock (mix: number | bigint | undefined | Date): this {
        if (mix == null) {
            return this;
        }
        if (typeof mix === 'undefined' || typeof mix === 'number' || typeof mix === 'bigint') {
            return this.forBlockNumber(mix);
        }
        return this.forBlockAt(mix);
    }
    protected forBlockNumber (blockNumber: number | bigint | undefined): this {
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

    protected $read (abi: string | TAbiItem, ...params) {
        if (this.builderConfig?.send === 'manual') {
            let req = new ContractReaderUtils.DeferredRequest({
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

    public $onLog (event: string, cb?) {
        let stream = this.getContractStream();
        let events = stream.on(event);
        if (cb) {
            events.onData(cb);
        }
        return events;
    }

    public $onTransaction (options?: BlockWalker.IBlockWalkerOptions): SubjectStream<{ tx: TEth.Tx, block: TEth.Block, calldata: { method, arguments: any[] } }> {

        options ??= {};
        options.logProgress ??= false;

        type TSubject =  {
            tx: TEth.Tx,
            block: TEth.Block,
            calldata: { method, arguments: any[] }
        };
        let stream = new SubjectStream<TSubject>();

        let indexer = BlockWalker.onBlock(this.client, options, async (client, block, { txs }) => {
            txs = txs.filter(x => $address.eq(x.to, this.address));
            if (txs.length === 0) {
                return;
            }

            txs.forEach(tx => {
                try {
                    let calldata = this.$parseInputData(tx.input);

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
        indexer.onStarted.pipe(stream.onConnected);
        return stream;
    }

    protected async $write (abi: string | TAbiItem, account: TAccount & {  value?: number | string | bigint }, ...params): Promise<TxWriter> {
        let writer = await this.getContractWriter();
        return writer.writeAsync(account, abi, params, {
            abi: this.abi,
            builderConfig: this.builderConfig,
            writerConfig: this.writerConfig,
        });
    }

    protected $getAbiItem (type: 'event' | 'function' | 'string', name: string, argsCount?: number) {
        return ContractBaseUtils.$getAbiItem(this.abi, type, name, argsCount);
    }

    protected $getAbiItemOverload (abis: (string | TAbiItem)[], args: any[]) {
        let $abis = abis
            .map(methodAbi => {
                if (typeof methodAbi ==='string') {
                    return $abiParser.parseMethod(methodAbi);
                }
                return methodAbi;
            })
            .filter(x => (x.inputs?.length ?? 0) === args.length);

        if ($abis.length === 0) {
            throw new Error(`ABI not found in overloads \n${abis.join('\n')}\n by arguments count. Got ${args.length} arguments`);
        }
        if ($abis.length === 1) {
            return $abis[0];
        }
        throw new Error(`Not implemented exception. Got multiple overloads for the argument count ${args.length}. We should pick the ABI by parameters type.`)
    }

    protected $extractLogs (tx: TEth.TxReceipt, abiItem: TAbiItem) {
        let logs = $contract.extractLogsForAbi(tx, abiItem);
        return logs;
    }
    protected $extractLog (log: TEth.Log, mix: string | TAbiItem | TAbiItem[] | '*') {
        let abi: TAbiItem | TAbiItem[];
        if (typeof mix === 'string') {
            abi = mix === '*' ? this.abi : this.$getAbiItem('event', mix)
        } else {
            abi = mix;
        }
        let parsed = $contract.parseLogWithAbi(log, abi);
        return parsed;
    }
    protected async $getPastLogs(filters: RpcTypes.Filter) {
        return this.getContractReader().getLogs(filters);
    }
    public async $getPastLogsParsed (mix: string | TAbiItem, options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {
            [key: string]: any
        }
    }) {
        let filters = await this.$getPastLogsFilters(mix, {
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, mix)) as any;
    }
    protected async $getPastLogsFilters(mix: string | TAbiItem, options: {
        topic?: string
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {
            [key: string]: any
        }
    }): Promise<RpcTypes.Filter> {
        let abi: TAbiItem | '*';
        if (typeof mix === 'string') {
            if (mix === '*') {
                abi = '*'
            } else {
                abi = this.$getAbiItem('event', mix);
            }
        } else {
            abi = mix;
        }


        return this.getContractReader().getLogsFilter(
            abi,
            {
                ...(options ?? {}),
                address: this.address
            }
        );
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
        let reader = new ContractReader(this.client, { name: this.constructor.name });
        return reader;
    }

    @memd.deco.memoize({ perInstance: true })
    protected getContractWriter () {
        if (this.abi != null) {
            // Updates the singleton instance
            let logParser = di.resolve(TxTopicInMemoryProvider);
            logParser.register(this.abi);
        }
        let writer = new ContractWriter(this.address, this.client);
        return writer;
    }

    @memd.deco.memoize({ perInstance: true })
    private getContractStream () {
        let stream = new ContractStream(this.address, this.abi, this.client);
        return stream;
    }
}

namespace BlockWalker {
    export interface IBlockWalkerOptions {
        name?: string,
        persistance?: boolean,
        logProgress?: boolean
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
            logProgress: options.logProgress,
        });

        indexers[key] = indexer;
        indexer.onBlock(cb);
        indexer.start();
        return indexer;
    }
}
