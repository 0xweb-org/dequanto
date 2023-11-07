/**
 *  AUTO-Generated Class: 2023-11-05 00:36
 *  Implementation: https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code
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



export class WETH extends ContractBase {
    constructor(
        public address: TEth.Address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new WETHStorageReader(this.address, this.client, this.explorer);
    }

    

    // 0x06fdde03
    async name (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'name'));
    }

    // 0x095ea7b3
    async approve (sender: TSender, guy: TAddress, wad: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approve'), sender, guy, wad);
    }

    // 0x18160ddd
    async totalSupply (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'totalSupply'));
    }

    // 0x23b872dd
    async transferFrom (sender: TSender, src: TAddress, dst: TAddress, wad: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferFrom'), sender, src, dst, wad);
    }

    // 0x2e1a7d4d
    async withdraw (sender: TSender, wad: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdraw'), sender, wad);
    }

    // 0x313ce567
    async decimals (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'decimals'));
    }

    // 0x70a08231
    async balanceOf (input0: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'balanceOf'), input0);
    }

    // 0x95d89b41
    async symbol (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'symbol'));
    }

    // 0xa9059cbb
    async transfer (sender: TSender, dst: TAddress, wad: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transfer'), sender, dst, wad);
    }

    // 0xd0e30db0
    async deposit (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'deposit'), sender);
    }

    // 0xdd62ed3e
    async allowance (input0: TAddress, input1: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'allowance'), input0, input1);
    }

    $call () {
        return super.$call() as IWETHTxCaller;
    }

    $data (): IWETHTxData {
        return super.$data() as IWETHTxData;
    }
    $gas (): TOverrideReturns<IWETHTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onApproval (fn?: (event: TClientEventsStreamData<TLogApprovalParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogApprovalParameters>> {
        return this.$onLog('Approval', fn);
    }

    onTransfer (fn?: (event: TClientEventsStreamData<TLogTransferParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogTransferParameters>> {
        return this.$onLog('Transfer', fn);
    }

    onDeposit (fn?: (event: TClientEventsStreamData<TLogDepositParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDepositParameters>> {
        return this.$onLog('Deposit', fn);
    }

    onWithdrawal (fn?: (event: TClientEventsStreamData<TLogWithdrawalParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogWithdrawalParameters>> {
        return this.$onLog('Withdrawal', fn);
    }

    extractLogsApproval (tx: TEth.TxReceipt): ITxLogItem<TLogApproval>[] {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApproval>[];
    }

    extractLogsTransfer (tx: TEth.TxReceipt): ITxLogItem<TLogTransfer>[] {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogTransfer>[];
    }

    extractLogsDeposit (tx: TEth.TxReceipt): ITxLogItem<TLogDeposit>[] {
        let abi = this.$getAbiItem('event', 'Deposit');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDeposit>[];
    }

    extractLogsWithdrawal (tx: TEth.TxReceipt): ITxLogItem<TLogWithdrawal>[] {
        let abi = this.$getAbiItem('event', 'Withdrawal');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogWithdrawal>[];
    }

    async getPastLogsApproval (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { src?: TAddress,guy?: TAddress }
    }): Promise<ITxLogItem<TLogApproval>[]> {
        return await this.$getPastLogsParsed('Approval', options) as any;
    }

    async getPastLogsTransfer (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { src?: TAddress,dst?: TAddress }
    }): Promise<ITxLogItem<TLogTransfer>[]> {
        return await this.$getPastLogsParsed('Transfer', options) as any;
    }

    async getPastLogsDeposit (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { dst?: TAddress }
    }): Promise<ITxLogItem<TLogDeposit>[]> {
        return await this.$getPastLogsParsed('Deposit', options) as any;
    }

    async getPastLogsWithdrawal (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { src?: TAddress }
    }): Promise<ITxLogItem<TLogWithdrawal>[]> {
        return await this.$getPastLogsParsed('Withdrawal', options) as any;
    }

    abi: TAbiItem[] = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]

    storage: WETHStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogApproval = {
        src: TAddress, guy: TAddress, wad: bigint
    };
    type TLogApprovalParameters = [ src: TAddress, guy: TAddress, wad: bigint ];
    type TLogTransfer = {
        src: TAddress, dst: TAddress, wad: bigint
    };
    type TLogTransferParameters = [ src: TAddress, dst: TAddress, wad: bigint ];
    type TLogDeposit = {
        dst: TAddress, wad: bigint
    };
    type TLogDepositParameters = [ dst: TAddress, wad: bigint ];
    type TLogWithdrawal = {
        src: TAddress, wad: bigint
    };
    type TLogWithdrawalParameters = [ src: TAddress, wad: bigint ];

interface IEvents {
  Approval: TLogApprovalParameters
  Transfer: TLogTransferParameters
  Deposit: TLogDepositParameters
  Withdrawal: TLogWithdrawalParameters
  '*': any[] 
}



interface IMethodName {
  method: "name"
  arguments: [  ]
}

interface IMethodApprove {
  method: "approve"
  arguments: [ guy: TAddress, wad: bigint ]
}

interface IMethodTotalSupply {
  method: "totalSupply"
  arguments: [  ]
}

interface IMethodTransferFrom {
  method: "transferFrom"
  arguments: [ src: TAddress, dst: TAddress, wad: bigint ]
}

interface IMethodWithdraw {
  method: "withdraw"
  arguments: [ wad: bigint ]
}

interface IMethodDecimals {
  method: "decimals"
  arguments: [  ]
}

interface IMethodBalanceOf {
  method: "balanceOf"
  arguments: [ input0: TAddress ]
}

interface IMethodSymbol {
  method: "symbol"
  arguments: [  ]
}

interface IMethodTransfer {
  method: "transfer"
  arguments: [ dst: TAddress, wad: bigint ]
}

interface IMethodDeposit {
  method: "deposit"
  arguments: [  ]
}

interface IMethodAllowance {
  method: "allowance"
  arguments: [ input0: TAddress, input1: TAddress ]
}

interface IMethods {
  name: IMethodName
  approve: IMethodApprove
  totalSupply: IMethodTotalSupply
  transferFrom: IMethodTransferFrom
  withdraw: IMethodWithdraw
  decimals: IMethodDecimals
  balanceOf: IMethodBalanceOf
  symbol: IMethodSymbol
  transfer: IMethodTransfer
  deposit: IMethodDeposit
  allowance: IMethodAllowance
  '*': { method: string, arguments: any[] } 
}





class WETHStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }

    async name(): Promise<string> {
        return this.$storage.get(['name', ]);
    }

    async symbol(): Promise<string> {
        return this.$storage.get(['symbol', ]);
    }

    async decimals(): Promise<number> {
        return this.$storage.get(['decimals', ]);
    }

    async balanceOf(key: TAddress): Promise<number> {
        return this.$storage.get(['balanceOf', key]);
    }

    async allowance(key: TAddress): Promise<Record<TAddress, number>> {
        return this.$storage.get(['allowance', key]);
    }

    $slots = [
    {
        "slot": 0,
        "position": 0,
        "name": "name",
        "size": null,
        "type": "string"
    },
    {
        "slot": 1,
        "position": 0,
        "name": "symbol",
        "size": null,
        "type": "string"
    },
    {
        "slot": 2,
        "position": 0,
        "name": "decimals",
        "size": 8,
        "type": "uint8"
    },
    {
        "slot": 3,
        "position": 0,
        "name": "balanceOf",
        "size": null,
        "type": "mapping(address => uint)"
    },
    {
        "slot": 4,
        "position": 0,
        "name": "allowance",
        "size": null,
        "type": "mapping(address => mapping(address => uint))"
    }
]

}



interface IWETHTxCaller {
    approve (sender: TSender, guy: TAddress, wad: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferFrom (sender: TSender, src: TAddress, dst: TAddress, wad: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    withdraw (sender: TSender, wad: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transfer (sender: TSender, dst: TAddress, wad: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    deposit (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IWETHTxData {
    approve (sender: TSender, guy: TAddress, wad: bigint): Promise<TEth.TxLike>
    transferFrom (sender: TSender, src: TAddress, dst: TAddress, wad: bigint): Promise<TEth.TxLike>
    withdraw (sender: TSender, wad: bigint): Promise<TEth.TxLike>
    transfer (sender: TSender, dst: TAddress, wad: bigint): Promise<TEth.TxLike>
    deposit (sender: TSender, ): Promise<TEth.TxLike>
}


