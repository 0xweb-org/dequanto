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



export class PaymentSplitter extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockchainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)


    }

    Types: TPaymentSplitterTypes;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/PaymentSplitter.ts"
    }

    async $constructor (deployer: TSender, payees: TAddress[], shares_: bigint[]): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0x8b83209b
    async payee (index: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'payee'), index);
    }

    // 0xa3f8eace
    async releasable (account: TAddress): Promise<bigint>
    // 0xc45ac050
    async releasable (token: TAddress, account: TAddress): Promise<bigint>
    async releasable (...args): Promise<bigint> {
        let abi = this.$getAbiItemOverload([ 'function releasable(address) returns uint256', 'function releasable(address, address) returns uint256' ], args);
        return this.$read(abi, ...args);
    }

    // 0x19165587
    async release (sender: TSender, account: TAddress): Promise<TxWriter>
    // 0x48b75044
    async release (sender: TSender, token: TAddress, account: TAddress): Promise<TxWriter>
    async release (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function release(address)', 'function release(address, address)' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0x406072a9
    async released (token: TAddress, account: TAddress): Promise<bigint>
    // 0x9852595c
    async released (account: TAddress): Promise<bigint>
    async released (...args): Promise<bigint> {
        let abi = this.$getAbiItemOverload([ 'function released(address, address) returns uint256', 'function released(address) returns uint256' ], args);
        return this.$read(abi, ...args);
    }

    // 0xce7c2ac2
    async shares (account: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'shares'), account);
    }

    // 0xd79779b2
    async totalReleased (token: TAddress): Promise<bigint>
    // 0xe33b7de3
    async totalReleased (): Promise<bigint>
    async totalReleased (...args): Promise<bigint> {
        let abi = this.$getAbiItemOverload([ 'function totalReleased(address) returns uint256', 'function totalReleased() returns uint256' ], args);
        return this.$read(abi, ...args);
    }

    // 0x3a98ef39
    async totalShares (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'totalShares'));
    }

    $call () {
        return super.$call() as IPaymentSplitterTxCaller;
    }
    $signed (): TOverrideReturns<IPaymentSplitterTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IPaymentSplitterTxData {
        return super.$data() as IPaymentSplitterTxData;
    }
    $gas (): TOverrideReturns<IPaymentSplitterTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TPaymentSplitterTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TPaymentSplitterTypes['Methods'][TMethod]['arguments']
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

    onERC20PaymentReleased (fn?: (event: TClientEventsStreamData<TEventArguments<'ERC20PaymentReleased'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ERC20PaymentReleased'>>> {
        return this.$onLog('ERC20PaymentReleased', fn);
    }

    onPayeeAdded (fn?: (event: TClientEventsStreamData<TEventArguments<'PayeeAdded'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'PayeeAdded'>>> {
        return this.$onLog('PayeeAdded', fn);
    }

    onPaymentReceived (fn?: (event: TClientEventsStreamData<TEventArguments<'PaymentReceived'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'PaymentReceived'>>> {
        return this.$onLog('PaymentReceived', fn);
    }

    onPaymentReleased (fn?: (event: TClientEventsStreamData<TEventArguments<'PaymentReleased'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'PaymentReleased'>>> {
        return this.$onLog('PaymentReleased', fn);
    }

    extractLogsERC20PaymentReleased (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ERC20PaymentReleased'>>[] {
        let abi = this.$getAbiItem('event', 'ERC20PaymentReleased');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ERC20PaymentReleased'>>[];
    }

    extractLogsPayeeAdded (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'PayeeAdded'>>[] {
        let abi = this.$getAbiItem('event', 'PayeeAdded');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'PayeeAdded'>>[];
    }

    extractLogsPaymentReceived (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'PaymentReceived'>>[] {
        let abi = this.$getAbiItem('event', 'PaymentReceived');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'PaymentReceived'>>[];
    }

    extractLogsPaymentReleased (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'PaymentReleased'>>[] {
        let abi = this.$getAbiItem('event', 'PaymentReleased');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'PaymentReleased'>>[];
    }

    async getPastLogsERC20PaymentReleased (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { token?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ERC20PaymentReleased'>>[]> {
        return await this.$getPastLogsParsed('ERC20PaymentReleased', options) as any;
    }

    async getPastLogsPayeeAdded (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'PayeeAdded'>>[]> {
        return await this.$getPastLogsParsed('PayeeAdded', options) as any;
    }

    async getPastLogsPaymentReceived (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'PaymentReceived'>>[]> {
        return await this.$getPastLogsParsed('PaymentReceived', options) as any;
    }

    async getPastLogsPaymentReleased (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'PaymentReleased'>>[]> {
        return await this.$getPastLogsParsed('PaymentReleased', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"address[]","name":"payees","type":"address[]"},{"internalType":"uint256[]","name":"shares_","type":"uint256[]"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ERC20PaymentReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"PayeeAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PaymentReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PaymentReleased","type":"event"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"payee","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"address","name":"account","type":"address"}],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"account","type":"address"}],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"address","name":"account","type":"address"}],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"address","name":"account","type":"address"}],"name":"released","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"released","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"shares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"}],"name":"totalReleased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalReleased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TPaymentSplitterTypes = {
    Events: {
        ERC20PaymentReleased: {
            outputParams: { token: TAddress, to: TAddress, amount: bigint },
            outputArgs:   [ token: TAddress, to: TAddress, amount: bigint ],
        }
        PayeeAdded: {
            outputParams: { account: TAddress, shares: bigint },
            outputArgs:   [ account: TAddress, shares: bigint ],
        }
        PaymentReceived: {
            outputParams: { from: TAddress, amount: bigint },
            outputArgs:   [ from: TAddress, amount: bigint ],
        }
        PaymentReleased: {
            outputParams: { to: TAddress, amount: bigint },
            outputArgs:   [ to: TAddress, amount: bigint ],
        }
    },
    Methods: {
        payee: {
          method: "payee"
          arguments: [ index: bigint ]
        }
        releasable: {
          method: "releasable"
          arguments: [ account: TAddress ] | [ token: TAddress, account: TAddress ]
        }
        release: {
          method: "release"
          arguments: [ account: TAddress ] | [ token: TAddress, account: TAddress ]
        }
        released: {
          method: "released"
          arguments: [ token: TAddress, account: TAddress ] | [ account: TAddress ]
        }
        shares: {
          method: "shares"
          arguments: [ account: TAddress ]
        }
        totalReleased: {
          method: "totalReleased"
          arguments: [ token: TAddress ] | [  ]
        }
        totalShares: {
          method: "totalShares"
          arguments: [  ]
        }
    }
}



interface IPaymentSplitterTxCaller {
    release (sender: TSender, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    release (sender: TSender, token: TAddress, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IPaymentSplitterTxData {
    release (sender: TSender, account: TAddress): Promise<TEth.TxLike>
    release (sender: TSender, token: TAddress, account: TAddress): Promise<TEth.TxLike>
}


type TEvents = TPaymentSplitterTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
