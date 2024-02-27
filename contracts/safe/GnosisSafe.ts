/**
 *  AUTO-Generated Class: 2024-02-27 16:48
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



export class GnosisSafe extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    $meta = {
        "class": "./contracts/safe/GnosisSafe.ts"
    }

    async $constructor (deployer: TSender, ): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
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
    async approveHash (sender: TSender, hashToApprove: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approveHash'), sender, hashToApprove);
    }

    // 0x7d832974
    async approvedHashes (input0: TAddress, input1: TEth.Hex): Promise<bigint> {
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

    // 0x0a1028c4
    async getMessageHash (message: TEth.Hex): Promise<TEth.Hex> {
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
    async getTransactionHash (to: TAddress, value: bigint, data: TEth.Hex, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, _nonce: bigint): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'getTransactionHash'), to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, _nonce);
    }

    // 0x2f54bf6e
    async isOwner (owner: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isOwner'), owner);
    }

    // 0x20c13b0b
    async isValidSignature (sender: TSender, _data: TEth.Hex, _signature: TEth.Hex): Promise<TxWriter> {
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
    async requiredTxGas (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'requiredTxGas'), sender, to, value, data, operation);
    }

    // 0xf08a0323
    async setFallbackHandler (sender: TSender, handler: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setFallbackHandler'), sender, handler);
    }

    // 0xb63e800d
    async setup (sender: TSender, _owners: TAddress[], _threshold: bigint, to: TAddress, data: TEth.Hex, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setup'), sender, _owners, _threshold, to, data, fallbackHandler, paymentToken, payment, paymentReceiver);
    }

    // 0x85a5affe
    async signMessage (sender: TSender, _data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'signMessage'), sender, _data);
    }

    // 0x5ae6bd37
    async signedMessages (input0: TEth.Hex): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'signedMessages'), input0);
    }

    // 0xe318b52b
    async swapOwner (sender: TSender, prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swapOwner'), sender, prevOwner, oldOwner, newOwner);
    }

    $call () {
        return super.$call() as IGnosisSafeTxCaller;
    }
    $signed (): TOverrideReturns<IGnosisSafeTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IGnosisSafeTxData {
        return super.$data() as IGnosisSafeTxData;
    }
    $gas (): TOverrideReturns<IGnosisSafeTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TGnosisSafeTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TGnosisSafeTypes['Methods'][TMethod]['arguments']
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
        return await this.$getPastLogsParsed(mix, options) as any;
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

    extractLogsAddedOwner (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'AddedOwner'>>[] {
        let abi = this.$getAbiItem('event', 'AddedOwner');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'AddedOwner'>>[];
    }

    extractLogsApproveHash (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ApproveHash'>>[] {
        let abi = this.$getAbiItem('event', 'ApproveHash');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ApproveHash'>>[];
    }

    extractLogsChangedMasterCopy (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ChangedMasterCopy'>>[] {
        let abi = this.$getAbiItem('event', 'ChangedMasterCopy');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ChangedMasterCopy'>>[];
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

    extractLogsSignMsg (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'SignMsg'>>[] {
        let abi = this.$getAbiItem('event', 'SignMsg');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'SignMsg'>>[];
    }

    async getPastLogsAddedOwner (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
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

    async getPastLogsChangedMasterCopy (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'ChangedMasterCopy'>>[]> {
        return await this.$getPastLogsParsed('ChangedMasterCopy', options) as any;
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
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'DisabledModule'>>[]> {
        return await this.$getPastLogsParsed('DisabledModule', options) as any;
    }

    async getPastLogsEnabledModule (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'EnabledModule'>>[]> {
        return await this.$getPastLogsParsed('EnabledModule', options) as any;
    }

    async getPastLogsExecutionFailure (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
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
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'ExecutionSuccess'>>[]> {
        return await this.$getPastLogsParsed('ExecutionSuccess', options) as any;
    }

    async getPastLogsRemovedOwner (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'RemovedOwner'>>[]> {
        return await this.$getPastLogsParsed('RemovedOwner', options) as any;
    }

    async getPastLogsSignMsg (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { msgHash?: TEth.Hex }
    }): Promise<ITxLogItem<TEventParams<'SignMsg'>>[]> {
        return await this.$getPastLogsParsed('SignMsg', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"AddedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"approvedHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"ApproveHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"masterCopy","type":"address"}],"name":"ChangedMasterCopy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"threshold","type":"uint256"}],"name":"ChangedThreshold","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract Module","name":"module","type":"address"}],"name":"DisabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract Module","name":"module","type":"address"}],"name":"EnabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"RemovedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"SignMsg","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"NAME","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"addOwnerWithThreshold","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"hashToApprove","type":"bytes32"}],"name":"approveHash","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"approvedHashes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_masterCopy","type":"address"}],"name":"changeMasterCopy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"changeThreshold","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract Module","name":"prevModule","type":"address"},{"internalType":"contract Module","name":"module","type":"address"}],"name":"disableModule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"domainSeparator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"contract Module","name":"module","type":"address"}],"name":"enableModule","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"encodeTransactionData","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address payable","name":"refundReceiver","type":"address"},{"internalType":"bytes","name":"signatures","type":"bytes"}],"name":"execTransaction","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModule","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModuleReturnData","outputs":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes","name":"message","type":"bytes"}],"name":"getMessageHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getModules","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"start","type":"address"},{"internalType":"uint256","name":"pageSize","type":"uint256"}],"name":"getModulesPaginated","outputs":[{"internalType":"address[]","name":"array","type":"address[]"},{"internalType":"address","name":"next","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOwners","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"getTransactionHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"bytes","name":"_signature","type":"bytes"}],"name":"isValidSignature","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"removeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"requiredTxGas","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"handler","type":"address"}],"name":"setFallbackHandler","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256","name":"_threshold","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"address","name":"fallbackHandler","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"payment","type":"uint256"},{"internalType":"address payable","name":"paymentReceiver","type":"address"}],"name":"setup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"signMessage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"signedMessages","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"oldOwner","type":"address"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"swapOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TGnosisSafeTypes = {
    Events: {
        AddedOwner: {
            outputParams: { owner: TAddress },
            outputArgs:   [ owner: TAddress ],
        }
        ApproveHash: {
            outputParams: { approvedHash: TEth.Hex, owner: TAddress },
            outputArgs:   [ approvedHash: TEth.Hex, owner: TAddress ],
        }
        ChangedMasterCopy: {
            outputParams: { masterCopy: TAddress },
            outputArgs:   [ masterCopy: TAddress ],
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
        SignMsg: {
            outputParams: { msgHash: TEth.Hex },
            outputArgs:   [ msgHash: TEth.Hex ],
        }
    },
    Methods: {
        NAME: {
          method: "NAME"
          arguments: [  ]
        }
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
        changeMasterCopy: {
          method: "changeMasterCopy"
          arguments: [ _masterCopy: TAddress ]
        }
        changeThreshold: {
          method: "changeThreshold"
          arguments: [ _threshold: bigint ]
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
        getMessageHash: {
          method: "getMessageHash"
          arguments: [ message: TEth.Hex ]
        }
        getModules: {
          method: "getModules"
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
        getThreshold: {
          method: "getThreshold"
          arguments: [  ]
        }
        getTransactionHash: {
          method: "getTransactionHash"
          arguments: [ to: TAddress, value: bigint, data: TEth.Hex, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, _nonce: bigint ]
        }
        isOwner: {
          method: "isOwner"
          arguments: [ owner: TAddress ]
        }
        isValidSignature: {
          method: "isValidSignature"
          arguments: [ _data: TEth.Hex, _signature: TEth.Hex ]
        }
        nonce: {
          method: "nonce"
          arguments: [  ]
        }
        removeOwner: {
          method: "removeOwner"
          arguments: [ prevOwner: TAddress, owner: TAddress, _threshold: bigint ]
        }
        requiredTxGas: {
          method: "requiredTxGas"
          arguments: [ to: TAddress, value: bigint, data: TEth.Hex, operation: number ]
        }
        setFallbackHandler: {
          method: "setFallbackHandler"
          arguments: [ handler: TAddress ]
        }
        setup: {
          method: "setup"
          arguments: [ _owners: TAddress[], _threshold: bigint, to: TAddress, data: TEth.Hex, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress ]
        }
        signMessage: {
          method: "signMessage"
          arguments: [ _data: TEth.Hex ]
        }
        signedMessages: {
          method: "signedMessages"
          arguments: [ input0: TEth.Hex ]
        }
        swapOwner: {
          method: "swapOwner"
          arguments: [ prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress ]
        }
    }
}



interface IGnosisSafeTxCaller {
    addOwnerWithThreshold (sender: TSender, owner: TAddress, _threshold: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    approveHash (sender: TSender, hashToApprove: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    changeMasterCopy (sender: TSender, _masterCopy: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    changeThreshold (sender: TSender, _threshold: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    disableModule (sender: TSender, prevModule: TAddress, module: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    enableModule (sender: TSender, module: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execTransaction (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execTransactionFromModule (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execTransactionFromModuleReturnData (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    isValidSignature (sender: TSender, _data: TEth.Hex, _signature: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    removeOwner (sender: TSender, prevOwner: TAddress, owner: TAddress, _threshold: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    requiredTxGas (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setFallbackHandler (sender: TSender, handler: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setup (sender: TSender, _owners: TAddress[], _threshold: bigint, to: TAddress, data: TEth.Hex, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    signMessage (sender: TSender, _data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swapOwner (sender: TSender, prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IGnosisSafeTxData {
    addOwnerWithThreshold (sender: TSender, owner: TAddress, _threshold: bigint): Promise<TEth.TxLike>
    approveHash (sender: TSender, hashToApprove: TEth.Hex): Promise<TEth.TxLike>
    changeMasterCopy (sender: TSender, _masterCopy: TAddress): Promise<TEth.TxLike>
    changeThreshold (sender: TSender, _threshold: bigint): Promise<TEth.TxLike>
    disableModule (sender: TSender, prevModule: TAddress, module: TAddress): Promise<TEth.TxLike>
    enableModule (sender: TSender, module: TAddress): Promise<TEth.TxLike>
    execTransaction (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number, safeTxGas: bigint, baseGas: bigint, gasPrice: bigint, gasToken: TAddress, refundReceiver: TAddress, signatures: TEth.Hex): Promise<TEth.TxLike>
    execTransactionFromModule (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number): Promise<TEth.TxLike>
    execTransactionFromModuleReturnData (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number): Promise<TEth.TxLike>
    isValidSignature (sender: TSender, _data: TEth.Hex, _signature: TEth.Hex): Promise<TEth.TxLike>
    removeOwner (sender: TSender, prevOwner: TAddress, owner: TAddress, _threshold: bigint): Promise<TEth.TxLike>
    requiredTxGas (sender: TSender, to: TAddress, value: bigint, data: TEth.Hex, operation: number): Promise<TEth.TxLike>
    setFallbackHandler (sender: TSender, handler: TAddress): Promise<TEth.TxLike>
    setup (sender: TSender, _owners: TAddress[], _threshold: bigint, to: TAddress, data: TEth.Hex, fallbackHandler: TAddress, paymentToken: TAddress, payment: bigint, paymentReceiver: TAddress): Promise<TEth.TxLike>
    signMessage (sender: TSender, _data: TEth.Hex): Promise<TEth.TxLike>
    swapOwner (sender: TSender, prevOwner: TAddress, oldOwner: TAddress, newOwner: TAddress): Promise<TEth.TxLike>
}


type TEvents = TGnosisSafeTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
