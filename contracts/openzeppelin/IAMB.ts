/**
 *  AUTO-Generated Class: 2023-10-05 18:18
 *  Implementation: https://etherscan.io/address/undefined#code
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TAccount } from '@dequanto/models/TAccount';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream, TClientEventsStreamData } from '@dequanto/clients/ClientEventsStream';
import { ContractBase, ContractBaseHelper } from '@dequanto/contracts/ContractBase';
import { ContractStorageReaderBase } from '@dequanto/contracts/ContractStorageReaderBase';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';


import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class IAMB extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0xb0750611
    async destinationChainId (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'destinationChainId'));
    }

    // 0xe37c3289
    async failedMessageDataHash (_messageId: TBufferLike): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'failedMessageDataHash'), _messageId);
    }

    // 0x3f9a8e7e
    async failedMessageReceiver (_messageId: TBufferLike): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'failedMessageReceiver'), _messageId);
    }

    // 0x4a610b04
    async failedMessageSender (_messageId: TBufferLike): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'failedMessageSender'), _messageId);
    }

    // 0xe5789d03
    async maxGasPerTx (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'maxGasPerTx'));
    }

    // 0xcb08a10c
    async messageCallStatus (_messageId: TBufferLike): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'messageCallStatus'), _messageId);
    }

    // 0x669f618b
    async messageId (): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'messageId'));
    }

    // 0xd67bdd25
    async messageSender (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'messageSender'));
    }

    // 0x9e307dff
    async messageSourceChainId (): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'messageSourceChainId'));
    }

    // 0x94643f71
    async requireToConfirmMessage (sender: TSender, _contract: TAddress, _data: TBufferLike, _gas: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'requireToConfirmMessage'), sender, _contract, _data, _gas);
    }

    // 0xdc8601b3
    async requireToPassMessage (sender: TSender, _contract: TAddress, _data: TBufferLike, _gas: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'requireToPassMessage'), sender, _contract, _data, _gas);
    }

    // 0x1544298e
    async sourceChainId (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'sourceChainId'));
    }

    // 0x0ac1c313
    async transactionHash (): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'transactionHash'));
    }

    $call () {
        return super.$call() as IIAMBTxCaller;;
    }

    $data (): IIAMBTxData {
        return super.$data() as IIAMBTxData;
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

    onAffirmationCompleted (fn?: (event: TClientEventsStreamData<TLogAffirmationCompletedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogAffirmationCompletedParameters>> {
        return this.$onLog('AffirmationCompleted', fn);
    }

    onRelayedMessage (fn?: (event: TClientEventsStreamData<TLogRelayedMessageParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogRelayedMessageParameters>> {
        return this.$onLog('RelayedMessage', fn);
    }

    onUserRequestForAffirmation (fn?: (event: TClientEventsStreamData<TLogUserRequestForAffirmationParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogUserRequestForAffirmationParameters>> {
        return this.$onLog('UserRequestForAffirmation', fn);
    }

    onUserRequestForSignature (fn?: (event: TClientEventsStreamData<TLogUserRequestForSignatureParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogUserRequestForSignatureParameters>> {
        return this.$onLog('UserRequestForSignature', fn);
    }

    extractLogsAffirmationCompleted (tx: TEth.TxReceipt): ITxLogItem<TLogAffirmationCompleted>[] {
        let abi = this.$getAbiItem('event', 'AffirmationCompleted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogAffirmationCompleted>[];
    }

    extractLogsRelayedMessage (tx: TEth.TxReceipt): ITxLogItem<TLogRelayedMessage>[] {
        let abi = this.$getAbiItem('event', 'RelayedMessage');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogRelayedMessage>[];
    }

    extractLogsUserRequestForAffirmation (tx: TEth.TxReceipt): ITxLogItem<TLogUserRequestForAffirmation>[] {
        let abi = this.$getAbiItem('event', 'UserRequestForAffirmation');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogUserRequestForAffirmation>[];
    }

    extractLogsUserRequestForSignature (tx: TEth.TxReceipt): ITxLogItem<TLogUserRequestForSignature>[] {
        let abi = this.$getAbiItem('event', 'UserRequestForSignature');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogUserRequestForSignature>[];
    }

    async getPastLogsAffirmationCompleted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress,executor?: TAddress,messageId?: TBufferLike }
    }): Promise<ITxLogItem<TLogAffirmationCompleted>[]> {
        return await this.$getPastLogsParsed('AffirmationCompleted', options) as any;
    }

    async getPastLogsRelayedMessage (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress,executor?: TAddress,messageId?: TBufferLike }
    }): Promise<ITxLogItem<TLogRelayedMessage>[]> {
        return await this.$getPastLogsParsed('RelayedMessage', options) as any;
    }

    async getPastLogsUserRequestForAffirmation (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { messageId?: TBufferLike }
    }): Promise<ITxLogItem<TLogUserRequestForAffirmation>[]> {
        return await this.$getPastLogsParsed('UserRequestForAffirmation', options) as any;
    }

    async getPastLogsUserRequestForSignature (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { messageId?: TBufferLike }
    }): Promise<ITxLogItem<TLogUserRequestForSignature>[]> {
        return await this.$getPastLogsParsed('UserRequestForSignature', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"executor","type":"address"},{"indexed":true,"internalType":"bytes32","name":"messageId","type":"bytes32"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"AffirmationCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"executor","type":"address"},{"indexed":true,"internalType":"bytes32","name":"messageId","type":"bytes32"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"RelayedMessage","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"messageId","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"encodedData","type":"bytes"}],"name":"UserRequestForAffirmation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"messageId","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"encodedData","type":"bytes"}],"name":"UserRequestForSignature","type":"event"},{"inputs":[],"name":"destinationChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_messageId","type":"bytes32"}],"name":"failedMessageDataHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_messageId","type":"bytes32"}],"name":"failedMessageReceiver","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_messageId","type":"bytes32"}],"name":"failedMessageSender","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxGasPerTx","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_messageId","type":"bytes32"}],"name":"messageCallStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"messageId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"messageSender","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"messageSourceChainId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"uint256","name":"_gas","type":"uint256"}],"name":"requireToConfirmMessage","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"uint256","name":"_gas","type":"uint256"}],"name":"requireToPassMessage","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sourceChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"transactionHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogAffirmationCompleted = {
        _sender: TAddress, executor: TAddress, messageId: TBufferLike, status: boolean
    };
    type TLogAffirmationCompletedParameters = [ _sender: TAddress, executor: TAddress, messageId: TBufferLike, status: boolean ];
    type TLogRelayedMessage = {
        _sender: TAddress, executor: TAddress, messageId: TBufferLike, status: boolean
    };
    type TLogRelayedMessageParameters = [ _sender: TAddress, executor: TAddress, messageId: TBufferLike, status: boolean ];
    type TLogUserRequestForAffirmation = {
        messageId: TBufferLike, encodedData: TBufferLike
    };
    type TLogUserRequestForAffirmationParameters = [ messageId: TBufferLike, encodedData: TBufferLike ];
    type TLogUserRequestForSignature = {
        messageId: TBufferLike, encodedData: TBufferLike
    };
    type TLogUserRequestForSignatureParameters = [ messageId: TBufferLike, encodedData: TBufferLike ];

interface IEvents {
  AffirmationCompleted: TLogAffirmationCompletedParameters
  RelayedMessage: TLogRelayedMessageParameters
  UserRequestForAffirmation: TLogUserRequestForAffirmationParameters
  UserRequestForSignature: TLogUserRequestForSignatureParameters
  '*': any[] 
}



interface IMethodDestinationChainId {
  method: "destinationChainId"
  arguments: [  ]
}

interface IMethodFailedMessageDataHash {
  method: "failedMessageDataHash"
  arguments: [ _messageId: TBufferLike ]
}

interface IMethodFailedMessageReceiver {
  method: "failedMessageReceiver"
  arguments: [ _messageId: TBufferLike ]
}

interface IMethodFailedMessageSender {
  method: "failedMessageSender"
  arguments: [ _messageId: TBufferLike ]
}

interface IMethodMaxGasPerTx {
  method: "maxGasPerTx"
  arguments: [  ]
}

interface IMethodMessageCallStatus {
  method: "messageCallStatus"
  arguments: [ _messageId: TBufferLike ]
}

interface IMethodMessageId {
  method: "messageId"
  arguments: [  ]
}

interface IMethodMessageSender {
  method: "messageSender"
  arguments: [  ]
}

interface IMethodMessageSourceChainId {
  method: "messageSourceChainId"
  arguments: [  ]
}

interface IMethodRequireToConfirmMessage {
  method: "requireToConfirmMessage"
  arguments: [ _contract: TAddress, _data: TBufferLike, _gas: bigint ]
}

interface IMethodRequireToPassMessage {
  method: "requireToPassMessage"
  arguments: [ _contract: TAddress, _data: TBufferLike, _gas: bigint ]
}

interface IMethodSourceChainId {
  method: "sourceChainId"
  arguments: [  ]
}

interface IMethodTransactionHash {
  method: "transactionHash"
  arguments: [  ]
}

interface IMethods {
  destinationChainId: IMethodDestinationChainId
  failedMessageDataHash: IMethodFailedMessageDataHash
  failedMessageReceiver: IMethodFailedMessageReceiver
  failedMessageSender: IMethodFailedMessageSender
  maxGasPerTx: IMethodMaxGasPerTx
  messageCallStatus: IMethodMessageCallStatus
  messageId: IMethodMessageId
  messageSender: IMethodMessageSender
  messageSourceChainId: IMethodMessageSourceChainId
  requireToConfirmMessage: IMethodRequireToConfirmMessage
  requireToPassMessage: IMethodRequireToPassMessage
  sourceChainId: IMethodSourceChainId
  transactionHash: IMethodTransactionHash
  '*': { method: string, arguments: any[] } 
}






interface IIAMBTxCaller {
    requireToConfirmMessage (sender: TSender, _contract: TAddress, _data: TBufferLike, _gas: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    requireToPassMessage (sender: TSender, _contract: TAddress, _data: TBufferLike, _gas: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIAMBTxData {
    requireToConfirmMessage (sender: TSender, _contract: TAddress, _data: TBufferLike, _gas: bigint): Promise<TEth.TxLike>
    requireToPassMessage (sender: TSender, _contract: TAddress, _data: TBufferLike, _gas: bigint): Promise<TEth.TxLike>
}


