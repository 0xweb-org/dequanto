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



export class ICompoundTimelock extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockchainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)


    }

    Types: TICompoundTimelockTypes;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/ICompoundTimelock.ts"
    }

    // 0xc1a287e2
    async GRACE_PERIOD (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'GRACE_PERIOD'));
    }

    // 0x7d645fab
    async MAXIMUM_DELAY (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'MAXIMUM_DELAY'));
    }

    // 0xb1b43ae5
    async MINIMUM_DELAY (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'MINIMUM_DELAY'));
    }

    // 0x0e18b681
    async acceptAdmin (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'acceptAdmin'), sender);
    }

    // 0xf851a440
    async admin (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'admin'));
    }

    // 0x591fcdfe
    async cancelTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'cancelTransaction'), sender, target, value, signature, data, eta);
    }

    // 0x6a42b8f8
    async delay (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'delay'));
    }

    // 0x0825f38f
    async executeTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'executeTransaction'), sender, target, value, signature, data, eta);
    }

    // 0x26782247
    async pendingAdmin (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'pendingAdmin'));
    }

    // 0x3a66f901
    async queueTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'queueTransaction'), sender, target, value, signature, data, eta);
    }

    // 0xf2b06537
    async queuedTransactions (input0: TEth.Hex): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'queuedTransactions'), input0);
    }

    // 0xe177246e
    async setDelay (sender: TSender, input0: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setDelay'), sender, input0);
    }

    // 0x4dd18bf5
    async setPendingAdmin (sender: TSender, input0: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setPendingAdmin'), sender, input0);
    }

    $call () {
        return super.$call() as IICompoundTimelockTxCaller;
    }
    $signed (): TOverrideReturns<IICompoundTimelockTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IICompoundTimelockTxData {
        return super.$data() as IICompoundTimelockTxData;
    }
    $gas (): TOverrideReturns<IICompoundTimelockTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TICompoundTimelockTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TICompoundTimelockTypes['Methods'][TMethod]['arguments']
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

    onCancelTransaction (fn?: (event: TClientEventsStreamData<TEventArguments<'CancelTransaction'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'CancelTransaction'>>> {
        return this.$onLog('CancelTransaction', fn);
    }

    onExecuteTransaction (fn?: (event: TClientEventsStreamData<TEventArguments<'ExecuteTransaction'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ExecuteTransaction'>>> {
        return this.$onLog('ExecuteTransaction', fn);
    }

    onNewAdmin (fn?: (event: TClientEventsStreamData<TEventArguments<'NewAdmin'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'NewAdmin'>>> {
        return this.$onLog('NewAdmin', fn);
    }

    onNewDelay (fn?: (event: TClientEventsStreamData<TEventArguments<'NewDelay'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'NewDelay'>>> {
        return this.$onLog('NewDelay', fn);
    }

    onNewPendingAdmin (fn?: (event: TClientEventsStreamData<TEventArguments<'NewPendingAdmin'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'NewPendingAdmin'>>> {
        return this.$onLog('NewPendingAdmin', fn);
    }

    onQueueTransaction (fn?: (event: TClientEventsStreamData<TEventArguments<'QueueTransaction'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'QueueTransaction'>>> {
        return this.$onLog('QueueTransaction', fn);
    }

    extractLogsCancelTransaction (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'CancelTransaction'>>[] {
        let abi = this.$getAbiItem('event', 'CancelTransaction');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'CancelTransaction'>>[];
    }

    extractLogsExecuteTransaction (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ExecuteTransaction'>>[] {
        let abi = this.$getAbiItem('event', 'ExecuteTransaction');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ExecuteTransaction'>>[];
    }

    extractLogsNewAdmin (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'NewAdmin'>>[] {
        let abi = this.$getAbiItem('event', 'NewAdmin');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'NewAdmin'>>[];
    }

    extractLogsNewDelay (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'NewDelay'>>[] {
        let abi = this.$getAbiItem('event', 'NewDelay');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'NewDelay'>>[];
    }

    extractLogsNewPendingAdmin (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'NewPendingAdmin'>>[] {
        let abi = this.$getAbiItem('event', 'NewPendingAdmin');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'NewPendingAdmin'>>[];
    }

    extractLogsQueueTransaction (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'QueueTransaction'>>[] {
        let abi = this.$getAbiItem('event', 'QueueTransaction');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'QueueTransaction'>>[];
    }

    async getPastLogsCancelTransaction (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { txHash?: TEth.Hex,target?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'CancelTransaction'>>[]> {
        return await this.$getPastLogsParsed('CancelTransaction', options) as any;
    }

    async getPastLogsExecuteTransaction (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { txHash?: TEth.Hex,target?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ExecuteTransaction'>>[]> {
        return await this.$getPastLogsParsed('ExecuteTransaction', options) as any;
    }

    async getPastLogsNewAdmin (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { newAdmin?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'NewAdmin'>>[]> {
        return await this.$getPastLogsParsed('NewAdmin', options) as any;
    }

    async getPastLogsNewDelay (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { newDelay?: bigint }
    }): Promise<ITxLogItem<TEventParams<'NewDelay'>>[]> {
        return await this.$getPastLogsParsed('NewDelay', options) as any;
    }

    async getPastLogsNewPendingAdmin (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { newPendingAdmin?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'NewPendingAdmin'>>[]> {
        return await this.$getPastLogsParsed('NewPendingAdmin', options) as any;
    }

    async getPastLogsQueueTransaction (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { txHash?: TEth.Hex,target?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'QueueTransaction'>>[]> {
        return await this.$getPastLogsParsed('QueueTransaction', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"string","name":"signature","type":"string"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"eta","type":"uint256"}],"name":"CancelTransaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"string","name":"signature","type":"string"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"eta","type":"uint256"}],"name":"ExecuteTransaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newAdmin","type":"address"}],"name":"NewAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"newDelay","type":"uint256"}],"name":"NewDelay","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newPendingAdmin","type":"address"}],"name":"NewPendingAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"string","name":"signature","type":"string"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"eta","type":"uint256"}],"name":"QueueTransaction","type":"event"},{"inputs":[],"name":"GRACE_PERIOD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAXIMUM_DELAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINIMUM_DELAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"acceptAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"string","name":"signature","type":"string"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"eta","type":"uint256"}],"name":"cancelTransaction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"delay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"string","name":"signature","type":"string"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"eta","type":"uint256"}],"name":"executeTransaction","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"pendingAdmin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"string","name":"signature","type":"string"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"eta","type":"uint256"}],"name":"queueTransaction","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"queuedTransactions","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"setDelay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"setPendingAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TICompoundTimelockTypes = {
    Events: {
        CancelTransaction: {
            outputParams: { txHash: TEth.Hex, target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint },
            outputArgs:   [ txHash: TEth.Hex, target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint ],
        }
        ExecuteTransaction: {
            outputParams: { txHash: TEth.Hex, target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint },
            outputArgs:   [ txHash: TEth.Hex, target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint ],
        }
        NewAdmin: {
            outputParams: { newAdmin: TAddress },
            outputArgs:   [ newAdmin: TAddress ],
        }
        NewDelay: {
            outputParams: { newDelay: bigint },
            outputArgs:   [ newDelay: bigint ],
        }
        NewPendingAdmin: {
            outputParams: { newPendingAdmin: TAddress },
            outputArgs:   [ newPendingAdmin: TAddress ],
        }
        QueueTransaction: {
            outputParams: { txHash: TEth.Hex, target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint },
            outputArgs:   [ txHash: TEth.Hex, target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint ],
        }
    },
    Methods: {
        GRACE_PERIOD: {
          method: "GRACE_PERIOD"
          arguments: [  ]
        }
        MAXIMUM_DELAY: {
          method: "MAXIMUM_DELAY"
          arguments: [  ]
        }
        MINIMUM_DELAY: {
          method: "MINIMUM_DELAY"
          arguments: [  ]
        }
        acceptAdmin: {
          method: "acceptAdmin"
          arguments: [  ]
        }
        admin: {
          method: "admin"
          arguments: [  ]
        }
        cancelTransaction: {
          method: "cancelTransaction"
          arguments: [ target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint ]
        }
        delay: {
          method: "delay"
          arguments: [  ]
        }
        executeTransaction: {
          method: "executeTransaction"
          arguments: [ target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint ]
        }
        pendingAdmin: {
          method: "pendingAdmin"
          arguments: [  ]
        }
        queueTransaction: {
          method: "queueTransaction"
          arguments: [ target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint ]
        }
        queuedTransactions: {
          method: "queuedTransactions"
          arguments: [ input0: TEth.Hex ]
        }
        setDelay: {
          method: "setDelay"
          arguments: [ input0: bigint ]
        }
        setPendingAdmin: {
          method: "setPendingAdmin"
          arguments: [ input0: TAddress ]
        }
    }
}



interface IICompoundTimelockTxCaller {
    acceptAdmin (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    cancelTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    executeTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    queueTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setDelay (sender: TSender, input0: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setPendingAdmin (sender: TSender, input0: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IICompoundTimelockTxData {
    acceptAdmin (sender: TSender, ): Promise<TEth.TxLike>
    cancelTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint): Promise<TEth.TxLike>
    executeTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint): Promise<TEth.TxLike>
    queueTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TEth.Hex, eta: bigint): Promise<TEth.TxLike>
    setDelay (sender: TSender, input0: bigint): Promise<TEth.TxLike>
    setPendingAdmin (sender: TSender, input0: TAddress): Promise<TEth.TxLike>
}


type TEvents = TICompoundTimelockTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
