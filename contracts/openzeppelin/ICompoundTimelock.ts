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
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';


import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class ICompoundTimelock extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0xc1a287e2
    async GRACE_PERIOD (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'GRACE_PERIOD'));
    }

    // 0x7d645fab
    async MAXIMUM_DELAY (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'MAXIMUM_DELAY'));
    }

    // 0xb1b43ae5
    async MINIMUM_DELAY (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'MINIMUM_DELAY'));
    }

    // 0x0e18b681
    async acceptAdmin (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'acceptAdmin'), sender);
    }

    // 0xf851a440
    async admin (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'admin'));
    }

    // 0x591fcdfe
    async cancelTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'cancelTransaction'), sender, target, value, signature, data, eta);
    }

    // 0x6a42b8f8
    async delay (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'delay'));
    }

    // 0x0825f38f
    async executeTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'executeTransaction'), sender, target, value, signature, data, eta);
    }

    // 0x26782247
    async pendingAdmin (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'pendingAdmin'));
    }

    // 0x3a66f901
    async queueTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'queueTransaction'), sender, target, value, signature, data, eta);
    }

    // 0xf2b06537
    async queuedTransactions (input0: TBufferLike): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'queuedTransactions'), input0);
    }

    // 0xe177246e
    async setDelay (sender: TSender, input0: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setDelay'), sender, input0);
    }

    // 0x4dd18bf5
    async setPendingAdmin (sender: TSender, input0: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setPendingAdmin'), sender, input0);
    }

    $call () {
        return super.$call() as IICompoundTimelockTxCaller;;
    }

    $data (): IICompoundTimelockTxData {
        return super.$data() as IICompoundTimelockTxData;
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

    onCancelTransaction (fn?: (event: TClientEventsStreamData<TLogCancelTransactionParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogCancelTransactionParameters>> {
        return this.$onLog('CancelTransaction', fn);
    }

    onExecuteTransaction (fn?: (event: TClientEventsStreamData<TLogExecuteTransactionParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogExecuteTransactionParameters>> {
        return this.$onLog('ExecuteTransaction', fn);
    }

    onNewAdmin (fn?: (event: TClientEventsStreamData<TLogNewAdminParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogNewAdminParameters>> {
        return this.$onLog('NewAdmin', fn);
    }

    onNewDelay (fn?: (event: TClientEventsStreamData<TLogNewDelayParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogNewDelayParameters>> {
        return this.$onLog('NewDelay', fn);
    }

    onNewPendingAdmin (fn?: (event: TClientEventsStreamData<TLogNewPendingAdminParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogNewPendingAdminParameters>> {
        return this.$onLog('NewPendingAdmin', fn);
    }

    onQueueTransaction (fn?: (event: TClientEventsStreamData<TLogQueueTransactionParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogQueueTransactionParameters>> {
        return this.$onLog('QueueTransaction', fn);
    }

    extractLogsCancelTransaction (tx: TEth.TxReceipt): ITxLogItem<TLogCancelTransaction>[] {
        let abi = this.$getAbiItem('event', 'CancelTransaction');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogCancelTransaction>[];
    }

    extractLogsExecuteTransaction (tx: TEth.TxReceipt): ITxLogItem<TLogExecuteTransaction>[] {
        let abi = this.$getAbiItem('event', 'ExecuteTransaction');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogExecuteTransaction>[];
    }

    extractLogsNewAdmin (tx: TEth.TxReceipt): ITxLogItem<TLogNewAdmin>[] {
        let abi = this.$getAbiItem('event', 'NewAdmin');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogNewAdmin>[];
    }

    extractLogsNewDelay (tx: TEth.TxReceipt): ITxLogItem<TLogNewDelay>[] {
        let abi = this.$getAbiItem('event', 'NewDelay');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogNewDelay>[];
    }

    extractLogsNewPendingAdmin (tx: TEth.TxReceipt): ITxLogItem<TLogNewPendingAdmin>[] {
        let abi = this.$getAbiItem('event', 'NewPendingAdmin');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogNewPendingAdmin>[];
    }

    extractLogsQueueTransaction (tx: TEth.TxReceipt): ITxLogItem<TLogQueueTransaction>[] {
        let abi = this.$getAbiItem('event', 'QueueTransaction');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogQueueTransaction>[];
    }

    async getPastLogsCancelTransaction (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { txHash?: TBufferLike,target?: TAddress }
    }): Promise<ITxLogItem<TLogCancelTransaction>[]> {
        return await this.$getPastLogsParsed('CancelTransaction', options) as any;
    }

    async getPastLogsExecuteTransaction (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { txHash?: TBufferLike,target?: TAddress }
    }): Promise<ITxLogItem<TLogExecuteTransaction>[]> {
        return await this.$getPastLogsParsed('ExecuteTransaction', options) as any;
    }

    async getPastLogsNewAdmin (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { newAdmin?: TAddress }
    }): Promise<ITxLogItem<TLogNewAdmin>[]> {
        return await this.$getPastLogsParsed('NewAdmin', options) as any;
    }

    async getPastLogsNewDelay (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { newDelay?: bigint }
    }): Promise<ITxLogItem<TLogNewDelay>[]> {
        return await this.$getPastLogsParsed('NewDelay', options) as any;
    }

    async getPastLogsNewPendingAdmin (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { newPendingAdmin?: TAddress }
    }): Promise<ITxLogItem<TLogNewPendingAdmin>[]> {
        return await this.$getPastLogsParsed('NewPendingAdmin', options) as any;
    }

    async getPastLogsQueueTransaction (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { txHash?: TBufferLike,target?: TAddress }
    }): Promise<ITxLogItem<TLogQueueTransaction>[]> {
        return await this.$getPastLogsParsed('QueueTransaction', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"string","name":"signature","type":"string"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"eta","type":"uint256"}],"name":"CancelTransaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"string","name":"signature","type":"string"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"eta","type":"uint256"}],"name":"ExecuteTransaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newAdmin","type":"address"}],"name":"NewAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"newDelay","type":"uint256"}],"name":"NewDelay","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newPendingAdmin","type":"address"}],"name":"NewPendingAdmin","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"target","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"string","name":"signature","type":"string"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"eta","type":"uint256"}],"name":"QueueTransaction","type":"event"},{"inputs":[],"name":"GRACE_PERIOD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAXIMUM_DELAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINIMUM_DELAY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"acceptAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"string","name":"signature","type":"string"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"eta","type":"uint256"}],"name":"cancelTransaction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"delay","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"string","name":"signature","type":"string"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"eta","type":"uint256"}],"name":"executeTransaction","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"pendingAdmin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"target","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"string","name":"signature","type":"string"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"uint256","name":"eta","type":"uint256"}],"name":"queueTransaction","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"queuedTransactions","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"setDelay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"setPendingAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogCancelTransaction = {
        txHash: TBufferLike, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint
    };
    type TLogCancelTransactionParameters = [ txHash: TBufferLike, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint ];
    type TLogExecuteTransaction = {
        txHash: TBufferLike, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint
    };
    type TLogExecuteTransactionParameters = [ txHash: TBufferLike, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint ];
    type TLogNewAdmin = {
        newAdmin: TAddress
    };
    type TLogNewAdminParameters = [ newAdmin: TAddress ];
    type TLogNewDelay = {
        newDelay: bigint
    };
    type TLogNewDelayParameters = [ newDelay: bigint ];
    type TLogNewPendingAdmin = {
        newPendingAdmin: TAddress
    };
    type TLogNewPendingAdminParameters = [ newPendingAdmin: TAddress ];
    type TLogQueueTransaction = {
        txHash: TBufferLike, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint
    };
    type TLogQueueTransactionParameters = [ txHash: TBufferLike, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint ];

