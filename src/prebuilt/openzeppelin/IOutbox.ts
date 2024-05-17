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

    Types: TIOutboxTypes;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/IOutbox.ts"
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
    async calculateItemHash (l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TEth.Hex): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'calculateItemHash'), l2Sender, to, l2Block, l1Block, l2Timestamp, value, data);
    }

    // 0x007436d3
    async calculateMerkleRoot (proof: TEth.Hex[], path: bigint, item: TEth.Hex): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'calculateMerkleRoot'), proof, path, item);
    }

    // 0x08635a95
    async executeTransaction (sender: TSender, proof: TEth.Hex[], index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'executeTransaction'), sender, proof, index, l2Sender, to, l2Block, l1Block, l2Timestamp, value, data);
    }

    // 0x288e5b10
    async executeTransactionSimulation (sender: TSender, index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TEth.Hex): Promise<TxWriter> {
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
    async l2ToL1OutputId (): Promise<TEth.Hex> {
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
    async roots (input0: TEth.Hex): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'roots'), input0);
    }

    // 0xd5b5cc23
    async spent (input0: bigint): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'spent'), input0);
    }

    // 0xa04cee60
    async updateSendRoot (sender: TSender, sendRoot: TEth.Hex, l2BlockHash: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'updateSendRoot'), sender, sendRoot, l2BlockHash);
    }

    $call () {
        return super.$call() as IIOutboxTxCaller;
    }
    $signed (): TOverrideReturns<IIOutboxTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IIOutboxTxData {
        return super.$data() as IIOutboxTxData;
    }
    $gas (): TOverrideReturns<IIOutboxTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TIOutboxTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TIOutboxTypes['Methods'][TMethod]['arguments']
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

    onOutBoxTransactionExecuted (fn?: (event: TClientEventsStreamData<TEventArguments<'OutBoxTransactionExecuted'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'OutBoxTransactionExecuted'>>> {
        return this.$onLog('OutBoxTransactionExecuted', fn);
    }

    onSendRootUpdated (fn?: (event: TClientEventsStreamData<TEventArguments<'SendRootUpdated'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'SendRootUpdated'>>> {
        return this.$onLog('SendRootUpdated', fn);
    }

    extractLogsOutBoxTransactionExecuted (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'OutBoxTransactionExecuted'>>[] {
        let abi = this.$getAbiItem('event', 'OutBoxTransactionExecuted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'OutBoxTransactionExecuted'>>[];
    }

    extractLogsSendRootUpdated (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'SendRootUpdated'>>[] {
        let abi = this.$getAbiItem('event', 'SendRootUpdated');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'SendRootUpdated'>>[];
    }

    async getPastLogsOutBoxTransactionExecuted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { to?: TAddress,l2Sender?: TAddress,zero?: bigint }
    }): Promise<ITxLogItem<TEventParams<'OutBoxTransactionExecuted'>>[]> {
        return await this.$getPastLogsParsed('OutBoxTransactionExecuted', options) as any;
    }

    async getPastLogsSendRootUpdated (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { blockHash?: TEth.Hex,outputRoot?: TEth.Hex }
    }): Promise<ITxLogItem<TEventParams<'SendRootUpdated'>>[]> {
        return await this.$getPastLogsParsed('SendRootUpdated', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"address","name":"l2Sender","type":"address"},{"indexed":true,"internalType":"uint256","name":"zero","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"transactionIndex","type":"uint256"}],"name":"OutBoxTransactionExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"blockHash","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"outputRoot","type":"bytes32"}],"name":"SendRootUpdated","type":"event"},{"inputs":[],"name":"OUTBOX_VERSION","outputs":[{"internalType":"uint128","name":"","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bridge","outputs":[{"internalType":"contract IBridge","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"l2Sender","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"l2Block","type":"uint256"},{"internalType":"uint256","name":"l1Block","type":"uint256"},{"internalType":"uint256","name":"l2Timestamp","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"calculateItemHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"},{"internalType":"uint256","name":"path","type":"uint256"},{"internalType":"bytes32","name":"item","type":"bytes32"}],"name":"calculateMerkleRoot","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"l2Sender","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"l2Block","type":"uint256"},{"internalType":"uint256","name":"l1Block","type":"uint256"},{"internalType":"uint256","name":"l2Timestamp","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"executeTransaction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"l2Sender","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"l2Block","type":"uint256"},{"internalType":"uint256","name":"l1Block","type":"uint256"},{"internalType":"uint256","name":"l2Timestamp","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"executeTransactionSimulation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"isSpent","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2ToL1Block","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2ToL1EthBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2ToL1OutputId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2ToL1Sender","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2ToL1Timestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rollup","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"roots","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"spent","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"sendRoot","type":"bytes32"},{"internalType":"bytes32","name":"l2BlockHash","type":"bytes32"}],"name":"updateSendRoot","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TIOutboxTypes = {
    Events: {
        OutBoxTransactionExecuted: {
            outputParams: { to: TAddress, l2Sender: TAddress, zero: bigint, transactionIndex: bigint },
            outputArgs:   [ to: TAddress, l2Sender: TAddress, zero: bigint, transactionIndex: bigint ],
        }
        SendRootUpdated: {
            outputParams: { blockHash: TEth.Hex, outputRoot: TEth.Hex },
            outputArgs:   [ blockHash: TEth.Hex, outputRoot: TEth.Hex ],
        }
    },
    Methods: {
        OUTBOX_VERSION: {
          method: "OUTBOX_VERSION"
          arguments: [  ]
        }
        bridge: {
          method: "bridge"
          arguments: [  ]
        }
        calculateItemHash: {
          method: "calculateItemHash"
          arguments: [ l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TEth.Hex ]
        }
        calculateMerkleRoot: {
          method: "calculateMerkleRoot"
          arguments: [ proof: TEth.Hex[], path: bigint, item: TEth.Hex ]
        }
        executeTransaction: {
          method: "executeTransaction"
          arguments: [ proof: TEth.Hex[], index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TEth.Hex ]
        }
        executeTransactionSimulation: {
          method: "executeTransactionSimulation"
          arguments: [ index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TEth.Hex ]
        }
        isSpent: {
          method: "isSpent"
          arguments: [ index: bigint ]
        }
        l2ToL1Block: {
          method: "l2ToL1Block"
          arguments: [  ]
        }
        l2ToL1EthBlock: {
          method: "l2ToL1EthBlock"
          arguments: [  ]
        }
        l2ToL1OutputId: {
          method: "l2ToL1OutputId"
          arguments: [  ]
        }
        l2ToL1Sender: {
          method: "l2ToL1Sender"
          arguments: [  ]
        }
        l2ToL1Timestamp: {
          method: "l2ToL1Timestamp"
          arguments: [  ]
        }
        rollup: {
          method: "rollup"
          arguments: [  ]
        }
        roots: {
          method: "roots"
          arguments: [ input0: TEth.Hex ]
        }
        spent: {
          method: "spent"
          arguments: [ input0: bigint ]
        }
        updateSendRoot: {
          method: "updateSendRoot"
          arguments: [ sendRoot: TEth.Hex, l2BlockHash: TEth.Hex ]
        }
    }
}



interface IIOutboxTxCaller {
    executeTransaction (sender: TSender, proof: TEth.Hex[], index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    executeTransactionSimulation (sender: TSender, index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    updateSendRoot (sender: TSender, sendRoot: TEth.Hex, l2BlockHash: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIOutboxTxData {
    executeTransaction (sender: TSender, proof: TEth.Hex[], index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TEth.Hex): Promise<TEth.TxLike>
    executeTransactionSimulation (sender: TSender, index: bigint, l2Sender: TAddress, to: TAddress, l2Block: bigint, l1Block: bigint, l2Timestamp: bigint, value: bigint, data: TEth.Hex): Promise<TEth.TxLike>
    updateSendRoot (sender: TSender, sendRoot: TEth.Hex, l2BlockHash: TEth.Hex): Promise<TEth.TxLike>
}


type TEvents = TIOutboxTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
