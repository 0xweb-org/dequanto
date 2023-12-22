/**
 *  AUTO-Generated Class: 2023-12-22 01:26
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



export class IBridge extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    

    // 0xab5d8943
    async activeOutbox (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'activeOutbox'));
    }

    // 0xe76f5c8d
    async allowedDelayedInboxList (sender: TSender, input0: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'allowedDelayedInboxList'), sender, input0);
    }

    // 0xae60bd13
    async allowedDelayedInboxes (inbox: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'allowedDelayedInboxes'), inbox);
    }

    // 0x945e1147
    async allowedOutboxList (sender: TSender, input0: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'allowedOutboxList'), sender, input0);
    }

    // 0x413b35bd
    async allowedOutboxes (outbox: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'allowedOutboxes'), outbox);
    }

    // 0xd5719dc2
    async delayedInboxAccs (input0: bigint): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'delayedInboxAccs'), input0);
    }

    // 0xeca067ad
    async delayedMessageCount (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'delayedMessageCount'));
    }

    // 0x8db5993b
    async enqueueDelayedMessage (sender: TSender, kind: number, _sender: TAddress, messageDataHash: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'enqueueDelayedMessage'), sender, kind, _sender, messageDataHash);
    }

    // 0x86598a56
    async enqueueSequencerMessage (sender: TSender, dataHash: TBufferLike, afterDelayedMessagesRead: bigint, prevMessageCount: bigint, newMessageCount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'enqueueSequencerMessage'), sender, dataHash, afterDelayedMessagesRead, prevMessageCount, newMessageCount);
    }

    // 0x9e5d4c49
    async executeCall (sender: TSender, to: TAddress, value: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'executeCall'), sender, to, value, data);
    }

    // 0xc4d66de8
    async initialize (sender: TSender, rollup_: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'initialize'), sender, rollup_);
    }

    // 0xcb23bcb5
    async rollup (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'rollup'));
    }

    // 0xee35f327
    async sequencerInbox (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'sequencerInbox'));
    }

    // 0x16bf5579
    async sequencerInboxAccs (input0: bigint): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'sequencerInboxAccs'), input0);
    }

    // 0x0084120c
    async sequencerMessageCount (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'sequencerMessageCount'));
    }

    // 0x5fca4a16
    async sequencerReportedSubMessageCount (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'sequencerReportedSubMessageCount'));
    }

    // 0x47fb24c5
    async setDelayedInbox (sender: TSender, inbox: TAddress, enabled: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setDelayedInbox'), sender, inbox, enabled);
    }

    // 0xcee3d728
    async setOutbox (sender: TSender, inbox: TAddress, enabled: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setOutbox'), sender, inbox, enabled);
    }

    // 0x4f61f850
    async setSequencerInbox (sender: TSender, _sequencerInbox: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setSequencerInbox'), sender, _sequencerInbox);
    }

    // 0x7a88b107
    async submitBatchSpendingReport (sender: TSender, batchPoster: TAddress, dataHash: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'submitBatchSpendingReport'), sender, batchPoster, dataHash);
    }

    $call () {
        return super.$call() as IIBridgeTxCaller;
    }
    $signed (): TOverrideReturns<IIBridgeTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IIBridgeTxData {
        return super.$data() as IIBridgeTxData;
    }
    $gas (): TOverrideReturns<IIBridgeTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
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

    onSequencerInboxUpdated (fn?: (event: TClientEventsStreamData<TLogSequencerInboxUpdatedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogSequencerInboxUpdatedParameters>> {
        return this.$onLog('SequencerInboxUpdated', fn);
    }

    extractLogsBridgeCallTriggered (tx: TEth.TxReceipt): ITxLogItem<TLogBridgeCallTriggered>[] {
        let abi = this.$getAbiItem('event', 'BridgeCallTriggered');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogBridgeCallTriggered>[];
    }

    extractLogsInboxToggle (tx: TEth.TxReceipt): ITxLogItem<TLogInboxToggle>[] {
        let abi = this.$getAbiItem('event', 'InboxToggle');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogInboxToggle>[];
    }

    extractLogsMessageDelivered (tx: TEth.TxReceipt): ITxLogItem<TLogMessageDelivered>[] {
        let abi = this.$getAbiItem('event', 'MessageDelivered');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogMessageDelivered>[];
    }

    extractLogsOutboxToggle (tx: TEth.TxReceipt): ITxLogItem<TLogOutboxToggle>[] {
        let abi = this.$getAbiItem('event', 'OutboxToggle');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogOutboxToggle>[];
    }

    extractLogsSequencerInboxUpdated (tx: TEth.TxReceipt): ITxLogItem<TLogSequencerInboxUpdated>[] {
        let abi = this.$getAbiItem('event', 'SequencerInboxUpdated');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogSequencerInboxUpdated>[];
    }

    async getPastLogsBridgeCallTriggered (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { outbox?: TAddress,to?: TAddress }
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

    async getPastLogsSequencerInboxUpdated (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogSequencerInboxUpdated>[]> {
        return await this.$getPastLogsParsed('SequencerInboxUpdated', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"outbox","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"BridgeCallTriggered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"inbox","type":"address"},{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"InboxToggle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"messageIndex","type":"uint256"},{"indexed":true,"internalType":"bytes32","name":"beforeInboxAcc","type":"bytes32"},{"indexed":false,"internalType":"address","name":"inbox","type":"address"},{"indexed":false,"internalType":"uint8","name":"kind","type":"uint8"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"bytes32","name":"messageDataHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"baseFeeL1","type":"uint256"},{"indexed":false,"internalType":"uint64","name":"timestamp","type":"uint64"}],"name":"MessageDelivered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"outbox","type":"address"},{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"OutboxToggle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newSequencerInbox","type":"address"}],"name":"SequencerInboxUpdated","type":"event"},{"inputs":[],"name":"activeOutbox","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allowedDelayedInboxList","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"inbox","type":"address"}],"name":"allowedDelayedInboxes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allowedOutboxList","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"outbox","type":"address"}],"name":"allowedOutboxes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"delayedInboxAccs","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"delayedMessageCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"kind","type":"uint8"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes32","name":"messageDataHash","type":"bytes32"}],"name":"enqueueDelayedMessage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"dataHash","type":"bytes32"},{"internalType":"uint256","name":"afterDelayedMessagesRead","type":"uint256"},{"internalType":"uint256","name":"prevMessageCount","type":"uint256"},{"internalType":"uint256","name":"newMessageCount","type":"uint256"}],"name":"enqueueSequencerMessage","outputs":[{"internalType":"uint256","name":"seqMessageIndex","type":"uint256"},{"internalType":"bytes32","name":"beforeAcc","type":"bytes32"},{"internalType":"bytes32","name":"delayedAcc","type":"bytes32"},{"internalType":"bytes32","name":"acc","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"executeCall","outputs":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"rollup_","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rollup","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sequencerInbox","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"sequencerInboxAccs","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sequencerMessageCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"sequencerReportedSubMessageCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"inbox","type":"address"},{"internalType":"bool","name":"enabled","type":"bool"}],"name":"setDelayedInbox","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"inbox","type":"address"},{"internalType":"bool","name":"enabled","type":"bool"}],"name":"setOutbox","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_sequencerInbox","type":"address"}],"name":"setSequencerInbox","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"batchPoster","type":"address"},{"internalType":"bytes32","name":"dataHash","type":"bytes32"}],"name":"submitBatchSpendingReport","outputs":[{"internalType":"uint256","name":"msgNum","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogBridgeCallTriggered = {
        outbox: TAddress, to: TAddress, value: bigint, data: TBufferLike
    };
    type TLogBridgeCallTriggeredParameters = [ outbox: TAddress, to: TAddress, value: bigint, data: TBufferLike ];
    type TLogInboxToggle = {
        inbox: TAddress, enabled: boolean
    };
    type TLogInboxToggleParameters = [ inbox: TAddress, enabled: boolean ];
    type TLogMessageDelivered = {
        messageIndex: bigint, beforeInboxAcc: TBufferLike, inbox: TAddress, kind: number, _sender: TAddress, messageDataHash: TBufferLike, baseFeeL1: bigint, timestamp: number
    };
    type TLogMessageDeliveredParameters = [ messageIndex: bigint, beforeInboxAcc: TBufferLike, inbox: TAddress, kind: number, _sender: TAddress, messageDataHash: TBufferLike, baseFeeL1: bigint, timestamp: number ];
    type TLogOutboxToggle = {
        outbox: TAddress, enabled: boolean
    };
    type TLogOutboxToggleParameters = [ outbox: TAddress, enabled: boolean ];
    type TLogSequencerInboxUpdated = {
        newSequencerInbox: TAddress
    };
    type TLogSequencerInboxUpdatedParameters = [ newSequencerInbox: TAddress ];

interface IEvents {
  BridgeCallTriggered: TLogBridgeCallTriggeredParameters
  InboxToggle: TLogInboxToggleParameters
  MessageDelivered: TLogMessageDeliveredParameters
  OutboxToggle: TLogOutboxToggleParameters
  SequencerInboxUpdated: TLogSequencerInboxUpdatedParameters
  '*': any[] 
}



interface IMethodActiveOutbox {
  method: "activeOutbox"
  arguments: [  ]
}

interface IMethodAllowedDelayedInboxList {
  method: "allowedDelayedInboxList"
  arguments: [ input0: bigint ]
}

interface IMethodAllowedDelayedInboxes {
  method: "allowedDelayedInboxes"
  arguments: [ inbox: TAddress ]
}

interface IMethodAllowedOutboxList {
  method: "allowedOutboxList"
  arguments: [ input0: bigint ]
}

interface IMethodAllowedOutboxes {
  method: "allowedOutboxes"
  arguments: [ outbox: TAddress ]
}

interface IMethodDelayedInboxAccs {
  method: "delayedInboxAccs"
  arguments: [ input0: bigint ]
}

interface IMethodDelayedMessageCount {
  method: "delayedMessageCount"
  arguments: [  ]
}

interface IMethodEnqueueDelayedMessage {
  method: "enqueueDelayedMessage"
  arguments: [ kind: number, _sender: TAddress, messageDataHash: TBufferLike ]
}

interface IMethodEnqueueSequencerMessage {
  method: "enqueueSequencerMessage"
  arguments: [ dataHash: TBufferLike, afterDelayedMessagesRead: bigint, prevMessageCount: bigint, newMessageCount: bigint ]
}

interface IMethodExecuteCall {
  method: "executeCall"
  arguments: [ to: TAddress, value: bigint, data: TBufferLike ]
}

interface IMethodInitialize {
  method: "initialize"
  arguments: [ rollup_: TAddress ]
}

interface IMethodRollup {
  method: "rollup"
  arguments: [  ]
}

interface IMethodSequencerInbox {
  method: "sequencerInbox"
  arguments: [  ]
}

interface IMethodSequencerInboxAccs {
  method: "sequencerInboxAccs"
  arguments: [ input0: bigint ]
}

interface IMethodSequencerMessageCount {
  method: "sequencerMessageCount"
  arguments: [  ]
}

interface IMethodSequencerReportedSubMessageCount {
  method: "sequencerReportedSubMessageCount"
  arguments: [  ]
}

interface IMethodSetDelayedInbox {
  method: "setDelayedInbox"
  arguments: [ inbox: TAddress, enabled: boolean ]
}

interface IMethodSetOutbox {
  method: "setOutbox"
  arguments: [ inbox: TAddress, enabled: boolean ]
}

interface IMethodSetSequencerInbox {
  method: "setSequencerInbox"
  arguments: [ _sequencerInbox: TAddress ]
}

interface IMethodSubmitBatchSpendingReport {
  method: "submitBatchSpendingReport"
  arguments: [ batchPoster: TAddress, dataHash: TBufferLike ]
}

interface IMethods {
  activeOutbox: IMethodActiveOutbox
  allowedDelayedInboxList: IMethodAllowedDelayedInboxList
  allowedDelayedInboxes: IMethodAllowedDelayedInboxes
  allowedOutboxList: IMethodAllowedOutboxList
  allowedOutboxes: IMethodAllowedOutboxes
  delayedInboxAccs: IMethodDelayedInboxAccs
  delayedMessageCount: IMethodDelayedMessageCount
  enqueueDelayedMessage: IMethodEnqueueDelayedMessage
  enqueueSequencerMessage: IMethodEnqueueSequencerMessage
  executeCall: IMethodExecuteCall
  initialize: IMethodInitialize
  rollup: IMethodRollup
  sequencerInbox: IMethodSequencerInbox
  sequencerInboxAccs: IMethodSequencerInboxAccs
  sequencerMessageCount: IMethodSequencerMessageCount
  sequencerReportedSubMessageCount: IMethodSequencerReportedSubMessageCount
  setDelayedInbox: IMethodSetDelayedInbox
  setOutbox: IMethodSetOutbox
  setSequencerInbox: IMethodSetSequencerInbox
  submitBatchSpendingReport: IMethodSubmitBatchSpendingReport
  '*': { method: string, arguments: any[] } 
}






interface IIBridgeTxCaller {
    allowedDelayedInboxList (sender: TSender, input0: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    allowedOutboxList (sender: TSender, input0: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    enqueueDelayedMessage (sender: TSender, kind: number, _sender: TAddress, messageDataHash: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    enqueueSequencerMessage (sender: TSender, dataHash: TBufferLike, afterDelayedMessagesRead: bigint, prevMessageCount: bigint, newMessageCount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    executeCall (sender: TSender, to: TAddress, value: bigint, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    initialize (sender: TSender, rollup_: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setDelayedInbox (sender: TSender, inbox: TAddress, enabled: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setOutbox (sender: TSender, inbox: TAddress, enabled: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setSequencerInbox (sender: TSender, _sequencerInbox: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    submitBatchSpendingReport (sender: TSender, batchPoster: TAddress, dataHash: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIBridgeTxData {
    allowedDelayedInboxList (sender: TSender, input0: bigint): Promise<TEth.TxLike>
    allowedOutboxList (sender: TSender, input0: bigint): Promise<TEth.TxLike>
    enqueueDelayedMessage (sender: TSender, kind: number, _sender: TAddress, messageDataHash: TBufferLike): Promise<TEth.TxLike>
    enqueueSequencerMessage (sender: TSender, dataHash: TBufferLike, afterDelayedMessagesRead: bigint, prevMessageCount: bigint, newMessageCount: bigint): Promise<TEth.TxLike>
    executeCall (sender: TSender, to: TAddress, value: bigint, data: TBufferLike): Promise<TEth.TxLike>
    initialize (sender: TSender, rollup_: TAddress): Promise<TEth.TxLike>
    setDelayedInbox (sender: TSender, inbox: TAddress, enabled: boolean): Promise<TEth.TxLike>
    setOutbox (sender: TSender, inbox: TAddress, enabled: boolean): Promise<TEth.TxLike>
    setSequencerInbox (sender: TSender, _sequencerInbox: TAddress): Promise<TEth.TxLike>
    submitBatchSpendingReport (sender: TSender, batchPoster: TAddress, dataHash: TBufferLike): Promise<TEth.TxLike>
}


