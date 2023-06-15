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



export class IBridge extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0xab5d8943
    async activeOutbox (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'activeOutbox'));
    }

    // 0xc29372de
    async allowedInboxes (inbox: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'allowedInboxes'), inbox);
    }

    // 0x413b35bd
    async allowedOutboxes (outbox: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'allowedOutboxes'), outbox);
    }

    // 0x02bbfad1
    async deliverMessageToInbox (sender: TSender, kind: number, _sender: TAddress, messageDataHash: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'deliverMessageToInbox'), sender, kind, _sender, messageDataHash);
    }

    // 0x9e5d4c49
    async executeCall (sender: TSender, destAddr: TAddress, amount: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'executeCall'), sender, destAddr, amount, data);
    }

    // 0xd9dd67ab
    async inboxAccs (index: bigint): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'inboxAccs'), index);
    }

    // 0x3dbcc8d1
    async messageCount (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'messageCount'));
    }

    // 0xe45b7ce6
    async setInbox (sender: TSender, inbox: TAddress, enabled: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setInbox'), sender, inbox, enabled);
    }

    // 0xcee3d728
    async setOutbox (sender: TSender, inbox: TAddress, enabled: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setOutbox'), sender, inbox, enabled);
    }

    $call () {
        return super.$call() as IIBridgeTxCaller;;
    }

    $data (): IIBridgeTxData {
        return super.$data() as IIBridgeTxData;
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

    onBridgeCallTriggered (fn?: (event: TClientEventsStreamData<TLogBridgeCallTriggeredParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogBridgeCallTriggeredParameters>> {
        return this.$onLog('BridgeCallTriggered', fn);
    }

    onInboxToggle (fn?: (event: TClientEventsStreamData<TLogInboxToggleParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogInboxToggleParameters>> {
        return this.$onLog('InboxToggle', fn);
    }

    onMessageDelivered (fn?: (event: TClientEventsStreamData<TLogMessageDeliveredParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogMessageDeliveredParameters>> {
        return this.$onLog('MessageDelivered', fn);
    }

    onOutboxToggle (fn?: (event: TClientEventsStreamData<TLogOutboxToggleParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogOutboxToggleParameters>> {
        return this.$onLog('OutboxToggle', fn);
    }

    extractLogsBridgeCallTriggered (tx: TransactionReceipt): ITxLogItem<TLogBridgeCallTriggered>[] {
        let abi = this.$getAbiItem('event', 'BridgeCallTriggered');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogBridgeCallTriggered>[];
    }

    extractLogsInboxToggle (tx: TransactionReceipt): ITxLogItem<TLogInboxToggle>[] {
        let abi = this.$getAbiItem('event', 'InboxToggle');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogInboxToggle>[];
    }

    extractLogsMessageDelivered (tx: TransactionReceipt): ITxLogItem<TLogMessageDelivered>[] {
        let abi = this.$getAbiItem('event', 'MessageDelivered');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogMessageDelivered>[];
    }

    extractLogsOutboxToggle (tx: TransactionReceipt): ITxLogItem<TLogOutboxToggle>[] {
        let abi = this.$getAbiItem('event', 'OutboxToggle');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogOutboxToggle>[];
    }

    async getPastLogsBridgeCallTriggered (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { outbox?: TAddress,destAddr?: TAddress }
    }): Promise<ITxLogItem<TLogBridgeCallTriggered>[]> {
        return await this.$getPastLogsParsed('BridgeCallTriggered', options) as any;
    }

    async getPastLogsInboxToggle (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { inbox?: TAddress }
    }): Promise<ITxLogItem<TLogInboxToggle>[]> {
        return await this.$getPastLogsParsed('InboxToggle', options) as any;
    }

    async getPastLogsMessageDelivered (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { messageIndex?: bigint,beforeInboxAcc?: TBufferLike }
    }): Promise<ITxLogItem<TLogMessageDelivered>[]> {
        return await this.$getPastLogsParsed('MessageDelivered', options) as any;
    }

    async getPastLogsOutboxToggle (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { outbox?: TAddress }
    }): Promise<ITxLogItem<TLogOutboxToggle>[]> {
        return await this.$getPastLogsParsed('OutboxToggle', options) as any;
    }

    abi: AbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"outbox","type":"address"},{"indexed":true,"internalType":"address","name":"destAddr","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"BridgeCallTriggered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"inbox","type":"address"},{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"InboxToggle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"messageIndex","type":"uint256"},{"indexed":true,"internalType":"bytes32","name":"beforeInboxAcc","type":"bytes32"},{"indexed":false,"internalType":"address","name":"inbox","type":"address"},{"indexed":false,"internalType":"uint8","name":"kind","type":"uint8"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"bytes32","name":"messageDataHash","type":"bytes32"}],"name":"MessageDelivered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"outbox","type":"address"},{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"OutboxToggle","type":"event"},{"inputs":[],"name":"activeOutbox","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"inbox","type":"address"}],"name":"allowedInboxes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"outbox","type":"address"}],"name":"allowedOutboxes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"kind","type":"uint8"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes32","name":"messageDataHash","type":"bytes32"}],"name":"deliverMessageToInbox","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"destAddr","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"executeCall","outputs":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"inboxAccs","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"messageCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"inbox","type":"address"},{"internalType":"bool","name":"enabled","type":"bool"}],"name":"setInbox","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"inbox","type":"address"},{"internalType":"bool","name":"enabled","type":"bool"}],"name":"setOutbox","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogBridgeCallTriggered = {
        outbox: TAddress, destAddr: TAddress, amount: bigint, data: TBufferLike
    };
    type TLogBridgeCallTriggeredParameters = [ outbox: TAddress, destAddr: TAddress, amount: bigint, data: TBufferLike ];
    type TLogInboxToggle = {
        inbox: TAddress, enabled: boolean
    };
    type TLogInboxToggleParameters = [ inbox: TAddress, enabled: boolean ];
    type TLogMessageDelivered = {
        messageIndex: bigint, beforeInboxAcc: TBufferLike, inbox: TAddress, kind: number, _sender: TAddress, messageDataHash: TBufferLike
    };
    type TLogMessageDeliveredParameters = [ messageIndex: bigint, beforeInboxAcc: TBufferLike, inbox: TAddress, kind: number, _sender: TAddress, messageDataHash: TBufferLike ];
    type TLogOutboxToggle = {
        outbox: TAddress, enabled: boolean
    };
    type TLogOutboxToggleParameters = [ outbox: TAddress, enabled: boolean ];

