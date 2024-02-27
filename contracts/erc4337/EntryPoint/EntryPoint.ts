/**
 *  AUTO-Generated Class: 2024-02-27 16:48
 *  Implementation: https://etherscan.io/address/0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789#code
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

export namespace EntryPointErrors {
    export interface ExecutionResult {
        type: 'ExecutionResult'
        params: {
            preOpGas: bigint
            paid: bigint
            validAfter: number
            validUntil: number
            targetSuccess: boolean
            targetResult: TEth.Hex
        }
    }
    export interface FailedOp {
        type: 'FailedOp'
        params: {
            opIndex: bigint
            reason: string
        }
    }
    export interface SenderAddressResult {
        type: 'SenderAddressResult'
        params: {
            sender: TAddress
        }
    }
    export interface SignatureValidationFailed {
        type: 'SignatureValidationFailed'
        params: {
            aggregator: TAddress
        }
    }
    export interface ValidationResult {
        type: 'ValidationResult'
        params: {
            returnInfo: { preOpGas: bigint, prefund: bigint, sigFailed: boolean, validAfter: number, validUntil: number, paymasterContext: TEth.Hex }
            senderInfo: { stake: bigint, unstakeDelaySec: bigint }
            factoryInfo: { stake: bigint, unstakeDelaySec: bigint }
            paymasterInfo: { stake: bigint, unstakeDelaySec: bigint }
        }
    }
    export interface ValidationResultWithAggregation {
        type: 'ValidationResultWithAggregation'
        params: {
            returnInfo: { preOpGas: bigint, prefund: bigint, sigFailed: boolean, validAfter: number, validUntil: number, paymasterContext: TEth.Hex }
            senderInfo: { stake: bigint, unstakeDelaySec: bigint }
            factoryInfo: { stake: bigint, unstakeDelaySec: bigint }
            paymasterInfo: { stake: bigint, unstakeDelaySec: bigint }
            aggregatorInfo: { aggregator: TAddress, stakeInfo: { stake: bigint, unstakeDelaySec: bigint } }
        }
    }
    export type Error = ExecutionResult | FailedOp | SenderAddressResult | SignatureValidationFailed | ValidationResult | ValidationResultWithAggregation
}

export class EntryPoint extends ContractBase {
    constructor(
        public address: TEth.Address = '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new EntryPointStorageReader(this.address, this.client, this.explorer);
    }

    $meta = {
        "class": "./contracts/erc4337/EntryPoint/EntryPoint.ts"
    }

    // 0x8f41ec5a
    async SIG_VALIDATION_FAILED (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'SIG_VALIDATION_FAILED'));
    }

    // 0x957122ab
    async _validateSenderAndPaymaster (initCode: TEth.Hex, _sender: TAddress, paymasterAndData: TEth.Hex): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', '_validateSenderAndPaymaster'), initCode, _sender, paymasterAndData);
    }

    // 0x0396cb60
    async addStake (sender: TSender, unstakeDelaySec: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'addStake'), sender, unstakeDelaySec);
    }

    // 0x70a08231
    async balanceOf (account: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'balanceOf'), account);
    }

    // 0xb760faf9
    async depositTo (sender: TSender, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'depositTo'), sender, account);
    }

    // 0xfc7e286d
    async deposits (input0: TAddress): Promise<{ deposit: bigint, staked: boolean, stake: bigint, unstakeDelaySec: number, withdrawTime: number }> {
        return this.$read(this.$getAbiItem('function', 'deposits'), input0);
    }

    // 0x5287ce12
    async getDepositInfo (account: TAddress): Promise<{ deposit: bigint, staked: boolean, stake: bigint, unstakeDelaySec: number, withdrawTime: number }> {
        return this.$read(this.$getAbiItem('function', 'getDepositInfo'), account);
    }

    // 0x35567e1a
    async getNonce (_sender: TAddress, key: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getNonce'), _sender, key);
    }

    // 0x9b249f69
    async getSenderAddress (sender: TSender, initCode: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'getSenderAddress'), sender, initCode);
    }

    // 0xa6193531
    async getUserOpHash (userOp: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'getUserOpHash'), userOp);
    }

    // 0x4b1d7cf5
    async handleAggregatedOps (sender: TSender, opsPerAggregator: { userOps: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }[], aggregator: TAddress, signature: TEth.Hex }[], beneficiary: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'handleAggregatedOps'), sender, opsPerAggregator, beneficiary);
    }

    // 0x1fad948c
    async handleOps (sender: TSender, ops: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }[], beneficiary: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'handleOps'), sender, ops, beneficiary);
    }

    // 0x0bd28e3b
    async incrementNonce (sender: TSender, key: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'incrementNonce'), sender, key);
    }

    // 0x1d732756
    async innerHandleOp (sender: TSender, callData: TEth.Hex, opInfo: { mUserOp: { sender: TAddress, nonce: bigint, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, paymaster: TAddress, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint }, userOpHash: TEth.Hex, prefund: bigint, contextOffset: bigint, preOpGas: bigint }, context: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'innerHandleOp'), sender, callData, opInfo, context);
    }

    // 0x1b2e01b8
    async nonceSequenceNumber (input0: TAddress, input1: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'nonceSequenceNumber'), input0, input1);
    }

    // 0xd6383f94
    async simulateHandleOp (sender: TSender, op: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }, target: TAddress, targetCallData: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'simulateHandleOp'), sender, op, target, targetCallData);
    }

    // 0xee219423
    async simulateValidation (sender: TSender, userOp: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'simulateValidation'), sender, userOp);
    }

    // 0xbb9fe6bf
    async unlockStake (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'unlockStake'), sender);
    }

    // 0xc23a5cea
    async withdrawStake (sender: TSender, withdrawAddress: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdrawStake'), sender, withdrawAddress);
    }

    // 0x205c2878
    async withdrawTo (sender: TSender, withdrawAddress: TAddress, withdrawAmount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdrawTo'), sender, withdrawAddress, withdrawAmount);
    }

    $call () {
        return super.$call() as IEntryPointTxCaller;
    }
    $signed (): TOverrideReturns<IEntryPointTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IEntryPointTxData {
        return super.$data() as IEntryPointTxData;
    }
    $gas (): TOverrideReturns<IEntryPointTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TEntryPointTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TEntryPointTypes['Methods'][TMethod]['arguments']
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

    onAccountDeployed (fn?: (event: TClientEventsStreamData<TLogAccountDeployedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogAccountDeployedParameters>> {
        return this.$onLog('AccountDeployed', fn);
    }

    onBeforeExecution (fn?: (event: TClientEventsStreamData<TLogBeforeExecutionParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogBeforeExecutionParameters>> {
        return this.$onLog('BeforeExecution', fn);
    }

    onDeposited (fn?: (event: TClientEventsStreamData<TLogDepositedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDepositedParameters>> {
        return this.$onLog('Deposited', fn);
    }

    onSignatureAggregatorChanged (fn?: (event: TClientEventsStreamData<TLogSignatureAggregatorChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogSignatureAggregatorChangedParameters>> {
        return this.$onLog('SignatureAggregatorChanged', fn);
    }

    onStakeLocked (fn?: (event: TClientEventsStreamData<TLogStakeLockedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogStakeLockedParameters>> {
        return this.$onLog('StakeLocked', fn);
    }

    onStakeUnlocked (fn?: (event: TClientEventsStreamData<TLogStakeUnlockedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogStakeUnlockedParameters>> {
        return this.$onLog('StakeUnlocked', fn);
    }

    onStakeWithdrawn (fn?: (event: TClientEventsStreamData<TLogStakeWithdrawnParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogStakeWithdrawnParameters>> {
        return this.$onLog('StakeWithdrawn', fn);
    }

    onUserOperationEvent (fn?: (event: TClientEventsStreamData<TLogUserOperationEventParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogUserOperationEventParameters>> {
        return this.$onLog('UserOperationEvent', fn);
    }

    onUserOperationRevertReason (fn?: (event: TClientEventsStreamData<TLogUserOperationRevertReasonParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogUserOperationRevertReasonParameters>> {
        return this.$onLog('UserOperationRevertReason', fn);
    }

    onWithdrawn (fn?: (event: TClientEventsStreamData<TLogWithdrawnParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogWithdrawnParameters>> {
        return this.$onLog('Withdrawn', fn);
    }

    extractLogsAccountDeployed (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'AccountDeployed'>>[] {
        let abi = this.$getAbiItem('event', 'AccountDeployed');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'AccountDeployed'>>[];
    }

    extractLogsBeforeExecution (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'BeforeExecution'>>[] {
        let abi = this.$getAbiItem('event', 'BeforeExecution');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'BeforeExecution'>>[];
    }

    extractLogsDeposited (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Deposited'>>[] {
        let abi = this.$getAbiItem('event', 'Deposited');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Deposited'>>[];
    }

    extractLogsSignatureAggregatorChanged (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'SignatureAggregatorChanged'>>[] {
        let abi = this.$getAbiItem('event', 'SignatureAggregatorChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'SignatureAggregatorChanged'>>[];
    }

    extractLogsStakeLocked (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'StakeLocked'>>[] {
        let abi = this.$getAbiItem('event', 'StakeLocked');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'StakeLocked'>>[];
    }

    extractLogsStakeUnlocked (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'StakeUnlocked'>>[] {
        let abi = this.$getAbiItem('event', 'StakeUnlocked');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'StakeUnlocked'>>[];
    }

    extractLogsStakeWithdrawn (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'StakeWithdrawn'>>[] {
        let abi = this.$getAbiItem('event', 'StakeWithdrawn');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'StakeWithdrawn'>>[];
    }

    extractLogsUserOperationEvent (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'UserOperationEvent'>>[] {
        let abi = this.$getAbiItem('event', 'UserOperationEvent');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'UserOperationEvent'>>[];
    }

    extractLogsUserOperationRevertReason (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'UserOperationRevertReason'>>[] {
        let abi = this.$getAbiItem('event', 'UserOperationRevertReason');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'UserOperationRevertReason'>>[];
    }

    extractLogsWithdrawn (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Withdrawn'>>[] {
        let abi = this.$getAbiItem('event', 'Withdrawn');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Withdrawn'>>[];
    }

    async getPastLogsAccountDeployed (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { userOpHash?: TEth.Hex,sender?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'AccountDeployed'>>[]> {
        return await this.$getPastLogsParsed('AccountDeployed', options) as any;
    }

    async getPastLogsBeforeExecution (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'BeforeExecution'>>[]> {
        return await this.$getPastLogsParsed('BeforeExecution', options) as any;
    }

    async getPastLogsDeposited (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { account?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Deposited'>>[]> {
        return await this.$getPastLogsParsed('Deposited', options) as any;
    }

    async getPastLogsSignatureAggregatorChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { aggregator?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'SignatureAggregatorChanged'>>[]> {
        return await this.$getPastLogsParsed('SignatureAggregatorChanged', options) as any;
    }

    async getPastLogsStakeLocked (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { account?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'StakeLocked'>>[]> {
        return await this.$getPastLogsParsed('StakeLocked', options) as any;
    }

    async getPastLogsStakeUnlocked (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { account?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'StakeUnlocked'>>[]> {
        return await this.$getPastLogsParsed('StakeUnlocked', options) as any;
    }

    async getPastLogsStakeWithdrawn (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { account?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'StakeWithdrawn'>>[]> {
        return await this.$getPastLogsParsed('StakeWithdrawn', options) as any;
    }

    async getPastLogsUserOperationEvent (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { userOpHash?: TEth.Hex,sender?: TAddress,paymaster?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'UserOperationEvent'>>[]> {
        return await this.$getPastLogsParsed('UserOperationEvent', options) as any;
    }

    async getPastLogsUserOperationRevertReason (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { userOpHash?: TEth.Hex,sender?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'UserOperationRevertReason'>>[]> {
        return await this.$getPastLogsParsed('UserOperationRevertReason', options) as any;
    }

    async getPastLogsWithdrawn (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { account?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Withdrawn'>>[]> {
        return await this.$getPastLogsParsed('Withdrawn', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"uint256","name":"preOpGas","type":"uint256"},{"internalType":"uint256","name":"paid","type":"uint256"},{"internalType":"uint48","name":"validAfter","type":"uint48"},{"internalType":"uint48","name":"validUntil","type":"uint48"},{"internalType":"bool","name":"targetSuccess","type":"bool"},{"internalType":"bytes","name":"targetResult","type":"bytes"}],"name":"ExecutionResult","type":"error"},{"inputs":[{"internalType":"uint256","name":"opIndex","type":"uint256"},{"internalType":"string","name":"reason","type":"string"}],"name":"FailedOp","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"SenderAddressResult","type":"error"},{"inputs":[{"internalType":"address","name":"aggregator","type":"address"}],"name":"SignatureValidationFailed","type":"error"},{"inputs":[{"components":[{"internalType":"uint256","name":"preOpGas","type":"uint256"},{"internalType":"uint256","name":"prefund","type":"uint256"},{"internalType":"bool","name":"sigFailed","type":"bool"},{"internalType":"uint48","name":"validAfter","type":"uint48"},{"internalType":"uint48","name":"validUntil","type":"uint48"},{"internalType":"bytes","name":"paymasterContext","type":"bytes"}],"internalType":"struct IEntryPoint.ReturnInfo","name":"returnInfo","type":"tuple"},{"components":[{"internalType":"uint256","name":"stake","type":"uint256"},{"internalType":"uint256","name":"unstakeDelaySec","type":"uint256"}],"internalType":"struct IStakeManager.StakeInfo","name":"senderInfo","type":"tuple"},{"components":[{"internalType":"uint256","name":"stake","type":"uint256"},{"internalType":"uint256","name":"unstakeDelaySec","type":"uint256"}],"internalType":"struct IStakeManager.StakeInfo","name":"factoryInfo","type":"tuple"},{"components":[{"internalType":"uint256","name":"stake","type":"uint256"},{"internalType":"uint256","name":"unstakeDelaySec","type":"uint256"}],"internalType":"struct IStakeManager.StakeInfo","name":"paymasterInfo","type":"tuple"}],"name":"ValidationResult","type":"error"},{"inputs":[{"components":[{"internalType":"uint256","name":"preOpGas","type":"uint256"},{"internalType":"uint256","name":"prefund","type":"uint256"},{"internalType":"bool","name":"sigFailed","type":"bool"},{"internalType":"uint48","name":"validAfter","type":"uint48"},{"internalType":"uint48","name":"validUntil","type":"uint48"},{"internalType":"bytes","name":"paymasterContext","type":"bytes"}],"internalType":"struct IEntryPoint.ReturnInfo","name":"returnInfo","type":"tuple"},{"components":[{"internalType":"uint256","name":"stake","type":"uint256"},{"internalType":"uint256","name":"unstakeDelaySec","type":"uint256"}],"internalType":"struct IStakeManager.StakeInfo","name":"senderInfo","type":"tuple"},{"components":[{"internalType":"uint256","name":"stake","type":"uint256"},{"internalType":"uint256","name":"unstakeDelaySec","type":"uint256"}],"internalType":"struct IStakeManager.StakeInfo","name":"factoryInfo","type":"tuple"},{"components":[{"internalType":"uint256","name":"stake","type":"uint256"},{"internalType":"uint256","name":"unstakeDelaySec","type":"uint256"}],"internalType":"struct IStakeManager.StakeInfo","name":"paymasterInfo","type":"tuple"},{"components":[{"internalType":"address","name":"aggregator","type":"address"},{"components":[{"internalType":"uint256","name":"stake","type":"uint256"},{"internalType":"uint256","name":"unstakeDelaySec","type":"uint256"}],"internalType":"struct IStakeManager.StakeInfo","name":"stakeInfo","type":"tuple"}],"internalType":"struct IEntryPoint.AggregatorStakeInfo","name":"aggregatorInfo","type":"tuple"}],"name":"ValidationResultWithAggregation","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"userOpHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"address","name":"factory","type":"address"},{"indexed":false,"internalType":"address","name":"paymaster","type":"address"}],"name":"AccountDeployed","type":"event"},{"anonymous":false,"inputs":[],"name":"BeforeExecution","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"totalDeposit","type":"uint256"}],"name":"Deposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"aggregator","type":"address"}],"name":"SignatureAggregatorChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"totalStaked","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"unstakeDelaySec","type":"uint256"}],"name":"StakeLocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"withdrawTime","type":"uint256"}],"name":"StakeUnlocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"address","name":"withdrawAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"StakeWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"userOpHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"paymaster","type":"address"},{"indexed":false,"internalType":"uint256","name":"nonce","type":"uint256"},{"indexed":false,"internalType":"bool","name":"success","type":"bool"},{"indexed":false,"internalType":"uint256","name":"actualGasCost","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"actualGasUsed","type":"uint256"}],"name":"UserOperationEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"userOpHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"nonce","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"revertReason","type":"bytes"}],"name":"UserOperationRevertReason","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"address","name":"withdrawAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"inputs":[],"name":"SIG_VALIDATION_FAILED","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"initCode","type":"bytes"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"bytes","name":"paymasterAndData","type":"bytes"}],"name":"_validateSenderAndPaymaster","outputs":[],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"unstakeDelaySec","type":"uint32"}],"name":"addStake","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"depositTo","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"deposits","outputs":[{"internalType":"uint112","name":"deposit","type":"uint112"},{"internalType":"bool","name":"staked","type":"bool"},{"internalType":"uint112","name":"stake","type":"uint112"},{"internalType":"uint32","name":"unstakeDelaySec","type":"uint32"},{"internalType":"uint48","name":"withdrawTime","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getDepositInfo","outputs":[{"components":[{"internalType":"uint112","name":"deposit","type":"uint112"},{"internalType":"bool","name":"staked","type":"bool"},{"internalType":"uint112","name":"stake","type":"uint112"},{"internalType":"uint32","name":"unstakeDelaySec","type":"uint32"},{"internalType":"uint48","name":"withdrawTime","type":"uint48"}],"internalType":"struct IStakeManager.DepositInfo","name":"info","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint192","name":"key","type":"uint192"}],"name":"getNonce","outputs":[{"internalType":"uint256","name":"nonce","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"initCode","type":"bytes"}],"name":"getSenderAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"initCode","type":"bytes"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"uint256","name":"callGasLimit","type":"uint256"},{"internalType":"uint256","name":"verificationGasLimit","type":"uint256"},{"internalType":"uint256","name":"preVerificationGas","type":"uint256"},{"internalType":"uint256","name":"maxFeePerGas","type":"uint256"},{"internalType":"uint256","name":"maxPriorityFeePerGas","type":"uint256"},{"internalType":"bytes","name":"paymasterAndData","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"struct UserOperation","name":"userOp","type":"tuple"}],"name":"getUserOpHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"initCode","type":"bytes"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"uint256","name":"callGasLimit","type":"uint256"},{"internalType":"uint256","name":"verificationGasLimit","type":"uint256"},{"internalType":"uint256","name":"preVerificationGas","type":"uint256"},{"internalType":"uint256","name":"maxFeePerGas","type":"uint256"},{"internalType":"uint256","name":"maxPriorityFeePerGas","type":"uint256"},{"internalType":"bytes","name":"paymasterAndData","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"struct UserOperation[]","name":"userOps","type":"tuple[]"},{"internalType":"contract IAggregator","name":"aggregator","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"struct IEntryPoint.UserOpsPerAggregator[]","name":"opsPerAggregator","type":"tuple[]"},{"internalType":"address payable","name":"beneficiary","type":"address"}],"name":"handleAggregatedOps","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"initCode","type":"bytes"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"uint256","name":"callGasLimit","type":"uint256"},{"internalType":"uint256","name":"verificationGasLimit","type":"uint256"},{"internalType":"uint256","name":"preVerificationGas","type":"uint256"},{"internalType":"uint256","name":"maxFeePerGas","type":"uint256"},{"internalType":"uint256","name":"maxPriorityFeePerGas","type":"uint256"},{"internalType":"bytes","name":"paymasterAndData","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"struct UserOperation[]","name":"ops","type":"tuple[]"},{"internalType":"address payable","name":"beneficiary","type":"address"}],"name":"handleOps","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint192","name":"key","type":"uint192"}],"name":"incrementNonce","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"callData","type":"bytes"},{"components":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"callGasLimit","type":"uint256"},{"internalType":"uint256","name":"verificationGasLimit","type":"uint256"},{"internalType":"uint256","name":"preVerificationGas","type":"uint256"},{"internalType":"address","name":"paymaster","type":"address"},{"internalType":"uint256","name":"maxFeePerGas","type":"uint256"},{"internalType":"uint256","name":"maxPriorityFeePerGas","type":"uint256"}],"internalType":"struct EntryPoint.MemoryUserOp","name":"mUserOp","type":"tuple"},{"internalType":"bytes32","name":"userOpHash","type":"bytes32"},{"internalType":"uint256","name":"prefund","type":"uint256"},{"internalType":"uint256","name":"contextOffset","type":"uint256"},{"internalType":"uint256","name":"preOpGas","type":"uint256"}],"internalType":"struct EntryPoint.UserOpInfo","name":"opInfo","type":"tuple"},{"internalType":"bytes","name":"context","type":"bytes"}],"name":"innerHandleOp","outputs":[{"internalType":"uint256","name":"actualGasCost","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint192","name":"","type":"uint192"}],"name":"nonceSequenceNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"initCode","type":"bytes"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"uint256","name":"callGasLimit","type":"uint256"},{"internalType":"uint256","name":"verificationGasLimit","type":"uint256"},{"internalType":"uint256","name":"preVerificationGas","type":"uint256"},{"internalType":"uint256","name":"maxFeePerGas","type":"uint256"},{"internalType":"uint256","name":"maxPriorityFeePerGas","type":"uint256"},{"internalType":"bytes","name":"paymasterAndData","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"struct UserOperation","name":"op","type":"tuple"},{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes","name":"targetCallData","type":"bytes"}],"name":"simulateHandleOp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"initCode","type":"bytes"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"uint256","name":"callGasLimit","type":"uint256"},{"internalType":"uint256","name":"verificationGasLimit","type":"uint256"},{"internalType":"uint256","name":"preVerificationGas","type":"uint256"},{"internalType":"uint256","name":"maxFeePerGas","type":"uint256"},{"internalType":"uint256","name":"maxPriorityFeePerGas","type":"uint256"},{"internalType":"bytes","name":"paymasterAndData","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"struct UserOperation","name":"userOp","type":"tuple"}],"name":"simulateValidation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unlockStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"withdrawAddress","type":"address"}],"name":"withdrawStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"withdrawAddress","type":"address"},{"internalType":"uint256","name":"withdrawAmount","type":"uint256"}],"name":"withdrawTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]

    declare storage: EntryPointStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TEntryPointTypes = {
    Events: {
        AccountDeployed: {
            outputParams: { userOpHash: TEth.Hex, _sender: TAddress, factory: TAddress, paymaster: TAddress },
            outputArgs:   [ userOpHash: TEth.Hex, _sender: TAddress, factory: TAddress, paymaster: TAddress ],
        }
        BeforeExecution: {
            outputParams: {  },
            outputArgs:   [  ],
        }
        Deposited: {
            outputParams: { account: TAddress, totalDeposit: bigint },
            outputArgs:   [ account: TAddress, totalDeposit: bigint ],
        }
        SignatureAggregatorChanged: {
            outputParams: { aggregator: TAddress },
            outputArgs:   [ aggregator: TAddress ],
        }
        StakeLocked: {
            outputParams: { account: TAddress, totalStaked: bigint, unstakeDelaySec: bigint },
            outputArgs:   [ account: TAddress, totalStaked: bigint, unstakeDelaySec: bigint ],
        }
        StakeUnlocked: {
            outputParams: { account: TAddress, withdrawTime: bigint },
            outputArgs:   [ account: TAddress, withdrawTime: bigint ],
        }
        StakeWithdrawn: {
            outputParams: { account: TAddress, withdrawAddress: TAddress, amount: bigint },
            outputArgs:   [ account: TAddress, withdrawAddress: TAddress, amount: bigint ],
        }
        UserOperationEvent: {
            outputParams: { userOpHash: TEth.Hex, _sender: TAddress, paymaster: TAddress, nonce: bigint, success: boolean, actualGasCost: bigint, actualGasUsed: bigint },
            outputArgs:   [ userOpHash: TEth.Hex, _sender: TAddress, paymaster: TAddress, nonce: bigint, success: boolean, actualGasCost: bigint, actualGasUsed: bigint ],
        }
        UserOperationRevertReason: {
            outputParams: { userOpHash: TEth.Hex, _sender: TAddress, nonce: bigint, revertReason: TEth.Hex },
            outputArgs:   [ userOpHash: TEth.Hex, _sender: TAddress, nonce: bigint, revertReason: TEth.Hex ],
        }
        Withdrawn: {
            outputParams: { account: TAddress, withdrawAddress: TAddress, amount: bigint },
            outputArgs:   [ account: TAddress, withdrawAddress: TAddress, amount: bigint ],
        }
    },
    Methods: {
        SIG_VALIDATION_FAILED: {
          method: "SIG_VALIDATION_FAILED"
          arguments: [  ]
        }
        _validateSenderAndPaymaster: {
          method: "_validateSenderAndPaymaster"
          arguments: [ initCode: TEth.Hex, _sender: TAddress, paymasterAndData: TEth.Hex ]
        }
        addStake: {
          method: "addStake"
          arguments: [ unstakeDelaySec: number ]
        }
        balanceOf: {
          method: "balanceOf"
          arguments: [ account: TAddress ]
        }
        depositTo: {
          method: "depositTo"
          arguments: [ account: TAddress ]
        }
        deposits: {
          method: "deposits"
          arguments: [ input0: TAddress ]
        }
        getDepositInfo: {
          method: "getDepositInfo"
          arguments: [ account: TAddress ]
        }
        getNonce: {
          method: "getNonce"
          arguments: [ _sender: TAddress, key: bigint ]
        }
        getSenderAddress: {
          method: "getSenderAddress"
          arguments: [ initCode: TEth.Hex ]
        }
        getUserOpHash: {
          method: "getUserOpHash"
          arguments: [ userOp: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex } ]
        }
        handleAggregatedOps: {
          method: "handleAggregatedOps"
          arguments: [ opsPerAggregator: { userOps: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }[], aggregator: TAddress, signature: TEth.Hex }[], beneficiary: TAddress ]
        }
        handleOps: {
          method: "handleOps"
          arguments: [ ops: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }[], beneficiary: TAddress ]
        }
        incrementNonce: {
          method: "incrementNonce"
          arguments: [ key: bigint ]
        }
        innerHandleOp: {
          method: "innerHandleOp"
          arguments: [ callData: TEth.Hex, opInfo: { mUserOp: { sender: TAddress, nonce: bigint, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, paymaster: TAddress, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint }, userOpHash: TEth.Hex, prefund: bigint, contextOffset: bigint, preOpGas: bigint }, context: TEth.Hex ]
        }
        nonceSequenceNumber: {
          method: "nonceSequenceNumber"
          arguments: [ input0: TAddress, input1: bigint ]
        }
        simulateHandleOp: {
          method: "simulateHandleOp"
          arguments: [ op: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }, target: TAddress, targetCallData: TEth.Hex ]
        }
        simulateValidation: {
          method: "simulateValidation"
          arguments: [ userOp: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex } ]
        }
        unlockStake: {
          method: "unlockStake"
          arguments: [  ]
        }
        withdrawStake: {
          method: "withdrawStake"
          arguments: [ withdrawAddress: TAddress ]
        }
        withdrawTo: {
          method: "withdrawTo"
          arguments: [ withdrawAddress: TAddress, withdrawAmount: bigint ]
        }
    }
}



class EntryPointStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }

    async deposits(key: TAddress): Promise<{ deposit: bigint, staked: boolean, stake: bigint, unstakeDelaySec: number, withdrawTime: number }> {
        return this.$storage.get(['deposits', key]);
    }

    async nonceSequenceNumber(key: TAddress): Promise<Record<string | number, bigint>> {
        return this.$storage.get(['nonceSequenceNumber', key]);
    }

    async _status(): Promise<bigint> {
        return this.$storage.get(['_status', ]);
    }

    $slots = [
    {
        "slot": 0,
        "position": 0,
        "name": "deposits",
        "size": null,
        "type": "mapping(address => (uint112 deposit, bool staked, uint112 stake, uint32 unstakeDelaySec, uint48 withdrawTime))"
    },
    {
        "slot": 1,
        "position": 0,
        "name": "nonceSequenceNumber",
        "size": null,
        "type": "mapping(address => mapping(uint192 => uint256))"
    },
    {
        "slot": 2,
        "position": 0,
        "name": "_status",
        "size": 256,
        "type": "uint256"
    }
]

}


interface IEntryPointTxCaller {
    addStake (sender: TSender, unstakeDelaySec: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    depositTo (sender: TSender, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    getSenderAddress (sender: TSender, initCode: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    handleAggregatedOps (sender: TSender, opsPerAggregator: { userOps: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }[], aggregator: TAddress, signature: TEth.Hex }[], beneficiary: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    handleOps (sender: TSender, ops: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }[], beneficiary: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    incrementNonce (sender: TSender, key: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    innerHandleOp (sender: TSender, callData: TEth.Hex, opInfo: { mUserOp: { sender: TAddress, nonce: bigint, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, paymaster: TAddress, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint }, userOpHash: TEth.Hex, prefund: bigint, contextOffset: bigint, preOpGas: bigint }, context: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    simulateHandleOp (sender: TSender, op: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }, target: TAddress, targetCallData: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    simulateValidation (sender: TSender, userOp: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    unlockStake (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    withdrawStake (sender: TSender, withdrawAddress: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    withdrawTo (sender: TSender, withdrawAddress: TAddress, withdrawAmount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IEntryPointTxData {
    addStake (sender: TSender, unstakeDelaySec: number): Promise<TEth.TxLike>
    depositTo (sender: TSender, account: TAddress): Promise<TEth.TxLike>
    getSenderAddress (sender: TSender, initCode: TEth.Hex): Promise<TEth.TxLike>
    handleAggregatedOps (sender: TSender, opsPerAggregator: { userOps: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }[], aggregator: TAddress, signature: TEth.Hex }[], beneficiary: TAddress): Promise<TEth.TxLike>
    handleOps (sender: TSender, ops: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }[], beneficiary: TAddress): Promise<TEth.TxLike>
    incrementNonce (sender: TSender, key: bigint): Promise<TEth.TxLike>
    innerHandleOp (sender: TSender, callData: TEth.Hex, opInfo: { mUserOp: { sender: TAddress, nonce: bigint, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, paymaster: TAddress, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint }, userOpHash: TEth.Hex, prefund: bigint, contextOffset: bigint, preOpGas: bigint }, context: TEth.Hex): Promise<TEth.TxLike>
    simulateHandleOp (sender: TSender, op: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }, target: TAddress, targetCallData: TEth.Hex): Promise<TEth.TxLike>
    simulateValidation (sender: TSender, userOp: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }): Promise<TEth.TxLike>
    unlockStake (sender: TSender, ): Promise<TEth.TxLike>
    withdrawStake (sender: TSender, withdrawAddress: TAddress): Promise<TEth.TxLike>
    withdrawTo (sender: TSender, withdrawAddress: TAddress, withdrawAmount: bigint): Promise<TEth.TxLike>
}


type TEvents = TEntryPointTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
