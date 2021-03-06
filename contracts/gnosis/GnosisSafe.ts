/**
 *  AUTO-Generated Class: 2022-07-07 00:45
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
export class GnosisSafe extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan)
    ) {
        super(address, client, explorer)
    }

    // 0xa3f4df7e
    async NAME (): Promise<string> {
        return this.$read('function NAME() returns string');
    }

    // 0xffa1ad74
    async VERSION (): Promise<string> {
        return this.$read('function VERSION() returns string');
    }

    // 0x0d582f13
    async addOwnerWithThreshold (sender: TSender, owner: TAddress, _threshold: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'addOwnerWithThreshold'), sender, owner, _threshold);
    }

    // 0xd4d9bdcd
    async approveHash (sender: TSender, hashToApprove: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approveHash'), sender, hashToApprove);
    }

    // 0x7d832974
    async approvedHashes (input0: TAddress, input1: TBufferLike): Promise<bigint> {
        return this.$read('function approvedHashes(address, bytes32) returns uint256', input0, input1);
    }

    // 0x7de7edef
    async changeMasterCopy (sender: TSender, _masterCopy: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'changeMasterCopy'), sender, _masterCopy);
    }

    // 0x694e80c3
    async changeThreshold (sender: TSender, _threshold: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'changeThreshold'), sender, _threshold);
    }

    // 0xe009cfde
    async disableModule (sender: TSender, prevModule: TAddress, module: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'disableModule'), sender, prevModule, module);
    }

    // 0xf698da25
    async domainSeparator (): Promise<TBufferLike> {
        return this.$read('function domainSeparator() returns bytes32');
    }

    // 0x610b5925
    async enableModule (sender: TSender, module: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'enableModule'), sender, module);
    }

    // 0xe86637db
    async encodeTransactionData (to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, _nonce: bigint): Promise<TBufferLike> {
        return this.$read('function encodeTransactionData(address, uint256, bytes, uint8, uint256, uint256, uint256, address, address, uint256) returns bytes', to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce);
    }

    // 0x6a761202
    async execTransaction (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'execTransaction'), sender, to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, signatures);
    }

    // 0x468721a7
    async execTransactionFromModule (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'execTransactionFromModule'), sender, to, value, data, operation);
    }

    // 0x5229073f
    async execTransactionFromModuleReturnData (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'execTransactionFromModuleReturnData'), sender, to, value, data, operation);
    }

    // 0x0a1028c4
    async getMessageHash (message: TBufferLike): Promise<TBufferLike> {
        return this.$read('function getMessageHash(bytes) returns bytes32', message);
    }

    // 0xb2494df3
    async getModules (): Promise<TAddress[]> {
        return this.$read('function getModules() returns address[]');
    }

    // 0xcc2f8452
    async getModulesPaginated (start: TAddress, pageSize: bigint): Promise<{ array: TAddress[], next: TAddress }> {
        return this.$read('function getModulesPaginated(address, uint256) returns (address[],address)', start, pageSize);
    }

    // 0xa0e67e2b
    async getOwners (): Promise<TAddress[]> {
        return this.$read('function getOwners() returns address[]');
    }

    // 0xe75235b8
    async getThreshold (): Promise<bigint> {
        return this.$read('function getThreshold() returns uint256');
    }

    // 0xd8d11f78
    async getTransactionHash (to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, _nonce: bigint): Promise<TBufferLike> {
        return this.$read('function getTransactionHash(address, uint256, bytes, uint8, uint256, uint256, uint256, address, address, uint256) returns bytes32', to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce);
    }

    // 0x2f54bf6e
    async isOwner (owner: TAddress): Promise<boolean> {
        return this.$read('function isOwner(address) returns bool', owner);
    }

    // 0x20c13b0b
    async isValidSignature (sender: TSender, _data: TBufferLike, _signature: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'isValidSignature'), sender, _data, _signature);
    }

    // 0xaffed0e0
    async nonce (): Promise<bigint> {
        return this.$read('function nonce() returns uint256');
    }

    // 0xf8dc5dd9
    async removeOwner (sender: TSender, prevOwner: TAddress, owner: TAddress, _threshold: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'removeOwner'), sender, prevOwner, owner, _threshold);
    }

    // 0xc4ca3a9c
    async requiredTxGas (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'requiredTxGas'), sender, to, value, data, operation);
    }

    // 0xf08a0323
    async setFallbackHandler (sender: TSender, handler: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setFallbackHandler'), sender, handler);
    }

    // 0xb63e800d
    async setup (sender: TSender, _owners: TAddress[], _threshold: bigint, to: TAddress, data: TBufferLike, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setup'), sender, _owners, _threshold, to, data, fallbackHandler, paymentToken, payment, paymentReceiver);
    }

    // 0x85a5affe
    async signMessage (sender: TSender, _data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'signMessage'), sender, _data);
    }

    // 0x5ae6bd37
    async signedMessages (input0: TBufferLike): Promise<bigint> {
        return this.$read('function signedMessages(bytes32) returns uint256', input0);
    }

    // 0xe318b52b
    async swapOwner (sender: TSender, prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swapOwner'), sender, prevOwner, oldOwner, newOwner);
    }

    onAddedOwner (fn: (event: EventLog, owner: TAddress) => void): ClientEventsStream<any> {
        return this.$on('AddedOwner', fn);
    }

    onApproveHash (fn: (event: EventLog, approvedHash: TBufferLike, owner: TAddress) => void): ClientEventsStream<any> {
        return this.$on('ApproveHash', fn);
    }

    onChangedMasterCopy (fn: (event: EventLog, masterCopy: TAddress) => void): ClientEventsStream<any> {
        return this.$on('ChangedMasterCopy', fn);
    }

    onChangedThreshold (fn: (event: EventLog, threshold: bigint) => void): ClientEventsStream<any> {
        return this.$on('ChangedThreshold', fn);
    }

    onDisabledModule (fn: (event: EventLog, module: TAddress) => void): ClientEventsStream<any> {
        return this.$on('DisabledModule', fn);
    }

    onEnabledModule (fn: (event: EventLog, module: TAddress) => void): ClientEventsStream<any> {
        return this.$on('EnabledModule', fn);
    }

    onExecutionFailure (fn: (event: EventLog, txHash: TBufferLike, payment: bigint) => void): ClientEventsStream<any> {
        return this.$on('ExecutionFailure', fn);
    }

    onExecutionFromModuleFailure (fn: (event: EventLog, module: TAddress) => void): ClientEventsStream<any> {
        return this.$on('ExecutionFromModuleFailure', fn);
    }

    onExecutionFromModuleSuccess (fn: (event: EventLog, module: TAddress) => void): ClientEventsStream<any> {
        return this.$on('ExecutionFromModuleSuccess', fn);
    }

    onExecutionSuccess (fn: (event: EventLog, txHash: TBufferLike, payment: bigint) => void): ClientEventsStream<any> {
        return this.$on('ExecutionSuccess', fn);
    }

    onRemovedOwner (fn: (event: EventLog, owner: TAddress) => void): ClientEventsStream<any> {
        return this.$on('RemovedOwner', fn);
    }

    onSignMsg (fn: (event: EventLog, msgHash: TBufferLike) => void): ClientEventsStream<any> {
        return this.$on('SignMsg', fn);
    }

    extractLogsAddedOwner (tx: TransactionReceipt): ITxLogItem<TLogAddedOwner>[] {
        let abi = this.$getAbiItem('event', 'AddedOwner');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogAddedOwner>[];
    }

    extractLogsApproveHash (tx: TransactionReceipt): ITxLogItem<TLogApproveHash>[] {
        let abi = this.$getAbiItem('event', 'ApproveHash');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApproveHash>[];
    }

    extractLogsChangedMasterCopy (tx: TransactionReceipt): ITxLogItem<TLogChangedMasterCopy>[] {
        let abi = this.$getAbiItem('event', 'ChangedMasterCopy');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogChangedMasterCopy>[];
    }

    extractLogsChangedThreshold (tx: TransactionReceipt): ITxLogItem<TLogChangedThreshold>[] {
        let abi = this.$getAbiItem('event', 'ChangedThreshold');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogChangedThreshold>[];
    }

    extractLogsDisabledModule (tx: TransactionReceipt): ITxLogItem<TLogDisabledModule>[] {
        let abi = this.$getAbiItem('event', 'DisabledModule');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDisabledModule>[];
    }

    extractLogsEnabledModule (tx: TransactionReceipt): ITxLogItem<TLogEnabledModule>[] {
        let abi = this.$getAbiItem('event', 'EnabledModule');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogEnabledModule>[];
    }

    extractLogsExecutionFailure (tx: TransactionReceipt): ITxLogItem<TLogExecutionFailure>[] {
        let abi = this.$getAbiItem('event', 'ExecutionFailure');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogExecutionFailure>[];
    }

    extractLogsExecutionFromModuleFailure (tx: TransactionReceipt): ITxLogItem<TLogExecutionFromModuleFailure>[] {
        let abi = this.$getAbiItem('event', 'ExecutionFromModuleFailure');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogExecutionFromModuleFailure>[];
    }

    extractLogsExecutionFromModuleSuccess (tx: TransactionReceipt): ITxLogItem<TLogExecutionFromModuleSuccess>[] {
        let abi = this.$getAbiItem('event', 'ExecutionFromModuleSuccess');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogExecutionFromModuleSuccess>[];
    }

    extractLogsExecutionSuccess (tx: TransactionReceipt): ITxLogItem<TLogExecutionSuccess>[] {
        let abi = this.$getAbiItem('event', 'ExecutionSuccess');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogExecutionSuccess>[];
    }

    extractLogsRemovedOwner (tx: TransactionReceipt): ITxLogItem<TLogRemovedOwner>[] {
        let abi = this.$getAbiItem('event', 'RemovedOwner');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogRemovedOwner>[];
    }

    extractLogsSignMsg (tx: TransactionReceipt): ITxLogItem<TLogSignMsg>[] {
        let abi = this.$getAbiItem('event', 'SignMsg');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogSignMsg>[];
    }

    async getPastLogsAddedOwner (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogAddedOwner>[]> {
        let topic = '0x9465fa0c962cc76958e6373a993326400c1c94f8be2fe3a952adfa7f60b2ea26';
        let abi = this.$getAbiItem('event', 'AddedOwner');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsApproveHash (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { approvedHash?: TBufferLike,owner?: TAddress }
    }): Promise<ITxLogItem<TLogApproveHash>[]> {
        let topic = '0xf2a0eb156472d1440255b0d7c1e19cc07115d1051fe605b0dce69acfec884d9c';
        let abi = this.$getAbiItem('event', 'ApproveHash');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsChangedMasterCopy (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogChangedMasterCopy>[]> {
        let topic = '0x75e41bc35ff1bf14d81d1d2f649c0084a0f974f9289c803ec9898eeec4c8d0b8';
        let abi = this.$getAbiItem('event', 'ChangedMasterCopy');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsChangedThreshold (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogChangedThreshold>[]> {
        let topic = '0x610f7ff2b304ae8903c3de74c60c6ab1f7d6226b3f52c5161905bb5ad4039c93';
        let abi = this.$getAbiItem('event', 'ChangedThreshold');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsDisabledModule (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogDisabledModule>[]> {
        let topic = '0xaab4fa2b463f581b2b32cb3b7e3b704b9ce37cc209b5fb4d77e593ace4054276';
        let abi = this.$getAbiItem('event', 'DisabledModule');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsEnabledModule (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogEnabledModule>[]> {
        let topic = '0xecdf3a3effea5783a3c4c2140e677577666428d44ed9d474a0b3a4c9943f8440';
        let abi = this.$getAbiItem('event', 'EnabledModule');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsExecutionFailure (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogExecutionFailure>[]> {
        let topic = '0x23428b18acfb3ea64b08dc0c1d296ea9c09702c09083ca5272e64d115b687d23';
        let abi = this.$getAbiItem('event', 'ExecutionFailure');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsExecutionFromModuleFailure (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { module?: TAddress }
    }): Promise<ITxLogItem<TLogExecutionFromModuleFailure>[]> {
        let topic = '0xacd2c8702804128fdb0db2bb49f6d127dd0181c13fd45dbfe16de0930e2bd375';
        let abi = this.$getAbiItem('event', 'ExecutionFromModuleFailure');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsExecutionFromModuleSuccess (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { module?: TAddress }
    }): Promise<ITxLogItem<TLogExecutionFromModuleSuccess>[]> {
        let topic = '0x6895c13664aa4f67288b25d7a21d7aaa34916e355fb9b6fae0a139a9085becb8';
        let abi = this.$getAbiItem('event', 'ExecutionFromModuleSuccess');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsExecutionSuccess (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogExecutionSuccess>[]> {
        let topic = '0x442e715f626346e8c54381002da614f62bee8d27386535b2521ec8540898556e';
        let abi = this.$getAbiItem('event', 'ExecutionSuccess');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsRemovedOwner (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogRemovedOwner>[]> {
        let topic = '0xf8d49fc529812e9a7c5c50e69c20f0dccc0db8fa95c98bc58cc9a4f1c1299eaf';
        let abi = this.$getAbiItem('event', 'RemovedOwner');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsSignMsg (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { msgHash?: TBufferLike }
    }): Promise<ITxLogItem<TLogSignMsg>[]> {
        let topic = '0xe7f4675038f4f6034dfcbbb24c4dc08e4ebf10eb9d257d3d02c0f38d122ac6e4';
        let abi = this.$getAbiItem('event', 'SignMsg');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"AddedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"approvedHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"ApproveHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"masterCopy","type":"address"}],"name":"ChangedMasterCopy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"threshold","type":"uint256"}],"name":"ChangedThreshold","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract Module","name":"module","type":"address"}],"name":"DisabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract Module","name":"module","type":"address"}],"name":"EnabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"RemovedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"SignMsg","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"NAME","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"addOwnerWithThreshold","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"hashToApprove","type":"bytes32"}],"name":"approveHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"approvedHashes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_masterCopy","type":"address"}],"name":"changeMasterCopy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"changeThreshold","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract Module","name":"prevModule","type":"address"},{"internalType":"contract Module","name":"module","type":"address"}],"name":"disableModule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"domainSeparator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"contract Module","name":"module","type":"address"}],"name":"enableModule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"encodeTransactionData","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address payable","name":"refundReceiver","type":"address"},{"internalType":"bytes","name":"signatures","type":"bytes"}],"name":"execTransaction","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModule","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModuleReturnData","outputs":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes","name":"message","type":"bytes"}],"name":"getMessageHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getModules","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"start","type":"address"},{"internalType":"uint256","name":"pageSize","type":"uint256"}],"name":"getModulesPaginated","outputs":[{"internalType":"address[]","name":"array","type":"address[]"},{"internalType":"address","name":"next","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"getTransactionHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"bytes","name":"_signature","type":"bytes"}],"name":"isValidSignature","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"requiredTxGas","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"handler","type":"address"}],"name":"setFallbackHandler","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256","name":"_threshold","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"address","name":"fallbackHandler","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"payment","type":"uint256"},{"internalType":"address payable","name":"paymentReceiver","type":"address"}],"name":"setup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"signMessage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"signedMessages","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"oldOwner","type":"address"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"swapOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogAddedOwner = {
        owner: TAddress
    }
    type TLogApproveHash = {
        approvedHash: TBufferLike, owner: TAddress
    }
    type TLogChangedMasterCopy = {
        masterCopy: TAddress
    }
    type TLogChangedThreshold = {
        threshold: bigint
    }
    type TLogDisabledModule = {
        module: TAddress
    }
    type TLogEnabledModule = {
        module: TAddress
    }
    type TLogExecutionFailure = {
        txHash: TBufferLike, payment: bigint
    }
    type TLogExecutionFromModuleFailure = {
        module: TAddress
    }
    type TLogExecutionFromModuleSuccess = {
        module: TAddress
    }
    type TLogExecutionSuccess = {
        txHash: TBufferLike, payment: bigint
    }
    type TLogRemovedOwner = {
        owner: TAddress
    }
    type TLogSignMsg = {
        msgHash: TBufferLike
    }

