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



export class SafeL2 extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
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

    // 0x694e80c3
    async changeThreshold (sender: TSender, _threshold: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'changeThreshold'), sender, _threshold);
    }

    // 0x12fb68e0
    async checkNSignatures (dataHash: TBufferLike, data: TBufferLike, signatures: TBufferLike, requiredSignatures: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'checkNSignatures'), dataHash, data, signatures, requiredSignatures);
    }

    // 0x934f3a11
    async checkSignatures (dataHash: TBufferLike, data: TBufferLike, signatures: TBufferLike): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'checkSignatures'), dataHash, data, signatures);
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

    // 0x3408e470
    async getChainId (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getChainId'));
    }

    // 0xcc2f8452
    async getModulesPaginated (start: TAddress, pageSize: bigint): Promise<{ array: TAddress[], next: TAddress }> {
        return this.$read(this.$getAbiItem('function', 'getModulesPaginated'), start, pageSize);
    }

    // 0xa0e67e2b
    async getOwners (): Promise<TAddress[]> {
        return this.$read(this.$getAbiItem('function', 'getOwners'));
    }

    // 0x5624b25b
    async getStorageAt (offset: bigint, length: bigint): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'getStorageAt'), offset, length);
    }

    // 0xe75235b8
    async getThreshold (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getThreshold'));
    }

    // 0xd8d11f78
    async getTransactionHash (to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, _nonce: bigint): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'getTransactionHash'), to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce);
    }

    // 0x2d9ad53d
    async isModuleEnabled (module: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isModuleEnabled'), module);
    }

    // 0x2f54bf6e
    async isOwner (owner: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isOwner'), owner);
    }

    // 0xaffed0e0
    async nonce (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'nonce'));
    }

    // 0xf8dc5dd9
    async removeOwner (sender: TSender, prevOwner: TAddress, owner: TAddress, _threshold: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'removeOwner'), sender, prevOwner, owner, _threshold);
    }

    // 0xf08a0323
    async setFallbackHandler (sender: TSender, handler: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setFallbackHandler'), sender, handler);
    }

    // 0xe19a9dd9
    async setGuard (sender: TSender, guard: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setGuard'), sender, guard);
    }

    // 0xb63e800d
    async setup (sender: TSender, _owners: TAddress[], _threshold: bigint, to: TAddress, data: TBufferLike, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setup'), sender, _owners, _threshold, to, data, fallbackHandler, paymentToken, payment, paymentReceiver);
    }

    // 0x5ae6bd37
    async signedMessages (input0: TBufferLike): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'signedMessages'), input0);
    }

    // 0xb4faba09
    async simulateAndRevert (sender: TSender, targetContract: TAddress, calldataPayload: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'simulateAndRevert'), sender, targetContract, calldataPayload);
    }

    // 0xe318b52b
    async swapOwner (sender: TSender, prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swapOwner'), sender, prevOwner, oldOwner, newOwner);
    }

    $call () {
        return super.$call() as ISafeL2TxCaller;
    }
    $signed (): TOverrideReturns<ISafeL2TxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): ISafeL2TxData {
        return super.$data() as ISafeL2TxData;
    }
    $gas (): TOverrideReturns<ISafeL2TxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onAddedOwner (fn?: (event: TClientEventsStreamData<TLogAddedOwnerParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogAddedOwnerParameters>> {
        return this.$onLog('AddedOwner', fn);
    }

    onApproveHash (fn?: (event: TClientEventsStreamData<TLogApproveHashParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogApproveHashParameters>> {
        return this.$onLog('ApproveHash', fn);
    }

    onChangedFallbackHandler (fn?: (event: TClientEventsStreamData<TLogChangedFallbackHandlerParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogChangedFallbackHandlerParameters>> {
        return this.$onLog('ChangedFallbackHandler', fn);
    }

    onChangedGuard (fn?: (event: TClientEventsStreamData<TLogChangedGuardParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogChangedGuardParameters>> {
        return this.$onLog('ChangedGuard', fn);
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

    onSafeModuleTransaction (fn?: (event: TClientEventsStreamData<TLogSafeModuleTransactionParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogSafeModuleTransactionParameters>> {
        return this.$onLog('SafeModuleTransaction', fn);
    }

    onSafeMultiSigTransaction (fn?: (event: TClientEventsStreamData<TLogSafeMultiSigTransactionParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogSafeMultiSigTransactionParameters>> {
        return this.$onLog('SafeMultiSigTransaction', fn);
    }

    onSafeReceived (fn?: (event: TClientEventsStreamData<TLogSafeReceivedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogSafeReceivedParameters>> {
        return this.$onLog('SafeReceived', fn);
    }

    onSafeSetup (fn?: (event: TClientEventsStreamData<TLogSafeSetupParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogSafeSetupParameters>> {
        return this.$onLog('SafeSetup', fn);
    }

    onSignMsg (fn?: (event: TClientEventsStreamData<TLogSignMsgParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogSignMsgParameters>> {
        return this.$onLog('SignMsg', fn);
    }

    extractLogsAddedOwner (tx: TEth.TxReceipt): ITxLogItem<TLogAddedOwner>[] {
        let abi = this.$getAbiItem('event', 'AddedOwner');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogAddedOwner>[];
    }

    extractLogsApproveHash (tx: TEth.TxReceipt): ITxLogItem<TLogApproveHash>[] {
        let abi = this.$getAbiItem('event', 'ApproveHash');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApproveHash>[];
    }

    extractLogsChangedFallbackHandler (tx: TEth.TxReceipt): ITxLogItem<TLogChangedFallbackHandler>[] {
        let abi = this.$getAbiItem('event', 'ChangedFallbackHandler');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogChangedFallbackHandler>[];
    }

    extractLogsChangedGuard (tx: TEth.TxReceipt): ITxLogItem<TLogChangedGuard>[] {
        let abi = this.$getAbiItem('event', 'ChangedGuard');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogChangedGuard>[];
    }

    extractLogsChangedThreshold (tx: TEth.TxReceipt): ITxLogItem<TLogChangedThreshold>[] {
        let abi = this.$getAbiItem('event', 'ChangedThreshold');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogChangedThreshold>[];
    }

    extractLogsDisabledModule (tx: TEth.TxReceipt): ITxLogItem<TLogDisabledModule>[] {
        let abi = this.$getAbiItem('event', 'DisabledModule');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDisabledModule>[];
    }

    extractLogsEnabledModule (tx: TEth.TxReceipt): ITxLogItem<TLogEnabledModule>[] {
        let abi = this.$getAbiItem('event', 'EnabledModule');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogEnabledModule>[];
    }

    extractLogsExecutionFailure (tx: TEth.TxReceipt): ITxLogItem<TLogExecutionFailure>[] {
        let abi = this.$getAbiItem('event', 'ExecutionFailure');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogExecutionFailure>[];
    }

    extractLogsExecutionFromModuleFailure (tx: TEth.TxReceipt): ITxLogItem<TLogExecutionFromModuleFailure>[] {
        let abi = this.$getAbiItem('event', 'ExecutionFromModuleFailure');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogExecutionFromModuleFailure>[];
    }

    extractLogsExecutionFromModuleSuccess (tx: TEth.TxReceipt): ITxLogItem<TLogExecutionFromModuleSuccess>[] {
        let abi = this.$getAbiItem('event', 'ExecutionFromModuleSuccess');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogExecutionFromModuleSuccess>[];
    }

    extractLogsExecutionSuccess (tx: TEth.TxReceipt): ITxLogItem<TLogExecutionSuccess>[] {
        let abi = this.$getAbiItem('event', 'ExecutionSuccess');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogExecutionSuccess>[];
    }

    extractLogsRemovedOwner (tx: TEth.TxReceipt): ITxLogItem<TLogRemovedOwner>[] {
        let abi = this.$getAbiItem('event', 'RemovedOwner');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogRemovedOwner>[];
    }

    extractLogsSafeModuleTransaction (tx: TEth.TxReceipt): ITxLogItem<TLogSafeModuleTransaction>[] {
        let abi = this.$getAbiItem('event', 'SafeModuleTransaction');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogSafeModuleTransaction>[];
    }

    extractLogsSafeMultiSigTransaction (tx: TEth.TxReceipt): ITxLogItem<TLogSafeMultiSigTransaction>[] {
        let abi = this.$getAbiItem('event', 'SafeMultiSigTransaction');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogSafeMultiSigTransaction>[];
    }

    extractLogsSafeReceived (tx: TEth.TxReceipt): ITxLogItem<TLogSafeReceived>[] {
        let abi = this.$getAbiItem('event', 'SafeReceived');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogSafeReceived>[];
    }

    extractLogsSafeSetup (tx: TEth.TxReceipt): ITxLogItem<TLogSafeSetup>[] {
        let abi = this.$getAbiItem('event', 'SafeSetup');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogSafeSetup>[];
    }

    extractLogsSignMsg (tx: TEth.TxReceipt): ITxLogItem<TLogSignMsg>[] {
        let abi = this.$getAbiItem('event', 'SignMsg');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogSignMsg>[];
    }

    async getPastLogsAddedOwner (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress }
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

    async getPastLogsChangedFallbackHandler (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { handler?: TAddress }
    }): Promise<ITxLogItem<TLogChangedFallbackHandler>[]> {
        return await this.$getPastLogsParsed('ChangedFallbackHandler', options) as any;
    }

    async getPastLogsChangedGuard (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { guard?: TAddress }
    }): Promise<ITxLogItem<TLogChangedGuard>[]> {
        return await this.$getPastLogsParsed('ChangedGuard', options) as any;
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
        params?: { module?: TAddress }
    }): Promise<ITxLogItem<TLogDisabledModule>[]> {
        return await this.$getPastLogsParsed('DisabledModule', options) as any;
    }

    async getPastLogsEnabledModule (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { module?: TAddress }
    }): Promise<ITxLogItem<TLogEnabledModule>[]> {
        return await this.$getPastLogsParsed('EnabledModule', options) as any;
    }

    async getPastLogsExecutionFailure (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { txHash?: TBufferLike }
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
        params?: { txHash?: TBufferLike }
    }): Promise<ITxLogItem<TLogExecutionSuccess>[]> {
        return await this.$getPastLogsParsed('ExecutionSuccess', options) as any;
    }

    async getPastLogsRemovedOwner (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress }
    }): Promise<ITxLogItem<TLogRemovedOwner>[]> {
        return await this.$getPastLogsParsed('RemovedOwner', options) as any;
    }

    async getPastLogsSafeModuleTransaction (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogSafeModuleTransaction>[]> {
        return await this.$getPastLogsParsed('SafeModuleTransaction', options) as any;
    }

    async getPastLogsSafeMultiSigTransaction (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogSafeMultiSigTransaction>[]> {
        return await this.$getPastLogsParsed('SafeMultiSigTransaction', options) as any;
    }

    async getPastLogsSafeReceived (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress }
    }): Promise<ITxLogItem<TLogSafeReceived>[]> {
        return await this.$getPastLogsParsed('SafeReceived', options) as any;
    }

    async getPastLogsSafeSetup (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { initiator?: TAddress }
    }): Promise<ITxLogItem<TLogSafeSetup>[]> {
        return await this.$getPastLogsParsed('SafeSetup', options) as any;
    }

    async getPastLogsSignMsg (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { msgHash?: TBufferLike }
    }): Promise<ITxLogItem<TLogSignMsg>[]> {
        return await this.$getPastLogsParsed('SignMsg', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"AddedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"approvedHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"ApproveHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"handler","type":"address"}],"name":"ChangedFallbackHandler","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"guard","type":"address"}],"name":"ChangedGuard","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"threshold","type":"uint256"}],"name":"ChangedThreshold","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"DisabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"EnabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"RemovedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"module","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"SafeModuleTransaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"baseGas","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"gasPrice","type":"uint256"},{"indexed":false,"internalType":"address","name":"gasToken","type":"address"},{"indexed":false,"internalType":"address payable","name":"refundReceiver","type":"address"},{"indexed":false,"internalType":"bytes","name":"signatures","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"additionalInfo","type":"bytes"}],"name":"SafeMultiSigTransaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"SafeReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"initiator","type":"address"},{"indexed":false,"internalType":"address[]","name":"owners","type":"address[]"},{"indexed":false,"internalType":"uint256","name":"threshold","type":"uint256"},{"indexed":false,"internalType":"address","name":"initializer","type":"address"},{"indexed":false,"internalType":"address","name":"fallbackHandler","type":"address"}],"name":"SafeSetup","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"SignMsg","type":"event"},{"stateMutability":"nonpayable","type":"fallback"},{"inputs":[],"name":"VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"addOwnerWithThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hashToApprove","type":"bytes32"}],"name":"approveHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"approvedHashes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"changeThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"dataHash","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"bytes","name":"signatures","type":"bytes"},{"internalType":"uint256","name":"requiredSignatures","type":"uint256"}],"name":"checkNSignatures","outputs":[],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"dataHash","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"bytes","name":"signatures","type":"bytes"}],"name":"checkSignatures","outputs":[],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"prevModule","type":"address"},{"internalType":"address","name":"module","type":"address"}],"name":"disableModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"domainSeparator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"module","type":"address"}],"name":"enableModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"encodeTransactionData","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address payable","name":"refundReceiver","type":"address"},{"internalType":"bytes","name":"signatures","type":"bytes"}],"name":"execTransaction","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModule","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModuleReturnData","outputs":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"start","type":"address"},{"internalType":"uint256","name":"pageSize","type":"uint256"}],"name":"getModulesPaginated","outputs":[{"internalType":"address[]","name":"array","type":"address[]"},{"internalType":"address","name":"next","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwners","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"offset","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"}],"name":"getStorageAt","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"getTransactionHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"module","type":"address"}],"name":"isModuleEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"removeOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"handler","type":"address"}],"name":"setFallbackHandler","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"guard","type":"address"}],"name":"setGuard","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256","name":"_threshold","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"address","name":"fallbackHandler","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"payment","type":"uint256"},{"internalType":"address payable","name":"paymentReceiver","type":"address"}],"name":"setup","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"signedMessages","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"targetContract","type":"address"},{"internalType":"bytes","name":"calldataPayload","type":"bytes"}],"name":"simulateAndRevert","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"oldOwner","type":"address"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"swapOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]

    
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
    type TLogChangedFallbackHandler = {
        handler: TAddress
    };
    type TLogChangedFallbackHandlerParameters = [ handler: TAddress ];
    type TLogChangedGuard = {
        guard: TAddress
    };
    type TLogChangedGuardParameters = [ guard: TAddress ];
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
    type TLogSafeModuleTransaction = {
        module: TAddress, to: TAddress, value: bigint, data: TBufferLike, operation: number
    };
    type TLogSafeModuleTransactionParameters = [ module: TAddress, to: TAddress, value: bigint, data: TBufferLike, operation: number ];
    type TLogSafeMultiSigTransaction = {
        to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TBufferLike, additionalInfo: TBufferLike
    };
    type TLogSafeMultiSigTransactionParameters = [ to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TBufferLike, additionalInfo: TBufferLike ];
    type TLogSafeReceived = {
        _sender: TAddress, value: bigint
    };
    type TLogSafeReceivedParameters = [ _sender: TAddress, value: bigint ];
    type TLogSafeSetup = {
        initiator: TAddress, owners: TAddress[], threshold: bigint, initializer: TAddress, fallbackHandler: TAddress
    };
    type TLogSafeSetupParameters = [ initiator: TAddress, owners: TAddress[], threshold: bigint, initializer: TAddress, fallbackHandler: TAddress ];
    type TLogSignMsg = {
        msgHash: TBufferLike
    };
    type TLogSignMsgParameters = [ msgHash: TBufferLike ];

