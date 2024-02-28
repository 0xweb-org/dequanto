/**
 *  AUTO-Generated Class: 2024-02-27 17:40
 *  Implementation: https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code
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



export class WETH extends ContractBase {
    constructor(
        public address: TEth.Address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new WETHStorageReader(this.address, this.client, this.explorer);
    }

    Types: TWETHTypes;

    $meta = {
        "class": "./contracts/weth/WETH/WETH.ts"
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
    $signed (): TOverrideReturns<IWETHTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IWETHTxData {
        return super.$data() as IWETHTxData;
    }
    $gas (): TOverrideReturns<IWETHTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TWETHTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TWETHTypes['Methods'][TMethod]['arguments']
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

    onApproval (fn?: (event: TClientEventsStreamData<TEventArguments<'Approval'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Approval'>>> {
        return this.$onLog('Approval', fn);
    }

    onTransfer (fn?: (event: TClientEventsStreamData<TEventArguments<'Transfer'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Transfer'>>> {
        return this.$onLog('Transfer', fn);
    }

    onDeposit (fn?: (event: TClientEventsStreamData<TEventArguments<'Deposit'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Deposit'>>> {
        return this.$onLog('Deposit', fn);
    }

    onWithdrawal (fn?: (event: TClientEventsStreamData<TEventArguments<'Withdrawal'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Withdrawal'>>> {
        return this.$onLog('Withdrawal', fn);
    }

    extractLogsApproval (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Approval'>>[] {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Approval'>>[];
    }

    extractLogsTransfer (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Transfer'>>[] {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Transfer'>>[];
    }

    extractLogsDeposit (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Deposit'>>[] {
        let abi = this.$getAbiItem('event', 'Deposit');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Deposit'>>[];
    }

    extractLogsWithdrawal (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Withdrawal'>>[] {
        let abi = this.$getAbiItem('event', 'Withdrawal');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Withdrawal'>>[];
    }

    async getPastLogsApproval (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { src?: TAddress,guy?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Approval'>>[]> {
        return await this.$getPastLogsParsed('Approval', options) as any;
    }

    async getPastLogsTransfer (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { src?: TAddress,dst?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Transfer'>>[]> {
        return await this.$getPastLogsParsed('Transfer', options) as any;
    }

    async getPastLogsDeposit (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { dst?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Deposit'>>[]> {
        return await this.$getPastLogsParsed('Deposit', options) as any;
    }

    async getPastLogsWithdrawal (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { src?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Withdrawal'>>[]> {
        return await this.$getPastLogsParsed('Withdrawal', options) as any;
    }

    abi: TAbiItem[] = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]

    declare storage: WETHStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TWETHTypes = {
    Events: {
        Approval: {
            outputParams: { src: TAddress, guy: TAddress, wad: bigint },
            outputArgs:   [ src: TAddress, guy: TAddress, wad: bigint ],
        }
        Transfer: {
            outputParams: { src: TAddress, dst: TAddress, wad: bigint },
            outputArgs:   [ src: TAddress, dst: TAddress, wad: bigint ],
        }
        Deposit: {
            outputParams: { dst: TAddress, wad: bigint },
            outputArgs:   [ dst: TAddress, wad: bigint ],
        }
        Withdrawal: {
            outputParams: { src: TAddress, wad: bigint },
            outputArgs:   [ src: TAddress, wad: bigint ],
        }
    },
    Methods: {
        name: {
          method: "name"
          arguments: [  ]
        }
        approve: {
          method: "approve"
          arguments: [ guy: TAddress, wad: bigint ]
        }
        totalSupply: {
          method: "totalSupply"
          arguments: [  ]
        }
        transferFrom: {
          method: "transferFrom"
          arguments: [ src: TAddress, dst: TAddress, wad: bigint ]
        }
        withdraw: {
          method: "withdraw"
          arguments: [ wad: bigint ]
        }
        decimals: {
          method: "decimals"
          arguments: [  ]
        }
        balanceOf: {
          method: "balanceOf"
          arguments: [ input0: TAddress ]
        }
        symbol: {
          method: "symbol"
          arguments: [  ]
        }
        transfer: {
          method: "transfer"
          arguments: [ dst: TAddress, wad: bigint ]
        }
        deposit: {
          method: "deposit"
          arguments: [  ]
        }
        allowance: {
          method: "allowance"
          arguments: [ input0: TAddress, input1: TAddress ]
        }
    }
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

    async allowance(key: TAddress): Promise<Record<string | number, number>> {
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


type TEvents = TWETHTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
