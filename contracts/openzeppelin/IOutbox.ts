/**
 *  AUTO-Generated Class: 2023-11-05 00:36
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
import type { TOverrideReturns } from '@dequanto/utils/types';


import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class IOutbox extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    

    // 0xc75184df
    async OUTBOX_VERSION (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'OUTBOX_VERSION'));
    }

    // 0xe78cea92
    async bridge (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'bridge'));
    }

    // 0x9f0c04bf
    async calculateItemHash (l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TBufferLike): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'calculateItemHash'), l2Sender, to, l2Block, l1Block, l2Timestamp, value, data);
    }

    // 0x007436d3
    async calculateMerkleRoot (proof: TBufferLike[], path: bigint, item: TBufferLike): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'calculateMerkleRoot'), proof, path, item);
    }

    // 0x08635a95
    async executeTransaction (sender: TSender, proof: TBufferLike[], index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'executeTransaction'), sender, proof, index, l2Sender, to, l2Block, l1Block, l2Timestamp, value, data);
    }

    // 0x288e5b10
    async executeTransactionSimulation (sender: TSender, index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'executeTransactionSimulation'), sender, index, l2Sender, to, l2Block, l1Block, l2Timestamp, value, data);
    }

    // 0x5a129efe
    async isSpent (index: bigint): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isSpent'), index);
    }

    // 0x46547790
    async l2ToL1Block (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'l2ToL1Block'));
    }

    // 0x8515bc6a
    async l2ToL1EthBlock (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'l2ToL1EthBlock'));
    }

    // 0x72f2a8c7
    async l2ToL1OutputId (): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'l2ToL1OutputId'));
    }

    // 0x80648b02
    async l2ToL1Sender (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'l2ToL1Sender'));
    }

    // 0xb0f30537
    async l2ToL1Timestamp (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'l2ToL1Timestamp'));
    }

    // 0xcb23bcb5
    async rollup (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'rollup'));
    }

    // 0xae6dead7
    async roots (input0: TBufferLike): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'roots'), input0);
    }

    // 0xd5b5cc23
    async spent (input0: bigint): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'spent'), input0);
    }

    // 0xa04cee60
    async updateSendRoot (sender: TSender, sendRoot: TBufferLike, l2BlockHash: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'updateSendRoot'), sender, sendRoot, l2BlockHash);
    }

    $call () {
        return super.$call() as IIOutboxTxCaller;
    }

    $data (): IIOutboxTxData {
        return super.$data() as IIOutboxTxData;
    }
    $gas (): TOverrideReturns<IIOutboxTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onOutBoxTransactionExecuted (fn?: (event: TClientEventsStreamData<TLogOutBoxTransactionExecutedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogOutBoxTransactionExecutedParameters>> {
        return this.$onLog('OutBoxTransactionExecuted', fn);
    }

    onSendRootUpdated (fn?: (event: TClientEventsStreamData<TLogSendRootUpdatedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogSendRootUpdatedParameters>> {
        return this.$onLog('SendRootUpdated', fn);
    }

    extractLogsOutBoxTransactionExecuted (tx: TEth.TxReceipt): ITxLogItem<TLogOutBoxTransactionExecuted>[] {
        let abi = this.$getAbiItem('event', 'OutBoxTransactionExecuted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogOutBoxTransactionExecuted>[];
    }

    extractLogsSendRootUpdated (tx: TEth.TxReceipt): ITxLogItem<TLogSendRootUpdated>[] {
        let abi = this.$getAbiItem('event', 'SendRootUpdated');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogSendRootUpdated>[];
    }

    async getPastLogsOutBoxTransactionExecuted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { to?: TAddress,l2Sender?: TAddress,zero?: bigint }
    }): Promise<ITxLogItem<TLogOutBoxTransactionExecuted>[]> {
        return await this.$getPastLogsParsed('OutBoxTransactionExecuted', options) as any;
    }

    async getPastLogsSendRootUpdated (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { blockHash?: TBufferLike,outputRoot?: TBufferLike }
    }): Promise<ITxLogItem<TLogSendRootUpdated>[]> {
        return await this.$getPastLogsParsed('SendRootUpdated', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"address","name":"l2Sender","type":"address"},{"indexed":true,"internalType":"uint256","name":"zero","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"transactionIndex","type":"uint256"}],"name":"OutBoxTransactionExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"blockHash","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"outputRoot","type":"bytes32"}],"name":"SendRootUpdated","type":"event"},{"inputs":[],"name":"OUTBOX_VERSION","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bridge","outputs":[{"internalType":"contract IBridge","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"l2Sender","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"l2Block","type":"uint256"},{"internalType":"uint256","name":"l1Block","type":"uint256"},{"internalType":"uint256","name":"l2Timestamp","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"calculateItemHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"},{"internalType":"uint256","name":"path","type":"uint256"},{"internalType":"bytes32","name":"item","type":"bytes32"}],"name":"calculateMerkleRoot","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"l2Sender","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"l2Block","type":"uint256"},{"internalType":"uint256","name":"l1Block","type":"uint256"},{"internalType":"uint256","name":"l2Timestamp","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"executeTransaction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"l2Sender","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"l2Block","type":"uint256"},{"internalType":"uint256","name":"l1Block","type":"uint256"},{"internalType":"uint256","name":"l2Timestamp","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"executeTransactionSimulation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"isSpent","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2ToL1Block","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2ToL1EthBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2ToL1OutputId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2ToL1Sender","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2ToL1Timestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rollup","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"roots","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"spent","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"sendRoot","type":"bytes32"},{"internalType":"bytes32","name":"l2BlockHash","type":"bytes32"}],"name":"updateSendRoot","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogOutBoxTransactionExecuted = {
        to: TAddress, l2Sender: TAddress, zero: bigint, transactionIndex: bigint
    };
    type TLogOutBoxTransactionExecutedParameters = [ to: TAddress, l2Sender: TAddress, zero: bigint, transactionIndex: bigint ];
    type TLogSendRootUpdated = {
        blockHash: TBufferLike, outputRoot: TBufferLike
    };
    type TLogSendRootUpdatedParameters = [ blockHash: TBufferLike, outputRoot: TBufferLike ];

interface IEvents {
  OutBoxTransactionExecuted: TLogOutBoxTransactionExecutedParameters
  SendRootUpdated: TLogSendRootUpdatedParameters
  '*': any[] 
}



interface IMethodOUTBOX_VERSION {
  method: "OUTBOX_VERSION"
  arguments: [  ]
}

interface IMethodBridge {
  method: "bridge"
  arguments: [  ]
}

interface IMethodCalculateItemHash {
  method: "calculateItemHash"
  arguments: [ l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TBufferLike ]
}

interface IMethodCalculateMerkleRoot {
  method: "calculateMerkleRoot"
  arguments: [ proof: TBufferLike[], path: bigint, item: TBufferLike ]
}

interface IMethodExecuteTransaction {
  method: "executeTransaction"
  arguments: [ proof: TBufferLike[], index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TBufferLike ]
}

interface IMethodExecuteTransactionSimulation {
  method: "executeTransactionSimulation"
  arguments: [ index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TBufferLike ]
}

interface IMethodIsSpent {
  method: "isSpent"
  arguments: [ index: bigint ]
}

interface IMethodL2ToL1Block {
  method: "l2ToL1Block"
  arguments: [  ]
}

interface IMethodL2ToL1EthBlock {
  method: "l2ToL1EthBlock"
  arguments: [  ]
}

interface IMethodL2ToL1OutputId {
  method: "l2ToL1OutputId"
  arguments: [  ]
}

interface IMethodL2ToL1Sender {
  method: "l2ToL1Sender"
  arguments: [  ]
}

interface IMethodL2ToL1Timestamp {
  method: "l2ToL1Timestamp"
  arguments: [  ]
}

interface IMethodRollup {
  method: "rollup"
  arguments: [  ]
}

interface IMethodRoots {
  method: "roots"
  arguments: [ input0: TBufferLike ]
}

interface IMethodSpent {
  method: "spent"
  arguments: [ input0: bigint ]
}

interface IMethodUpdateSendRoot {
  method: "updateSendRoot"
  arguments: [ sendRoot: TBufferLike, l2BlockHash: TBufferLike ]
}

interface IMethods {
  OUTBOX_VERSION: IMethodOUTBOX_VERSION
  bridge: IMethodBridge
  calculateItemHash: IMethodCalculateItemHash
  calculateMerkleRoot: IMethodCalculateMerkleRoot
  executeTransaction: IMethodExecuteTransaction
  executeTransactionSimulation: IMethodExecuteTransactionSimulation
  isSpent: IMethodIsSpent
  l2ToL1Block: IMethodL2ToL1Block
  l2ToL1EthBlock: IMethodL2ToL1EthBlock
  l2ToL1OutputId: IMethodL2ToL1OutputId
  l2ToL1Sender: IMethodL2ToL1Sender
  l2ToL1Timestamp: IMethodL2ToL1Timestamp
  rollup: IMethodRollup
  roots: IMethodRoots
  spent: IMethodSpent
  updateSendRoot: IMethodUpdateSendRoot
  '*': { method: string, arguments: any[] } 
}






interface IIOutboxTxCaller {
    executeTransaction (sender: TSender, proof: TBufferLike[], index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    executeTransactionSimulation (sender: TSender, index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    updateSendRoot (sender: TSender, sendRoot: TBufferLike, l2BlockHash: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIOutboxTxData {
    executeTransaction (sender: TSender, proof: TBufferLike[], index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TBufferLike): Promise<TEth.TxLike>
    executeTransactionSimulation (sender: TSender, index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TBufferLike): Promise<TEth.TxLike>
    updateSendRoot (sender: TSender, sendRoot: TBufferLike, l2BlockHash: TBufferLike): Promise<TEth.TxLike>
}


