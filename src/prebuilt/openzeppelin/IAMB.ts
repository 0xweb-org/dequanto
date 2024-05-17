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



export class IAMB extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    Types: TIAMBTypes;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/IAMB.ts"
    }

    // 0xb0750611
    async destinationChainId (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'destinationChainId'));
    }

    // 0xe37c3289
    async failedMessageDataHash (_messageId: TEth.Hex): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'failedMessageDataHash'), _messageId);
    }

    // 0x3f9a8e7e
    async failedMessageReceiver (_messageId: TEth.Hex): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'failedMessageReceiver'), _messageId);
    }

    // 0x4a610b04
    async failedMessageSender (_messageId: TEth.Hex): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'failedMessageSender'), _messageId);
    }

    // 0xe5789d03
    async maxGasPerTx (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'maxGasPerTx'));
    }

    // 0xcb08a10c
    async messageCallStatus (_messageId: TEth.Hex): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'messageCallStatus'), _messageId);
    }

    // 0x669f618b
    async messageId (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'messageId'));
    }

    // 0xd67bdd25
    async messageSender (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'messageSender'));
    }

    // 0x9e307dff
    async messageSourceChainId (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'messageSourceChainId'));
    }

    // 0x94643f71
    async requireToConfirmMessage (sender: TSender, _contract: TAddress, _data: TEth.Hex, _gas: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'requireToConfirmMessage'), sender, _contract, _data, _gas);
    }

    // 0xdc8601b3
    async requireToPassMessage (sender: TSender, _contract: TAddress, _data: TEth.Hex, _gas: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'requireToPassMessage'), sender, _contract, _data, _gas);
    }

    // 0x1544298e
    async sourceChainId (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'sourceChainId'));
    }

    // 0x0ac1c313
    async transactionHash (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'transactionHash'));
    }

    $call () {
        return super.$call() as IIAMBTxCaller;
    }
    $signed (): TOverrideReturns<IIAMBTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IIAMBTxData {
        return super.$data() as IIAMBTxData;
    }
    $gas (): TOverrideReturns<IIAMBTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TIAMBTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TIAMBTypes['Methods'][TMethod]['arguments']
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

    onAffirmationCompleted (fn?: (event: TClientEventsStreamData<TEventArguments<'AffirmationCompleted'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'AffirmationCompleted'>>> {
        return this.$onLog('AffirmationCompleted', fn);
    }

    onRelayedMessage (fn?: (event: TClientEventsStreamData<TEventArguments<'RelayedMessage'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'RelayedMessage'>>> {
        return this.$onLog('RelayedMessage', fn);
    }

    onUserRequestForAffirmation (fn?: (event: TClientEventsStreamData<TEventArguments<'UserRequestForAffirmation'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'UserRequestForAffirmation'>>> {
        return this.$onLog('UserRequestForAffirmation', fn);
    }

    onUserRequestForSignature (fn?: (event: TClientEventsStreamData<TEventArguments<'UserRequestForSignature'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'UserRequestForSignature'>>> {
        return this.$onLog('UserRequestForSignature', fn);
    }

    extractLogsAffirmationCompleted (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'AffirmationCompleted'>>[] {
        let abi = this.$getAbiItem('event', 'AffirmationCompleted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'AffirmationCompleted'>>[];
    }

    extractLogsRelayedMessage (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'RelayedMessage'>>[] {
        let abi = this.$getAbiItem('event', 'RelayedMessage');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'RelayedMessage'>>[];
    }

    extractLogsUserRequestForAffirmation (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'UserRequestForAffirmation'>>[] {
        let abi = this.$getAbiItem('event', 'UserRequestForAffirmation');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'UserRequestForAffirmation'>>[];
    }

    extractLogsUserRequestForSignature (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'UserRequestForSignature'>>[] {
        let abi = this.$getAbiItem('event', 'UserRequestForSignature');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'UserRequestForSignature'>>[];
    }

    async getPastLogsAffirmationCompleted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress,executor?: TAddress,messageId?: TEth.Hex }
    }): Promise<ITxLogItem<TEventParams<'AffirmationCompleted'>>[]> {
        return await this.$getPastLogsParsed('AffirmationCompleted', options) as any;
    }

    async getPastLogsRelayedMessage (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress,executor?: TAddress,messageId?: TEth.Hex }
    }): Promise<ITxLogItem<TEventParams<'RelayedMessage'>>[]> {
        return await this.$getPastLogsParsed('RelayedMessage', options) as any;
    }

    async getPastLogsUserRequestForAffirmation (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { messageId?: TEth.Hex }
    }): Promise<ITxLogItem<TEventParams<'UserRequestForAffirmation'>>[]> {
        return await this.$getPastLogsParsed('UserRequestForAffirmation', options) as any;
    }

    async getPastLogsUserRequestForSignature (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { messageId?: TEth.Hex }
    }): Promise<ITxLogItem<TEventParams<'UserRequestForSignature'>>[]> {
        return await this.$getPastLogsParsed('UserRequestForSignature', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"executor","type":"address"},{"indexed":true,"internalType":"bytes32","name":"messageId","type":"bytes32"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"AffirmationCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"executor","type":"address"},{"indexed":true,"internalType":"bytes32","name":"messageId","type":"bytes32"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"RelayedMessage","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"messageId","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"encodedData","type":"bytes"}],"name":"UserRequestForAffirmation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"messageId","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"encodedData","type":"bytes"}],"name":"UserRequestForSignature","type":"event"},{"inputs":[],"name":"destinationChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_messageId","type":"bytes32"}],"name":"failedMessageDataHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_messageId","type":"bytes32"}],"name":"failedMessageReceiver","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_messageId","type":"bytes32"}],"name":"failedMessageSender","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxGasPerTx","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_messageId","type":"bytes32"}],"name":"messageCallStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"messageId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"messageSender","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"messageSourceChainId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"uint256","name":"_gas","type":"uint256"}],"name":"requireToConfirmMessage","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"uint256","name":"_gas","type":"uint256"}],"name":"requireToPassMessage","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sourceChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"transactionHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TIAMBTypes = {
    Events: {
        AffirmationCompleted: {
            outputParams: { _sender: TAddress, executor: TAddress, messageId: TEth.Hex, status: boolean },
            outputArgs:   [ _sender: TAddress, executor: TAddress, messageId: TEth.Hex, status: boolean ],
        }
        RelayedMessage: {
            outputParams: { _sender: TAddress, executor: TAddress, messageId: TEth.Hex, status: boolean },
            outputArgs:   [ _sender: TAddress, executor: TAddress, messageId: TEth.Hex, status: boolean ],
        }
        UserRequestForAffirmation: {
            outputParams: { messageId: TEth.Hex, encodedData: TEth.Hex },
            outputArgs:   [ messageId: TEth.Hex, encodedData: TEth.Hex ],
        }
        UserRequestForSignature: {
            outputParams: { messageId: TEth.Hex, encodedData: TEth.Hex },
            outputArgs:   [ messageId: TEth.Hex, encodedData: TEth.Hex ],
        }
    },
    Methods: {
        destinationChainId: {
          method: "destinationChainId"
          arguments: [  ]
        }
        failedMessageDataHash: {
          method: "failedMessageDataHash"
          arguments: [ _messageId: TEth.Hex ]
        }
        failedMessageReceiver: {
          method: "failedMessageReceiver"
          arguments: [ _messageId: TEth.Hex ]
        }
        failedMessageSender: {
          method: "failedMessageSender"
          arguments: [ _messageId: TEth.Hex ]
        }
        maxGasPerTx: {
          method: "maxGasPerTx"
          arguments: [  ]
        }
        messageCallStatus: {
          method: "messageCallStatus"
          arguments: [ _messageId: TEth.Hex ]
        }
        messageId: {
          method: "messageId"
          arguments: [  ]
        }
        messageSender: {
          method: "messageSender"
          arguments: [  ]
        }
        messageSourceChainId: {
          method: "messageSourceChainId"
          arguments: [  ]
        }
        requireToConfirmMessage: {
          method: "requireToConfirmMessage"
          arguments: [ _contract: TAddress, _data: TEth.Hex, _gas: bigint ]
        }
        requireToPassMessage: {
          method: "requireToPassMessage"
          arguments: [ _contract: TAddress, _data: TEth.Hex, _gas: bigint ]
        }
        sourceChainId: {
          method: "sourceChainId"
          arguments: [  ]
        }
        transactionHash: {
          method: "transactionHash"
          arguments: [  ]
        }
    }
}



interface IIAMBTxCaller {
    requireToConfirmMessage (sender: TSender, _contract: TAddress, _data: TEth.Hex, _gas: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    requireToPassMessage (sender: TSender, _contract: TAddress, _data: TEth.Hex, _gas: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIAMBTxData {
    requireToConfirmMessage (sender: TSender, _contract: TAddress, _data: TEth.Hex, _gas: bigint): Promise<TEth.TxLike>
    requireToPassMessage (sender: TSender, _contract: TAddress, _data: TEth.Hex, _gas: bigint): Promise<TEth.TxLike>
}


type TEvents = TIAMBTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
