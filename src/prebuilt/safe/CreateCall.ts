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
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';
import type { TOverrideReturns } from '@dequanto/utils/types';


import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class CreateCall extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockchainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)


    }

    Types: TCreateCallTypes;

    $meta = {
        "class": "./src/prebuilt/safe/CreateCall.ts"
    }

    // 0x4c8c9ea1
    async performCreate (sender: TSender, value: bigint, deploymentData: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'performCreate'), sender, value, deploymentData);
    }

    // 0x4847be6f
    async performCreate2 (sender: TSender, value: bigint, deploymentData: TEth.Hex, salt: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'performCreate2'), sender, value, deploymentData, salt);
    }

    $call () {
        return super.$call() as ICreateCallTxCaller;
    }
    $signed (): TOverrideReturns<ICreateCallTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): ICreateCallTxData {
        return super.$data() as ICreateCallTxData;
    }
    $gas (): TOverrideReturns<ICreateCallTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TCreateCallTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TCreateCallTypes['Methods'][TMethod]['arguments']
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

    onContractCreation (fn?: (event: TClientEventsStreamData<TEventArguments<'ContractCreation'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ContractCreation'>>> {
        return this.$onLog('ContractCreation', fn);
    }

    extractLogsContractCreation (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ContractCreation'>>[] {
        let abi = this.$getAbiItem('event', 'ContractCreation');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ContractCreation'>>[];
    }

    async getPastLogsContractCreation (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { newContract?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ContractCreation'>>[]> {
        return await this.$getPastLogsParsed('ContractCreation', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newContract","type":"address"}],"name":"ContractCreation","type":"event"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"deploymentData","type":"bytes"}],"name":"performCreate","outputs":[{"internalType":"address","name":"newContract","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"deploymentData","type":"bytes"},{"internalType":"bytes32","name":"salt","type":"bytes32"}],"name":"performCreate2","outputs":[{"internalType":"address","name":"newContract","type":"address"}],"stateMutability":"nonpayable","type":"function"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TCreateCallTypes = {
    Events: {
        ContractCreation: {
            outputParams: { newContract: TAddress },
            outputArgs:   [ newContract: TAddress ],
        }
    },
    Methods: {
        performCreate: {
          method: "performCreate"
          arguments: [ value: bigint, deploymentData: TEth.Hex ]
        }
        performCreate2: {
          method: "performCreate2"
          arguments: [ value: bigint, deploymentData: TEth.Hex, salt: TEth.Hex ]
        }
    }
}



interface ICreateCallTxCaller {
    performCreate (sender: TSender, value: bigint, deploymentData: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    performCreate2 (sender: TSender, value: bigint, deploymentData: TEth.Hex, salt: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface ICreateCallTxData {
    performCreate (sender: TSender, value: bigint, deploymentData: TEth.Hex): Promise<TEth.TxLike>
    performCreate2 (sender: TSender, value: bigint, deploymentData: TEth.Hex, salt: TEth.Hex): Promise<TEth.TxLike>
}


type TEvents = TCreateCallTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
