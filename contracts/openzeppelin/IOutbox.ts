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



export class IOutbox extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0x11985271
    async l2ToL1BatchNum (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'l2ToL1BatchNum'));
    }

    // 0x46547790
    async l2ToL1Block (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'l2ToL1Block'));
    }

    // 0x8515bc6a
    async l2ToL1EthBlock (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'l2ToL1EthBlock'));
    }

    // 0x72f2a8c7
    async l2ToL1OutputId (): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'l2ToL1OutputId'));
    }

    // 0x80648b02
    async l2ToL1Sender (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'l2ToL1Sender'));
    }

    // 0xb0f30537
    async l2ToL1Timestamp (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'l2ToL1Timestamp'));
    }

    // 0xf1fd3a39
    async outboxEntryExists (batchNum: bigint): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'outboxEntryExists'), batchNum);
    }

    // 0x0c726847
    async processOutgoingMessages (sender: TSender, sendsData: TBufferLike, sendLengths: bigint[]): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'processOutgoingMessages'), sender, sendsData, sendLengths);
    }

    $call () {
        return super.$call() as IIOutboxTxCaller;;
    }

    $data (): IIOutboxTxData {
        return super.$data() as IIOutboxTxData;
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

    onOutBoxTransactionExecuted (fn?: (event: TClientEventsStreamData<TLogOutBoxTransactionExecutedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogOutBoxTransactionExecutedParameters>> {
        return this.$onLog('OutBoxTransactionExecuted', fn);
    }

    onOutboxEntryCreated (fn?: (event: TClientEventsStreamData<TLogOutboxEntryCreatedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogOutboxEntryCreatedParameters>> {
        return this.$onLog('OutboxEntryCreated', fn);
    }

    extractLogsOutBoxTransactionExecuted (tx: TransactionReceipt): ITxLogItem<TLogOutBoxTransactionExecuted>[] {
        let abi = this.$getAbiItem('event', 'OutBoxTransactionExecuted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogOutBoxTransactionExecuted>[];
    }

    extractLogsOutboxEntryCreated (tx: TransactionReceipt): ITxLogItem<TLogOutboxEntryCreated>[] {
        let abi = this.$getAbiItem('event', 'OutboxEntryCreated');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogOutboxEntryCreated>[];
    }

    async getPastLogsOutBoxTransactionExecuted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { destAddr?: TAddress,l2Sender?: TAddress,outboxEntryIndex?: bigint }
    }): Promise<ITxLogItem<TLogOutBoxTransactionExecuted>[]> {
        return await this.$getPastLogsParsed('OutBoxTransactionExecuted', options) as any;
    }

    async getPastLogsOutboxEntryCreated (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { batchNum?: bigint }
    }): Promise<ITxLogItem<TLogOutboxEntryCreated>[]> {
        return await this.$getPastLogsParsed('OutboxEntryCreated', options) as any;
    }

    abi: AbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"destAddr","type":"address"},{"indexed":true,"internalType":"address","name":"l2Sender","type":"address"},{"indexed":true,"internalType":"uint256","name":"outboxEntryIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"transactionIndex","type":"uint256"}],"name":"OutBoxTransactionExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"batchNum","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"outboxEntryIndex","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"outputRoot","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"numInBatch","type":"uint256"}],"name":"OutboxEntryCreated","type":"event"},{"inputs":[],"name":"l2ToL1BatchNum","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2ToL1Block","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2ToL1EthBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2ToL1OutputId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2ToL1Sender","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2ToL1Timestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"batchNum","type":"uint256"}],"name":"outboxEntryExists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"sendsData","type":"bytes"},{"internalType":"uint256[]","name":"sendLengths","type":"uint256[]"}],"name":"processOutgoingMessages","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogOutBoxTransactionExecuted = {
        destAddr: TAddress, l2Sender: TAddress, outboxEntryIndex: bigint, transactionIndex: bigint
    };
    type TLogOutBoxTransactionExecutedParameters = [ destAddr: TAddress, l2Sender: TAddress, outboxEntryIndex: bigint, transactionIndex: bigint ];
    type TLogOutboxEntryCreated = {
        batchNum: bigint, outboxEntryIndex: bigint, outputRoot: TBufferLike, numInBatch: bigint
    };
    type TLogOutboxEntryCreatedParameters = [ batchNum: bigint, outboxEntryIndex: bigint, outputRoot: TBufferLike, numInBatch: bigint ];

interface IEvents {
  OutBoxTransactionExecuted: TLogOutBoxTransactionExecutedParameters
  OutboxEntryCreated: TLogOutboxEntryCreatedParameters
  '*': any[] 
}



interface IMethodL2ToL1BatchNum {
  method: "l2ToL1BatchNum"
  arguments: [  ]
}

interface IMethodL2ToL1Block {
  method: "l2ToL1Block"
  arguments: [  ]
}

interface IMethodL2ToL1EthBlock {
  method: "l2ToL1EthBlock"
  arguments: [  ]
}

interface IMethodL2ToL1OutputId {
  method: "l2ToL1OutputId"
  arguments: [  ]
}

interface IMethodL2ToL1Sender {
  method: "l2ToL1Sender"
  arguments: [  ]
}

interface IMethodL2ToL1Timestamp {
  method: "l2ToL1Timestamp"
  arguments: [  ]
}

interface IMethodOutboxEntryExists {
  method: "outboxEntryExists"
  arguments: [ batchNum: bigint ]
}

interface IMethodProcessOutgoingMessages {
  method: "processOutgoingMessages"
  arguments: [ sendsData: TBufferLike, sendLengths: bigint[] ]
}

interface IMethods {
  l2ToL1BatchNum: IMethodL2ToL1BatchNum
  l2ToL1Block: IMethodL2ToL1Block
  l2ToL1EthBlock: IMethodL2ToL1EthBlock
  l2ToL1OutputId: IMethodL2ToL1OutputId
  l2ToL1Sender: IMethodL2ToL1Sender
  l2ToL1Timestamp: IMethodL2ToL1Timestamp
  outboxEntryExists: IMethodOutboxEntryExists
  processOutgoingMessages: IMethodProcessOutgoingMessages
  '*': { method: string, arguments: any[] } 
}






interface IIOutboxTxCaller {
    processOutgoingMessages (sender: TSender, sendsData: TBufferLike, sendLengths: bigint[]): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIOutboxTxData {
    processOutgoingMessages (sender: TSender, sendsData: TBufferLike, sendLengths: bigint[]): Promise<TransactionConfig>
}


