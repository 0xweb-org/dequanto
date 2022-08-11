/**
 *  AUTO-Generated Class: 2022-08-11 11:20
 *  Implementation: https://etherscan.io/address/undefined#code
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TAccount } from '@dequanto/models/TAccount';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { type AbiItem } from 'web3-utils';
import { TransactionReceipt, EventLog } from 'web3-core';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';

import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'
export class PaymentSplitter extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan)
    ) {
        super(address, client, explorer)
    }

    // 0x8b83209b
    async payee (index: bigint): Promise<TAddress> {
        return this.$read('function payee(uint256) returns address', index);
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
        return this.$read('function shares(address) returns uint256', account);
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
        return this.$read('function totalShares() returns uint256');
    }

    onERC20PaymentReleased (fn: (event: EventLog, token: TAddress, to: TAddress, amount: bigint) => void): ClientEventsStream<any> {
        return this.$on('ERC20PaymentReleased', fn);
    }

    onPayeeAdded (fn: (event: EventLog, account: TAddress, shares: bigint) => void): ClientEventsStream<any> {
        return this.$on('PayeeAdded', fn);
    }

    onPaymentReceived (fn: (event: EventLog, from: TAddress, amount: bigint) => void): ClientEventsStream<any> {
        return this.$on('PaymentReceived', fn);
    }

    onPaymentReleased (fn: (event: EventLog, to: TAddress, amount: bigint) => void): ClientEventsStream<any> {
        return this.$on('PaymentReleased', fn);
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
        let topic = '0x3be5b7a71e84ed12875d241991c70855ac5817d847039e17a9d895c1ceb0f18a';
        let abi = this.$getAbiItem('event', 'ERC20PaymentReleased');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsPayeeAdded (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogPayeeAdded>[]> {
        let topic = '0x40c340f65e17194d14ddddb073d3c9f888e3cb52b5aae0c6c7706b4fbc905fac';
        let abi = this.$getAbiItem('event', 'PayeeAdded');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsPaymentReceived (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogPaymentReceived>[]> {
        let topic = '0x6ef95f06320e7a25a04a175ca677b7052bdd97131872c2192525a629f51be770';
        let abi = this.$getAbiItem('event', 'PaymentReceived');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsPaymentReleased (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogPaymentReleased>[]> {
        let topic = '0xdf20fd1e76bc69d672e4814fafb2c449bba3a5369d8359adf9e05e6fde87b056';
        let abi = this.$getAbiItem('event', 'PaymentReleased');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi: AbiItem[] = [{"inputs":[{"internalType":"address[]","name":"payees","type":"address[]"},{"internalType":"uint256[]","name":"shares_","type":"uint256[]"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ERC20PaymentReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"PayeeAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PaymentReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PaymentReleased","type":"event"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"payee","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"address","name":"account","type":"address"}],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address payable","name":"account","type":"address"}],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"address","name":"account","type":"address"}],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"address","name":"account","type":"address"}],"name":"released","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"released","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"shares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"}],"name":"totalReleased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalReleased","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogERC20PaymentReleased = {
        token: TAddress, to: TAddress, amount: bigint
    }
    type TLogPayeeAdded = {
        account: TAddress, shares: bigint
    }
    type TLogPaymentReceived = {
        from: TAddress, amount: bigint
    }
    type TLogPaymentReleased = {
        to: TAddress, amount: bigint
    }