interface IEvents {
  CancelTransaction: TLogCancelTransactionParameters
  ExecuteTransaction: TLogExecuteTransactionParameters
  NewAdmin: TLogNewAdminParameters
  NewDelay: TLogNewDelayParameters
  NewPendingAdmin: TLogNewPendingAdminParameters
  QueueTransaction: TLogQueueTransactionParameters
  '*': any[] 
}



interface IMethodGRACE_PERIOD {
  method: "GRACE_PERIOD"
  arguments: [  ]
}

interface IMethodMAXIMUM_DELAY {
  method: "MAXIMUM_DELAY"
  arguments: [  ]
}

interface IMethodMINIMUM_DELAY {
  method: "MINIMUM_DELAY"
  arguments: [  ]
}

interface IMethodAcceptAdmin {
  method: "acceptAdmin"
  arguments: [  ]
}

interface IMethodAdmin {
  method: "admin"
  arguments: [  ]
}

interface IMethodCancelTransaction {
  method: "cancelTransaction"
  arguments: [ target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint ]
}

interface IMethodDelay {
  method: "delay"
  arguments: [  ]
}

interface IMethodExecuteTransaction {
  method: "executeTransaction"
  arguments: [ target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint ]
}

interface IMethodPendingAdmin {
  method: "pendingAdmin"
  arguments: [  ]
}

interface IMethodQueueTransaction {
  method: "queueTransaction"
  arguments: [ target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint ]
}

interface IMethodQueuedTransactions {
  method: "queuedTransactions"
  arguments: [ input0: TBufferLike ]
}

interface IMethodSetDelay {
  method: "setDelay"
  arguments: [ input0: bigint ]
}

interface IMethodSetPendingAdmin {
  method: "setPendingAdmin"
  arguments: [ input0: TAddress ]
}

interface IMethods {
  GRACE_PERIOD: IMethodGRACE_PERIOD
  MAXIMUM_DELAY: IMethodMAXIMUM_DELAY
  MINIMUM_DELAY: IMethodMINIMUM_DELAY
  acceptAdmin: IMethodAcceptAdmin
  admin: IMethodAdmin
  cancelTransaction: IMethodCancelTransaction
  delay: IMethodDelay
  executeTransaction: IMethodExecuteTransaction
  pendingAdmin: IMethodPendingAdmin
  queueTransaction: IMethodQueueTransaction
  queuedTransactions: IMethodQueuedTransactions
  setDelay: IMethodSetDelay
  setPendingAdmin: IMethodSetPendingAdmin
  '*': { method: string, arguments: any[] } 
}






interface IICompoundTimelockTxCaller {
    acceptAdmin (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    cancelTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    executeTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    queueTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setDelay (sender: TSender, input0: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setPendingAdmin (sender: TSender, input0: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IICompoundTimelockTxData {
    acceptAdmin (sender: TSender, ): Promise<TEth.TxLike>
    cancelTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint): Promise<TEth.TxLike>
    executeTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint): Promise<TEth.TxLike>
    queueTransaction (sender: TSender, target: TAddress, value: bigint, signature: string, data: TBufferLike, eta: bigint): Promise<TEth.TxLike>
    setDelay (sender: TSender, input0: bigint): Promise<TEth.TxLike>
    setPendingAdmin (sender: TSender, input0: TAddress): Promise<TEth.TxLike>
}


