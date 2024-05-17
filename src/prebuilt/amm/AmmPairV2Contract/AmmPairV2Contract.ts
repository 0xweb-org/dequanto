/**
 *  AUTO-Generated Class: 2024-05-17 00:25
 *  Implementation: https://bscscan.com/address/0x7752e1fa9f3a2e860856458517008558deb989e3#code
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


import { Bscscan } from '@dequanto/explorer/Bscscan'
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client'



export class AmmPairV2Contract extends ContractBase {
    constructor(
        public address: TEth.Address = '0x7752e1fa9f3a2e860856458517008558deb989e3',
        public client: Web3Client = di.resolve(BscWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Bscscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new AmmPairV2ContractStorageReader(this.address, this.client, this.explorer);
    }

    Types: TAmmPairV2ContractTypes;

    $meta = {
        "class": "./src/prebuilt/amm/AmmPairV2Contract/AmmPairV2Contract.ts"
    }

    async $constructor (deployer: TSender, ): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0x3644e515
    async DOMAIN_SEPARATOR (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'DOMAIN_SEPARATOR'));
    }

    // 0xba9a7a56
    async MINIMUM_LIQUIDITY (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'MINIMUM_LIQUIDITY'));
    }

    // 0x30adf81f
    async PERMIT_TYPEHASH (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'PERMIT_TYPEHASH'));
    }

    // 0xdd62ed3e
    async allowance (input0: TAddress, input1: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'allowance'), input0, input1);
    }

    // 0x095ea7b3
    async approve (sender: TSender, spender: TAddress, value: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approve'), sender, spender, value);
    }

    // 0x70a08231
    async balanceOf (input0: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'balanceOf'), input0);
    }

    // 0x89afcb44
    async burn (sender: TSender, to: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'burn'), sender, to);
    }

    // 0x313ce567
    async decimals (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'decimals'));
    }

    // 0xc45a0155
    async factory (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'factory'));
    }

    // 0x0902f1ac
    async getReserves (): Promise<{ _reserve0: bigint, _reserve1: bigint, _blockTimestampLast: number }> {
        return this.$read(this.$getAbiItem('function', 'getReserves'));
    }

    // 0x485cc955
    async initialize (sender: TSender, _token0: TAddress, _token1: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'initialize'), sender, _token0, _token1);
    }

    // 0x7464fc3d
    async kLast (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'kLast'));
    }

    // 0x6a627842
    async mint (sender: TSender, to: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'mint'), sender, to);
    }

    // 0x06fdde03
    async name (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'name'));
    }

    // 0x7ecebe00
    async nonces (input0: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'nonces'), input0);
    }

    // 0xd505accf
    async permit (sender: TSender, owner: TAddress, spender: TAddress, value: bigint, deadline: bigint, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'permit'), sender, owner, spender, value, deadline, v, r, s);
    }

    // 0x5909c0d5
    async price0CumulativeLast (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'price0CumulativeLast'));
    }

    // 0x5a3d5493
    async price1CumulativeLast (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'price1CumulativeLast'));
    }

    // 0xbc25cf77
    async skim (sender: TSender, to: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'skim'), sender, to);
    }

    // 0x022c0d9f
    async swap (sender: TSender, amount0Out: bigint, amount1Out: bigint, to: TAddress, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swap'), sender, amount0Out, amount1Out, to, data);
    }

    // 0x95d89b41
    async symbol (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'symbol'));
    }

    // 0xfff6cae9
    async sync (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'sync'), sender);
    }

    // 0x0dfe1681
    async token0 (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'token0'));
    }

    // 0xd21220a7
    async token1 (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'token1'));
    }

    // 0x18160ddd
    async totalSupply (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'totalSupply'));
    }

    // 0xa9059cbb
    async transfer (sender: TSender, to: TAddress, value: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transfer'), sender, to, value);
    }

    // 0x23b872dd
    async transferFrom (sender: TSender, from: TAddress, to: TAddress, value: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferFrom'), sender, from, to, value);
    }

    $call () {
        return super.$call() as IAmmPairV2ContractTxCaller;
    }
    $signed (): TOverrideReturns<IAmmPairV2ContractTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IAmmPairV2ContractTxData {
        return super.$data() as IAmmPairV2ContractTxData;
    }
    $gas (): TOverrideReturns<IAmmPairV2ContractTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TAmmPairV2ContractTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TAmmPairV2ContractTypes['Methods'][TMethod]['arguments']
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

    onBurn (fn?: (event: TClientEventsStreamData<TEventArguments<'Burn'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Burn'>>> {
        return this.$onLog('Burn', fn);
    }

    onMint (fn?: (event: TClientEventsStreamData<TEventArguments<'Mint'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Mint'>>> {
        return this.$onLog('Mint', fn);
    }

    onSwap (fn?: (event: TClientEventsStreamData<TEventArguments<'Swap'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Swap'>>> {
        return this.$onLog('Swap', fn);
    }

    onSync (fn?: (event: TClientEventsStreamData<TEventArguments<'Sync'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Sync'>>> {
        return this.$onLog('Sync', fn);
    }

    onTransfer (fn?: (event: TClientEventsStreamData<TEventArguments<'Transfer'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Transfer'>>> {
        return this.$onLog('Transfer', fn);
    }

    extractLogsApproval (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Approval'>>[] {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Approval'>>[];
    }

    extractLogsBurn (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Burn'>>[] {
        let abi = this.$getAbiItem('event', 'Burn');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Burn'>>[];
    }

    extractLogsMint (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Mint'>>[] {
        let abi = this.$getAbiItem('event', 'Mint');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Mint'>>[];
    }

    extractLogsSwap (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Swap'>>[] {
        let abi = this.$getAbiItem('event', 'Swap');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Swap'>>[];
    }

    extractLogsSync (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Sync'>>[] {
        let abi = this.$getAbiItem('event', 'Sync');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Sync'>>[];
    }

    extractLogsTransfer (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Transfer'>>[] {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Transfer'>>[];
    }

    async getPastLogsApproval (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress,spender?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Approval'>>[]> {
        return await this.$getPastLogsParsed('Approval', options) as any;
    }

    async getPastLogsBurn (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Burn'>>[]> {
        return await this.$getPastLogsParsed('Burn', options) as any;
    }

    async getPastLogsMint (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Mint'>>[]> {
        return await this.$getPastLogsParsed('Mint', options) as any;
    }

    async getPastLogsSwap (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Swap'>>[]> {
        return await this.$getPastLogsParsed('Swap', options) as any;
    }

    async getPastLogsSync (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'Sync'>>[]> {
        return await this.$getPastLogsParsed('Sync', options) as any;
    }

    async getPastLogsTransfer (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { from?: TAddress,to?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Transfer'>>[]> {
        return await this.$getPastLogsParsed('Transfer', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]

    declare storage: AmmPairV2ContractStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TAmmPairV2ContractTypes = {
    Events: {
        Approval: {
            outputParams: { owner: TAddress, spender: TAddress, value: bigint },
            outputArgs:   [ owner: TAddress, spender: TAddress, value: bigint ],
        }
        Burn: {
            outputParams: { _sender: TAddress, amount0: bigint, amount1: bigint, to: TAddress },
            outputArgs:   [ _sender: TAddress, amount0: bigint, amount1: bigint, to: TAddress ],
        }
        Mint: {
            outputParams: { _sender: TAddress, amount0: bigint, amount1: bigint },
            outputArgs:   [ _sender: TAddress, amount0: bigint, amount1: bigint ],
        }
        Swap: {
            outputParams: { _sender: TAddress, amount0In: bigint, amount1In: bigint, amount0Out: bigint, amount1Out: bigint, to: TAddress },
            outputArgs:   [ _sender: TAddress, amount0In: bigint, amount1In: bigint, amount0Out: bigint, amount1Out: bigint, to: TAddress ],
        }
        Sync: {
            outputParams: { reserve0: bigint, reserve1: bigint },
            outputArgs:   [ reserve0: bigint, reserve1: bigint ],
        }
        Transfer: {
            outputParams: { from: TAddress, to: TAddress, value: bigint },
            outputArgs:   [ from: TAddress, to: TAddress, value: bigint ],
        }
    },
    Methods: {
        DOMAIN_SEPARATOR: {
          method: "DOMAIN_SEPARATOR"
          arguments: [  ]
        }
        MINIMUM_LIQUIDITY: {
          method: "MINIMUM_LIQUIDITY"
          arguments: [  ]
        }
        PERMIT_TYPEHASH: {
          method: "PERMIT_TYPEHASH"
          arguments: [  ]
        }
        allowance: {
          method: "allowance"
          arguments: [ input0: TAddress, input1: TAddress ]
        }
        approve: {
          method: "approve"
          arguments: [ spender: TAddress, value: bigint ]
        }
        balanceOf: {
          method: "balanceOf"
          arguments: [ input0: TAddress ]
        }
        burn: {
          method: "burn"
          arguments: [ to: TAddress ]
        }
        decimals: {
          method: "decimals"
          arguments: [  ]
        }
        factory: {
          method: "factory"
          arguments: [  ]
        }
        getReserves: {
          method: "getReserves"
          arguments: [  ]
        }
        initialize: {
          method: "initialize"
          arguments: [ _token0: TAddress, _token1: TAddress ]
        }
        kLast: {
          method: "kLast"
          arguments: [  ]
        }
        mint: {
          method: "mint"
          arguments: [ to: TAddress ]
        }
        name: {
          method: "name"
          arguments: [  ]
        }
        nonces: {
          method: "nonces"
          arguments: [ input0: TAddress ]
        }
        permit: {
          method: "permit"
          arguments: [ owner: TAddress, spender: TAddress, value: bigint, deadline: bigint, v: number, r: TEth.Hex, s: TEth.Hex ]
        }
        price0CumulativeLast: {
          method: "price0CumulativeLast"
          arguments: [  ]
        }
        price1CumulativeLast: {
          method: "price1CumulativeLast"
          arguments: [  ]
        }
        skim: {
          method: "skim"
          arguments: [ to: TAddress ]
        }
        swap: {
          method: "swap"
          arguments: [ amount0Out: bigint, amount1Out: bigint, to: TAddress, data: TEth.Hex ]
        }
        symbol: {
          method: "symbol"
          arguments: [  ]
        }
        sync: {
          method: "sync"
          arguments: [  ]
        }
        token0: {
          method: "token0"
          arguments: [  ]
        }
        token1: {
          method: "token1"
          arguments: [  ]
        }
        totalSupply: {
          method: "totalSupply"
          arguments: [  ]
        }
        transfer: {
          method: "transfer"
          arguments: [ to: TAddress, value: bigint ]
        }
        transferFrom: {
          method: "transferFrom"
          arguments: [ from: TAddress, to: TAddress, value: bigint ]
        }
    }
}



class AmmPairV2ContractStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }

    async totalSupply(): Promise<number> {
        return this.$storage.get(['totalSupply', ]);
    }

    async balanceOf(key: TAddress): Promise<number> {
        return this.$storage.get(['balanceOf', key]);
    }

    async allowance(key: TAddress): Promise<Record<string | number, number>> {
        return this.$storage.get(['allowance', key]);
    }

    async DOMAIN_SEPARATOR(): Promise<TEth.Hex> {
        return this.$storage.get(['DOMAIN_SEPARATOR', ]);
    }

    async nonces(key: TAddress): Promise<number> {
        return this.$storage.get(['nonces', key]);
    }

    async factory(): Promise<TAddress> {
        return this.$storage.get(['factory', ]);
    }

    async token0(): Promise<TAddress> {
        return this.$storage.get(['token0', ]);
    }

    async token1(): Promise<TAddress> {
        return this.$storage.get(['token1', ]);
    }

    async reserve0(): Promise<bigint> {
        return this.$storage.get(['reserve0', ]);
    }

    async reserve1(): Promise<bigint> {
        return this.$storage.get(['reserve1', ]);
    }

    async blockTimestampLast(): Promise<number> {
        return this.$storage.get(['blockTimestampLast', ]);
    }

    async price0CumulativeLast(): Promise<number> {
        return this.$storage.get(['price0CumulativeLast', ]);
    }

    async price1CumulativeLast(): Promise<number> {
        return this.$storage.get(['price1CumulativeLast', ]);
    }

    async kLast(): Promise<number> {
        return this.$storage.get(['kLast', ]);
    }

    async unlocked(): Promise<number> {
        return this.$storage.get(['unlocked', ]);
    }

    $slots = [
    {
        "slot": 0,
        "position": 0,
        "name": "totalSupply",
        "size": 256,
        "type": "uint"
    },
    {
        "slot": 1,
        "position": 0,
        "name": "balanceOf",
        "size": null,
        "type": "mapping(address => uint)"
    },
    {
        "slot": 2,
        "position": 0,
        "name": "allowance",
        "size": null,
        "type": "mapping(address => mapping(address => uint))"
    },
    {
        "slot": 3,
        "position": 0,
        "name": "DOMAIN_SEPARATOR",
        "size": 256,
        "type": "bytes32"
    },
    {
        "slot": 4,
        "position": 0,
        "name": "nonces",
        "size": null,
        "type": "mapping(address => uint)"
    },
    {
        "slot": 5,
        "position": 0,
        "name": "factory",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 6,
        "position": 0,
        "name": "token0",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 7,
        "position": 0,
        "name": "token1",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 8,
        "position": 0,
        "name": "reserve0",
        "size": 112,
        "type": "uint112"
    },
    {
        "slot": 8,
        "position": 112,
        "name": "reserve1",
        "size": 112,
        "type": "uint112"
    },
    {
        "slot": 8,
        "position": 224,
        "name": "blockTimestampLast",
        "size": 32,
        "type": "uint32"
    },
    {
        "slot": 9,
        "position": 0,
        "name": "price0CumulativeLast",
        "size": 256,
        "type": "uint"
    },
    {
        "slot": 10,
        "position": 0,
        "name": "price1CumulativeLast",
        "size": 256,
        "type": "uint"
    },
    {
        "slot": 11,
        "position": 0,
        "name": "kLast",
        "size": 256,
        "type": "uint"
    },
    {
        "slot": 12,
        "position": 0,
        "name": "unlocked",
        "size": 256,
        "type": "uint"
    }
]

}


interface IAmmPairV2ContractTxCaller {
    approve (sender: TSender, spender: TAddress, value: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    burn (sender: TSender, to: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    initialize (sender: TSender, _token0: TAddress, _token1: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    mint (sender: TSender, to: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    permit (sender: TSender, owner: TAddress, spender: TAddress, value: bigint, deadline: bigint, v: number, r: TEth.Hex, s: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    skim (sender: TSender, to: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swap (sender: TSender, amount0Out: bigint, amount1Out: bigint, to: TAddress, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    sync (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transfer (sender: TSender, to: TAddress, value: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferFrom (sender: TSender, from: TAddress, to: TAddress, value: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IAmmPairV2ContractTxData {
    approve (sender: TSender, spender: TAddress, value: bigint): Promise<TEth.TxLike>
    burn (sender: TSender, to: TAddress): Promise<TEth.TxLike>
    initialize (sender: TSender, _token0: TAddress, _token1: TAddress): Promise<TEth.TxLike>
    mint (sender: TSender, to: TAddress): Promise<TEth.TxLike>
    permit (sender: TSender, owner: TAddress, spender: TAddress, value: bigint, deadline: bigint, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TEth.TxLike>
    skim (sender: TSender, to: TAddress): Promise<TEth.TxLike>
    swap (sender: TSender, amount0Out: bigint, amount1Out: bigint, to: TAddress, data: TEth.Hex): Promise<TEth.TxLike>
    sync (sender: TSender, ): Promise<TEth.TxLike>
    transfer (sender: TSender, to: TAddress, value: bigint): Promise<TEth.TxLike>
    transferFrom (sender: TSender, from: TAddress, to: TAddress, value: bigint): Promise<TEth.TxLike>
}


type TEvents = TAmmPairV2ContractTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
