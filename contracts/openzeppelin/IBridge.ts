/**
 *  AUTO-Generated Class: 2022-07-06 13:14
 *  Implementation: https://etherscan.io/address/undefined#code
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TAccount } from '@dequanto/models/TAccount';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { type AbiItem } from 'web3-utils';
import { TransactionReceipt, EventLog } from 'web3-core';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';

import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'
export class IBridge extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan)
    ) {
        super(address, client, explorer)
    }

    // 0xab5d8943
    async activeOutbox (): Promise<TAddress> {
        return this.$read('function activeOutbox() returns address');
    }

    // 0xc29372de
    async allowedInboxes (inbox: TAddress): Promise<boolean> {
        return this.$read('function allowedInboxes(address) returns bool', inbox);
    }

    // 0x413b35bd
    async allowedOutboxes (outbox: TAddress): Promise<boolean> {
        return this.$read('function allowedOutboxes(address) returns bool', outbox);
    }

    // 0x02bbfad1
    async deliverMessageToInbox (sender: TSender, kind: number, sender: TAddress, messageDataHash: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'deliverMessageToInbox'), sender, kind, sender, messageDataHash);
    }

    // 0x9e5d4c49
    async executeCall (sender: TSender, destAddr: TAddress, amount: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'executeCall'), sender, destAddr, amount, data);
    }

    // 0xd9dd67ab
    async inboxAccs (index: bigint): Promise<TBufferLike> {
        return this.$read('function inboxAccs(uint256) returns bytes32', index);
    }

    // 0x3dbcc8d1
    async messageCount (): Promise<bigint> {
        return this.$read('function messageCount() returns uint256');
    }

    // 0xe45b7ce6
    async setInbox (sender: TSender, inbox: TAddress, enabled: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setInbox'), sender, inbox, enabled);
    }

    // 0xcee3d728
    async setOutbox (sender: TSender, inbox: TAddress, enabled: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setOutbox'), sender, inbox, enabled);
    }

    onBridgeCallTriggered (fn: (event: EventLog, outbox: TAddress, destAddr: TAddress, amount: bigint, data: TBufferLike) => void): ClientEventsStream<any> {
        return this.$on('BridgeCallTriggered', fn);
    }

    onInboxToggle (fn: (event: EventLog, inbox: TAddress, enabled: boolean) => void): ClientEventsStream<any> {
        return this.$on('InboxToggle', fn);
    }

    onMessageDelivered (fn: (event: EventLog, messageIndex: bigint, beforeInboxAcc: TBufferLike, inbox: TAddress, kind: number, sender: TAddress, messageDataHash: TBufferLike) => void): ClientEventsStream<any> {
        return this.$on('MessageDelivered', fn);
    }

    onOutboxToggle (fn: (event: EventLog, outbox: TAddress, enabled: boolean) => void): ClientEventsStream<any> {
        return this.$on('OutboxToggle', fn);
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
        let topic = '0x2d9d115ef3e4a606d698913b1eae831a3cdfe20d9a83d48007b0526749c3d466';
        let abi = this.$getAbiItem('event', 'BridgeCallTriggered');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsInboxToggle (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { inbox?: TAddress }
    }): Promise<ITxLogItem<TLogInboxToggle>[]> {
        let topic = '0x6675ce8882cb71637de5903a193d218cc0544be9c0650cb83e0955f6aa2bf521';
        let abi = this.$getAbiItem('event', 'InboxToggle');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsMessageDelivered (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { messageIndex?: bigint,beforeInboxAcc?: TBufferLike }
    }): Promise<ITxLogItem<TLogMessageDelivered>[]> {
        let topic = '0x23be8e12e420b5da9fb98d8102572f640fb3c11a0085060472dfc0ed194b3cf7';
        let abi = this.$getAbiItem('event', 'MessageDelivered');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsOutboxToggle (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { outbox?: TAddress }
    }): Promise<ITxLogItem<TLogOutboxToggle>[]> {
        let topic = '0x49477e7356dbcb654ab85d7534b50126772d938130d1350e23e2540370c8dffa';
        let abi = this.$getAbiItem('event', 'OutboxToggle');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"outbox","type":"address"},{"indexed":true,"internalType":"address","name":"destAddr","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"BridgeCallTriggered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"inbox","type":"address"},{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"InboxToggle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"messageIndex","type":"uint256"},{"indexed":true,"internalType":"bytes32","name":"beforeInboxAcc","type":"bytes32"},{"indexed":false,"internalType":"address","name":"inbox","type":"address"},{"indexed":false,"internalType":"uint8","name":"kind","type":"uint8"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"bytes32","name":"messageDataHash","type":"bytes32"}],"name":"MessageDelivered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"outbox","type":"address"},{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"OutboxToggle","type":"event"},{"inputs":[],"name":"activeOutbox","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"inbox","type":"address"}],"name":"allowedInboxes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"outbox","type":"address"}],"name":"allowedOutboxes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"kind","type":"uint8"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes32","name":"messageDataHash","type":"bytes32"}],"name":"deliverMessageToInbox","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"destAddr","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"executeCall","outputs":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"inboxAccs","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"messageCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"inbox","type":"address"},{"internalType":"bool","name":"enabled","type":"bool"}],"name":"setInbox","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"inbox","type":"address"},{"internalType":"bool","name":"enabled","type":"bool"}],"name":"setOutbox","outputs":[],"stateMutability":"nonpayable","type":"function"}]
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogBridgeCallTriggered = {
        outbox: TAddress, destAddr: TAddress, amount: bigint, data: TBufferLike
    }
    type TLogInboxToggle = {
        inbox: TAddress, enabled: boolean
    }
    type TLogMessageDelivered = {
        messageIndex: bigint, beforeInboxAcc: TBufferLike, inbox: TAddress, kind: number, sender: TAddress, messageDataHash: TBufferLike
    }
    type TLogOutboxToggle = {
        outbox: TAddress, enabled: boolean
    }

