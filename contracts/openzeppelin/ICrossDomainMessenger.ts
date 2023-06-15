/**
 *  AUTO-Generated Class: 2023-06-15 23:19
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

import type { TransactionReceipt, Transaction, EventLog, TransactionConfig } from 'web3-core';
import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { AbiItem } from 'web3-utils';
import type { BlockTransactionString } from 'web3-eth';


import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class ICrossDomainMessenger extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0x3dbb202b
    async sendMessage (sender: TSender, _target: TAddress, _message: TBufferLike, _gasLimit: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'sendMessage'), sender, _target, _message, _gasLimit);
    }

    // 0x6e296e45
    async xDomainMessageSender (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'xDomainMessageSender'));
    }

    $call () {
        return super.$call() as IICrossDomainMessengerTxCaller;;
    }

    $data (): IICrossDomainMessengerTxData {
        return super.$data() as IICrossDomainMessengerTxData;
    }

    onTransaction <TMethod extends keyof IMethods> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: Transaction
        block: BlockTransactionString
        calldata: IMethods[TMethod]
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = <any> method;
        return <any> this.$onTransaction(options);
    }

    onLog (event: keyof IEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
        return this.$onLog(event, cb);
    }

    onFailedRelayedMessage (fn?: (event: TClientEventsStreamData<TLogFailedRelayedMessageParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogFailedRelayedMessageParameters>> {
        return this.$onLog('FailedRelayedMessage', fn);
    }

    onRelayedMessage (fn?: (event: TClientEventsStreamData<TLogRelayedMessageParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogRelayedMessageParameters>> {
        return this.$onLog('RelayedMessage', fn);
    }

    onSentMessage (fn?: (event: TClientEventsStreamData<TLogSentMessageParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogSentMessageParameters>> {
        return this.$onLog('SentMessage', fn);
    }

    extractLogsFailedRelayedMessage (tx: TransactionReceipt): ITxLogItem<TLogFailedRelayedMessage>[] {
        let abi = this.$getAbiItem('event', 'FailedRelayedMessage');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogFailedRelayedMessage>[];
    }

    extractLogsRelayedMessage (tx: TransactionReceipt): ITxLogItem<TLogRelayedMessage>[] {
        let abi = this.$getAbiItem('event', 'RelayedMessage');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogRelayedMessage>[];
    }

    extractLogsSentMessage (tx: TransactionReceipt): ITxLogItem<TLogSentMessage>[] {
        let abi = this.$getAbiItem('event', 'SentMessage');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogSentMessage>[];
    }

    async getPastLogsFailedRelayedMessage (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { msgHash?: TBufferLike }
    }): Promise<ITxLogItem<TLogFailedRelayedMessage>[]> {
        return await this.$getPastLogsParsed('FailedRelayedMessage', options) as any;
    }

    async getPastLogsRelayedMessage (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { msgHash?: TBufferLike }
    }): Promise<ITxLogItem<TLogRelayedMessage>[]> {
        return await this.$getPastLogsParsed('RelayedMessage', options) as any;
    }

    async getPastLogsSentMessage (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { target?: TAddress }
    }): Promise<ITxLogItem<TLogSentMessage>[]> {
        return await this.$getPastLogsParsed('SentMessage', options) as any;
    }

    abi: AbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"FailedRelayedMessage","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"RelayedMessage","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"bytes","name":"message","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"messageNonce","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"gasLimit","type":"uint256"}],"name":"SentMessage","type":"event"},{"inputs":[{"internalType":"address","name":"_target","type":"address"},{"internalType":"bytes","name":"_message","type":"bytes"},{"internalType":"uint32","name":"_gasLimit","type":"uint32"}],"name":"sendMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"xDomainMessageSender","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogFailedRelayedMessage = {
        msgHash: TBufferLike
    };
    type TLogFailedRelayedMessageParameters = [ msgHash: TBufferLike ];
    type TLogRelayedMessage = {
        msgHash: TBufferLike
    };
    type TLogRelayedMessageParameters = [ msgHash: TBufferLike ];
    type TLogSentMessage = {
        target: TAddress, _sender: TAddress, message: TBufferLike, messageNonce: bigint, gasLimit: bigint
    };
    type TLogSentMessageParameters = [ target: TAddress, _sender: TAddress, message: TBufferLike, messageNonce: bigint, gasLimit: bigint ];

interface IEvents {
  FailedRelayedMessage: TLogFailedRelayedMessageParameters
  RelayedMessage: TLogRelayedMessageParameters
  SentMessage: TLogSentMessageParameters
  '*': any[] 
}



interface IMethodSendMessage {
  method: "sendMessage"
  arguments: [ _target: TAddress, _message: TBufferLike, _gasLimit: number ]
}

interface IMethodXDomainMessageSender {
  method: "xDomainMessageSender"
  arguments: [  ]
}

interface IMethods {
  sendMessage: IMethodSendMessage
  xDomainMessageSender: IMethodXDomainMessageSender
  '*': { method: string, arguments: any[] } 
}






interface IICrossDomainMessengerTxCaller {
    sendMessage (sender: TSender, _target: TAddress, _message: TBufferLike, _gasLimit: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IICrossDomainMessengerTxData {
    sendMessage (sender: TSender, _target: TAddress, _message: TBufferLike, _gasLimit: number): Promise<TransactionConfig>
}


