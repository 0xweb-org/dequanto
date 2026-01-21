import di from 'a-di';
import memd from 'memd';
import alot from 'alot';
import type { TLogsRangeProgress, Web3Client } from '@dequanto/clients/Web3Client';
import type { ITxWriterOptions, TxWriter } from '@dequanto/txs/TxWriter';

import type { IAccount, TAccount } from "@dequanto/models/TAccount";
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
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
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { $is } from '@dequanto/utils/$is';
import { FnRequestWrapper } from './wrappers/FnRequestWrapper';
import { WClient } from '@dequanto/clients/ClientPool';


export abstract class ContractBase {
    private blockNumber?: number;
    private blockDate?: Date;
    //private from?: TAddress;

    /** 1.4 for medium*/
    private gasPriorityFee?: number
    protected builderConfig?: ITxBuilderOptions;
    protected writerConfig?: ITxWriterOptions;

    abstract abi?: TAbiItem[]
    abstract Types?: TContractTypes

    $meta?: {
        // Path to the compiled JSON artifact file (exists when the contract was generated from artifact JSON)
        artifact?: string
        // Path to the generated TS/JS class filename
        class?: string
        // Path to the SOL file (exists when the contract was generated from SOL)
        source?: string
        // Contract name
        name?: string
    }

    storage?: ContractStorageReaderBase

    constructor (
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockchainExplorer
    ) {

    }

    public async $getStorageAt (position: number | bigint | TEth.Hex)  {
        let reader = await this.getContractReader();
        return reader.getStorageAt(this.address, position);
    }
    public $parseInputData (buffer: TEth.BufferLike, value?: string) {
        return $abiUtils.parseMethodCallData(this.abi, buffer);
    }
    public async $executeBatch <T extends readonly unknown[] | ContractReaderUtils.IContractReadParams[]>(values: T): Promise<
        { -readonly [P in keyof T]: ContractReaderUtils.TIContractReadParamsInferred<T[P]>; }
    > {
        let reader = await this.getContractReader();
        return reader.executeBatch(values);
    }

    async getPastLogs <TEvents extends TEventsBase, TEventName extends keyof TEvents> (
        event: TEventName | TEventName[]
        , options?: TEventLogOptions<TEventParams<TEvents, TEventName>>
    ): Promise<ITxLogItem<TEventParams<TEvents, TEventName>, TEventName>[]> {
        return await this.$getPastLogsParsed(event as string | string[], options) as any;
    }

