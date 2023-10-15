import di from 'a-di';
import memd from 'memd';
import alot from 'alot';
import type { Web3Client } from '@dequanto/clients/Web3Client';
import type { ITxWriterOptions, TxWriter } from '@dequanto/txs/TxWriter';

import type { IAccount, TAccount } from "@dequanto/models/TAccount";
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import type { TAddress } from '@dequanto/models/TAddress';
import type { ITxConfig } from '@dequanto/txs/ITxConfig';

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
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';


export abstract class ContractBase {
    private blockNumber?: number;
    private blockDate?: Date;
    //private from?: TAddress;

    /** 1.4 for medium*/
    private gasPriorityFee?: number
    private builderConfig?: ITxConfig;
    private writerConfig?: ITxWriterOptions;

    abstract abi?: TAbiItem[]

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
    public parseInputData (buffer: TEth.BufferLike, value?: string) {

        return $abiUtils.parseMethodCallData(this.abi, buffer);

        // const iface = new utils.Interface(this.abi as any);
        // const decodedInput = iface.parseTransaction({
        //     data: buffer as string,
        //     value: value,
        // });
        // return {
        //     name: decodedInput.name,
        //     args: $contract.normalizeArgs(Array.from(decodedInput.args)),
        //     params: $contract.parseInputData(buffer as string, this.abi)?.params
        // };
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

    public $address<T extends this>(this: T, address: TAddress): T {
        let Ctor = this.constructor as any;
        let x = new Ctor(address, this.client, this.explorer);
        return x;
    }

    @memd.deco.memoize({ perInstance: true })
    public $call () {
        let abiArr = this.abi;
        let writer = this.getContractWriter();

        let methods = this.abi.filter(abi => abi.type === 'function' && $abiUtil.isReader(abi) === false);
        let fns = alot(methods).map(abiMethod => {
            return {
                name: abiMethod.name,
                async fn (sender: TAccount,...args: any[]) {
                    return ContractBaseHelper.$call(
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
        let writeMethods = this.abi.filter(abi => abi.type === 'function' && $abiUtil.isReader(abi) === false);
        let writeFns = alot(writeMethods).map(method => {
            return {
                name: method.name,
                async fn (sender: TAccount,...args: any[]) {
                    let writer: TxWriter = await $top
                        .$config({
                            send: 'manual',
                            gasEstimation: false,
                        })
                        [method.name](sender, ...args);

                    return writer.builder.data as any as TEth.Tx;
                }
            }
        }).toDictionary(x => x.name, x => x.fn);

        let readMethods = this.abi.filter(abi => abi.type === 'function' && $abiUtil.isReader(abi) === true);
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

        let methods = this.abi.filter(abi => abi.type === 'function' && $abiUtil.isReader(abi) === false);
        let fns = alot(methods).map(abiMethod => {
            return {
                name: abiMethod.name,
                async fn (sender: IAccount,...args: any[]) {
                    return ContractBaseHelper.$gas(
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
    public $receipt <T extends this> (this: T): T {
        let $top = this;
        let methods = this.abi.filter(abi => abi.type === 'function' && $abiUtil.isReader(abi) === false);
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
        return ContractBaseHelper.$getAbiItem(this.abi, type, name, argsCount);
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

    protected $extractLogs (tx: TEth.TxReceipt, abiItem: TAbiItem) {
        let logs = $contract.extractLogsForAbi(tx, abiItem);
        return logs;
    }
    protected $extractLog (log: TEth.Log, abiItem: TAbiItem) {
        let parsed = $contract.parseLogWithAbi(log, abiItem);
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
        let abi = typeof mix === 'string'
            ? this.$getAbiItem('event', mix)
            : mix;
        let filters = await this.$getPastLogsFilters(abi, {
            ...options
        });
        let logs = await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }
    protected async $getPastLogsFilters(mix: string | TAbiItem, options: {
        topic?: string
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {
            [key: string]: any
        }
    }): Promise<RpcTypes.Filter> {
        let abi = typeof mix === 'string'
            ? this.$getAbiItem('event', mix)
            : mix;
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

export namespace ContractBaseHelper {
    export function $getAbiItem (abi: TAbiItem[], type: 'event' | 'function' | 'string', name: string, argsCount?: number) {
        let arr = abi.filter(x => x.type === type && x.name === name);
        if (arr.length === 0) {
            throw new Error(`TAbiItem ${name} not found`);
        }
        if (arr.length === 1) {
            return arr[0];
        }
        if (argsCount == null) {
            throw new Error(`Found multiple TAbiItems for ${name}. Args count not specified to pick one`);
        }
        return arr.find(x => (x.inputs?.length ?? 0) === argsCount)
    }

    export async function $call (writer: ContractWriter
        , abi: string | TAbiItem
        , abiArr: TAbiItem[]
        , account: TAccount & {  value?: number | string | bigint }
        , ...params
    ): Promise<{ error?, result? }> {
        let tx = await writer.writeAsync(account, abi, params, {
            builderConfig: {
                send: 'manual',
                gasEstimation: false,
                nonce: 0,
                ...(this.builderConfig ?? {})
            },
            writerConfig: this.writerConfig,
        });
        try {
            let result = await tx.call();
            return {
                result
            };
        } catch (error) {
            if (error.data) {
                error.data = $contract.decodeCustomError(error.data, abiArr);
            }
            return {
                error
            }
        }
    }
    export async function $gas (writer: ContractWriter
        , abi: string | TAbiItem
        , abiArr: TAbiItem[]
        , account: IAccount & {  value?: number | string | bigint }
        , ...params
    ): Promise<{ error?, gas?: bigint, price?: bigint }> {

        let txBuilder = new TxDataBuilder(writer.client, account, {
            to: writer.address
        });

        txBuilder.setInputDataWithABI(abi, ...params);
        txBuilder.abi = abiArr;

        try {
            txBuilder = await txBuilder.setGas({
                gasEstimation: true,
                gasLimitRatio: 1,
            });
            return {
                gas: BigInt(txBuilder.data.gas),
                price: BigInt(txBuilder.data.gasPrice ?? txBuilder.data.maxFeePerGas),
            };
        } catch (error) {
            if (error.data) {
                error.data = $contract.decodeCustomError(error.data, abiArr);
            }
            return {
                error
            }
        }
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


namespace $abiUtil {
    export function isReader (abi: TAbiItem) {
        return ['view', 'pure', null].includes(abi.stateMutability);
    }
}
