/**
 *  AUTO-Generated Class: 2024-05-17 00:25
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

    Types: TSafeProxyFactoryTypes;

    $meta = {
        "class": "./src/prebuilt/safe/SafeProxyFactory.ts"
    }

    // 0xec9e80bb
    async createChainSpecificProxyWithNonce (sender: TSender, _singleton: TAddress, initializer: TEth.Hex, saltNonce: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'createChainSpecificProxyWithNonce'), sender, _singleton, initializer, saltNonce);
    }

    // 0xd18af54d
    async createProxyWithCallback (sender: TSender, _singleton: TAddress, initializer: TEth.Hex, saltNonce: bigint, callback: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'createProxyWithCallback'), sender, _singleton, initializer, saltNonce, callback);
    }

    // 0x1688f0b9
    async createProxyWithNonce (sender: TSender, _singleton: TAddress, initializer: TEth.Hex, saltNonce: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'createProxyWithNonce'), sender, _singleton, initializer, saltNonce);
    }

    // 0x3408e470
    async getChainId (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getChainId'));
    }

    // 0x53e5d935
    async proxyCreationCode (): Promise<TEth.Hex> {
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

    onTransaction <TMethod extends keyof TSafeProxyFactoryTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TSafeProxyFactoryTypes['Methods'][TMethod]['arguments']
        }
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = method;
        return <any> this.$onTransaction(options);
    }

    onLog (event: keyof TEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
        return this.$onLog(event, cb);
    }

    async getPastLogs <TEventName extends keyof TEvents> (
        events: TEventName[]
        , options?: TEventLogOptions<TEventParams<TEventName>>
    ): Promise<ITxLogItem<TEventParams<TEventName>, TEventName>[]>
    async getPastLogs <TEventName extends keyof TEvents> (
        event: TEventName
        , options?: TEventLogOptions<TEventParams<TEventName>>
    ): Promise<ITxLogItem<TEventParams<TEventName>, TEventName>[]>
    async getPastLogs (mix: any, options?): Promise<any> {
        return await super.getPastLogs(mix, options) as any;
    }

    onProxyCreation (fn?: (event: TClientEventsStreamData<TEventArguments<'ProxyCreation'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ProxyCreation'>>> {
        return this.$onLog('ProxyCreation', fn);
    }

    extractLogsProxyCreation (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ProxyCreation'>>[] {
        let abi = this.$getAbiItem('event', 'ProxyCreation');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ProxyCreation'>>[];
    }

    async getPastLogsProxyCreation (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { proxy?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ProxyCreation'>>[]> {
        return await this.$getPastLogsParsed('ProxyCreation', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract SafeProxy","name":"proxy","type":"address"},{"indexed":false,"internalType":"address","name":"singleton","type":"address"}],"name":"ProxyCreation","type":"event"},{"inputs":[{"internalType":"address","name":"_singleton","type":"address"},{"internalType":"bytes","name":"initializer","type":"bytes"},{"internalType":"uint256","name":"saltNonce","type":"uint256"}],"name":"createChainSpecificProxyWithNonce","outputs":[{"internalType":"contract SafeProxy","name":"proxy","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_singleton","type":"address"},{"internalType":"bytes","name":"initializer","type":"bytes"},{"internalType":"uint256","name":"saltNonce","type":"uint256"},{"internalType":"contract IProxyCreationCallback","name":"callback","type":"address"}],"name":"createProxyWithCallback","outputs":[{"internalType":"contract SafeProxy","name":"proxy","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_singleton","type":"address"},{"internalType":"bytes","name":"initializer","type":"bytes"},{"internalType":"uint256","name":"saltNonce","type":"uint256"}],"name":"createProxyWithNonce","outputs":[{"internalType":"contract SafeProxy","name":"proxy","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxyCreationCode","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"pure","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TSafeProxyFactoryTypes = {
    Events: {
        ProxyCreation: {
            outputParams: { proxy: TAddress, singleton: TAddress },
            outputArgs:   [ proxy: TAddress, singleton: TAddress ],
        }
    },
    Methods: {
        createChainSpecificProxyWithNonce: {
          method: "createChainSpecificProxyWithNonce"
          arguments: [ _singleton: TAddress, initializer: TEth.Hex, saltNonce: bigint ]
        }
        createProxyWithCallback: {
          method: "createProxyWithCallback"
          arguments: [ _singleton: TAddress, initializer: TEth.Hex, saltNonce: bigint, callback: TAddress ]
        }
        createProxyWithNonce: {
          method: "createProxyWithNonce"
          arguments: [ _singleton: TAddress, initializer: TEth.Hex, saltNonce: bigint ]
        }
        getChainId: {
          method: "getChainId"
          arguments: [  ]
        }
        proxyCreationCode: {
          method: "proxyCreationCode"
          arguments: [  ]
        }
    }
}



interface ISafeProxyFactoryTxCaller {
    createChainSpecificProxyWithNonce (sender: TSender, _singleton: TAddress, initializer: TEth.Hex, saltNonce: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    createProxyWithCallback (sender: TSender, _singleton: TAddress, initializer: TEth.Hex, saltNonce: bigint, callback: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    createProxyWithNonce (sender: TSender, _singleton: TAddress, initializer: TEth.Hex, saltNonce: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface ISafeProxyFactoryTxData {
    createChainSpecificProxyWithNonce (sender: TSender, _singleton: TAddress, initializer: TEth.Hex, saltNonce: bigint): Promise<TEth.TxLike>
    createProxyWithCallback (sender: TSender, _singleton: TAddress, initializer: TEth.Hex, saltNonce: bigint, callback: TAddress): Promise<TEth.TxLike>
    createProxyWithNonce (sender: TSender, _singleton: TAddress, initializer: TEth.Hex, saltNonce: bigint): Promise<TEth.TxLike>
}


type TEvents = TSafeProxyFactoryTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
