/**
 *  AUTO-Generated Class: 2024-05-17 00:25
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
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
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
        public explorer: IBlockchainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)


    }

    Types: TSafeL2Types;

    $meta = {
        "class": "./src/prebuilt/safe/SafeL2.ts"
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
    async approveHash (sender: TSender, hashToApprove: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approveHash'), sender, hashToApprove);
    }

    // 0x7d832974
    async approvedHashes (input0: TAddress, input1: TEth.Hex): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'approvedHashes'), input0, input1);
    }

    // 0x694e80c3
    async changeThreshold (sender: TSender, _threshold: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'changeThreshold'), sender, _threshold);
    }

    // 0x12fb68e0
    async checkNSignatures (dataHash: TEth.Hex, data: TEth.Hex, signatures: TEth.Hex, requiredSignatures: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'checkNSignatures'), dataHash, data, signatures, requiredSignatures);
    }

    // 0x934f3a11
    async checkSignatures (dataHash: TEth.Hex, data: TEth.Hex, signatures: TEth.Hex): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'checkSignatures'), dataHash, data, signatures);
    }

    // 0xe009cfde
    async disableModule (sender: TSender, prevModule: TAddress, module: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'disableModule'), sender, prevModule, module);
    }

    // 0xf698da25
    async domainSeparator (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'domainSeparator'));
    }

    // 0x610b5925
    async enableModule (sender: TSender, module: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'enableModule'), sender, module);
    }

    // 0xe86637db
    async encodeTransactionData (to: TAddress, value: bigint, data: TEth.Hex, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, _nonce: bigint): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'encodeTransactionData'), to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce);
    }

    // 0x6a761202
    async execTransaction (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'execTransaction'), sender, to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, signatures);
    }

    // 0x468721a7
    async execTransactionFromModule (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'execTransactionFromModule'), sender, to, value, data, operation);
    }

    // 0x5229073f
    async execTransactionFromModuleReturnData (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number): Promise<TxWriter> {
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
    async getStorageAt (offset: bigint, length: bigint): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'getStorageAt'), offset, length);
    }

    // 0xe75235b8
    async getThreshold (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getThreshold'));
    }

    // 0xd8d11f78
    async getTransactionHash (to: TAddress, value: bigint, data: TEth.Hex, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, _nonce: bigint): Promise<TEth.Hex> {
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
    async setup (sender: TSender, _owners: TAddress[], _threshold: bigint, to: TAddress, data: TEth.Hex, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setup'), sender, _owners, _threshold, to, data, fallbackHandler, paymentToken, payment, paymentReceiver);
    }

    // 0x5ae6bd37
    async signedMessages (input0: TEth.Hex): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'signedMessages'), input0);
    }

    // 0xb4faba09
    async simulateAndRevert (sender: TSender, targetContract: TAddress, calldataPayload: TEth.Hex): Promise<TxWriter> {
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

    onTransaction <TMethod extends keyof TSafeL2Types['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TSafeL2Types['Methods'][TMethod]['arguments']
        }
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = method;
        return <any> this.$onTransaction(options);
    }

    onLog (event: keyof TEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
        return this.$onLog(event, cb);
    }

    async getPastLogs <TEventName extends keyof TEvents> (
        events: TEventName[]
        , options?: TEventLogOptions<TEventParams<TEventName>>
    ): Promise<ITxLogItem<TEventParams<TEventName>, TEventName>[]>
    async getPastLogs <TEventName extends keyof TEvents> (
        event: TEventName
        , options?: TEventLogOptions<TEventParams<TEventName>>
    ): Promise<ITxLogItem<TEventParams<TEventName>, TEventName>[]>
    async getPastLogs (mix: any, options?): Promise<any> {
        return await super.getPastLogs(mix, options) as any;
    }

    onAddedOwner (fn?: (event: TClientEventsStreamData<TEventArguments<'AddedOwner'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'AddedOwner'>>> {
        return this.$onLog('AddedOwner', fn);
    }

    onApproveHash (fn?: (event: TClientEventsStreamData<TEventArguments<'ApproveHash'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ApproveHash'>>> {
        return this.$onLog('ApproveHash', fn);
    }

    onChangedFallbackHandler (fn?: (event: TClientEventsStreamData<TEventArguments<'ChangedFallbackHandler'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ChangedFallbackHandler'>>> {
        return this.$onLog('ChangedFallbackHandler', fn);
    }

    onChangedGuard (fn?: (event: TClientEventsStreamData<TEventArguments<'ChangedGuard'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ChangedGuard'>>> {
        return this.$onLog('ChangedGuard', fn);
    }

    onChangedThreshold (fn?: (event: TClientEventsStreamData<TEventArguments<'ChangedThreshold'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ChangedThreshold'>>> {
        return this.$onLog('ChangedThreshold', fn);
    }

    onDisabledModule (fn?: (event: TClientEventsStreamData<TEventArguments<'DisabledModule'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'DisabledModule'>>> {
        return this.$onLog('DisabledModule', fn);
    }

    onEnabledModule (fn?: (event: TClientEventsStreamData<TEventArguments<'EnabledModule'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'EnabledModule'>>> {
        return this.$onLog('EnabledModule', fn);
    }

    onExecutionFailure (fn?: (event: TClientEventsStreamData<TEventArguments<'ExecutionFailure'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ExecutionFailure'>>> {
        return this.$onLog('ExecutionFailure', fn);
    }

    onExecutionFromModuleFailure (fn?: (event: TClientEventsStreamData<TEventArguments<'ExecutionFromModuleFailure'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ExecutionFromModuleFailure'>>> {
        return this.$onLog('ExecutionFromModuleFailure', fn);
    }

    onExecutionFromModuleSuccess (fn?: (event: TClientEventsStreamData<TEventArguments<'ExecutionFromModuleSuccess'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ExecutionFromModuleSuccess'>>> {
        return this.$onLog('ExecutionFromModuleSuccess', fn);
    }

    onExecutionSuccess (fn?: (event: TClientEventsStreamData<TEventArguments<'ExecutionSuccess'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ExecutionSuccess'>>> {
        return this.$onLog('ExecutionSuccess', fn);
    }

    onRemovedOwner (fn?: (event: TClientEventsStreamData<TEventArguments<'RemovedOwner'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'RemovedOwner'>>> {
        return this.$onLog('RemovedOwner', fn);
    }

    onSafeModuleTransaction (fn?: (event: TClientEventsStreamData<TEventArguments<'SafeModuleTransaction'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'SafeModuleTransaction'>>> {
        return this.$onLog('SafeModuleTransaction', fn);
    }

    onSafeMultiSigTransaction (fn?: (event: TClientEventsStreamData<TEventArguments<'SafeMultiSigTransaction'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'SafeMultiSigTransaction'>>> {
        return this.$onLog('SafeMultiSigTransaction', fn);
    }

    onSafeReceived (fn?: (event: TClientEventsStreamData<TEventArguments<'SafeReceived'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'SafeReceived'>>> {
        return this.$onLog('SafeReceived', fn);
    }

    onSafeSetup (fn?: (event: TClientEventsStreamData<TEventArguments<'SafeSetup'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'SafeSetup'>>> {
        return this.$onLog('SafeSetup', fn);
    }

    onSignMsg (fn?: (event: TClientEventsStreamData<TEventArguments<'SignMsg'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'SignMsg'>>> {
        return this.$onLog('SignMsg', fn);
    }

    extractLogsAddedOwner (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'AddedOwner'>>[] {
        let abi = this.$getAbiItem('event', 'AddedOwner');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'AddedOwner'>>[];
    }

    extractLogsApproveHash (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ApproveHash'>>[] {
        let abi = this.$getAbiItem('event', 'ApproveHash');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ApproveHash'>>[];
    }

    extractLogsChangedFallbackHandler (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ChangedFallbackHandler'>>[] {
        let abi = this.$getAbiItem('event', 'ChangedFallbackHandler');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ChangedFallbackHandler'>>[];
    }

    extractLogsChangedGuard (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ChangedGuard'>>[] {
        let abi = this.$getAbiItem('event', 'ChangedGuard');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ChangedGuard'>>[];
    }

    extractLogsChangedThreshold (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ChangedThreshold'>>[] {
        let abi = this.$getAbiItem('event', 'ChangedThreshold');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ChangedThreshold'>>[];
    }

    extractLogsDisabledModule (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'DisabledModule'>>[] {
        let abi = this.$getAbiItem('event', 'DisabledModule');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'DisabledModule'>>[];
    }

    extractLogsEnabledModule (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'EnabledModule'>>[] {
        let abi = this.$getAbiItem('event', 'EnabledModule');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'EnabledModule'>>[];
    }

    extractLogsExecutionFailure (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ExecutionFailure'>>[] {
        let abi = this.$getAbiItem('event', 'ExecutionFailure');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ExecutionFailure'>>[];
    }

    extractLogsExecutionFromModuleFailure (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ExecutionFromModuleFailure'>>[] {
        let abi = this.$getAbiItem('event', 'ExecutionFromModuleFailure');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ExecutionFromModuleFailure'>>[];
    }

    extractLogsExecutionFromModuleSuccess (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ExecutionFromModuleSuccess'>>[] {
        let abi = this.$getAbiItem('event', 'ExecutionFromModuleSuccess');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ExecutionFromModuleSuccess'>>[];
    }

    extractLogsExecutionSuccess (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ExecutionSuccess'>>[] {
        let abi = this.$getAbiItem('event', 'ExecutionSuccess');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ExecutionSuccess'>>[];
    }

    extractLogsRemovedOwner (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'RemovedOwner'>>[] {
        let abi = this.$getAbiItem('event', 'RemovedOwner');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'RemovedOwner'>>[];
    }

    extractLogsSafeModuleTransaction (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'SafeModuleTransaction'>>[] {
        let abi = this.$getAbiItem('event', 'SafeModuleTransaction');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'SafeModuleTransaction'>>[];
    }

    extractLogsSafeMultiSigTransaction (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'SafeMultiSigTransaction'>>[] {
        let abi = this.$getAbiItem('event', 'SafeMultiSigTransaction');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'SafeMultiSigTransaction'>>[];
    }

    extractLogsSafeReceived (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'SafeReceived'>>[] {
        let abi = this.$getAbiItem('event', 'SafeReceived');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'SafeReceived'>>[];
    }

    extractLogsSafeSetup (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'SafeSetup'>>[] {
        let abi = this.$getAbiItem('event', 'SafeSetup');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'SafeSetup'>>[];
    }

    extractLogsSignMsg (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'SignMsg'>>[] {
        let abi = this.$getAbiItem('event', 'SignMsg');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'SignMsg'>>[];
    }

    async getPastLogsAddedOwner (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'AddedOwner'>>[]> {
        return await this.$getPastLogsParsed('AddedOwner', options) as any;
    }

    async getPastLogsApproveHash (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { approvedHash?: TEth.Hex,owner?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ApproveHash'>>[]> {
        return await this.$getPastLogsParsed('ApproveHash', options) as any;
    }

    async getPastLogsChangedFallbackHandler (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { handler?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ChangedFallbackHandler'>>[]> {
        return await this.$getPastLogsParsed('ChangedFallbackHandler', options) as any;
    }

    async getPastLogsChangedGuard (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { guard?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ChangedGuard'>>[]> {
        return await this.$getPastLogsParsed('ChangedGuard', options) as any;
    }

    async getPastLogsChangedThreshold (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'ChangedThreshold'>>[]> {
        return await this.$getPastLogsParsed('ChangedThreshold', options) as any;
    }

    async getPastLogsDisabledModule (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { module?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'DisabledModule'>>[]> {
        return await this.$getPastLogsParsed('DisabledModule', options) as any;
    }

    async getPastLogsEnabledModule (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { module?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'EnabledModule'>>[]> {
        return await this.$getPastLogsParsed('EnabledModule', options) as any;
    }

    async getPastLogsExecutionFailure (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { txHash?: TEth.Hex }
    }): Promise<ITxLogItem<TEventParams<'ExecutionFailure'>>[]> {
        return await this.$getPastLogsParsed('ExecutionFailure', options) as any;
    }

    async getPastLogsExecutionFromModuleFailure (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { module?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ExecutionFromModuleFailure'>>[]> {
        return await this.$getPastLogsParsed('ExecutionFromModuleFailure', options) as any;
    }

    async getPastLogsExecutionFromModuleSuccess (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { module?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ExecutionFromModuleSuccess'>>[]> {
        return await this.$getPastLogsParsed('ExecutionFromModuleSuccess', options) as any;
    }

    async getPastLogsExecutionSuccess (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { txHash?: TEth.Hex }
    }): Promise<ITxLogItem<TEventParams<'ExecutionSuccess'>>[]> {
        return await this.$getPastLogsParsed('ExecutionSuccess', options) as any;
    }

    async getPastLogsRemovedOwner (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'RemovedOwner'>>[]> {
        return await this.$getPastLogsParsed('RemovedOwner', options) as any;
    }

    async getPastLogsSafeModuleTransaction (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'SafeModuleTransaction'>>[]> {
        return await this.$getPastLogsParsed('SafeModuleTransaction', options) as any;
    }

    async getPastLogsSafeMultiSigTransaction (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'SafeMultiSigTransaction'>>[]> {
        return await this.$getPastLogsParsed('SafeMultiSigTransaction', options) as any;
    }

    async getPastLogsSafeReceived (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'SafeReceived'>>[]> {
        return await this.$getPastLogsParsed('SafeReceived', options) as any;
    }

    async getPastLogsSafeSetup (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { initiator?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'SafeSetup'>>[]> {
        return await this.$getPastLogsParsed('SafeSetup', options) as any;
    }

    async getPastLogsSignMsg (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { msgHash?: TEth.Hex }
    }): Promise<ITxLogItem<TEventParams<'SignMsg'>>[]> {
        return await this.$getPastLogsParsed('SignMsg', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"AddedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"approvedHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"ApproveHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"handler","type":"address"}],"name":"ChangedFallbackHandler","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"guard","type":"address"}],"name":"ChangedGuard","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"threshold","type":"uint256"}],"name":"ChangedThreshold","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"DisabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"EnabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"RemovedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"module","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"SafeModuleTransaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"baseGas","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"gasPrice","type":"uint256"},{"indexed":false,"internalType":"address","name":"gasToken","type":"address"},{"indexed":false,"internalType":"address payable","name":"refundReceiver","type":"address"},{"indexed":false,"internalType":"bytes","name":"signatures","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"additionalInfo","type":"bytes"}],"name":"SafeMultiSigTransaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"SafeReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"initiator","type":"address"},{"indexed":false,"internalType":"address[]","name":"owners","type":"address[]"},{"indexed":false,"internalType":"uint256","name":"threshold","type":"uint256"},{"indexed":false,"internalType":"address","name":"initializer","type":"address"},{"indexed":false,"internalType":"address","name":"fallbackHandler","type":"address"}],"name":"SafeSetup","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"SignMsg","type":"event"},{"stateMutability":"nonpayable","type":"fallback"},{"inputs":[],"name":"VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"addOwnerWithThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hashToApprove","type":"bytes32"}],"name":"approveHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"approvedHashes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"changeThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"dataHash","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"bytes","name":"signatures","type":"bytes"},{"internalType":"uint256","name":"requiredSignatures","type":"uint256"}],"name":"checkNSignatures","outputs":[],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"dataHash","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"bytes","name":"signatures","type":"bytes"}],"name":"checkSignatures","outputs":[],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"prevModule","type":"address"},{"internalType":"address","name":"module","type":"address"}],"name":"disableModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"domainSeparator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"module","type":"address"}],"name":"enableModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"encodeTransactionData","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address payable","name":"refundReceiver","type":"address"},{"internalType":"bytes","name":"signatures","type":"bytes"}],"name":"execTransaction","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModule","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModuleReturnData","outputs":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"start","type":"address"},{"internalType":"uint256","name":"pageSize","type":"uint256"}],"name":"getModulesPaginated","outputs":[{"internalType":"address[]","name":"array","type":"address[]"},{"internalType":"address","name":"next","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwners","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"offset","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"}],"name":"getStorageAt","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"getTransactionHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"module","type":"address"}],"name":"isModuleEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"removeOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"handler","type":"address"}],"name":"setFallbackHandler","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"guard","type":"address"}],"name":"setGuard","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256","name":"_threshold","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"address","name":"fallbackHandler","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"payment","type":"uint256"},{"internalType":"address payable","name":"paymentReceiver","type":"address"}],"name":"setup","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"signedMessages","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"targetContract","type":"address"},{"internalType":"bytes","name":"calldataPayload","type":"bytes"}],"name":"simulateAndRevert","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"oldOwner","type":"address"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"swapOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TSafeL2Types = {
    Events: {
        AddedOwner: {
            outputParams: { owner: TAddress },
            outputArgs:   [ owner: TAddress ],
        }
        ApproveHash: {
            outputParams: { approvedHash: TEth.Hex, owner: TAddress },
            outputArgs:   [ approvedHash: TEth.Hex, owner: TAddress ],
        }
        ChangedFallbackHandler: {
            outputParams: { handler: TAddress },
            outputArgs:   [ handler: TAddress ],
        }
        ChangedGuard: {
            outputParams: { guard: TAddress },
            outputArgs:   [ guard: TAddress ],
        }
        ChangedThreshold: {
            outputParams: { threshold: bigint },
            outputArgs:   [ threshold: bigint ],
        }
        DisabledModule: {
            outputParams: { module: TAddress },
            outputArgs:   [ module: TAddress ],
        }
        EnabledModule: {
            outputParams: { module: TAddress },
            outputArgs:   [ module: TAddress ],
        }
        ExecutionFailure: {
            outputParams: { txHash: TEth.Hex, payment: bigint },
            outputArgs:   [ txHash: TEth.Hex, payment: bigint ],
        }
        ExecutionFromModuleFailure: {
            outputParams: { module: TAddress },
            outputArgs:   [ module: TAddress ],
        }
        ExecutionFromModuleSuccess: {
            outputParams: { module: TAddress },
            outputArgs:   [ module: TAddress ],
        }
        ExecutionSuccess: {
            outputParams: { txHash: TEth.Hex, payment: bigint },
            outputArgs:   [ txHash: TEth.Hex, payment: bigint ],
        }
        RemovedOwner: {
            outputParams: { owner: TAddress },
            outputArgs:   [ owner: TAddress ],
        }
        SafeModuleTransaction: {
            outputParams: { module: TAddress, to: TAddress, value: bigint, data: TEth.Hex, operation: number },
            outputArgs:   [ module: TAddress, to: TAddress, value: bigint, data: TEth.Hex, operation: number ],
        }
        SafeMultiSigTransaction: {
            outputParams: { to: TAddress, value: bigint, data: TEth.Hex, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TEth.Hex, additionalInfo: TEth.Hex },
            outputArgs:   [ to: TAddress, value: bigint, data: TEth.Hex, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TEth.Hex, additionalInfo: TEth.Hex ],
        }
        SafeReceived: {
            outputParams: { _sender: TAddress, value: bigint },
            outputArgs:   [ _sender: TAddress, value: bigint ],
        }
        SafeSetup: {
            outputParams: { initiator: TAddress, owners: TAddress[], threshold: bigint, initializer: TAddress, fallbackHandler: TAddress },
            outputArgs:   [ initiator: TAddress, owners: TAddress[], threshold: bigint, initializer: TAddress, fallbackHandler: TAddress ],
        }
        SignMsg: {
            outputParams: { msgHash: TEth.Hex },
            outputArgs:   [ msgHash: TEth.Hex ],
        }
    },
    Methods: {
        VERSION: {
          method: "VERSION"
          arguments: [  ]
        }
        addOwnerWithThreshold: {
          method: "addOwnerWithThreshold"
          arguments: [ owner: TAddress, _threshold: bigint ]
        }
        approveHash: {
          method: "approveHash"
          arguments: [ hashToApprove: TEth.Hex ]
        }
        approvedHashes: {
          method: "approvedHashes"
          arguments: [ input0: TAddress, input1: TEth.Hex ]
        }
        changeThreshold: {
          method: "changeThreshold"
          arguments: [ _threshold: bigint ]
        }
        checkNSignatures: {
          method: "checkNSignatures"
          arguments: [ dataHash: TEth.Hex, data: TEth.Hex, signatures: TEth.Hex, requiredSignatures: bigint ]
        }
        checkSignatures: {
          method: "checkSignatures"
          arguments: [ dataHash: TEth.Hex, data: TEth.Hex, signatures: TEth.Hex ]
        }
        disableModule: {
          method: "disableModule"
          arguments: [ prevModule: TAddress, module: TAddress ]
        }
        domainSeparator: {
          method: "domainSeparator"
          arguments: [  ]
        }
        enableModule: {
          method: "enableModule"
          arguments: [ module: TAddress ]
        }
        encodeTransactionData: {
          method: "encodeTransactionData"
          arguments: [ to: TAddress, value: bigint, data: TEth.Hex, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, _nonce: bigint ]
        }
        execTransaction: {
          method: "execTransaction"
          arguments: [ to: TAddress, value: bigint, data: TEth.Hex, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TEth.Hex ]
        }
        execTransactionFromModule: {
          method: "execTransactionFromModule"
          arguments: [ to: TAddress, value: bigint, data: TEth.Hex, operation: number ]
        }
        execTransactionFromModuleReturnData: {
          method: "execTransactionFromModuleReturnData"
          arguments: [ to: TAddress, value: bigint, data: TEth.Hex, operation: number ]
        }
        getChainId: {
          method: "getChainId"
          arguments: [  ]
        }
        getModulesPaginated: {
          method: "getModulesPaginated"
          arguments: [ start: TAddress, pageSize: bigint ]
        }
        getOwners: {
          method: "getOwners"
          arguments: [  ]
        }
        getStorageAt: {
          method: "getStorageAt"
          arguments: [ offset: bigint, length: bigint ]
        }
        getThreshold: {
          method: "getThreshold"
          arguments: [  ]
        }
        getTransactionHash: {
          method: "getTransactionHash"
          arguments: [ to: TAddress, value: bigint, data: TEth.Hex, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, _nonce: bigint ]
        }
        isModuleEnabled: {
          method: "isModuleEnabled"
          arguments: [ module: TAddress ]
        }
        isOwner: {
          method: "isOwner"
          arguments: [ owner: TAddress ]
        }
        nonce: {
          method: "nonce"
          arguments: [  ]
        }
        removeOwner: {
          method: "removeOwner"
          arguments: [ prevOwner: TAddress, owner: TAddress, _threshold: bigint ]
        }
        setFallbackHandler: {
          method: "setFallbackHandler"
          arguments: [ handler: TAddress ]
        }
        setGuard: {
          method: "setGuard"
          arguments: [ guard: TAddress ]
        }
        setup: {
          method: "setup"
          arguments: [ _owners: TAddress[], _threshold: bigint, to: TAddress, data: TEth.Hex, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress ]
        }
        signedMessages: {
          method: "signedMessages"
          arguments: [ input0: TEth.Hex ]
        }
        simulateAndRevert: {
          method: "simulateAndRevert"
          arguments: [ targetContract: TAddress, calldataPayload: TEth.Hex ]
        }
        swapOwner: {
          method: "swapOwner"
          arguments: [ prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress ]
        }
    }
}



interface ISafeL2TxCaller {
    addOwnerWithThreshold (sender: TSender, owner: TAddress, _threshold: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    approveHash (sender: TSender, hashToApprove: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    changeThreshold (sender: TSender, _threshold: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    disableModule (sender: TSender, prevModule: TAddress, module: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    enableModule (sender: TSender, module: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execTransaction (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execTransactionFromModule (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execTransactionFromModuleReturnData (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    removeOwner (sender: TSender, prevOwner: TAddress, owner: TAddress, _threshold: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setFallbackHandler (sender: TSender, handler: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setGuard (sender: TSender, guard: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setup (sender: TSender, _owners: TAddress[], _threshold: bigint, to: TAddress, data: TEth.Hex, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    simulateAndRevert (sender: TSender, targetContract: TAddress, calldataPayload: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swapOwner (sender: TSender, prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface ISafeL2TxData {
    addOwnerWithThreshold (sender: TSender, owner: TAddress, _threshold: bigint): Promise<TEth.TxLike>
    approveHash (sender: TSender, hashToApprove: TEth.Hex): Promise<TEth.TxLike>
    changeThreshold (sender: TSender, _threshold: bigint): Promise<TEth.TxLike>
    disableModule (sender: TSender, prevModule: TAddress, module: TAddress): Promise<TEth.TxLike>
    enableModule (sender: TSender, module: TAddress): Promise<TEth.TxLike>
    execTransaction (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TEth.Hex): Promise<TEth.TxLike>
    execTransactionFromModule (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number): Promise<TEth.TxLike>
    execTransactionFromModuleReturnData (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number): Promise<TEth.TxLike>
    removeOwner (sender: TSender, prevOwner: TAddress, owner: TAddress, _threshold: bigint): Promise<TEth.TxLike>
    setFallbackHandler (sender: TSender, handler: TAddress): Promise<TEth.TxLike>
    setGuard (sender: TSender, guard: TAddress): Promise<TEth.TxLike>
    setup (sender: TSender, _owners: TAddress[], _threshold: bigint, to: TAddress, data: TEth.Hex, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress): Promise<TEth.TxLike>
    simulateAndRevert (sender: TSender, targetContract: TAddress, calldataPayload: TEth.Hex): Promise<TEth.TxLike>
    swapOwner (sender: TSender, prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress): Promise<TEth.TxLike>
}


type TEvents = TSafeL2Types['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
