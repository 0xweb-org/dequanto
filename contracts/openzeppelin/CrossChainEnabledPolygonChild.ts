/**
 *  AUTO-Generated Class: 2024-02-27 16:48
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

export namespace CrossChainEnabledPolygonChildErrors {
    export interface NotCrossChainCall {
        type: 'NotCrossChainCall'
        params: {
        }
    }
    export type Error = NotCrossChainCall
}

export class CrossChainEnabledPolygonChild extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    $meta = {
        "class": "./contracts/openzeppelin/CrossChainEnabledPolygonChild.ts"
    }

    // 0x9a7c4b71
    async processMessageFromRoot (sender: TSender, input0: bigint, rootMessageSender: TAddress, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'processMessageFromRoot'), sender, input0, rootMessageSender, data);
    }

    $call () {
        return super.$call() as ICrossChainEnabledPolygonChildTxCaller;
    }
    $signed (): TOverrideReturns<ICrossChainEnabledPolygonChildTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): ICrossChainEnabledPolygonChildTxData {
        return super.$data() as ICrossChainEnabledPolygonChildTxData;
    }
    $gas (): TOverrideReturns<ICrossChainEnabledPolygonChildTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TCrossChainEnabledPolygonChildTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TCrossChainEnabledPolygonChildTypes['Methods'][TMethod]['arguments']
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
        return await this.$getPastLogsParsed(mix, options) as any;
    }







    abi: TAbiItem[] = [{"inputs":[],"name":"NotCrossChainCall","type":"error"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"rootMessageSender","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"processMessageFromRoot","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TCrossChainEnabledPolygonChildTypes = {
    Events: {
        
    },
    Methods: {
        processMessageFromRoot: {
          method: "processMessageFromRoot"
          arguments: [ input0: bigint, rootMessageSender: TAddress, data: TEth.Hex ]
        }
    }
}



interface ICrossChainEnabledPolygonChildTxCaller {
    processMessageFromRoot (sender: TSender, input0: bigint, rootMessageSender: TAddress, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface ICrossChainEnabledPolygonChildTxData {
    processMessageFromRoot (sender: TSender, input0: bigint, rootMessageSender: TAddress, data: TEth.Hex): Promise<TEth.TxLike>
}


type TEvents = TCrossChainEnabledPolygonChildTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
