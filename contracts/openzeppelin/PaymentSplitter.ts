/**
 *  AUTO-Generated Class: 2023-06-15 23:19
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

import type { TransactionReceipt, Transaction, EventLog, TransactionConfig } from 'web3-core';
import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { AbiItem } from 'web3-utils';
import type { BlockTransactionString } from 'web3-eth';


import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class PaymentSplitter extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
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
        return super.$call() as IPaymentSplitterTxCaller;;
    }

    $data (): IPaymentSplitterTxData {
        return super.$data() as IPaymentSplitterTxData;
    }

    onTransaction <TMethod extends keyof IMethods> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: Transaction
        block: BlockTransactionString
        calldata: IMethods[TMethod]
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = <any> method;
        return <any> this.$onTransaction(options);
    }

    onLog (event: keyof IEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
        return this.$onLog(event, cb);
    }

    onERC20PaymentReleased (fn?: (event: TClientEventsStreamData<TLogERC20PaymentReleasedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogERC20PaymentReleasedParameters>> {
        return this.$onLog('ERC20PaymentReleased', fn);
    }

    onPayeeAdded (fn?: (event: TClientEventsStreamData<TLogPayeeAddedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogPayeeAddedParameters>> {
        return this.$onLog('PayeeAdded', fn);
    }

    onPaymentReceived (fn?: (event: TClientEventsStreamData<TLogPaymentReceivedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogPaymentReceivedParameters>> {
        return this.$onLog('PaymentReceived', fn);
    }

    onPaymentReleased (fn?: (event: TClientEventsStreamData<TLogPaymentReleasedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogPaymentReleasedParameters>> {
        return this.$onLog('PaymentReleased', fn);
    }

    extractLogsERC20PaymentReleased (tx: TransactionReceipt): ITxLogItem<TLogERC20PaymentReleased>[] {
        let abi = this.$getAbiItem('event', 'ERC20PaymentReleased');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogERC20PaymentReleased>[];
    }

    extractLogsPayeeAdded (tx: TransactionReceipt): ITxLogItem<TLogPayeeAdded>[] {
        let abi = this.$getAbiItem('event', 'PayeeAdded');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogPayeeAdded>[];
    }

    extractLogsPaymentReceived (tx: TransactionReceipt): ITxLogItem<TLogPaymentReceived>[] {
        let abi = this.$getAbiItem('event', 'PaymentReceived');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogPaymentReceived>[];
    }

    extractLogsPaymentReleased (tx: TransactionReceipt): ITxLogItem<TLogPaymentReleased>[] {
        let abi = this.$getAbiItem('event', 'PaymentReleased');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogPaymentReleased>[];
    }

    async getPastLogsERC20PaymentReleased (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { token?: TAddress }
    }): Promise<ITxLogItem<TLogERC20PaymentReleased>[]> {
        return await this.$getPastLogsParsed('ERC20PaymentReleased', options) as any;
    }

    async getPastLogsPayeeAdded (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogPayeeAdded>[]> {
        return await this.$getPastLogsParsed('PayeeAdded', options) as any;
    }

    async getPastLogsPaymentReceived (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogPaymentReceived>[]> {
        return await this.$getPastLogsParsed('PaymentReceived', options) as any;
    }

    async getPastLogsPaymentReleased (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogPaymentReleased>[]> {
        return await this.$getPastLogsParsed('PaymentReleased', options) as any;
    }

    abi: AbiItem[] = [{"inputs":[{"internalType":"address[]","name":"payees","type":"address[]"},{"internalType":"uint256[]","name":"shares_","type":"uint256[]"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ERC20PaymentReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"PayeeAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PaymentReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PaymentReleased","type":"event"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"payee","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"address","name":"account","type":"address"}],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"account","type":"address"}],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"address","name":"account","type":"address"}],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"address","name":"account","type":"address"}],"name":"released","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"released","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"shares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"}],"name":"totalReleased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalReleased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogERC20PaymentReleased = {
        token: TAddress, to: TAddress, amount: bigint
    };
    type TLogERC20PaymentReleasedParameters = [ token: TAddress, to: TAddress, amount: bigint ];
    type TLogPayeeAdded = {
        account: TAddress, shares: bigint
    };
    type TLogPayeeAddedParameters = [ account: TAddress, shares: bigint ];
    type TLogPaymentReceived = {
        from: TAddress, amount: bigint
    };
    type TLogPaymentReceivedParameters = [ from: TAddress, amount: bigint ];
    type TLogPaymentReleased = {
        to: TAddress, amount: bigint
    };
    type TLogPaymentReleasedParameters = [ to: TAddress, amount: bigint ];

interface IEvents {
  ERC20PaymentReleased: TLogERC20PaymentReleasedParameters
  PayeeAdded: TLogPayeeAddedParameters
  PaymentReceived: TLogPaymentReceivedParameters
  PaymentReleased: TLogPaymentReleasedParameters
  '*': any[] 
}



interface IMethodPayee {
  method: "payee"
  arguments: [ index: bigint ]
}

interface IMethodReleasable {
  method: "releasable"
  arguments: [ account: TAddress ] | [ token: TAddress, account: TAddress ]
}

interface IMethodRelease {
  method: "release"
  arguments: [ account: TAddress ] | [ token: TAddress, account: TAddress ]
}

interface IMethodReleased {
  method: "released"
  arguments: [ token: TAddress, account: TAddress ] | [ account: TAddress ]
}

interface IMethodShares {
  method: "shares"
  arguments: [ account: TAddress ]
}

interface IMethodTotalReleased {
  method: "totalReleased"
  arguments: [ token: TAddress ] | [  ]
}

interface IMethodTotalShares {
  method: "totalShares"
  arguments: [  ]
}

interface IMethods {
  payee: IMethodPayee
  releasable: IMethodReleasable
  release: IMethodRelease
  released: IMethodReleased
  shares: IMethodShares
  totalReleased: IMethodTotalReleased
  totalShares: IMethodTotalShares
  '*': { method: string, arguments: any[] } 
}






interface IPaymentSplitterTxCaller {
    release (sender: TSender, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    release (sender: TSender, token: TAddress, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IPaymentSplitterTxData {
    release (sender: TSender, account: TAddress): Promise<TransactionConfig>
    release (sender: TSender, token: TAddress, account: TAddress): Promise<TransactionConfig>
}


