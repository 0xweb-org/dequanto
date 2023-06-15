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



export class GnosisSafe extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0xa3f4df7e
    async NAME (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'NAME'));
    }

    // 0xffa1ad74
    async VERSION (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'VERSION'));
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
        return this.$read(this.$getAbiItem('function', 'approvedHashes'), input0, input1);
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
        return this.$read(this.$getAbiItem('function', 'domainSeparator'));
    }

    // 0x610b5925
    async enableModule (sender: TSender, module: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'enableModule'), sender, module);
    }

    // 0xe86637db
    async encodeTransactionData (to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, _nonce: bigint): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'encodeTransactionData'), to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce);
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
        return this.$read(this.$getAbiItem('function', 'getMessageHash'), message);
    }

    // 0xb2494df3
    async getModules (): Promise<TAddress[]> {
        return this.$read(this.$getAbiItem('function', 'getModules'));
    }

    // 0xcc2f8452
    async getModulesPaginated (start: TAddress, pageSize: bigint): Promise<{ array: TAddress[], next: TAddress }> {
        return this.$read(this.$getAbiItem('function', 'getModulesPaginated'), start, pageSize);
    }

    // 0xa0e67e2b
    async getOwners (): Promise<TAddress[]> {
        return this.$read(this.$getAbiItem('function', 'getOwners'));
    }

    // 0xe75235b8
    async getThreshold (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getThreshold'));
    }

    // 0xd8d11f78
    async getTransactionHash (to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, _nonce: bigint): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'getTransactionHash'), to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce);
    }

    // 0x2f54bf6e
    async isOwner (owner: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isOwner'), owner);
    }

    // 0x20c13b0b
    async isValidSignature (sender: TSender, _data: TBufferLike, _signature: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'isValidSignature'), sender, _data, _signature);
    }

    // 0xaffed0e0
    async nonce (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'nonce'));
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
        return this.$read(this.$getAbiItem('function', 'signedMessages'), input0);
    }

    // 0xe318b52b
    async swapOwner (sender: TSender, prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swapOwner'), sender, prevOwner, oldOwner, newOwner);
    }

    $call () {
        return super.$call() as IGnosisSafeTxCaller;;
    }

    $data (): IGnosisSafeTxData {
        return super.$data() as IGnosisSafeTxData;
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

    onAddedOwner (fn?: (event: TClientEventsStreamData<TLogAddedOwnerParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogAddedOwnerParameters>> {
        return this.$onLog('AddedOwner', fn);
    }

    onApproveHash (fn?: (event: TClientEventsStreamData<TLogApproveHashParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogApproveHashParameters>> {
        return this.$onLog('ApproveHash', fn);
    }

    onChangedMasterCopy (fn?: (event: TClientEventsStreamData<TLogChangedMasterCopyParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogChangedMasterCopyParameters>> {
        return this.$onLog('ChangedMasterCopy', fn);
    }

    onChangedThreshold (fn?: (event: TClientEventsStreamData<TLogChangedThresholdParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogChangedThresholdParameters>> {
        return this.$onLog('ChangedThreshold', fn);
    }

    onDisabledModule (fn?: (event: TClientEventsStreamData<TLogDisabledModuleParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDisabledModuleParameters>> {
        return this.$onLog('DisabledModule', fn);
    }

    onEnabledModule (fn?: (event: TClientEventsStreamData<TLogEnabledModuleParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogEnabledModuleParameters>> {
        return this.$onLog('EnabledModule', fn);
    }

    onExecutionFailure (fn?: (event: TClientEventsStreamData<TLogExecutionFailureParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogExecutionFailureParameters>> {
        return this.$onLog('ExecutionFailure', fn);
    }

    onExecutionFromModuleFailure (fn?: (event: TClientEventsStreamData<TLogExecutionFromModuleFailureParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogExecutionFromModuleFailureParameters>> {
        return this.$onLog('ExecutionFromModuleFailure', fn);
    }

    onExecutionFromModuleSuccess (fn?: (event: TClientEventsStreamData<TLogExecutionFromModuleSuccessParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogExecutionFromModuleSuccessParameters>> {
        return this.$onLog('ExecutionFromModuleSuccess', fn);
    }

    onExecutionSuccess (fn?: (event: TClientEventsStreamData<TLogExecutionSuccessParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogExecutionSuccessParameters>> {
        return this.$onLog('ExecutionSuccess', fn);
    }

    onRemovedOwner (fn?: (event: TClientEventsStreamData<TLogRemovedOwnerParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogRemovedOwnerParameters>> {
        return this.$onLog('RemovedOwner', fn);
    }

    onSignMsg (fn?: (event: TClientEventsStreamData<TLogSignMsgParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogSignMsgParameters>> {
        return this.$onLog('SignMsg', fn);
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
        return await this.$getPastLogsParsed('AddedOwner', options) as any;
    }

    async getPastLogsApproveHash (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { approvedHash?: TBufferLike,owner?: TAddress }
    }): Promise<ITxLogItem<TLogApproveHash>[]> {
        return await this.$getPastLogsParsed('ApproveHash', options) as any;
    }

    async getPastLogsChangedMasterCopy (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogChangedMasterCopy>[]> {
        return await this.$getPastLogsParsed('ChangedMasterCopy', options) as any;
    }

    async getPastLogsChangedThreshold (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogChangedThreshold>[]> {
        return await this.$getPastLogsParsed('ChangedThreshold', options) as any;
    }

    async getPastLogsDisabledModule (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogDisabledModule>[]> {
        return await this.$getPastLogsParsed('DisabledModule', options) as any;
    }

    async getPastLogsEnabledModule (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogEnabledModule>[]> {
        return await this.$getPastLogsParsed('EnabledModule', options) as any;
    }

    async getPastLogsExecutionFailure (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogExecutionFailure>[]> {
        return await this.$getPastLogsParsed('ExecutionFailure', options) as any;
    }

    async getPastLogsExecutionFromModuleFailure (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { module?: TAddress }
    }): Promise<ITxLogItem<TLogExecutionFromModuleFailure>[]> {
        return await this.$getPastLogsParsed('ExecutionFromModuleFailure', options) as any;
    }

    async getPastLogsExecutionFromModuleSuccess (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { module?: TAddress }
    }): Promise<ITxLogItem<TLogExecutionFromModuleSuccess>[]> {
        return await this.$getPastLogsParsed('ExecutionFromModuleSuccess', options) as any;
    }

    async getPastLogsExecutionSuccess (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogExecutionSuccess>[]> {
        return await this.$getPastLogsParsed('ExecutionSuccess', options) as any;
    }

    async getPastLogsRemovedOwner (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogRemovedOwner>[]> {
        return await this.$getPastLogsParsed('RemovedOwner', options) as any;
    }

    async getPastLogsSignMsg (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { msgHash?: TBufferLike }
    }): Promise<ITxLogItem<TLogSignMsg>[]> {
        return await this.$getPastLogsParsed('SignMsg', options) as any;
    }

    abi: AbiItem[] = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"AddedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"approvedHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"ApproveHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"masterCopy","type":"address"}],"name":"ChangedMasterCopy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"threshold","type":"uint256"}],"name":"ChangedThreshold","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract Module","name":"module","type":"address"}],"name":"DisabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract Module","name":"module","type":"address"}],"name":"EnabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"RemovedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"SignMsg","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"NAME","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"addOwnerWithThreshold","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"hashToApprove","type":"bytes32"}],"name":"approveHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"approvedHashes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_masterCopy","type":"address"}],"name":"changeMasterCopy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"changeThreshold","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract Module","name":"prevModule","type":"address"},{"internalType":"contract Module","name":"module","type":"address"}],"name":"disableModule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"domainSeparator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"contract Module","name":"module","type":"address"}],"name":"enableModule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"encodeTransactionData","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address payable","name":"refundReceiver","type":"address"},{"internalType":"bytes","name":"signatures","type":"bytes"}],"name":"execTransaction","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModule","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModuleReturnData","outputs":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes","name":"message","type":"bytes"}],"name":"getMessageHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getModules","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"start","type":"address"},{"internalType":"uint256","name":"pageSize","type":"uint256"}],"name":"getModulesPaginated","outputs":[{"internalType":"address[]","name":"array","type":"address[]"},{"internalType":"address","name":"next","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"getTransactionHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"bytes","name":"_signature","type":"bytes"}],"name":"isValidSignature","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"requiredTxGas","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"handler","type":"address"}],"name":"setFallbackHandler","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256","name":"_threshold","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"address","name":"fallbackHandler","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"payment","type":"uint256"},{"internalType":"address payable","name":"paymentReceiver","type":"address"}],"name":"setup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"signMessage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"signedMessages","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"oldOwner","type":"address"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"swapOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogAddedOwner = {
        owner: TAddress
    };
    type TLogAddedOwnerParameters = [ owner: TAddress ];
    type TLogApproveHash = {
        approvedHash: TBufferLike, owner: TAddress
    };
    type TLogApproveHashParameters = [ approvedHash: TBufferLike, owner: TAddress ];
    type TLogChangedMasterCopy = {
        masterCopy: TAddress
    };
    type TLogChangedMasterCopyParameters = [ masterCopy: TAddress ];
    type TLogChangedThreshold = {
        threshold: bigint
    };
    type TLogChangedThresholdParameters = [ threshold: bigint ];
    type TLogDisabledModule = {
        module: TAddress
    };
    type TLogDisabledModuleParameters = [ module: TAddress ];
    type TLogEnabledModule = {
        module: TAddress
    };
    type TLogEnabledModuleParameters = [ module: TAddress ];
    type TLogExecutionFailure = {
        txHash: TBufferLike, payment: bigint
    };
    type TLogExecutionFailureParameters = [ txHash: TBufferLike, payment: bigint ];
    type TLogExecutionFromModuleFailure = {
        module: TAddress
    };
    type TLogExecutionFromModuleFailureParameters = [ module: TAddress ];
    type TLogExecutionFromModuleSuccess = {
        module: TAddress
    };
    type TLogExecutionFromModuleSuccessParameters = [ module: TAddress ];
    type TLogExecutionSuccess = {
        txHash: TBufferLike, payment: bigint
    };
    type TLogExecutionSuccessParameters = [ txHash: TBufferLike, payment: bigint ];
    type TLogRemovedOwner = {
        owner: TAddress
    };
    type TLogRemovedOwnerParameters = [ owner: TAddress ];
    type TLogSignMsg = {
        msgHash: TBufferLike
    };
    type TLogSignMsgParameters = [ msgHash: TBufferLike ];

interface IEvents {
  AddedOwner: TLogAddedOwnerParameters
  ApproveHash: TLogApproveHashParameters
  ChangedMasterCopy: TLogChangedMasterCopyParameters
  ChangedThreshold: TLogChangedThresholdParameters
  DisabledModule: TLogDisabledModuleParameters
  EnabledModule: TLogEnabledModuleParameters
  ExecutionFailure: TLogExecutionFailureParameters
  ExecutionFromModuleFailure: TLogExecutionFromModuleFailureParameters
  ExecutionFromModuleSuccess: TLogExecutionFromModuleSuccessParameters
  ExecutionSuccess: TLogExecutionSuccessParameters
  RemovedOwner: TLogRemovedOwnerParameters
  SignMsg: TLogSignMsgParameters
  '*': any[] 
}



interface IMethodNAME {
  method: "NAME"
  arguments: [  ]
}

interface IMethodVERSION {
  method: "VERSION"
  arguments: [  ]
}

interface IMethodAddOwnerWithThreshold {
  method: "addOwnerWithThreshold"
  arguments: [ owner: TAddress, _threshold: bigint ]
}

interface IMethodApproveHash {
  method: "approveHash"
  arguments: [ hashToApprove: TBufferLike ]
}

interface IMethodApprovedHashes {
  method: "approvedHashes"
  arguments: [ input0: TAddress, input1: TBufferLike ]
}

interface IMethodChangeMasterCopy {
  method: "changeMasterCopy"
  arguments: [ _masterCopy: TAddress ]
}

interface IMethodChangeThreshold {
  method: "changeThreshold"
  arguments: [ _threshold: bigint ]
}

interface IMethodDisableModule {
  method: "disableModule"
  arguments: [ prevModule: TAddress, module: TAddress ]
}

interface IMethodDomainSeparator {
  method: "domainSeparator"
  arguments: [  ]
}

interface IMethodEnableModule {
  method: "enableModule"
  arguments: [ module: TAddress ]
}

interface IMethodEncodeTransactionData {
  method: "encodeTransactionData"
  arguments: [ to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, _nonce: bigint ]
}

interface IMethodExecTransaction {
  method: "execTransaction"
  arguments: [ to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TBufferLike ]
}

interface IMethodExecTransactionFromModule {
  method: "execTransactionFromModule"
  arguments: [ to: TAddress, value: bigint, data: TBufferLike, operation: number ]
}

interface IMethodExecTransactionFromModuleReturnData {
  method: "execTransactionFromModuleReturnData"
  arguments: [ to: TAddress, value: bigint, data: TBufferLike, operation: number ]
}

interface IMethodGetMessageHash {
  method: "getMessageHash"
  arguments: [ message: TBufferLike ]
}

interface IMethodGetModules {
  method: "getModules"
  arguments: [  ]
}

interface IMethodGetModulesPaginated {
  method: "getModulesPaginated"
  arguments: [ start: TAddress, pageSize: bigint ]
}

interface IMethodGetOwners {
  method: "getOwners"
  arguments: [  ]
}

interface IMethodGetThreshold {
  method: "getThreshold"
  arguments: [  ]
}

interface IMethodGetTransactionHash {
  method: "getTransactionHash"
  arguments: [ to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, _nonce: bigint ]
}

interface IMethodIsOwner {
  method: "isOwner"
  arguments: [ owner: TAddress ]
}

interface IMethodIsValidSignature {
  method: "isValidSignature"
  arguments: [ _data: TBufferLike, _signature: TBufferLike ]
}

interface IMethodNonce {
  method: "nonce"
  arguments: [  ]
}

interface IMethodRemoveOwner {
  method: "removeOwner"
  arguments: [ prevOwner: TAddress, owner: TAddress, _threshold: bigint ]
}

interface IMethodRequiredTxGas {
  method: "requiredTxGas"
  arguments: [ to: TAddress, value: bigint, data: TBufferLike, operation: number ]
}

interface IMethodSetFallbackHandler {
  method: "setFallbackHandler"
  arguments: [ handler: TAddress ]
}

interface IMethodSetup {
  method: "setup"
  arguments: [ _owners: TAddress[], _threshold: bigint, to: TAddress, data: TBufferLike, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress ]
}

interface IMethodSignMessage {
  method: "signMessage"
  arguments: [ _data: TBufferLike ]
}

interface IMethodSignedMessages {
  method: "signedMessages"
  arguments: [ input0: TBufferLike ]
}

interface IMethodSwapOwner {
  method: "swapOwner"
  arguments: [ prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress ]
}

interface IMethods {
  NAME: IMethodNAME
  VERSION: IMethodVERSION
  addOwnerWithThreshold: IMethodAddOwnerWithThreshold
  approveHash: IMethodApproveHash
  approvedHashes: IMethodApprovedHashes
  changeMasterCopy: IMethodChangeMasterCopy
  changeThreshold: IMethodChangeThreshold
  disableModule: IMethodDisableModule
  domainSeparator: IMethodDomainSeparator
  enableModule: IMethodEnableModule
  encodeTransactionData: IMethodEncodeTransactionData
  execTransaction: IMethodExecTransaction
  execTransactionFromModule: IMethodExecTransactionFromModule
  execTransactionFromModuleReturnData: IMethodExecTransactionFromModuleReturnData
  getMessageHash: IMethodGetMessageHash
  getModules: IMethodGetModules
  getModulesPaginated: IMethodGetModulesPaginated
  getOwners: IMethodGetOwners
  getThreshold: IMethodGetThreshold
  getTransactionHash: IMethodGetTransactionHash
  isOwner: IMethodIsOwner
  isValidSignature: IMethodIsValidSignature
  nonce: IMethodNonce
  removeOwner: IMethodRemoveOwner
  requiredTxGas: IMethodRequiredTxGas
  setFallbackHandler: IMethodSetFallbackHandler
  setup: IMethodSetup
  signMessage: IMethodSignMessage
  signedMessages: IMethodSignedMessages
  swapOwner: IMethodSwapOwner
  '*': { method: string, arguments: any[] } 
}






interface IGnosisSafeTxCaller {
    addOwnerWithThreshold (sender: TSender, owner: TAddress, _threshold: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    approveHash (sender: TSender, hashToApprove: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    changeMasterCopy (sender: TSender, _masterCopy: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    changeThreshold (sender: TSender, _threshold: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    disableModule (sender: TSender, prevModule: TAddress, module: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    enableModule (sender: TSender, module: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execTransaction (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execTransactionFromModule (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execTransactionFromModuleReturnData (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    isValidSignature (sender: TSender, _data: TBufferLike, _signature: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    removeOwner (sender: TSender, prevOwner: TAddress, owner: TAddress, _threshold: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    requiredTxGas (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setFallbackHandler (sender: TSender, handler: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setup (sender: TSender, _owners: TAddress[], _threshold: bigint, to: TAddress, data: TBufferLike, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    signMessage (sender: TSender, _data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swapOwner (sender: TSender, prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IGnosisSafeTxData {
    addOwnerWithThreshold (sender: TSender, owner: TAddress, _threshold: bigint): Promise<TransactionConfig>
    approveHash (sender: TSender, hashToApprove: TBufferLike): Promise<TransactionConfig>
    changeMasterCopy (sender: TSender, _masterCopy: TAddress): Promise<TransactionConfig>
    changeThreshold (sender: TSender, _threshold: bigint): Promise<TransactionConfig>
    disableModule (sender: TSender, prevModule: TAddress, module: TAddress): Promise<TransactionConfig>
    enableModule (sender: TSender, module: TAddress): Promise<TransactionConfig>
    execTransaction (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TBufferLike): Promise<TransactionConfig>
    execTransactionFromModule (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number): Promise<TransactionConfig>
    execTransactionFromModuleReturnData (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number): Promise<TransactionConfig>
    isValidSignature (sender: TSender, _data: TBufferLike, _signature: TBufferLike): Promise<TransactionConfig>
    removeOwner (sender: TSender, prevOwner: TAddress, owner: TAddress, _threshold: bigint): Promise<TransactionConfig>
    requiredTxGas (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number): Promise<TransactionConfig>
    setFallbackHandler (sender: TSender, handler: TAddress): Promise<TransactionConfig>
    setup (sender: TSender, _owners: TAddress[], _threshold: bigint, to: TAddress, data: TBufferLike, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress): Promise<TransactionConfig>
    signMessage (sender: TSender, _data: TBufferLike): Promise<TransactionConfig>
    swapOwner (sender: TSender, prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress): Promise<TransactionConfig>
}


