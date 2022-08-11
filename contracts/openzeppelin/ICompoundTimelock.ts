/**
 *  AUTO-Generated Class: 2022-08-11 11:20
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
export class ICompoundTimelock extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan)
    ) {
        super(address, client, explorer)
    }

    // 0xc1a287e2
    async GRACE_PERIOD (): Promise<bigint> {
        return this.$read('function GRACE_PERIOD() returns uint256');
    }

    // 0x7d645fab
    async MAXIMUM_DELAY (): Promise<bigint> {
        return this.$read('function MAXIMUM_DELAY() returns uint256');
    }

    // 0xb1b43ae5
    async MINIMUM_DELAY (): Promise<bigint> {
        return this.$read('function MINIMUM_DELAY() returns uint256');
    }

    // 0x0e18b681
    async acceptAdmin (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'acceptAdmin'), sender);
    }

    // 0xf851a440
    async admin (): Promise<TAddress> {
        return this.$read('function admin() returns address');
    }

    // 0x591fcdfe
    async cancelTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'cancelTransaction'), sender, target, value, signature, data, eta);
    }

    // 0x6a42b8f8
    async delay (): Promise<bigint> {
        return this.$read('function delay() returns uint256');
    }

    // 0x0825f38f
    async executeTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'executeTransaction'), sender, target, value, signature, data, eta);
    }

    // 0x26782247
    async pendingAdmin (): Promise<TAddress> {
        return this.$read('function pendingAdmin() returns address');
    }

    // 0x3a66f901
    async queueTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'queueTransaction'), sender, target, value, signature, data, eta);
    }

    // 0xf2b06537
    async queuedTransactions (input0: TBufferLike): Promise<boolean> {
        return this.$read('function queuedTransactions(bytes32) returns bool', input0);
    }

    // 0xe177246e
    async setDelay (sender: TSender, input0: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setDelay'), sender, input0);
    }

    // 0x4dd18bf5
    async setPendingAdmin (sender: TSender, input0: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setPendingAdmin'), sender, input0);
    }

    onCancelTransaction (fn: (event: EventLog, txHash: TBufferLike, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint) => void): ClientEventsStream<any> {
        return this.$on('CancelTransaction', fn);
    }

    onExecuteTransaction (fn: (event: EventLog, txHash: TBufferLike, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint) => void): ClientEventsStream<any> {
        return this.$on('ExecuteTransaction', fn);
    }

    onNewAdmin (fn: (event: EventLog, newAdmin: TAddress) => void): ClientEventsStream<any> {
        return this.$on('NewAdmin', fn);
    }

    onNewDelay (fn: (event: EventLog, newDelay: bigint) => void): ClientEventsStream<any> {
        return this.$on('NewDelay', fn);
    }

    onNewPendingAdmin (fn: (event: EventLog, newPendingAdmin: TAddress) => void): ClientEventsStream<any> {
        return this.$on('NewPendingAdmin', fn);
    }

    onQueueTransaction (fn: (event: EventLog, txHash: TBufferLike, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint) => void): ClientEventsStream<any> {
        return this.$on('QueueTransaction', fn);
    }

    extractLogsCancelTransaction (tx: TransactionReceipt): ITxLogItem<TLogCancelTransaction>[] {
        let abi = this.$getAbiItem('event', 'CancelTransaction');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogCancelTransaction>[];
    }

    extractLogsExecuteTransaction (tx: TransactionReceipt): ITxLogItem<TLogExecuteTransaction>[] {
        let abi = this.$getAbiItem('event', 'ExecuteTransaction');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogExecuteTransaction>[];
    }

    extractLogsNewAdmin (tx: TransactionReceipt): ITxLogItem<TLogNewAdmin>[] {
        let abi = this.$getAbiItem('event', 'NewAdmin');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogNewAdmin>[];
    }

    extractLogsNewDelay (tx: TransactionReceipt): ITxLogItem<TLogNewDelay>[] {
        let abi = this.$getAbiItem('event', 'NewDelay');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogNewDelay>[];
    }

    extractLogsNewPendingAdmin (tx: TransactionReceipt): ITxLogItem<TLogNewPendingAdmin>[] {
        let abi = this.$getAbiItem('event', 'NewPendingAdmin');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogNewPendingAdmin>[];
    }

    extractLogsQueueTransaction (tx: TransactionReceipt): ITxLogItem<TLogQueueTransaction>[] {
        let abi = this.$getAbiItem('event', 'QueueTransaction');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogQueueTransaction>[];
    }

    async getPastLogsCancelTransaction (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { txHash?: TBufferLike,target?: TAddress }
    }): Promise<ITxLogItem<TLogCancelTransaction>[]> {
        let topic = '0x2fffc091a501fd91bfbff27141450d3acb40fb8e6d8382b243ec7a812a3aaf87';
        let abi = this.$getAbiItem('event', 'CancelTransaction');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsExecuteTransaction (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { txHash?: TBufferLike,target?: TAddress }
    }): Promise<ITxLogItem<TLogExecuteTransaction>[]> {
        let topic = '0xa560e3198060a2f10670c1ec5b403077ea6ae93ca8de1c32b451dc1a943cd6e7';
        let abi = this.$getAbiItem('event', 'ExecuteTransaction');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsNewAdmin (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { newAdmin?: TAddress }
    }): Promise<ITxLogItem<TLogNewAdmin>[]> {
        let topic = '0x71614071b88dee5e0b2ae578a9dd7b2ebbe9ae832ba419dc0242cd065a290b6c';
        let abi = this.$getAbiItem('event', 'NewAdmin');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsNewDelay (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { newDelay?: bigint }
    }): Promise<ITxLogItem<TLogNewDelay>[]> {
        let topic = '0x948b1f6a42ee138b7e34058ba85a37f716d55ff25ff05a763f15bed6a04c8d2c';
        let abi = this.$getAbiItem('event', 'NewDelay');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsNewPendingAdmin (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { newPendingAdmin?: TAddress }
    }): Promise<ITxLogItem<TLogNewPendingAdmin>[]> {
        let topic = '0x69d78e38a01985fbb1462961809b4b2d65531bc93b2b94037f3334b82ca4a756';
        let abi = this.$getAbiItem('event', 'NewPendingAdmin');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsQueueTransaction (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { txHash?: TBufferLike,target?: TAddress }
    }): Promise<ITxLogItem<TLogQueueTransaction>[]> {
        let topic = '0x76e2796dc3a81d57b0e8504b647febcbeeb5f4af818e164f11eef8131a6a763f';
        let abi = this.$getAbiItem('event', 'QueueTransaction');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi: AbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"string","name":"signature","type":"string"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"eta","type":"uint256"}],"name":"CancelTransaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"string","name":"signature","type":"string"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"eta","type":"uint256"}],"name":"ExecuteTransaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newAdmin","type":"address"}],"name":"NewAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"newDelay","type":"uint256"}],"name":"NewDelay","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newPendingAdmin","type":"address"}],"name":"NewPendingAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"string","name":"signature","type":"string"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"eta","type":"uint256"}],"name":"QueueTransaction","type":"event"},{"inputs":[],"name":"GRACE_PERIOD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAXIMUM_DELAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINIMUM_DELAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"acceptAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"string","name":"signature","type":"string"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"eta","type":"uint256"}],"name":"cancelTransaction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"delay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"string","name":"signature","type":"string"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"eta","type":"uint256"}],"name":"executeTransaction","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"pendingAdmin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"string","name":"signature","type":"string"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"eta","type":"uint256"}],"name":"queueTransaction","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"queuedTransactions","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"setDelay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"setPendingAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogCancelTransaction = {
        txHash: TBufferLike, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint
    }
    type TLogExecuteTransaction = {
        txHash: TBufferLike, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint
    }
    type TLogNewAdmin = {
        newAdmin: TAddress
    }
    type TLogNewDelay = {
        newDelay: bigint
    }
    type TLogNewPendingAdmin = {
        newPendingAdmin: TAddress
    }
    type TLogQueueTransaction = {
        txHash: TBufferLike, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint
    }