    public $config (builderConfig?: ITxBuilderOptions, writerConfig?: ITxWriterOptions): this {
        let $contract = $class.curry(this, {
            builderConfig: {
                ...(this.builderConfig ?? {}),
                ...(builderConfig ?? {})
            },
            writerConfig: {
                ...(this.builderConfig ?? {}),
                ...(writerConfig ?? {}),
            },
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
    public $data (params?: {
        estimateGas?: boolean
        getNonce?: boolean
        from?: TAddress
    }) {
        let $top = this;
        if (params?.from) {
            $top = $top.$config({ from: params.from });
        }

        let writeMethods = this.abi.filter(abi => abi.type === 'function' && $abiUtils.isReadMethod(abi) === false);
        let writeFns = alot(writeMethods).map(method => {
            return {
                name: method.name,
                async fn (sender: TAccount,...args: any[]) {
                    let writer: TxWriter = await $top
                        .$config({
                            send: 'manual',
                            gasEstimation: false,
                            nonce: params?.getNonce ? void 0 : 0,
                        })
                        [method.name](sender, ...args);

                    if (params?.getNonce) {
                        await writer.builder.ensureNonce();
                    }
                    if (params?.estimateGas) {
                        await writer.builder.ensureGas();
                    }
                    let data = writer.builder.data as any as TEth.Tx;
                    if (!params?.estimateGas) {
                        // remove default values
                        delete data.gasPrice;
                        delete data.maxPriorityFeePerGas;
                        delete data.maxFeePerGas;
                        delete data.gas;
                    }
                    return data;
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
                        data: $abiUtils.serializeMethodCallData(method, args)
                    };
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

    public $req () {
        return FnRequestWrapper.create(this);
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
                    let tx: TxWriter = await $top[abiMethod.name](sender, ...args);
                    let receipt = await tx.wait();
                    return tx;
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
            let req = <ContractReaderUtils.IContractReadParams>{
                address: this.address,
                abi,
                params: params,
                blockNumber: this.blockNumber ?? this.blockDate,
                options: {
                    from: this.builderConfig?.from
                }
            };
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
        $abis = $abis.filter(abi => {
            for (let i = 0; i < args.length; i++) {
                let item = abi.inputs[i];
                let arg = args[i];
                if (item.type === 'address' && $address.isValid(arg)) {
                    continue;
                }
                if (item.type === 'bool' && typeof arg === 'boolean') {
                    continue;
                }
                if (item.type === 'string' && typeof arg === 'string') {
                    continue;
                }
                if (/^u?int/.test(item.type) && (typeof arg === 'number' || typeof arg === 'bigint')) {
                    continue;
                }
                return false;
            }
            return true;
        });
        if ($abis.length === 1) {
            return $abis[0];
        }
        throw new Error(`ABI not found. Got multiple overloads for the argument count ${args.length}. We should pick the ABI by parameters type.`)
    }

    protected $extractLogs (tx: TEth.TxReceipt, abiItem: TAbiItem) {
        let logs = $contract.extractLogsForAbi(tx, abiItem);
        return logs;
    }
    protected $extractLog (log: TEth.Log, mix: string | string[] | TAbiItem | TAbiItem[] | '*') {
        let abi: TAbiItem | TAbiItem[];

        let mixArr = typeof mix === 'string' ? [ mix ] : ((mix as TAbiItem[] | string[])  ?? []);
        if (mixArr.length === 0 || (mixArr.length === 1 && mixArr[0] === '*')) {
            abi = this.abi;
        } else {
            abi = mixArr.map(x => typeof x === 'string' ? this.$getAbiItem('event', x) : x);
        }

        let parsed = $contract.parseLogWithAbi(log, abi);
        return parsed;
    }
    protected async $getPastLogs(filters: RpcTypes.Filter, options?: {
        streamed?: boolean
        blockRangeLimits?: WClient['blockRangeLimits']
        onProgress? (info: TLogsRangeProgress<TEth.Log>)
    }) {
        return this.getContractReader().getLogs(filters, options);
    }
    public async $getPastLogsParsed (mix: string | TAbiItem | string[] | TAbiItem[], options?: {
        addresses?: TAddress[]
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {
            [key: string]: any
        }
        onProgress? (info: TLogsRangeProgress<ITxLogItem>)

        /** if TRUE the data will be only forwarded via onProgress callback.
         * And the final array will be undefined.
         * This will handle big queries to hold huge arrays in memory
         * */
        streamed?: boolean

        blockRangeLimits?: WClient['blockRangeLimits']
    }) {
        let filters = await this.$getPastLogsFilters(mix, {
            ...options
        });
        let logs = await this.$getPastLogs(filters, {
            streamed: options?.streamed,
            blockRangeLimits: options?.blockRangeLimits,
            onProgress: async (info) => {
                if (options?.onProgress == null) {
                    return;
                }
                let paged = info.paged.map(log => this.$extractLog(log, mix));
                await options.onProgress({
                    ...info,
                    logs: paged,
                    paged
                });
            }
        });
        return logs?.map(log => this.$extractLog(log, mix)) as any;
    }
    protected async $getPastLogsFilters(mix: string | TAbiItem | string[] | TAbiItem[], options: {
        addresses?: TAddress[]
        topic?: string
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {
            [key: string]: any
        }
    }): Promise<RpcTypes.Filter> {
        let abi: TAbiItem | '*' | TAbiItem[];
        if (mix === '*') {
            abi = '*'
        } else if (typeof mix === 'string') {
            abi = this.$getAbiItem('event', mix);
        } else if (Array.isArray(mix) === false) {
            abi = mix;
        } else if (mix.length === 1 && typeof mix[0] ==='string' && mix[0] === '*') {
            abi = '*';
        } else {
            abi = mix.map(x => {
                if (typeof x === 'string') {
                    return this.$getAbiItem('event', x);
                }
                return x;
            });
        }
        return this.getContractReader().getLogsFilter(
            abi,
            {
                ...(options ?? {}),
                address: options?.addresses ?? this.address
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
        persistence?: boolean,
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

        let key = `${client.platform}_${options?.name ?? ''}_${options?.persistence ?? false}`;
        let current = indexers[key];
        if (current) {
            current.onBlock(cb);
            return current;
        }

        let indexer = new BlocksTxIndexer(client.platform, {
            name: options.name,
            persistence: options.persistence,
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


export type TContractTypes = {
    Events: TEventsBase
}

type TEventsBase = {
    [name: string]: {
        outputParams: Record<string, any>,
        outputArgs:   any[],
    }
}

export type TEventLogOptions<TParams> = {
    addresses?: TAddress[]
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
    streamed?: boolean
    onProgress? (info: TLogsRangeProgress<ITxLogItem>)
    blockRangeLimits?: WClient['blockRangeLimits']
}

type TEventParams<TEvents extends TEventsBase, TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
