/**
 *  AUTO-Generated Class: 2023-11-05 00:36
 *  Implementation: https://bscscan.com/address/0x11111112542d85b3ef69ae05771c2dccff4faa26#code
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


import { Bscscan } from '@dequanto/explorer/Bscscan'
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client'



export class OneInchRouterContract extends ContractBase {
    constructor(
        public address: TEth.Address = '0x11111112542d85b3ef69ae05771c2dccff4faa26',
        public client: Web3Client = di.resolve(BscWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Bscscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new OneInchRouterContractStorageReader(this.address, this.client, this.explorer);
    }

    

    // 0x83197ef0
    async destroy (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'destroy'), sender);
    }

    // 0x6c4a483e
    async discountedSwap (sender: TSender, caller: TAddress, desc: { srcToken: TAddress, dstToken: TAddress, srcReceiver: TAddress, dstReceiver: TAddress, amount: bigint, minReturnAmount: bigint, flags: bigint, permit: TBufferLike }, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'discountedSwap'), sender, caller, desc, data);
    }

    // 0x8da5cb5b
    async owner (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'owner'));
    }

    // 0x715018a6
    async renounceOwnership (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renounceOwnership'), sender);
    }

    // 0x78e3214f
    async rescueFunds (sender: TSender, token: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'rescueFunds'), sender, token, amount);
    }

    // 0x7c025200
    async swap (sender: TSender, caller: TAddress, desc: { srcToken: TAddress, dstToken: TAddress, srcReceiver: TAddress, dstReceiver: TAddress, amount: bigint, minReturnAmount: bigint, flags: bigint, permit: TBufferLike }, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swap'), sender, caller, desc, data);
    }

    // 0xf2fde38b
    async transferOwnership (sender: TSender, newOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferOwnership'), sender, newOwner);
    }

    // 0x2e95b6c8
    async unoswap (sender: TSender, srcToken: TAddress, amount: bigint, minReturn: bigint, input3: TBufferLike[]): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'unoswap'), sender, srcToken, amount, minReturn, input3);
    }

    // 0xa1251d75
    async unoswapWithPermit (sender: TSender, srcToken: TAddress, amount: bigint, minReturn: bigint, pools: TBufferLike[], permit: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'unoswapWithPermit'), sender, srcToken, amount, minReturn, pools, permit);
    }

    $call () {
        return super.$call() as IOneInchRouterContractTxCaller;
    }

    $data (): IOneInchRouterContractTxData {
        return super.$data() as IOneInchRouterContractTxData;
    }
    $gas (): TOverrideReturns<IOneInchRouterContractTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onError (fn?: (event: TClientEventsStreamData<TLogErrorParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogErrorParameters>> {
        return this.$onLog('Error', fn);
    }

    onOwnershipTransferred (fn?: (event: TClientEventsStreamData<TLogOwnershipTransferredParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogOwnershipTransferredParameters>> {
        return this.$onLog('OwnershipTransferred', fn);
    }

    onSwapped (fn?: (event: TClientEventsStreamData<TLogSwappedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogSwappedParameters>> {
        return this.$onLog('Swapped', fn);
    }

    extractLogsError (tx: TEth.TxReceipt): ITxLogItem<TLogError>[] {
        let abi = this.$getAbiItem('event', 'Error');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogError>[];
    }

    extractLogsOwnershipTransferred (tx: TEth.TxReceipt): ITxLogItem<TLogOwnershipTransferred>[] {
        let abi = this.$getAbiItem('event', 'OwnershipTransferred');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogOwnershipTransferred>[];
    }

    extractLogsSwapped (tx: TEth.TxReceipt): ITxLogItem<TLogSwapped>[] {
        let abi = this.$getAbiItem('event', 'Swapped');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogSwapped>[];
    }

    async getPastLogsError (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogError>[]> {
        return await this.$getPastLogsParsed('Error', options) as any;
    }

    async getPastLogsOwnershipTransferred (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { previousOwner?: TAddress,newOwner?: TAddress }
    }): Promise<ITxLogItem<TLogOwnershipTransferred>[]> {
        return await this.$getPastLogsParsed('OwnershipTransferred', options) as any;
    }

    async getPastLogsSwapped (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogSwapped>[]> {
        return await this.$getPastLogsParsed('Swapped', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"Error","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"contract IERC20","name":"srcToken","type":"address"},{"indexed":false,"internalType":"contract IERC20","name":"dstToken","type":"address"},{"indexed":false,"internalType":"address","name":"dstReceiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"spentAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"returnAmount","type":"uint256"}],"name":"Swapped","type":"event"},{"inputs":[],"name":"destroy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IAggregationExecutor","name":"caller","type":"address"},{"components":[{"internalType":"contract IERC20","name":"srcToken","type":"address"},{"internalType":"contract IERC20","name":"dstToken","type":"address"},{"internalType":"address","name":"srcReceiver","type":"address"},{"internalType":"address","name":"dstReceiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturnAmount","type":"uint256"},{"internalType":"uint256","name":"flags","type":"uint256"},{"internalType":"bytes","name":"permit","type":"bytes"}],"internalType":"struct AggregationRouterV3.SwapDescription","name":"desc","type":"tuple"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"discountedSwap","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"},{"internalType":"uint256","name":"gasLeft","type":"uint256"},{"internalType":"uint256","name":"chiSpent","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rescueFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IAggregationExecutor","name":"caller","type":"address"},{"components":[{"internalType":"contract IERC20","name":"srcToken","type":"address"},{"internalType":"contract IERC20","name":"dstToken","type":"address"},{"internalType":"address","name":"srcReceiver","type":"address"},{"internalType":"address","name":"dstReceiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturnAmount","type":"uint256"},{"internalType":"uint256","name":"flags","type":"uint256"},{"internalType":"bytes","name":"permit","type":"bytes"}],"internalType":"struct AggregationRouterV3.SwapDescription","name":"desc","type":"tuple"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"},{"internalType":"uint256","name":"gasLeft","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"srcToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturn","type":"uint256"},{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"name":"unoswap","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"srcToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturn","type":"uint256"},{"internalType":"bytes32[]","name":"pools","type":"bytes32[]"},{"internalType":"bytes","name":"permit","type":"bytes"}],"name":"unoswapWithPermit","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]

    storage: OneInchRouterContractStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogError = {
        reason: string
    };
    type TLogErrorParameters = [ reason: string ];
    type TLogOwnershipTransferred = {
        previousOwner: TAddress, newOwner: TAddress
    };
    type TLogOwnershipTransferredParameters = [ previousOwner: TAddress, newOwner: TAddress ];
    type TLogSwapped = {
        _sender: TAddress, srcToken: TAddress, dstToken: TAddress, dstReceiver: TAddress, spentAmount: bigint, returnAmount: bigint
    };
    type TLogSwappedParameters = [ _sender: TAddress, srcToken: TAddress, dstToken: TAddress, dstReceiver: TAddress, spentAmount: bigint, returnAmount: bigint ];

interface IEvents {
  Error: TLogErrorParameters
  OwnershipTransferred: TLogOwnershipTransferredParameters
  Swapped: TLogSwappedParameters
  '*': any[] 
}



interface IMethodDestroy {
  method: "destroy"
  arguments: [  ]
}

interface IMethodDiscountedSwap {
  method: "discountedSwap"
  arguments: [ caller: TAddress, desc: { srcToken: TAddress, dstToken: TAddress, srcReceiver: TAddress, dstReceiver: TAddress, amount: bigint, minReturnAmount: bigint, flags: bigint, permit: TBufferLike }, data: TBufferLike ]
}

interface IMethodOwner {
  method: "owner"
  arguments: [  ]
}

interface IMethodRenounceOwnership {
  method: "renounceOwnership"
  arguments: [  ]
}

interface IMethodRescueFunds {
  method: "rescueFunds"
  arguments: [ token: TAddress, amount: bigint ]
}

interface IMethodSwap {
  method: "swap"
  arguments: [ caller: TAddress, desc: { srcToken: TAddress, dstToken: TAddress, srcReceiver: TAddress, dstReceiver: TAddress, amount: bigint, minReturnAmount: bigint, flags: bigint, permit: TBufferLike }, data: TBufferLike ]
}

interface IMethodTransferOwnership {
  method: "transferOwnership"
  arguments: [ newOwner: TAddress ]
}

interface IMethodUnoswap {
  method: "unoswap"
  arguments: [ srcToken: TAddress, amount: bigint, minReturn: bigint, input3: TBufferLike[] ]
}

interface IMethodUnoswapWithPermit {
  method: "unoswapWithPermit"
  arguments: [ srcToken: TAddress, amount: bigint, minReturn: bigint, pools: TBufferLike[], permit: TBufferLike ]
}

interface IMethods {
  destroy: IMethodDestroy
  discountedSwap: IMethodDiscountedSwap
  owner: IMethodOwner
  renounceOwnership: IMethodRenounceOwnership
  rescueFunds: IMethodRescueFunds
  swap: IMethodSwap
  transferOwnership: IMethodTransferOwnership
  unoswap: IMethodUnoswap
  unoswapWithPermit: IMethodUnoswapWithPermit
  '*': { method: string, arguments: any[] } 
}





class OneInchRouterContractStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }

    async _owner(): Promise<TAddress> {
        return this.$storage.get(['_owner', ]);
    }

    $slots = [
    {
        "slot": 0,
        "position": 0,
        "name": "_owner",
        "size": 160,
        "type": "address"
    }
]

}



interface IOneInchRouterContractTxCaller {
    destroy (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    discountedSwap (sender: TSender, caller: TAddress, desc: { srcToken: TAddress, dstToken: TAddress, srcReceiver: TAddress, dstReceiver: TAddress, amount: bigint, minReturnAmount: bigint, flags: bigint, permit: TBufferLike }, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceOwnership (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    rescueFunds (sender: TSender, token: TAddress, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swap (sender: TSender, caller: TAddress, desc: { srcToken: TAddress, dstToken: TAddress, srcReceiver: TAddress, dstReceiver: TAddress, amount: bigint, minReturnAmount: bigint, flags: bigint, permit: TBufferLike }, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    unoswap (sender: TSender, srcToken: TAddress, amount: bigint, minReturn: bigint, input3: TBufferLike[]): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    unoswapWithPermit (sender: TSender, srcToken: TAddress, amount: bigint, minReturn: bigint, pools: TBufferLike[], permit: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IOneInchRouterContractTxData {
    destroy (sender: TSender, ): Promise<TEth.TxLike>
    discountedSwap (sender: TSender, caller: TAddress, desc: { srcToken: TAddress, dstToken: TAddress, srcReceiver: TAddress, dstReceiver: TAddress, amount: bigint, minReturnAmount: bigint, flags: bigint, permit: TBufferLike }, data: TBufferLike): Promise<TEth.TxLike>
    renounceOwnership (sender: TSender, ): Promise<TEth.TxLike>
    rescueFunds (sender: TSender, token: TAddress, amount: bigint): Promise<TEth.TxLike>
    swap (sender: TSender, caller: TAddress, desc: { srcToken: TAddress, dstToken: TAddress, srcReceiver: TAddress, dstReceiver: TAddress, amount: bigint, minReturnAmount: bigint, flags: bigint, permit: TBufferLike }, data: TBufferLike): Promise<TEth.TxLike>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<TEth.TxLike>
    unoswap (sender: TSender, srcToken: TAddress, amount: bigint, minReturn: bigint, input3: TBufferLike[]): Promise<TEth.TxLike>
    unoswapWithPermit (sender: TSender, srcToken: TAddress, amount: bigint, minReturn: bigint, pools: TBufferLike[], permit: TBufferLike): Promise<TEth.TxLike>
}


