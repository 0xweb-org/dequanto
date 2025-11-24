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

import type { TimelockController as TimelockControllerType } from '../prebuilt/openzeppelin/TimelockController';


export function TimelockControllerFactory (): typeof TimelockControllerType {

    class TimelockController extends ContractBase {
        constructor(
            public address: TEth.Address = null,
            public client: Web3Client = di.resolve(EthWeb3Client,),
            public explorer: IBlockchainExplorer = di.resolve(Etherscan,),
        ) {
            super(address, client, explorer)


        }

        Types: TTimelockControllerTypes;

        $meta = {
            "class": "./src/prebuilt/openzeppelin/TimelockController.ts"
        }

        async $constructor(deployer: TSender, minDelay: bigint, proposers: TAddress[], executors: TAddress[], admin: TAddress): Promise<TxWriter> {
            throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
        }

        // 0xb08e51c0
        async CANCELLER_ROLE(): Promise<TEth.Hex> {
            return this.$read(this.$getAbiItem('function', 'CANCELLER_ROLE'));
        }

        // 0xa217fddf
        async DEFAULT_ADMIN_ROLE(): Promise<TEth.Hex> {
            return this.$read(this.$getAbiItem('function', 'DEFAULT_ADMIN_ROLE'));
        }

        // 0x07bd0265
        async EXECUTOR_ROLE(): Promise<TEth.Hex> {
            return this.$read(this.$getAbiItem('function', 'EXECUTOR_ROLE'));
        }

        // 0x8f61f4f5
        async PROPOSER_ROLE(): Promise<TEth.Hex> {
            return this.$read(this.$getAbiItem('function', 'PROPOSER_ROLE'));
        }

        // 0x0d3cf6fc
        async TIMELOCK_ADMIN_ROLE(): Promise<TEth.Hex> {
            return this.$read(this.$getAbiItem('function', 'TIMELOCK_ADMIN_ROLE'));
        }

        // 0xc4d252f5
        async cancel(sender: TSender, id: TEth.Hex): Promise<TxWriter> {
            return this.$write(this.$getAbiItem('function', 'cancel'), sender, id);
        }

        // 0x134008d3
        async execute(sender: TSender, target: TAddress, value: bigint, payload: TEth.Hex, predecessor: TEth.Hex, salt: TEth.Hex): Promise<TxWriter> {
            return this.$write(this.$getAbiItem('function', 'execute'), sender, target, value, payload, predecessor, salt);
        }

        // 0xe38335e5
        async executeBatch(sender: TSender, targets: TAddress[], values: bigint[], payloads: TEth.Hex[], predecessor: TEth.Hex, salt: TEth.Hex): Promise<TxWriter> {
            return this.$write(this.$getAbiItem('function', 'executeBatch'), sender, targets, values, payloads, predecessor, salt);
        }

        // 0xf27a0c92
        async getMinDelay(): Promise<bigint> {
            return this.$read(this.$getAbiItem('function', 'getMinDelay'));
        }

        // 0x248a9ca3
        async getRoleAdmin(role: TEth.Hex): Promise<TEth.Hex> {
            return this.$read(this.$getAbiItem('function', 'getRoleAdmin'), role);
        }

        // 0xd45c4435
        async getTimestamp(id: TEth.Hex): Promise<bigint> {
            return this.$read(this.$getAbiItem('function', 'getTimestamp'), id);
        }

        // 0x2f2ff15d
        async grantRole(sender: TSender, role: TEth.Hex, account: TAddress): Promise<TxWriter> {
            return this.$write(this.$getAbiItem('function', 'grantRole'), sender, role, account);
        }

        // 0x91d14854
        async hasRole(role: TEth.Hex, account: TAddress): Promise<boolean> {
            return this.$read(this.$getAbiItem('function', 'hasRole'), role, account);
        }

        // 0x8065657f
        async hashOperation(target: TAddress, value: bigint, data: TEth.Hex, predecessor: TEth.Hex, salt: TEth.Hex): Promise<TEth.Hex> {
            return this.$read(this.$getAbiItem('function', 'hashOperation'), target, value, data, predecessor, salt);
        }

        // 0xb1c5f427
        async hashOperationBatch(targets: TAddress[], values: bigint[], payloads: TEth.Hex[], predecessor: TEth.Hex, salt: TEth.Hex): Promise<TEth.Hex> {
            return this.$read(this.$getAbiItem('function', 'hashOperationBatch'), targets, values, payloads, predecessor, salt);
        }

        // 0x31d50750
        async isOperation(id: TEth.Hex): Promise<boolean> {
            return this.$read(this.$getAbiItem('function', 'isOperation'), id);
        }

        // 0x2ab0f529
        async isOperationDone(id: TEth.Hex): Promise<boolean> {
            return this.$read(this.$getAbiItem('function', 'isOperationDone'), id);
        }

        // 0x584b153e
        async isOperationPending(id: TEth.Hex): Promise<boolean> {
            return this.$read(this.$getAbiItem('function', 'isOperationPending'), id);
        }

        // 0x13bc9f20
        async isOperationReady(id: TEth.Hex): Promise<boolean> {
            return this.$read(this.$getAbiItem('function', 'isOperationReady'), id);
        }

        // 0xbc197c81
        async onERC1155BatchReceived(sender: TSender, input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TEth.Hex): Promise<TxWriter> {
            return this.$write(this.$getAbiItem('function', 'onERC1155BatchReceived'), sender, input0, input1, input2, input3, input4);
        }

        // 0xf23a6e61
        async onERC1155Received(sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TEth.Hex): Promise<TxWriter> {
            return this.$write(this.$getAbiItem('function', 'onERC1155Received'), sender, input0, input1, input2, input3, input4);
        }

        // 0x150b7a02
        async onERC721Received(sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: TEth.Hex): Promise<TxWriter> {
            return this.$write(this.$getAbiItem('function', 'onERC721Received'), sender, input0, input1, input2, input3);
        }

        // 0x36568abe
        async renounceRole(sender: TSender, role: TEth.Hex, account: TAddress): Promise<TxWriter> {
            return this.$write(this.$getAbiItem('function', 'renounceRole'), sender, role, account);
        }

        // 0xd547741f
        async revokeRole(sender: TSender, role: TEth.Hex, account: TAddress): Promise<TxWriter> {
            return this.$write(this.$getAbiItem('function', 'revokeRole'), sender, role, account);
        }

        // 0x01d5062a
        async schedule(sender: TSender, target: TAddress, value: bigint, data: TEth.Hex, predecessor: TEth.Hex, salt: TEth.Hex, delay: bigint): Promise<TxWriter> {
            return this.$write(this.$getAbiItem('function', 'schedule'), sender, target, value, data, predecessor, salt, delay);
        }

        // 0x8f2a0bb0
        async scheduleBatch(sender: TSender, targets: TAddress[], values: bigint[], payloads: TEth.Hex[], predecessor: TEth.Hex, salt: TEth.Hex, delay: bigint): Promise<TxWriter> {
            return this.$write(this.$getAbiItem('function', 'scheduleBatch'), sender, targets, values, payloads, predecessor, salt, delay);
        }

        // 0x01ffc9a7
        async supportsInterface(interfaceId: TEth.Hex): Promise<boolean> {
            return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceId);
        }

        // 0x64d62353
        async updateDelay(sender: TSender, newDelay: bigint): Promise<TxWriter> {
            return this.$write(this.$getAbiItem('function', 'updateDelay'), sender, newDelay);
        }

        $call() {
            return super.$call() as ITimelockControllerTxCaller;
        }
        $signed(): TOverrideReturns<ITimelockControllerTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
            return super.$signed() as any;
        }
        $data(): ITimelockControllerTxData {
            return super.$data() as ITimelockControllerTxData;
        }
        $gas(): TOverrideReturns<ITimelockControllerTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
            return super.$gas() as any;
        }

        onTransaction<TMethod extends keyof TTimelockControllerTypes['Methods']>(method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
            tx: TEth.Tx
            block: TEth.Block<TEth.Hex>
            calldata: {
                method: TMethod
                arguments: TTimelockControllerTypes['Methods'][TMethod]['arguments']
            }
        }> {
            options ??= {};
            options.filter ??= {};
            options.filter.method = method;
            return <any>this.$onTransaction(options);
        }

        onLog(event: keyof TEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
            return this.$onLog(event, cb);
        }

        async getPastLogs<TEventName extends keyof TEvents>(
            events: TEventName[]
            , options?: TEventLogOptions<TEventParams<TEventName>>
        ): Promise<ITxLogItem<TEventParams<TEventName>, TEventName>[]>
        async getPastLogs<TEventName extends keyof TEvents>(
            event: TEventName
            , options?: TEventLogOptions<TEventParams<TEventName>>
        ): Promise<ITxLogItem<TEventParams<TEventName>, TEventName>[]>
        async getPastLogs(mix: any, options?): Promise<any> {
            return await super.getPastLogs(mix, options) as any;
        }

        onCallExecuted(fn?: (event: TClientEventsStreamData<TEventArguments<'CallExecuted'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'CallExecuted'>>> {
            return this.$onLog('CallExecuted', fn);
        }

        onCallSalt(fn?: (event: TClientEventsStreamData<TEventArguments<'CallSalt'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'CallSalt'>>> {
            return this.$onLog('CallSalt', fn);
        }

        onCallScheduled(fn?: (event: TClientEventsStreamData<TEventArguments<'CallScheduled'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'CallScheduled'>>> {
            return this.$onLog('CallScheduled', fn);
        }

        onCancelled(fn?: (event: TClientEventsStreamData<TEventArguments<'Cancelled'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Cancelled'>>> {
            return this.$onLog('Cancelled', fn);
        }

        onMinDelayChange(fn?: (event: TClientEventsStreamData<TEventArguments<'MinDelayChange'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'MinDelayChange'>>> {
            return this.$onLog('MinDelayChange', fn);
        }

        onRoleAdminChanged(fn?: (event: TClientEventsStreamData<TEventArguments<'RoleAdminChanged'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'RoleAdminChanged'>>> {
            return this.$onLog('RoleAdminChanged', fn);
        }

        onRoleGranted(fn?: (event: TClientEventsStreamData<TEventArguments<'RoleGranted'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'RoleGranted'>>> {
            return this.$onLog('RoleGranted', fn);
        }

        onRoleRevoked(fn?: (event: TClientEventsStreamData<TEventArguments<'RoleRevoked'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'RoleRevoked'>>> {
            return this.$onLog('RoleRevoked', fn);
        }

        extractLogsCallExecuted(tx: TEth.TxReceipt): ITxLogItem<TEventParams<'CallExecuted'>>[] {
            let abi = this.$getAbiItem('event', 'CallExecuted');
            return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'CallExecuted'>>[];
        }

        extractLogsCallSalt(tx: TEth.TxReceipt): ITxLogItem<TEventParams<'CallSalt'>>[] {
            let abi = this.$getAbiItem('event', 'CallSalt');
            return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'CallSalt'>>[];
        }

        extractLogsCallScheduled(tx: TEth.TxReceipt): ITxLogItem<TEventParams<'CallScheduled'>>[] {
            let abi = this.$getAbiItem('event', 'CallScheduled');
            return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'CallScheduled'>>[];
        }

        extractLogsCancelled(tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Cancelled'>>[] {
            let abi = this.$getAbiItem('event', 'Cancelled');
            return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Cancelled'>>[];
        }

        extractLogsMinDelayChange(tx: TEth.TxReceipt): ITxLogItem<TEventParams<'MinDelayChange'>>[] {
            let abi = this.$getAbiItem('event', 'MinDelayChange');
            return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'MinDelayChange'>>[];
        }

        extractLogsRoleAdminChanged(tx: TEth.TxReceipt): ITxLogItem<TEventParams<'RoleAdminChanged'>>[] {
            let abi = this.$getAbiItem('event', 'RoleAdminChanged');
            return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'RoleAdminChanged'>>[];
        }

        extractLogsRoleGranted(tx: TEth.TxReceipt): ITxLogItem<TEventParams<'RoleGranted'>>[] {
            let abi = this.$getAbiItem('event', 'RoleGranted');
            return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'RoleGranted'>>[];
        }

        extractLogsRoleRevoked(tx: TEth.TxReceipt): ITxLogItem<TEventParams<'RoleRevoked'>>[] {
            let abi = this.$getAbiItem('event', 'RoleRevoked');
            return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'RoleRevoked'>>[];
        }

        async getPastLogsCallExecuted(options?: {
            fromBlock?: number | Date
            toBlock?: number | Date
            params?: { id?: TEth.Hex, index?: bigint }
        }): Promise<ITxLogItem<TEventParams<'CallExecuted'>>[]> {
            return await this.$getPastLogsParsed('CallExecuted', options) as any;
        }

        async getPastLogsCallSalt(options?: {
            fromBlock?: number | Date
            toBlock?: number | Date
            params?: { id?: TEth.Hex }
        }): Promise<ITxLogItem<TEventParams<'CallSalt'>>[]> {
            return await this.$getPastLogsParsed('CallSalt', options) as any;
        }

        async getPastLogsCallScheduled(options?: {
            fromBlock?: number | Date
            toBlock?: number | Date
            params?: { id?: TEth.Hex, index?: bigint }
        }): Promise<ITxLogItem<TEventParams<'CallScheduled'>>[]> {
            return await this.$getPastLogsParsed('CallScheduled', options) as any;
        }

        async getPastLogsCancelled(options?: {
            fromBlock?: number | Date
            toBlock?: number | Date
            params?: { id?: TEth.Hex }
        }): Promise<ITxLogItem<TEventParams<'Cancelled'>>[]> {
            return await this.$getPastLogsParsed('Cancelled', options) as any;
        }

        async getPastLogsMinDelayChange(options?: {
            fromBlock?: number | Date
            toBlock?: number | Date
            params?: {}
        }): Promise<ITxLogItem<TEventParams<'MinDelayChange'>>[]> {
            return await this.$getPastLogsParsed('MinDelayChange', options) as any;
        }

        async getPastLogsRoleAdminChanged(options?: {
            fromBlock?: number | Date
            toBlock?: number | Date
            params?: { role?: TEth.Hex, previousAdminRole?: TEth.Hex, newAdminRole?: TEth.Hex }
        }): Promise<ITxLogItem<TEventParams<'RoleAdminChanged'>>[]> {
            return await this.$getPastLogsParsed('RoleAdminChanged', options) as any;
        }

        async getPastLogsRoleGranted(options?: {
            fromBlock?: number | Date
            toBlock?: number | Date
            params?: { role?: TEth.Hex, account?: TAddress, sender?: TAddress }
        }): Promise<ITxLogItem<TEventParams<'RoleGranted'>>[]> {
            return await this.$getPastLogsParsed('RoleGranted', options) as any;
        }

        async getPastLogsRoleRevoked(options?: {
            fromBlock?: number | Date
            toBlock?: number | Date
            params?: { role?: TEth.Hex, account?: TAddress, sender?: TAddress }
        }): Promise<ITxLogItem<TEventParams<'RoleRevoked'>>[]> {
            return await this.$getPastLogsParsed('RoleRevoked', options) as any;
        }

        abi: TAbiItem[] = [{ "inputs": [{ "internalType": "uint256", "name": "minDelay", "type": "uint256" }, { "internalType": "address[]", "name": "proposers", "type": "address[]" }, { "internalType": "address[]", "name": "executors", "type": "address[]" }, { "internalType": "address", "name": "admin", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "id", "type": "bytes32" }, { "indexed": true, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "target", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "CallExecuted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "id", "type": "bytes32" }, { "indexed": false, "internalType": "bytes32", "name": "salt", "type": "bytes32" }], "name": "CallSalt", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "id", "type": "bytes32" }, { "indexed": true, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "target", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "data", "type": "bytes" }, { "indexed": false, "internalType": "bytes32", "name": "predecessor", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "delay", "type": "uint256" }], "name": "CallScheduled", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "id", "type": "bytes32" }], "name": "Cancelled", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "oldDuration", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "newDuration", "type": "uint256" }], "name": "MinDelayChange", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" }, { "inputs": [], "name": "CANCELLER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "EXECUTOR_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "PROPOSER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "TIMELOCK_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "id", "type": "bytes32" }], "name": "cancel", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "target", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bytes", "name": "payload", "type": "bytes" }, { "internalType": "bytes32", "name": "predecessor", "type": "bytes32" }, { "internalType": "bytes32", "name": "salt", "type": "bytes32" }], "name": "execute", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "targets", "type": "address[]" }, { "internalType": "uint256[]", "name": "values", "type": "uint256[]" }, { "internalType": "bytes[]", "name": "payloads", "type": "bytes[]" }, { "internalType": "bytes32", "name": "predecessor", "type": "bytes32" }, { "internalType": "bytes32", "name": "salt", "type": "bytes32" }], "name": "executeBatch", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "getMinDelay", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleAdmin", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "id", "type": "bytes32" }], "name": "getTimestamp", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "target", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "bytes32", "name": "predecessor", "type": "bytes32" }, { "internalType": "bytes32", "name": "salt", "type": "bytes32" }], "name": "hashOperation", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "targets", "type": "address[]" }, { "internalType": "uint256[]", "name": "values", "type": "uint256[]" }, { "internalType": "bytes[]", "name": "payloads", "type": "bytes[]" }, { "internalType": "bytes32", "name": "predecessor", "type": "bytes32" }, { "internalType": "bytes32", "name": "salt", "type": "bytes32" }], "name": "hashOperationBatch", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "id", "type": "bytes32" }], "name": "isOperation", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "id", "type": "bytes32" }], "name": "isOperationDone", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "id", "type": "bytes32" }], "name": "isOperationPending", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "id", "type": "bytes32" }], "name": "isOperationReady", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC1155BatchReceived", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC1155Received", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "onERC721Received", "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "target", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "bytes32", "name": "predecessor", "type": "bytes32" }, { "internalType": "bytes32", "name": "salt", "type": "bytes32" }, { "internalType": "uint256", "name": "delay", "type": "uint256" }], "name": "schedule", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "targets", "type": "address[]" }, { "internalType": "uint256[]", "name": "values", "type": "uint256[]" }, { "internalType": "bytes[]", "name": "payloads", "type": "bytes[]" }, { "internalType": "bytes32", "name": "predecessor", "type": "bytes32" }, { "internalType": "bytes32", "name": "salt", "type": "bytes32" }, { "internalType": "uint256", "name": "delay", "type": "uint256" }], "name": "scheduleBatch", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newDelay", "type": "uint256" }], "name": "updateDelay", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }]


    }

    return TimelockController as any;
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TTimelockControllerTypes = {
    Events: {
        CallExecuted: {
            outputParams: { id: TEth.Hex, index: bigint, target: TAddress, value: bigint, data: TEth.Hex },
            outputArgs: [id: TEth.Hex, index: bigint, target: TAddress, value: bigint, data: TEth.Hex],
        }
        CallSalt: {
            outputParams: { id: TEth.Hex, salt: TEth.Hex },
            outputArgs: [id: TEth.Hex, salt: TEth.Hex],
        }
        CallScheduled: {
            outputParams: { id: TEth.Hex, index: bigint, target: TAddress, value: bigint, data: TEth.Hex, predecessor: TEth.Hex, delay: bigint },
            outputArgs: [id: TEth.Hex, index: bigint, target: TAddress, value: bigint, data: TEth.Hex, predecessor: TEth.Hex, delay: bigint],
        }
        Cancelled: {
            outputParams: { id: TEth.Hex },
            outputArgs: [id: TEth.Hex],
        }
        MinDelayChange: {
            outputParams: { oldDuration: bigint, newDuration: bigint },
            outputArgs: [oldDuration: bigint, newDuration: bigint],
        }
        RoleAdminChanged: {
            outputParams: { role: TEth.Hex, previousAdminRole: TEth.Hex, newAdminRole: TEth.Hex },
            outputArgs: [role: TEth.Hex, previousAdminRole: TEth.Hex, newAdminRole: TEth.Hex],
        }
        RoleGranted: {
            outputParams: { role: TEth.Hex, account: TAddress, _sender: TAddress },
            outputArgs: [role: TEth.Hex, account: TAddress, _sender: TAddress],
        }
        RoleRevoked: {
            outputParams: { role: TEth.Hex, account: TAddress, _sender: TAddress },
            outputArgs: [role: TEth.Hex, account: TAddress, _sender: TAddress],
        }
    },
    Methods: {
        CANCELLER_ROLE: {
            method: "CANCELLER_ROLE"
            arguments: []
        }
        DEFAULT_ADMIN_ROLE: {
            method: "DEFAULT_ADMIN_ROLE"
            arguments: []
        }
        EXECUTOR_ROLE: {
            method: "EXECUTOR_ROLE"
            arguments: []
        }
        PROPOSER_ROLE: {
            method: "PROPOSER_ROLE"
            arguments: []
        }
        TIMELOCK_ADMIN_ROLE: {
            method: "TIMELOCK_ADMIN_ROLE"
            arguments: []
        }
        cancel: {
            method: "cancel"
            arguments: [id: TEth.Hex]
        }
        execute: {
            method: "execute"
            arguments: [target: TAddress, value: bigint, payload: TEth.Hex, predecessor: TEth.Hex, salt: TEth.Hex]
        }
        executeBatch: {
            method: "executeBatch"
            arguments: [targets: TAddress[], values: bigint[], payloads: TEth.Hex[], predecessor: TEth.Hex, salt: TEth.Hex]
        }
        getMinDelay: {
            method: "getMinDelay"
            arguments: []
        }
        getRoleAdmin: {
            method: "getRoleAdmin"
            arguments: [role: TEth.Hex]
        }
        getTimestamp: {
            method: "getTimestamp"
            arguments: [id: TEth.Hex]
        }
        grantRole: {
            method: "grantRole"
            arguments: [role: TEth.Hex, account: TAddress]
        }
        hasRole: {
            method: "hasRole"
            arguments: [role: TEth.Hex, account: TAddress]
        }
        hashOperation: {
            method: "hashOperation"
            arguments: [target: TAddress, value: bigint, data: TEth.Hex, predecessor: TEth.Hex, salt: TEth.Hex]
        }
        hashOperationBatch: {
            method: "hashOperationBatch"
            arguments: [targets: TAddress[], values: bigint[], payloads: TEth.Hex[], predecessor: TEth.Hex, salt: TEth.Hex]
        }
        isOperation: {
            method: "isOperation"
            arguments: [id: TEth.Hex]
        }
        isOperationDone: {
            method: "isOperationDone"
            arguments: [id: TEth.Hex]
        }
        isOperationPending: {
            method: "isOperationPending"
            arguments: [id: TEth.Hex]
        }
        isOperationReady: {
            method: "isOperationReady"
            arguments: [id: TEth.Hex]
        }
        onERC1155BatchReceived: {
            method: "onERC1155BatchReceived"
            arguments: [input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TEth.Hex]
        }
        onERC1155Received: {
            method: "onERC1155Received"
            arguments: [input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TEth.Hex]
        }
        onERC721Received: {
            method: "onERC721Received"
            arguments: [input0: TAddress, input1: TAddress, input2: bigint, input3: TEth.Hex]
        }
        renounceRole: {
            method: "renounceRole"
            arguments: [role: TEth.Hex, account: TAddress]
        }
        revokeRole: {
            method: "revokeRole"
            arguments: [role: TEth.Hex, account: TAddress]
        }
        schedule: {
            method: "schedule"
            arguments: [target: TAddress, value: bigint, data: TEth.Hex, predecessor: TEth.Hex, salt: TEth.Hex, delay: bigint]
        }
        scheduleBatch: {
            method: "scheduleBatch"
            arguments: [targets: TAddress[], values: bigint[], payloads: TEth.Hex[], predecessor: TEth.Hex, salt: TEth.Hex, delay: bigint]
        }
        supportsInterface: {
            method: "supportsInterface"
            arguments: [interfaceId: TEth.Hex]
        }
        updateDelay: {
            method: "updateDelay"
            arguments: [newDelay: bigint]
        }
    }
}



