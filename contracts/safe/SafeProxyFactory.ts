/**
 *  AUTO-Generated Class: 2023-12-22 01:26
 *  Implementation: https://etherscan.io/address/undefined#code
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TAccount } from '@dequanto/models/TAccount';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream, TClientEventsStreamData } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { ContractBaseUtils } from '@dequanto/contracts/utils/ContractBaseUtils';
import { ContractStorageReaderBase } from '@dequanto/contracts/ContractStorageReaderBase';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';
import type { TOverrideReturns } from '@dequanto/utils/types';


import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class SafeProxyFactory extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    

    // 0xec9e80bb
    async createChainSpecificProxyWithNonce (sender: TSender, _singleton: TAddress, initializer: TBufferLike, saltNonce: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'createChainSpecificProxyWithNonce'), sender, _singleton, initializer, saltNonce);
    }

    // 0xd18af54d
    async createProxyWithCallback (sender: TSender, _singleton: TAddress, initializer: TBufferLike, saltNonce: bigint, callback: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'createProxyWithCallback'), sender, _singleton, initializer, saltNonce, callback);
    }

    // 0x1688f0b9
    async createProxyWithNonce (sender: TSender, _singleton: TAddress, initializer: TBufferLike, saltNonce: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'createProxyWithNonce'), sender, _singleton, initializer, saltNonce);
    }

    // 0x3408e470
    async getChainId (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getChainId'));
    }

    // 0x53e5d935
    async proxyCreationCode (): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'proxyCreationCode'));
    }

    $call () {
        return super.$call() as ISafeProxyFactoryTxCaller;
    }
    $signed (): TOverrideReturns<ISafeProxyFactoryTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): ISafeProxyFactoryTxData {
        return super.$data() as ISafeProxyFactoryTxData;
    }
    $gas (): TOverrideReturns<ISafeProxyFactoryTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof IMethods> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: IMethods[TMethod]
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = method;
        return <any> this.$onTransaction(options);
    }

    onLog (event: keyof IEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
        return this.$onLog(event, cb);
    }

    onProxyCreation (fn?: (event: TClientEventsStreamData<TLogProxyCreationParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogProxyCreationParameters>> {
        return this.$onLog('ProxyCreation', fn);
    }

    extractLogsProxyCreation (tx: TEth.TxReceipt): ITxLogItem<TLogProxyCreation>[] {
        let abi = this.$getAbiItem('event', 'ProxyCreation');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogProxyCreation>[];
    }

    async getPastLogsProxyCreation (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { proxy?: TAddress }
    }): Promise<ITxLogItem<TLogProxyCreation>[]> {
        return await this.$getPastLogsParsed('ProxyCreation', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract SafeProxy","name":"proxy","type":"address"},{"indexed":false,"internalType":"address","name":"singleton","type":"address"}],"name":"ProxyCreation","type":"event"},{"inputs":[{"internalType":"address","name":"_singleton","type":"address"},{"internalType":"bytes","name":"initializer","type":"bytes"},{"internalType":"uint256","name":"saltNonce","type":"uint256"}],"name":"createChainSpecificProxyWithNonce","outputs":[{"internalType":"contract SafeProxy","name":"proxy","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_singleton","type":"address"},{"internalType":"bytes","name":"initializer","type":"bytes"},{"internalType":"uint256","name":"saltNonce","type":"uint256"},{"internalType":"contract IProxyCreationCallback","name":"callback","type":"address"}],"name":"createProxyWithCallback","outputs":[{"internalType":"contract SafeProxy","name":"proxy","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_singleton","type":"address"},{"internalType":"bytes","name":"initializer","type":"bytes"},{"internalType":"uint256","name":"saltNonce","type":"uint256"}],"name":"createProxyWithNonce","outputs":[{"internalType":"contract SafeProxy","name":"proxy","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxyCreationCode","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"pure","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogProxyCreation = {
        proxy: TAddress, singleton: TAddress
    };
    type TLogProxyCreationParameters = [ proxy: TAddress, singleton: TAddress ];

interface IEvents {
  ProxyCreation: TLogProxyCreationParameters
  '*': any[] 
}



interface IMethodCreateChainSpecificProxyWithNonce {
  method: "createChainSpecificProxyWithNonce"
  arguments: [ _singleton: TAddress, initializer: TBufferLike, saltNonce: bigint ]
}

interface IMethodCreateProxyWithCallback {
  method: "createProxyWithCallback"
  arguments: [ _singleton: TAddress, initializer: TBufferLike, saltNonce: bigint, callback: TAddress ]
}

interface IMethodCreateProxyWithNonce {
  method: "createProxyWithNonce"
  arguments: [ _singleton: TAddress, initializer: TBufferLike, saltNonce: bigint ]
}

interface IMethodGetChainId {
  method: "getChainId"
  arguments: [  ]
}

interface IMethodProxyCreationCode {
  method: "proxyCreationCode"
  arguments: [  ]
}

interface IMethods {
  createChainSpecificProxyWithNonce: IMethodCreateChainSpecificProxyWithNonce
  createProxyWithCallback: IMethodCreateProxyWithCallback
  createProxyWithNonce: IMethodCreateProxyWithNonce
  getChainId: IMethodGetChainId
  proxyCreationCode: IMethodProxyCreationCode
  '*': { method: string, arguments: any[] } 
}






interface ISafeProxyFactoryTxCaller {
    createChainSpecificProxyWithNonce (sender: TSender, _singleton: TAddress, initializer: TBufferLike, saltNonce: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    createProxyWithCallback (sender: TSender, _singleton: TAddress, initializer: TBufferLike, saltNonce: bigint, callback: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    createProxyWithNonce (sender: TSender, _singleton: TAddress, initializer: TBufferLike, saltNonce: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface ISafeProxyFactoryTxData {
    createChainSpecificProxyWithNonce (sender: TSender, _singleton: TAddress, initializer: TBufferLike, saltNonce: bigint): Promise<TEth.TxLike>
    createProxyWithCallback (sender: TSender, _singleton: TAddress, initializer: TBufferLike, saltNonce: bigint, callback: TAddress): Promise<TEth.TxLike>
    createProxyWithNonce (sender: TSender, _singleton: TAddress, initializer: TBufferLike, saltNonce: bigint): Promise<TEth.TxLike>
}