interface IEvents {
  AddedOwner: TLogAddedOwnerParameters
  ApproveHash: TLogApproveHashParameters
  ChangedFallbackHandler: TLogChangedFallbackHandlerParameters
  ChangedGuard: TLogChangedGuardParameters
  ChangedThreshold: TLogChangedThresholdParameters
  DisabledModule: TLogDisabledModuleParameters
  EnabledModule: TLogEnabledModuleParameters
  ExecutionFailure: TLogExecutionFailureParameters
  ExecutionFromModuleFailure: TLogExecutionFromModuleFailureParameters
  ExecutionFromModuleSuccess: TLogExecutionFromModuleSuccessParameters
  ExecutionSuccess: TLogExecutionSuccessParameters
  RemovedOwner: TLogRemovedOwnerParameters
  SafeModuleTransaction: TLogSafeModuleTransactionParameters
  SafeMultiSigTransaction: TLogSafeMultiSigTransactionParameters
  SafeReceived: TLogSafeReceivedParameters
  SafeSetup: TLogSafeSetupParameters
  SignMsg: TLogSignMsgParameters
  '*': any[] 
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

interface IMethodChangeThreshold {
  method: "changeThreshold"
  arguments: [ _threshold: bigint ]
}

interface IMethodCheckNSignatures {
  method: "checkNSignatures"
  arguments: [ dataHash: TBufferLike, data: TBufferLike, signatures: TBufferLike, requiredSignatures: bigint ]
}

interface IMethodCheckSignatures {
  method: "checkSignatures"
  arguments: [ dataHash: TBufferLike, data: TBufferLike, signatures: TBufferLike ]
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

interface IMethodGetChainId {
  method: "getChainId"
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

interface IMethodGetStorageAt {
  method: "getStorageAt"
  arguments: [ offset: bigint, length: bigint ]
}

interface IMethodGetThreshold {
  method: "getThreshold"
  arguments: [  ]
}

interface IMethodGetTransactionHash {
  method: "getTransactionHash"
  arguments: [ to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, _nonce: bigint ]
}

interface IMethodIsModuleEnabled {
  method: "isModuleEnabled"
  arguments: [ module: TAddress ]
}

interface IMethodIsOwner {
  method: "isOwner"
  arguments: [ owner: TAddress ]
}

interface IMethodNonce {
  method: "nonce"
  arguments: [  ]
}

interface IMethodRemoveOwner {
  method: "removeOwner"
  arguments: [ prevOwner: TAddress, owner: TAddress, _threshold: bigint ]
}

interface IMethodSetFallbackHandler {
  method: "setFallbackHandler"
  arguments: [ handler: TAddress ]
}

interface IMethodSetGuard {
  method: "setGuard"
  arguments: [ guard: TAddress ]
}

interface IMethodSetup {
  method: "setup"
  arguments: [ _owners: TAddress[], _threshold: bigint, to: TAddress, data: TBufferLike, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress ]
}

interface IMethodSignedMessages {
  method: "signedMessages"
  arguments: [ input0: TBufferLike ]
}

interface IMethodSimulateAndRevert {
  method: "simulateAndRevert"
  arguments: [ targetContract: TAddress, calldataPayload: TBufferLike ]
}

interface IMethodSwapOwner {
  method: "swapOwner"
  arguments: [ prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress ]
}

interface IMethods {
  VERSION: IMethodVERSION
  addOwnerWithThreshold: IMethodAddOwnerWithThreshold
  approveHash: IMethodApproveHash
  approvedHashes: IMethodApprovedHashes
  changeThreshold: IMethodChangeThreshold
  checkNSignatures: IMethodCheckNSignatures
  checkSignatures: IMethodCheckSignatures
  disableModule: IMethodDisableModule
  domainSeparator: IMethodDomainSeparator
  enableModule: IMethodEnableModule
  encodeTransactionData: IMethodEncodeTransactionData
  execTransaction: IMethodExecTransaction
  execTransactionFromModule: IMethodExecTransactionFromModule
  execTransactionFromModuleReturnData: IMethodExecTransactionFromModuleReturnData
  getChainId: IMethodGetChainId
  getModulesPaginated: IMethodGetModulesPaginated
  getOwners: IMethodGetOwners
  getStorageAt: IMethodGetStorageAt
  getThreshold: IMethodGetThreshold
  getTransactionHash: IMethodGetTransactionHash
  isModuleEnabled: IMethodIsModuleEnabled
  isOwner: IMethodIsOwner
  nonce: IMethodNonce
  removeOwner: IMethodRemoveOwner
  setFallbackHandler: IMethodSetFallbackHandler
  setGuard: IMethodSetGuard
  setup: IMethodSetup
  signedMessages: IMethodSignedMessages
  simulateAndRevert: IMethodSimulateAndRevert
  swapOwner: IMethodSwapOwner
  '*': { method: string, arguments: any[] } 
}






interface ISafeL2TxCaller {
    addOwnerWithThreshold (sender: TSender, owner: TAddress, _threshold: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    approveHash (sender: TSender, hashToApprove: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    changeThreshold (sender: TSender, _threshold: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    disableModule (sender: TSender, prevModule: TAddress, module: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    enableModule (sender: TSender, module: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execTransaction (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execTransactionFromModule (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execTransactionFromModuleReturnData (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    removeOwner (sender: TSender, prevOwner: TAddress, owner: TAddress, _threshold: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setFallbackHandler (sender: TSender, handler: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setGuard (sender: TSender, guard: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setup (sender: TSender, _owners: TAddress[], _threshold: bigint, to: TAddress, data: TBufferLike, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    simulateAndRevert (sender: TSender, targetContract: TAddress, calldataPayload: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swapOwner (sender: TSender, prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface ISafeL2TxData {
    addOwnerWithThreshold (sender: TSender, owner: TAddress, _threshold: bigint): Promise<TEth.TxLike>
    approveHash (sender: TSender, hashToApprove: TBufferLike): Promise<TEth.TxLike>
    changeThreshold (sender: TSender, _threshold: bigint): Promise<TEth.TxLike>
    disableModule (sender: TSender, prevModule: TAddress, module: TAddress): Promise<TEth.TxLike>
    enableModule (sender: TSender, module: TAddress): Promise<TEth.TxLike>
    execTransaction (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TBufferLike): Promise<TEth.TxLike>
    execTransactionFromModule (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number): Promise<TEth.TxLike>
    execTransactionFromModuleReturnData (sender: TSender, to: TAddress, value: bigint, data: TBufferLike, operation: number): Promise<TEth.TxLike>
    removeOwner (sender: TSender, prevOwner: TAddress, owner: TAddress, _threshold: bigint): Promise<TEth.TxLike>
    setFallbackHandler (sender: TSender, handler: TAddress): Promise<TEth.TxLike>
    setGuard (sender: TSender, guard: TAddress): Promise<TEth.TxLike>
    setup (sender: TSender, _owners: TAddress[], _threshold: bigint, to: TAddress, data: TBufferLike, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress): Promise<TEth.TxLike>
    simulateAndRevert (sender: TSender, targetContract: TAddress, calldataPayload: TBufferLike): Promise<TEth.TxLike>
    swapOwner (sender: TSender, prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress): Promise<TEth.TxLike>
}


