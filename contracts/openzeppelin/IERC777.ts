/**
 *  AUTO-Generated Class: 2022-08-11 00:10
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
export class IERC777 extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan)
    ) {
        super(address, client, explorer)
    }

    // 0x959b8c3f
    async authorizeOperator (sender: TSender, operator: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'authorizeOperator'), sender, operator);
    }

    // 0x70a08231
    async balanceOf (owner: TAddress): Promise<bigint> {
        return this.$read('function balanceOf(address) returns uint256', owner);
    }

    // 0xfe9d9303
    async burn (sender: TSender, amount: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'burn'), sender, amount, data);
    }

    // 0x06e48538
    async defaultOperators (): Promise<TAddress[]> {
        return this.$read('function defaultOperators() returns address[]');
    }

    // 0x556f0dc7
    async granularity (): Promise<bigint> {
        return this.$read('function granularity() returns uint256');
    }

    // 0xd95b6371
    async isOperatorFor (operator: TAddress, tokenHolder: TAddress): Promise<boolean> {
        return this.$read('function isOperatorFor(address, address) returns bool', operator, tokenHolder);
    }

    // 0x06fdde03
    async name (): Promise<string> {
        return this.$read('function name() returns string');
    }

    // 0xfc673c4f
    async operatorBurn (sender: TSender, account: TAddress, amount: bigint, data: TBufferLike, operatorData: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'operatorBurn'), sender, account, amount, data, operatorData);
    }

    // 0x62ad1b83
    async operatorSend (sender: TSender, _sender: TAddress, recipient: TAddress, amount: bigint, data: TBufferLike, operatorData: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'operatorSend'), sender, _sender, recipient, amount, data, operatorData);
    }

    // 0xfad8b32a
    async revokeOperator (sender: TSender, operator: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'revokeOperator'), sender, operator);
    }

    // 0x9bd9bbc6
    async send (sender: TSender, recipient: TAddress, amount: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'send'), sender, recipient, amount, data);
    }

    // 0x95d89b41
    async symbol (): Promise<string> {
        return this.$read('function symbol() returns string');
    }

    // 0x18160ddd
    async totalSupply (): Promise<bigint> {
        return this.$read('function totalSupply() returns uint256');
    }

    onAuthorizedOperator (fn: (event: EventLog, operator: TAddress, tokenHolder: TAddress) => void): ClientEventsStream<any> {
        return this.$on('AuthorizedOperator', fn);
    }

    onBurned (fn: (event: EventLog, operator: TAddress, from: TAddress, amount: bigint, data: TBufferLike, operatorData: TBufferLike) => void): ClientEventsStream<any> {
        return this.$on('Burned', fn);
    }

    onMinted (fn: (event: EventLog, operator: TAddress, to: TAddress, amount: bigint, data: TBufferLike, operatorData: TBufferLike) => void): ClientEventsStream<any> {
        return this.$on('Minted', fn);
    }

    onRevokedOperator (fn: (event: EventLog, operator: TAddress, tokenHolder: TAddress) => void): ClientEventsStream<any> {
        return this.$on('RevokedOperator', fn);
    }

    onSent (fn: (event: EventLog, operator: TAddress, from: TAddress, to: TAddress, amount: bigint, data: TBufferLike, operatorData: TBufferLike) => void): ClientEventsStream<any> {
        return this.$on('Sent', fn);
    }

    extractLogsAuthorizedOperator (tx: TransactionReceipt): ITxLogItem<TLogAuthorizedOperator>[] {
        let abi = this.$getAbiItem('event', 'AuthorizedOperator');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogAuthorizedOperator>[];
    }

    extractLogsBurned (tx: TransactionReceipt): ITxLogItem<TLogBurned>[] {
        let abi = this.$getAbiItem('event', 'Burned');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogBurned>[];
    }

    extractLogsMinted (tx: TransactionReceipt): ITxLogItem<TLogMinted>[] {
        let abi = this.$getAbiItem('event', 'Minted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogMinted>[];
    }

    extractLogsRevokedOperator (tx: TransactionReceipt): ITxLogItem<TLogRevokedOperator>[] {
        let abi = this.$getAbiItem('event', 'RevokedOperator');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogRevokedOperator>[];
    }

    extractLogsSent (tx: TransactionReceipt): ITxLogItem<TLogSent>[] {
        let abi = this.$getAbiItem('event', 'Sent');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogSent>[];
    }

    async getPastLogsAuthorizedOperator (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { operator?: TAddress,tokenHolder?: TAddress }
    }): Promise<ITxLogItem<TLogAuthorizedOperator>[]> {
        let topic = '0xf4caeb2d6ca8932a215a353d0703c326ec2d81fc68170f320eb2ab49e9df61f9';
        let abi = this.$getAbiItem('event', 'AuthorizedOperator');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsBurned (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { operator?: TAddress,from?: TAddress }
    }): Promise<ITxLogItem<TLogBurned>[]> {
        let topic = '0xa78a9be3a7b862d26933ad85fb11d80ef66b8f972d7cbba06621d583943a4098';
        let abi = this.$getAbiItem('event', 'Burned');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsMinted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { operator?: TAddress,to?: TAddress }
    }): Promise<ITxLogItem<TLogMinted>[]> {
        let topic = '0x2fe5be0146f74c5bce36c0b80911af6c7d86ff27e89d5cfa61fc681327954e5d';
        let abi = this.$getAbiItem('event', 'Minted');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsRevokedOperator (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { operator?: TAddress,tokenHolder?: TAddress }
    }): Promise<ITxLogItem<TLogRevokedOperator>[]> {
        let topic = '0x50546e66e5f44d728365dc3908c63bc5cfeeab470722c1677e3073a6ac294aa1';
        let abi = this.$getAbiItem('event', 'RevokedOperator');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsSent (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { operator?: TAddress,from?: TAddress,to?: TAddress }
    }): Promise<ITxLogItem<TLogSent>[]> {
        let topic = '0x06b541ddaa720db2b10a4d0cdac39b8d360425fc073085fac19bc82614677987';
        let abi = this.$getAbiItem('event', 'Sent');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"tokenHolder","type":"address"}],"name":"AuthorizedOperator","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"operatorData","type":"bytes"}],"name":"Burned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"operatorData","type":"bytes"}],"name":"Minted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"tokenHolder","type":"address"}],"name":"RevokedOperator","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"operatorData","type":"bytes"}],"name":"Sent","type":"event"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"authorizeOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"defaultOperators","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"granularity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"address","name":"tokenHolder","type":"address"}],"name":"isOperatorFor","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"bytes","name":"operatorData","type":"bytes"}],"name":"operatorBurn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"bytes","name":"operatorData","type":"bytes"}],"name":"operatorSend","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"revokeOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"send","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogAuthorizedOperator = {
        operator: TAddress, tokenHolder: TAddress
    }
    type TLogBurned = {
        operator: TAddress, from: TAddress, amount: bigint, data: TBufferLike, operatorData: TBufferLike
    }
    type TLogMinted = {
        operator: TAddress, to: TAddress, amount: bigint, data: TBufferLike, operatorData: TBufferLike
    }
    type TLogRevokedOperator = {
        operator: TAddress, tokenHolder: TAddress
    }
    type TLogSent = {
        operator: TAddress, from: TAddress, to: TAddress, amount: bigint, data: TBufferLike, operatorData: TBufferLike
    }

