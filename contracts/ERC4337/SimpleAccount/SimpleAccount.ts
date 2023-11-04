/**
 *  AUTO-Generated Class: 2023-10-05 18:18
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
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';


import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class SimpleAccount extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0x4a58db19
    async addDeposit (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'addDeposit'), sender);
    }

    // 0xb0d691fe
    async entryPoint (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'entryPoint'));
    }

    // 0xb61d27f6
    async execute (sender: TSender, dest: TAddress, value: bigint, func: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'execute'), sender, dest, value, func);
    }

    // 0x18dfb3c7
    async executeBatch (sender: TSender, dest: TAddress[], func: TBufferLike[]): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'executeBatch'), sender, dest, func);
    }

    // 0xc399ec88
    async getDeposit (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getDeposit'));
    }

    // 0xd087d288
    async getNonce (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getNonce'));
    }

    // 0xc4d66de8
    async initialize (sender: TSender, anOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'initialize'), sender, anOwner);
    }

    // 0xbc197c81
    async onERC1155BatchReceived (input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TBufferLike): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'onERC1155BatchReceived'), input0, input1, input2, input3, input4);
    }

    // 0xf23a6e61
    async onERC1155Received (input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TBufferLike): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'onERC1155Received'), input0, input1, input2, input3, input4);
    }

    // 0x150b7a02
    async onERC721Received (input0: TAddress, input1: TAddress, input2: bigint, input3: TBufferLike): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'onERC721Received'), input0, input1, input2, input3);
    }

    // 0x8da5cb5b
    async owner (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'owner'));
    }

    // 0x52d1902d
    async proxiableUUID (): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'proxiableUUID'));
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceId: TBufferLike): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceId);
    }

    // 0x0023de29
    async tokensReceived (input0: TAddress, input1: TAddress, input2: TAddress, input3: bigint, input4: TBufferLike, input5: TBufferLike): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'tokensReceived'), input0, input1, input2, input3, input4, input5);
    }

    // 0x3659cfe6
    async upgradeTo (sender: TSender, newImplementation: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'upgradeTo'), sender, newImplementation);
    }

    // 0x4f1ef286
    async upgradeToAndCall (sender: TSender, newImplementation: TAddress, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'upgradeToAndCall'), sender, newImplementation, data);
    }

    // 0x3a871cdd
    async validateUserOp (sender: TSender, userOp: { sender: TAddress, nonce: bigint, initCode: TBufferLike, callData: TBufferLike, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TBufferLike, signature: TBufferLike }, userOpHash: TBufferLike, missingAccountFunds: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'validateUserOp'), sender, userOp, userOpHash, missingAccountFunds);
    }

    // 0x4d44560d
    async withdrawDepositTo (sender: TSender, withdrawAddress: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdrawDepositTo'), sender, withdrawAddress, amount);
    }

    $call () {
        return super.$call() as ISimpleAccountTxCaller;;
    }

    $data (): ISimpleAccountTxData {
        return super.$data() as ISimpleAccountTxData;
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

    onUpgraded (fn?: (event: TClientEventsStreamData<TLogUpgradedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogUpgradedParameters>> {
        return this.$onLog('Upgraded', fn);
    }

    extractLogsAdminChanged (tx: TEth.TxReceipt): ITxLogItem<TLogAdminChanged>[] {
        let abi = this.$getAbiItem('event', 'AdminChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogAdminChanged>[];
    }

    extractLogsBeaconUpgraded (tx: TEth.TxReceipt): ITxLogItem<TLogBeaconUpgraded>[] {
        let abi = this.$getAbiItem('event', 'BeaconUpgraded');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogBeaconUpgraded>[];
    }

    extractLogsInitialized (tx: TEth.TxReceipt): ITxLogItem<TLogInitialized>[] {
        let abi = this.$getAbiItem('event', 'Initialized');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogInitialized>[];
    }

    extractLogsSimpleAccountInitialized (tx: TEth.TxReceipt): ITxLogItem<TLogSimpleAccountInitialized>[] {
        let abi = this.$getAbiItem('event', 'SimpleAccountInitialized');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogSimpleAccountInitialized>[];
    }

    extractLogsUpgraded (tx: TEth.TxReceipt): ITxLogItem<TLogUpgraded>[] {
        let abi = this.$getAbiItem('event', 'Upgraded');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogUpgraded>[];
    }

    async getPastLogsAdminChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogAdminChanged>[]> {
        return await this.$getPastLogsParsed('AdminChanged', options) as any;
    }

    async getPastLogsBeaconUpgraded (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { beacon?: TAddress }
    }): Promise<ITxLogItem<TLogBeaconUpgraded>[]> {
        return await this.$getPastLogsParsed('BeaconUpgraded', options) as any;
    }

    async getPastLogsInitialized (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogInitialized>[]> {
        return await this.$getPastLogsParsed('Initialized', options) as any;
    }

    async getPastLogsSimpleAccountInitialized (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { entryPoint?: TAddress,owner?: TAddress }
    }): Promise<ITxLogItem<TLogSimpleAccountInitialized>[]> {
        return await this.$getPastLogsParsed('SimpleAccountInitialized', options) as any;
    }

    async getPastLogsUpgraded (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { implementation?: TAddress }
    }): Promise<ITxLogItem<TLogUpgraded>[]> {
        return await this.$getPastLogsParsed('Upgraded', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"contract IEntryPoint","name":"anEntryPoint","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IEntryPoint","name":"entryPoint","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"SimpleAccountInitialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"inputs":[],"name":"addDeposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"entryPoint","outputs":[{"internalType":"contract IEntryPoint","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"dest","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"func","type":"bytes"}],"name":"execute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"dest","type":"address[]"},{"internalType":"bytes[]","name":"func","type":"bytes[]"}],"name":"executeBatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getDeposit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"anOwner","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"tokensReceived","outputs":[],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"initCode","type":"bytes"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"uint256","name":"callGasLimit","type":"uint256"},{"internalType":"uint256","name":"verificationGasLimit","type":"uint256"},{"internalType":"uint256","name":"preVerificationGas","type":"uint256"},{"internalType":"uint256","name":"maxFeePerGas","type":"uint256"},{"internalType":"uint256","name":"maxPriorityFeePerGas","type":"uint256"},{"internalType":"bytes","name":"paymasterAndData","type":"bytes"},{"internalType":"bytes","name":"signature","type":"bytes"}],"internalType":"struct UserOperation","name":"userOp","type":"tuple"},{"internalType":"bytes32","name":"userOpHash","type":"bytes32"},{"internalType":"uint256","name":"missingAccountFunds","type":"uint256"}],"name":"validateUserOp","outputs":[{"internalType":"uint256","name":"validationData","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"withdrawAddress","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawDepositTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]

    storage = new SimpleAccountStorageReader(this.address, this.client, this.explorer);
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogAdminChanged = {
        previousAdmin: TAddress, newAdmin: TAddress
    };
    type TLogAdminChangedParameters = [ previousAdmin: TAddress, newAdmin: TAddress ];
    type TLogBeaconUpgraded = {
        beacon: TAddress
    };
    type TLogBeaconUpgradedParameters = [ beacon: TAddress ];
    type TLogInitialized = {
        version: number
    };
    type TLogInitializedParameters = [ version: number ];
    type TLogSimpleAccountInitialized = {
        entryPoint: TAddress, owner: TAddress
    };
    type TLogSimpleAccountInitializedParameters = [ entryPoint: TAddress, owner: TAddress ];
    type TLogUpgraded = {
        implementation: TAddress
    };
    type TLogUpgradedParameters = [ implementation: TAddress ];

interface IEvents {
  AdminChanged: TLogAdminChangedParameters
  BeaconUpgraded: TLogBeaconUpgradedParameters
  Initialized: TLogInitializedParameters
  SimpleAccountInitialized: TLogSimpleAccountInitializedParameters
  Upgraded: TLogUpgradedParameters
  '*': any[]
}



interface IMethodAddDeposit {
  method: "addDeposit"
  arguments: [  ]
}

interface IMethodEntryPoint {
  method: "entryPoint"
  arguments: [  ]
}

interface IMethodExecute {
  method: "execute"
  arguments: [ dest: TAddress, value: bigint, func: TBufferLike ]
}

interface IMethodExecuteBatch {
  method: "executeBatch"
  arguments: [ dest: TAddress[], func: TBufferLike[] ]
}

interface IMethodGetDeposit {
  method: "getDeposit"
  arguments: [  ]
}

interface IMethodGetNonce {
  method: "getNonce"
  arguments: [  ]
}

interface IMethodInitialize {
  method: "initialize"
  arguments: [ anOwner: TAddress ]
}

interface IMethodOnERC1155BatchReceived {
  method: "onERC1155BatchReceived"
  arguments: [ input0: TAddress, input1: TAddress, input2: bigint[], input3: bigint[], input4: TBufferLike ]
}

interface IMethodOnERC1155Received {
  method: "onERC1155Received"
  arguments: [ input0: TAddress, input1: TAddress, input2: bigint, input3: bigint, input4: TBufferLike ]
}

interface IMethodOnERC721Received {
  method: "onERC721Received"
  arguments: [ input0: TAddress, input1: TAddress, input2: bigint, input3: TBufferLike ]
}

interface IMethodOwner {
  method: "owner"
  arguments: [  ]
}

interface IMethodProxiableUUID {
  method: "proxiableUUID"
  arguments: [  ]
}

interface IMethodSupportsInterface {
  method: "supportsInterface"
  arguments: [ interfaceId: TBufferLike ]
}

interface IMethodTokensReceived {
  method: "tokensReceived"
  arguments: [ input0: TAddress, input1: TAddress, input2: TAddress, input3: bigint, input4: TBufferLike, input5: TBufferLike ]
}

interface IMethodUpgradeTo {
  method: "upgradeTo"
  arguments: [ newImplementation: TAddress ]
}

interface IMethodUpgradeToAndCall {
  method: "upgradeToAndCall"
  arguments: [ newImplementation: TAddress, data: TBufferLike ]
}

interface IMethodValidateUserOp {
  method: "validateUserOp"
  arguments: [ userOp: { sender: TAddress, nonce: bigint, initCode: TBufferLike, callData: TBufferLike, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TBufferLike, signature: TBufferLike }, userOpHash: TBufferLike, missingAccountFunds: bigint ]
}

interface IMethodWithdrawDepositTo {
  method: "withdrawDepositTo"
  arguments: [ withdrawAddress: TAddress, amount: bigint ]
}

interface IMethods {
  addDeposit: IMethodAddDeposit
  entryPoint: IMethodEntryPoint
  execute: IMethodExecute
  executeBatch: IMethodExecuteBatch
  getDeposit: IMethodGetDeposit
  getNonce: IMethodGetNonce
  initialize: IMethodInitialize
  onERC1155BatchReceived: IMethodOnERC1155BatchReceived
  onERC1155Received: IMethodOnERC1155Received
  onERC721Received: IMethodOnERC721Received
  owner: IMethodOwner
  proxiableUUID: IMethodProxiableUUID
  supportsInterface: IMethodSupportsInterface
  tokensReceived: IMethodTokensReceived
  upgradeTo: IMethodUpgradeTo
  upgradeToAndCall: IMethodUpgradeToAndCall
  validateUserOp: IMethodValidateUserOp
  withdrawDepositTo: IMethodWithdrawDepositTo
  '*': { method: string, arguments: any[] }
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

    async accountImplementation(): Promise<TAddress> {
        return this.$storage.get(['accountImplementation', ]);
    }

    $slots = [
    {
        "slot": 0,
        "position": 0,
        "name": "accountImplementation",
        "size": 160,
        "type": "address"
    }
]

}



interface ISimpleAccountTxCaller {
    addDeposit (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    execute (sender: TSender, dest: TAddress, value: bigint, func: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    executeBatch (sender: TSender, dest: TAddress[], func: TBufferLike[]): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    initialize (sender: TSender, anOwner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    upgradeTo (sender: TSender, newImplementation: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    upgradeToAndCall (sender: TSender, newImplementation: TAddress, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    validateUserOp (sender: TSender, userOp: { sender: TAddress, nonce: bigint, initCode: TBufferLike, callData: TBufferLike, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TBufferLike, signature: TBufferLike }, userOpHash: TBufferLike, missingAccountFunds: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    withdrawDepositTo (sender: TSender, withdrawAddress: TAddress, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface ISimpleAccountTxData {
    addDeposit (sender: TSender, ): Promise<TEth.TxLike>
    execute (sender: TSender, dest: TAddress, value: bigint, func: TBufferLike): Promise<TEth.TxLike>
    executeBatch (sender: TSender, dest: TAddress[], func: TBufferLike[]): Promise<TEth.TxLike>
    initialize (sender: TSender, anOwner: TAddress): Promise<TEth.TxLike>
    upgradeTo (sender: TSender, newImplementation: TAddress): Promise<TEth.TxLike>
    upgradeToAndCall (sender: TSender, newImplementation: TAddress, data: TBufferLike): Promise<TEth.TxLike>
    validateUserOp (sender: TSender, userOp: { sender: TAddress, nonce: bigint, initCode: TBufferLike, callData: TBufferLike, callGasLimit: bigint, verificationGasLimit: bigint, preVerificationGas: bigint, maxFeePerGas: bigint, maxPriorityFeePerGas: bigint, paymasterAndData: TBufferLike, signature: TBufferLike }, userOpHash: TBufferLike, missingAccountFunds: bigint): Promise<TEth.TxLike>
    withdrawDepositTo (sender: TSender, withdrawAddress: TAddress, amount: bigint): Promise<TEth.TxLike>
}