interface IEvents {
  BridgeCallTriggered: TLogBridgeCallTriggeredParameters
  InboxToggle: TLogInboxToggleParameters
  MessageDelivered: TLogMessageDeliveredParameters
  OutboxToggle: TLogOutboxToggleParameters
  '*': any[] 
}



interface IMethodActiveOutbox {
  method: "activeOutbox"
  arguments: [  ]
}

interface IMethodAllowedInboxes {
  method: "allowedInboxes"
  arguments: [ inbox: TAddress ]
}

interface IMethodAllowedOutboxes {
  method: "allowedOutboxes"
  arguments: [ outbox: TAddress ]
}

interface IMethodDeliverMessageToInbox {
  method: "deliverMessageToInbox"
  arguments: [ kind: number, _sender: TAddress, messageDataHash: TBufferLike ]
}

interface IMethodExecuteCall {
  method: "executeCall"
  arguments: [ destAddr: TAddress, amount: bigint, data: TBufferLike ]
}

interface IMethodInboxAccs {
  method: "inboxAccs"
  arguments: [ index: bigint ]
}

interface IMethodMessageCount {
  method: "messageCount"
  arguments: [  ]
}

interface IMethodSetInbox {
  method: "setInbox"
  arguments: [ inbox: TAddress, enabled: boolean ]
}

interface IMethodSetOutbox {
  method: "setOutbox"
  arguments: [ inbox: TAddress, enabled: boolean ]
}

interface IMethods {
  activeOutbox: IMethodActiveOutbox
  allowedInboxes: IMethodAllowedInboxes
  allowedOutboxes: IMethodAllowedOutboxes
  deliverMessageToInbox: IMethodDeliverMessageToInbox
  executeCall: IMethodExecuteCall
  inboxAccs: IMethodInboxAccs
  messageCount: IMethodMessageCount
  setInbox: IMethodSetInbox
  setOutbox: IMethodSetOutbox
  '*': { method: string, arguments: any[] } 
}






interface IIBridgeTxCaller {
    deliverMessageToInbox (sender: TSender, kind: number, _sender: TAddress, messageDataHash: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    executeCall (sender: TSender, destAddr: TAddress, amount: bigint, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setInbox (sender: TSender, inbox: TAddress, enabled: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setOutbox (sender: TSender, inbox: TAddress, enabled: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIBridgeTxData {
    deliverMessageToInbox (sender: TSender, kind: number, _sender: TAddress, messageDataHash: TBufferLike): Promise<TransactionConfig>
    executeCall (sender: TSender, destAddr: TAddress, amount: bigint, data: TBufferLike): Promise<TransactionConfig>
    setInbox (sender: TSender, inbox: TAddress, enabled: boolean): Promise<TransactionConfig>
    setOutbox (sender: TSender, inbox: TAddress, enabled: boolean): Promise<TransactionConfig>
}