interface ITimelockControllerTxCaller {
    cancel(sender: TSender, id: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result?}>
    execute(sender: TSender, target: TAddress, value: bigint, payload: TEth.Hex, predecessor: TEth.Hex, salt: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result?}>
    executeBatch(sender: TSender, targets: TAddress[], values: bigint[], payloads: TEth.Hex[], predecessor: TEth.Hex, salt: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result?}>
    grantRole(sender: TSender, role: TEth.Hex, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result?}>
    onERC1155BatchReceived(sender: TSender, input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result?}>
    onERC1155Received(sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result?}>
    onERC721Received(sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result?}>
    renounceRole(sender: TSender, role: TEth.Hex, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result?}>
    revokeRole(sender: TSender, role: TEth.Hex, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result?}>
    schedule(sender: TSender, target: TAddress, value: bigint, data: TEth.Hex, predecessor: TEth.Hex, salt: TEth.Hex, delay: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result?}>
    scheduleBatch(sender: TSender, targets: TAddress[], values: bigint[], payloads: TEth.Hex[], predecessor: TEth.Hex, salt: TEth.Hex, delay: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result?}>
    updateDelay(sender: TSender, newDelay: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result?}>
}


interface ITimelockControllerTxData {
    cancel(sender: TSender, id: TEth.Hex): Promise<TEth.TxLike>
    execute(sender: TSender, target: TAddress, value: bigint, payload: TEth.Hex, predecessor: TEth.Hex, salt: TEth.Hex): Promise<TEth.TxLike>
    executeBatch(sender: TSender, targets: TAddress[], values: bigint[], payloads: TEth.Hex[], predecessor: TEth.Hex, salt: TEth.Hex): Promise<TEth.TxLike>
    grantRole(sender: TSender, role: TEth.Hex, account: TAddress): Promise<TEth.TxLike>
    onERC1155BatchReceived(sender: TSender, input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TEth.Hex): Promise<TEth.TxLike>
    onERC1155Received(sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TEth.Hex): Promise<TEth.TxLike>
    onERC721Received(sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: TEth.Hex): Promise<TEth.TxLike>
    renounceRole(sender: TSender, role: TEth.Hex, account: TAddress): Promise<TEth.TxLike>
    revokeRole(sender: TSender, role: TEth.Hex, account: TAddress): Promise<TEth.TxLike>
    schedule(sender: TSender, target: TAddress, value: bigint, data: TEth.Hex, predecessor: TEth.Hex, salt: TEth.Hex, delay: bigint): Promise<TEth.TxLike>
    scheduleBatch(sender: TSender, targets: TAddress[], values: bigint[], payloads: TEth.Hex[], predecessor: TEth.Hex, salt: TEth.Hex, delay: bigint): Promise<TEth.TxLike>
    updateDelay(sender: TSender, newDelay: bigint): Promise<TEth.TxLike>
}


type TEvents = TTimelockControllerTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;



