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
export class IArbSys extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan)
    ) {
        super(address, client, explorer)
    }

    // 0xa3b1b31d
    async arbBlockNumber (): Promise<bigint> {
        return this.$read('function arbBlockNumber() returns uint256');
    }

    // 0xd127f54a
    async arbChainID (): Promise<bigint> {
        return this.$read('function arbChainID() returns uint256');
    }

    // 0x051038f2
    async arbOSVersion (): Promise<bigint> {
        return this.$read('function arbOSVersion() returns uint256');
    }

    // 0xa169625f
    async getStorageAt (account: TAddress, index: bigint): Promise<bigint> {
        return this.$read('function getStorageAt(address, uint256) returns uint256', account, index);
    }

    // 0xa94597ff
    async getStorageGasAvailable (): Promise<bigint> {
        return this.$read('function getStorageGasAvailable() returns uint256');
    }

    // 0x23ca0cd2
    async getTransactionCount (account: TAddress): Promise<bigint> {
        return this.$read('function getTransactionCount(address) returns uint256', account);
    }

    // 0x08bd624c
    async isTopLevelCall (): Promise<boolean> {
        return this.$read('function isTopLevelCall() returns bool');
    }

    // 0x4dbbd506
    async mapL1SenderContractAddressToL2Alias (_sender: TAddress, dest: TAddress): Promise<TAddress> {
        return this.$read('function mapL1SenderContractAddressToL2Alias(address, address) returns address', _sender, dest);
    }

    // 0xd74523b3
    async myCallersAddressWithoutAliasing (): Promise<TAddress> {
        return this.$read('function myCallersAddressWithoutAliasing() returns address');
    }

    // 0x928c169a
    async sendTxToL1 (sender: TSender, destination: TAddress, calldataForL1: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'sendTxToL1'), sender, destination, calldataForL1);
    }

    // 0x175a260b
    async wasMyCallersAddressAliased (): Promise<boolean> {
        return this.$read('function wasMyCallersAddressAliased() returns bool');
    }

    // 0x25e16063
    async withdrawEth (sender: TSender, destination: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdrawEth'), sender, destination);
    }

    onL2ToL1Transaction (fn: (event: EventLog, caller: TAddress, destination: TAddress, uniqueId: bigint, batchNumber: bigint, indexInBatch: bigint, arbBlockNum: bigint, ethBlockNum: bigint, timestamp: bigint, callvalue: bigint, data: TBufferLike) => void): ClientEventsStream<any> {
        return this.$on('L2ToL1Transaction', fn);
    }

    extractLogsL2ToL1Transaction (tx: TransactionReceipt): ITxLogItem<TLogL2ToL1Transaction>[] {
        let abi = this.$getAbiItem('event', 'L2ToL1Transaction');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogL2ToL1Transaction>[];
    }

    async getPastLogsL2ToL1Transaction (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogL2ToL1Transaction>[]> {
        let topic = '0x5baaa87db386365b5c161be377bc3d8e317e8d98d71a3ca7ed7d555340c8f767';
        let abi = this.$getAbiItem('event', 'L2ToL1Transaction');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":true,"internalType":"address","name":"destination","type":"address"},{"indexed":true,"internalType":"uint256","name":"uniqueId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"batchNumber","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"indexInBatch","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"arbBlockNum","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethBlockNum","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"callvalue","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"L2ToL1Transaction","type":"event"},{"inputs":[],"name":"arbBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"arbChainID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"arbOSVersion","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getStorageAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStorageGasAvailable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getTransactionCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isTopLevelCall","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"dest","type":"address"}],"name":"mapL1SenderContractAddressToL2Alias","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"myCallersAddressWithoutAliasing","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"bytes","name":"calldataForL1","type":"bytes"}],"name":"sendTxToL1","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"wasMyCallersAddressAliased","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"destination","type":"address"}],"name":"withdrawEth","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"}]
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogL2ToL1Transaction = {
        caller: TAddress, destination: TAddress, uniqueId: bigint, batchNumber: bigint, indexInBatch: bigint, arbBlockNum: bigint, ethBlockNum: bigint, timestamp: bigint, callvalue: bigint, data: TBufferLike
    }

