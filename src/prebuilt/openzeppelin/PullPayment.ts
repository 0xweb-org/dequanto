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



export class PullPayment extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockchainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)


    }

    Types: TPullPaymentTypes;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/PullPayment.ts"
    }

    // 0xe2982c21
    async payments (dest: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'payments'), dest);
    }

    // 0x31b3eb94
    async withdrawPayments (sender: TSender, payee: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdrawPayments'), sender, payee);
    }

    $call () {
        return super.$call() as IPullPaymentTxCaller;
    }
    $signed (): TOverrideReturns<IPullPaymentTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IPullPaymentTxData {
        return super.$data() as IPullPaymentTxData;
    }
    $gas (): TOverrideReturns<IPullPaymentTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TPullPaymentTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TPullPaymentTypes['Methods'][TMethod]['arguments']
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







    abi: TAbiItem[] = [{"inputs":[{"internalType":"address","name":"dest","type":"address"}],"name":"payments","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"payee","type":"address"}],"name":"withdrawPayments","outputs":[],"stateMutability":"nonpayable","type":"function"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TPullPaymentTypes = {
    Events: {

    },
    Methods: {
        payments: {
          method: "payments"
          arguments: [ dest: TAddress ]
        }
        withdrawPayments: {
          method: "withdrawPayments"
          arguments: [ payee: TAddress ]
        }
    }
}



interface IPullPaymentTxCaller {
    withdrawPayments (sender: TSender, payee: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IPullPaymentTxData {
    withdrawPayments (sender: TSender, payee: TAddress): Promise<TEth.TxLike>
}


type TEvents = TPullPaymentTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
