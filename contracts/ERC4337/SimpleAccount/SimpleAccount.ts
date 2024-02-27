/**
 *  AUTO-Generated Class: 2024-02-27 16:48
 *  Implementation: ./test/fixtures/erc4337/samples/SimpleAccount.sol
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



export class SimpleAccount extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new SimpleAccountStorageReader(this.address, this.client, this.explorer);
    }

    $meta = {
        "source": "./test/fixtures/erc4337/samples/SimpleAccount.sol",
        "class": "./contracts/erc4337/SimpleAccount/SimpleAccount.ts"
    }

    // 0x3a871cdd
    async validateUserOp (sender: TSender, userOp: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }, userOpHash: TEth.Hex, missingAccountFunds: bigint): Promise<TxWriter>
    // 0x3a871cdd
    async validateUserOp (sender: TSender, userOp: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }, userOpHash: TEth.Hex, missingAccountFunds: bigint): Promise<TxWriter>
    async validateUserOp (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function validateUserOp(tuple, bytes32, uint256) returns uint256', 'function validateUserOp(tuple, bytes32, uint256) returns uint256' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0xd087d288
    async getNonce (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getNonce'));
    }

    // 0xb0d691fe
    async entryPoint (): Promise<TAddress>
    // 0xb0d691fe
    async entryPoint (): Promise<TAddress>
    async entryPoint (...args): Promise<TAddress> {
        let abi = this.$getAbiItemOverload([ 'function entryPoint() returns address', 'function entryPoint() returns address' ], args);
        return this.$read(abi, ...args);
    }

    // 0x0023de29
    async tokensReceived (sender: TSender, operator: TAddress, from: TAddress, to: TAddress, amount: bigint, userData: TEth.Hex, operatorData: TEth.Hex): Promise<TxWriter>
    // 0x0023de29
    async tokensReceived (sender: TSender, input0: TAddress, input1: TAddress, input2: TAddress, input3: bigint, input4: TEth.Hex, input5: TEth.Hex): Promise<TxWriter>
    async tokensReceived (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function tokensReceived(address, address, address, uint256, bytes, bytes)', 'function tokensReceived(address, address, address, uint256, bytes, bytes)' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0x150b7a02
    async onERC721Received (sender: TSender, operator: TAddress, from: TAddress, tokenId: bigint, data: TEth.Hex): Promise<TxWriter>
    // 0x150b7a02
    async onERC721Received (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: TEth.Hex): Promise<TxWriter>
    async onERC721Received (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function onERC721Received(address, address, uint256, bytes) returns bytes4', 'function onERC721Received(address, address, uint256, bytes) returns bytes4' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceId: TEth.Hex): Promise<boolean>
    // 0x01ffc9a7
    async supportsInterface (interfaceId: TEth.Hex): Promise<boolean>
    async supportsInterface (...args): Promise<boolean> {
        let abi = this.$getAbiItemOverload([ 'function supportsInterface(bytes4) returns bool', 'function supportsInterface(bytes4) returns bool' ], args);
        return this.$read(abi, ...args);
    }

    // 0xf23a6e61
    async onERC1155Received (sender: TSender, operator: TAddress, from: TAddress, id: bigint, value: bigint, data: TEth.Hex): Promise<TxWriter>
    // 0xf23a6e61
    async onERC1155Received (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TEth.Hex): Promise<TxWriter>
    async onERC1155Received (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function onERC1155Received(address, address, uint256, uint256, bytes) returns bytes4', 'function onERC1155Received(address, address, uint256, uint256, bytes) returns bytes4' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0xbc197c81
    async onERC1155BatchReceived (sender: TSender, operator: TAddress, from: TAddress, ids: bigint[], values: bigint[], data: TEth.Hex): Promise<TxWriter>
    // 0xbc197c81
    async onERC1155BatchReceived (sender: TSender, input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TEth.Hex): Promise<TxWriter>
    async onERC1155BatchReceived (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function onERC1155BatchReceived(address, address, uint256[], uint256[], bytes) returns bytes4', 'function onERC1155BatchReceived(address, address, uint256[], uint256[], bytes) returns bytes4' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0x52d1902d
    async proxiableUUID (): Promise<TEth.Hex>
    // 0x52d1902d
    async proxiableUUID (): Promise<TEth.Hex>
    async proxiableUUID (...args): Promise<TEth.Hex> {
        let abi = this.$getAbiItemOverload([ 'function proxiableUUID() returns bytes32', 'function proxiableUUID() returns bytes32' ], args);
        return this.$read(abi, ...args);
    }

    // 0x3659cfe6
    async upgradeTo (sender: TSender, newImplementation: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'upgradeTo'), sender, newImplementation);
    }

    // 0x4f1ef286
    async upgradeToAndCall (sender: TSender, newImplementation: TAddress, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'upgradeToAndCall'), sender, newImplementation, data);
    }

    // 0xb61d27f6
    async execute (sender: TSender, dest: TAddress, value: bigint, func: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'execute'), sender, dest, value, func);
    }

    // 0x18dfb3c7
    async executeBatch (sender: TSender, dest: TAddress[], func: TEth.Hex[]): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'executeBatch'), sender, dest, func);
    }

    // 0xc4d66de8
    async initialize (sender: TSender, anOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'initialize'), sender, anOwner);
    }

    // 0xc399ec88
    async getDeposit (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getDeposit'));
    }

    // 0x4a58db19
    async addDeposit (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'addDeposit'), sender);
    }

    // 0x4d44560d
    async withdrawDepositTo (sender: TSender, withdrawAddress: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdrawDepositTo'), sender, withdrawAddress, amount);
    }

    // 0x8da5cb5b
    async owner (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'owner'));
    }

    $call () {
        return super.$call() as ISimpleAccountTxCaller;
    }
    $signed (): TOverrideReturns<ISimpleAccountTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): ISimpleAccountTxData {
        return super.$data() as ISimpleAccountTxData;
    }
    $gas (): TOverrideReturns<ISimpleAccountTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TSimpleAccountTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TSimpleAccountTypes['Methods'][TMethod]['arguments']
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

    onUpgraded (fn?: (event: TClientEventsStreamData<TLogUpgradedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogUpgradedParameters>> {
        return this.$onLog('Upgraded', fn);
    }

    onAdminChanged (fn?: (event: TClientEventsStreamData<TLogAdminChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogAdminChangedParameters>> {
        return this.$onLog('AdminChanged', fn);
    }

    onBeaconUpgraded (fn?: (event: TClientEventsStreamData<TLogBeaconUpgradedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogBeaconUpgradedParameters>> {
        return this.$onLog('BeaconUpgraded', fn);
    }

    onInitialized (fn?: (event: TClientEventsStreamData<TLogInitializedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogInitializedParameters>> {
        return this.$onLog('Initialized', fn);
    }

    onSimpleAccountInitialized (fn?: (event: TClientEventsStreamData<TLogSimpleAccountInitializedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogSimpleAccountInitializedParameters>> {
        return this.$onLog('SimpleAccountInitialized', fn);
    }

    extractLogsUpgraded (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Upgraded'>>[] {
        let abi = this.$getAbiItem('event', 'Upgraded');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Upgraded'>>[];
    }

    extractLogsAdminChanged (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'AdminChanged'>>[] {
        let abi = this.$getAbiItem('event', 'AdminChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'AdminChanged'>>[];
    }

    extractLogsBeaconUpgraded (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'BeaconUpgraded'>>[] {
        let abi = this.$getAbiItem('event', 'BeaconUpgraded');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'BeaconUpgraded'>>[];
    }

    extractLogsInitialized (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Initialized'>>[] {
        let abi = this.$getAbiItem('event', 'Initialized');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Initialized'>>[];
    }

    extractLogsSimpleAccountInitialized (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'SimpleAccountInitialized'>>[] {
        let abi = this.$getAbiItem('event', 'SimpleAccountInitialized');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'SimpleAccountInitialized'>>[];
    }

    async getPastLogsUpgraded (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { implementation?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Upgraded'>>[]> {
        return await this.$getPastLogsParsed('Upgraded', options) as any;
    }

    async getPastLogsAdminChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'AdminChanged'>>[]> {
        return await this.$getPastLogsParsed('AdminChanged', options) as any;
    }

    async getPastLogsBeaconUpgraded (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { beacon?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'BeaconUpgraded'>>[]> {
        return await this.$getPastLogsParsed('BeaconUpgraded', options) as any;
    }

    async getPastLogsInitialized (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'Initialized'>>[]> {
        return await this.$getPastLogsParsed('Initialized', options) as any;
    }

    async getPastLogsSimpleAccountInitialized (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { entryPoint?: TAddress,owner?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'SimpleAccountInitialized'>>[]> {
        return await this.$getPastLogsParsed('SimpleAccountInitialized', options) as any;
    }

    abi: TAbiItem[] = [{"type":"function","name":"validateUserOp","inputs":[{"name":"userOp","type":"tuple","components":[{"name":"sender","type":"address"},{"name":"nonce","type":"uint256"},{"name":"initCode","type":"bytes"},{"name":"callData","type":"bytes"},{"name":"callGasLimit","type":"uint256"},{"name":"verificationGasLimit","type":"uint256"},{"name":"preVerificationGas","type":"uint256"},{"name":"maxFeePerGas","type":"uint256"},{"name":"maxPriorityFeePerGas","type":"uint256"},{"name":"paymasterAndData","type":"bytes"},{"name":"signature","type":"bytes"}]},{"name":"userOpHash","type":"bytes32"},{"name":"missingAccountFunds","type":"uint256"}],"outputs":[{"name":"validationData","type":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"getNonce","inputs":[],"outputs":[{"type":"uint256"}],"stateMutability":"view"},{"type":"function","name":"entryPoint","inputs":[],"outputs":[{"type":"address"}],"stateMutability":"view"},{"type":"function","name":"validateUserOp","inputs":[{"name":"userOp","type":"tuple","components":[{"name":"sender","type":"address"},{"name":"nonce","type":"uint256"},{"name":"initCode","type":"bytes"},{"name":"callData","type":"bytes"},{"name":"callGasLimit","type":"uint256"},{"name":"verificationGasLimit","type":"uint256"},{"name":"preVerificationGas","type":"uint256"},{"name":"maxFeePerGas","type":"uint256"},{"name":"maxPriorityFeePerGas","type":"uint256"},{"name":"paymasterAndData","type":"bytes"},{"name":"signature","type":"bytes"}]},{"name":"userOpHash","type":"bytes32"},{"name":"missingAccountFunds","type":"uint256"}],"outputs":[{"name":"validationData","type":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"tokensReceived","inputs":[{"name":"operator","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"},{"name":"userData","type":"bytes"},{"name":"operatorData","type":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"onERC721Received","inputs":[{"name":"operator","type":"address"},{"name":"from","type":"address"},{"name":"tokenId","type":"uint256"},{"name":"data","type":"bytes"}],"outputs":[{"type":"bytes4"}],"stateMutability":"nonpayable"},{"type":"function","name":"supportsInterface","inputs":[{"name":"interfaceId","type":"bytes4"}],"outputs":[{"type":"bool"}],"stateMutability":"view"},{"type":"function","name":"onERC1155Received","inputs":[{"name":"operator","type":"address"},{"name":"from","type":"address"},{"name":"id","type":"uint256"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"outputs":[{"type":"bytes4"}],"stateMutability":"nonpayable"},{"type":"function","name":"onERC1155BatchReceived","inputs":[{"name":"operator","type":"address"},{"name":"from","type":"address"},{"name":"ids","type":"uint256[]"},{"name":"values","type":"uint256[]"},{"name":"data","type":"bytes"}],"outputs":[{"type":"bytes4"}],"stateMutability":"nonpayable"},{"type":"function","name":"tokensReceived","inputs":[{"name":null,"type":"address"},{"name":null,"type":"address"},{"name":null,"type":"address"},{"name":null,"type":"uint256"},{"name":null,"type":"bytes"},{"name":null,"type":"bytes"}],"outputs":[],"stateMutability":"pure"},{"type":"function","name":"onERC721Received","inputs":[{"name":null,"type":"address"},{"name":null,"type":"address"},{"name":null,"type":"uint256"},{"name":null,"type":"bytes"}],"outputs":[{"type":"bytes4"}],"stateMutability":"pure"},{"type":"function","name":"onERC1155Received","inputs":[{"name":null,"type":"address"},{"name":null,"type":"address"},{"name":null,"type":"uint256"},{"name":null,"type":"uint256"},{"name":null,"type":"bytes"}],"outputs":[{"type":"bytes4"}],"stateMutability":"pure"},{"type":"function","name":"onERC1155BatchReceived","inputs":[{"name":null,"type":"address"},{"name":null,"type":"address"},{"name":null,"type":"uint256[]"},{"name":null,"type":"uint256[]"},{"name":null,"type":"bytes"}],"outputs":[{"type":"bytes4"}],"stateMutability":"pure"},{"type":"function","name":"supportsInterface","inputs":[{"name":"interfaceId","type":"bytes4"}],"outputs":[{"type":"bool"}],"stateMutability":"view"},{"type":"function","name":"proxiableUUID","inputs":[],"outputs":[{"type":"bytes32"}],"stateMutability":"view"},{"type":"event","name":"Upgraded","inputs":[{"name":"implementation","type":"address","indexed":true}]},{"type":"event","name":"AdminChanged","inputs":[{"name":"previousAdmin","type":"address","indexed":false},{"name":"newAdmin","type":"address","indexed":false}]},{"type":"event","name":"BeaconUpgraded","inputs":[{"name":"beacon","type":"address","indexed":true}]},{"type":"function","name":"proxiableUUID","inputs":[],"outputs":[{"type":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"upgradeTo","inputs":[{"name":"newImplementation","type":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"upgradeToAndCall","inputs":[{"name":"newImplementation","type":"address"},{"name":"data","type":"bytes"}],"outputs":[],"stateMutability":"payable"},{"type":"event","name":"Initialized","inputs":[{"name":"version","type":"uint8","indexed":false}]},{"type":"function","name":"entryPoint","inputs":[],"outputs":[{"type":"address"}],"stateMutability":"view"},{"type":"receive","inputs":[],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"execute","inputs":[{"name":"dest","type":"address"},{"name":"value","type":"uint256"},{"name":"func","type":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"executeBatch","inputs":[{"name":"dest","type":"address[]"},{"name":"func","type":"bytes[]"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"initialize","inputs":[{"name":"anOwner","type":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"getDeposit","inputs":[],"outputs":[{"type":"uint256"}],"stateMutability":"view"},{"type":"function","name":"addDeposit","inputs":[],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"withdrawDepositTo","inputs":[{"name":"withdrawAddress","type":"address"},{"name":"amount","type":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"owner","inputs":[],"outputs":[{"name":"owner","type":"address"}],"stateMutability":"view"},{"type":"event","name":"SimpleAccountInitialized","inputs":[{"name":"entryPoint","type":"address","indexed":true},{"name":"owner","type":"address","indexed":true}]}]

    declare storage: SimpleAccountStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TSimpleAccountTypes = {
    Events: {
        Upgraded: {
            outputParams: { implementation: TAddress },
            outputArgs:   [ implementation: TAddress ],
        }
        AdminChanged: {
            outputParams: { previousAdmin: TAddress, newAdmin: TAddress },
            outputArgs:   [ previousAdmin: TAddress, newAdmin: TAddress ],
        }
        BeaconUpgraded: {
            outputParams: { beacon: TAddress },
            outputArgs:   [ beacon: TAddress ],
        }
        Initialized: {
            outputParams: { version: number },
            outputArgs:   [ version: number ],
        }
        SimpleAccountInitialized: {
            outputParams: { entryPoint: TAddress, owner: TAddress },
            outputArgs:   [ entryPoint: TAddress, owner: TAddress ],
        }
    },
    Methods: {
        validateUserOp: {
          method: "validateUserOp"
          arguments: [ userOp: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }, userOpHash: TEth.Hex, missingAccountFunds: bigint ] | [ userOp: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }, userOpHash: TEth.Hex, missingAccountFunds: bigint ]
        }
        getNonce: {
          method: "getNonce"
          arguments: [  ]
        }
        entryPoint: {
          method: "entryPoint"
          arguments: [  ] | [  ]
        }
        tokensReceived: {
          method: "tokensReceived"
          arguments: [ operator: TAddress, from: TAddress, to: TAddress, amount: bigint, userData: TEth.Hex, operatorData: TEth.Hex ] | [ input0: TAddress, input1: TAddress, input2: TAddress, input3: bigint, input4: TEth.Hex, input5: TEth.Hex ]
        }
        onERC721Received: {
          method: "onERC721Received"
          arguments: [ operator: TAddress, from: TAddress, tokenId: bigint, data: TEth.Hex ] | [ input0: TAddress, input1: TAddress, input2: bigint, input3: TEth.Hex ]
        }
        supportsInterface: {
          method: "supportsInterface"
          arguments: [ interfaceId: TEth.Hex ] | [ interfaceId: TEth.Hex ]
        }
        onERC1155Received: {
          method: "onERC1155Received"
          arguments: [ operator: TAddress, from: TAddress, id: bigint, value: bigint, data: TEth.Hex ] | [ input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TEth.Hex ]
        }
        onERC1155BatchReceived: {
          method: "onERC1155BatchReceived"
          arguments: [ operator: TAddress, from: TAddress, ids: bigint[], values: bigint[], data: TEth.Hex ] | [ input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TEth.Hex ]
        }
        proxiableUUID: {
          method: "proxiableUUID"
          arguments: [  ] | [  ]
        }
        upgradeTo: {
          method: "upgradeTo"
          arguments: [ newImplementation: TAddress ]
        }
        upgradeToAndCall: {
          method: "upgradeToAndCall"
          arguments: [ newImplementation: TAddress, data: TEth.Hex ]
        }
        execute: {
          method: "execute"
          arguments: [ dest: TAddress, value: bigint, func: TEth.Hex ]
        }
        executeBatch: {
          method: "executeBatch"
          arguments: [ dest: TAddress[], func: TEth.Hex[] ]
        }
        initialize: {
          method: "initialize"
          arguments: [ anOwner: TAddress ]
        }
        getDeposit: {
          method: "getDeposit"
          arguments: [  ]
        }
        addDeposit: {
          method: "addDeposit"
          arguments: [  ]
        }
        withdrawDepositTo: {
          method: "withdrawDepositTo"
          arguments: [ withdrawAddress: TAddress, amount: bigint ]
        }
        owner: {
          method: "owner"
          arguments: [  ]
        }
    }
}



class SimpleAccountStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }

    async _initialized(): Promise<number> {
        return this.$storage.get(['_initialized', ]);
    }

    async _initializing(): Promise<boolean> {
        return this.$storage.get(['_initializing', ]);
    }

    async owner(): Promise<TAddress> {
        return this.$storage.get(['owner', ]);
    }

    $slots = [
    {
        "slot": 0,
        "position": 0,
        "name": "_initialized",
        "size": 8,
        "type": "uint8"
    },
    {
        "slot": 0,
        "position": 8,
        "name": "_initializing",
        "size": 8,
        "type": "bool"
    },
    {
        "slot": 0,
        "position": 16,
        "name": "owner",
        "size": 160,
        "type": "address"
    }
]

}


interface ISimpleAccountTxCaller {
    validateUserOp (sender: TSender, userOp: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }, userOpHash: TEth.Hex, missingAccountFunds: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    validateUserOp (sender: TSender, userOp: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }, userOpHash: TEth.Hex, missingAccountFunds: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    tokensReceived (sender: TSender, operator: TAddress, from: TAddress, to: TAddress, amount: bigint, userData: TEth.Hex, operatorData: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    onERC721Received (sender: TSender, operator: TAddress, from: TAddress, tokenId: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    onERC1155Received (sender: TSender, operator: TAddress, from: TAddress, id: bigint, value: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    onERC1155BatchReceived (sender: TSender, operator: TAddress, from: TAddress, ids: bigint[], values: bigint[], data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    upgradeTo (sender: TSender, newImplementation: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    upgradeToAndCall (sender: TSender, newImplementation: TAddress, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execute (sender: TSender, dest: TAddress, value: bigint, func: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    executeBatch (sender: TSender, dest: TAddress[], func: TEth.Hex[]): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    initialize (sender: TSender, anOwner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    addDeposit (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    withdrawDepositTo (sender: TSender, withdrawAddress: TAddress, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface ISimpleAccountTxData {
    validateUserOp (sender: TSender, userOp: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }, userOpHash: TEth.Hex, missingAccountFunds: bigint): Promise<TEth.TxLike>
    validateUserOp (sender: TSender, userOp: { sender: TAddress, nonce: bigint, initCode: TEth.Hex, callData: TEth.Hex, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TEth.Hex, signature: TEth.Hex }, userOpHash: TEth.Hex, missingAccountFunds: bigint): Promise<TEth.TxLike>
    tokensReceived (sender: TSender, operator: TAddress, from: TAddress, to: TAddress, amount: bigint, userData: TEth.Hex, operatorData: TEth.Hex): Promise<TEth.TxLike>
    onERC721Received (sender: TSender, operator: TAddress, from: TAddress, tokenId: bigint, data: TEth.Hex): Promise<TEth.TxLike>
    onERC1155Received (sender: TSender, operator: TAddress, from: TAddress, id: bigint, value: bigint, data: TEth.Hex): Promise<TEth.TxLike>
    onERC1155BatchReceived (sender: TSender, operator: TAddress, from: TAddress, ids: bigint[], values: bigint[], data: TEth.Hex): Promise<TEth.TxLike>
    upgradeTo (sender: TSender, newImplementation: TAddress): Promise<TEth.TxLike>
    upgradeToAndCall (sender: TSender, newImplementation: TAddress, data: TEth.Hex): Promise<TEth.TxLike>
    execute (sender: TSender, dest: TAddress, value: bigint, func: TEth.Hex): Promise<TEth.TxLike>
    executeBatch (sender: TSender, dest: TAddress[], func: TEth.Hex[]): Promise<TEth.TxLike>
    initialize (sender: TSender, anOwner: TAddress): Promise<TEth.TxLike>
    addDeposit (sender: TSender, ): Promise<TEth.TxLike>
    withdrawDepositTo (sender: TSender, withdrawAddress: TAddress, amount: bigint): Promise<TEth.TxLike>
}


type TEvents = TSimpleAccountTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
