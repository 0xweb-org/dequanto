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
export class IERC1820Registry extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan)
    ) {
        super(address, client, explorer)
    }

    // 0xaabbb8ca
    async getInterfaceImplementer (account: TAddress, _interfaceHash: TBufferLike): Promise<TAddress> {
        return this.$read('function getInterfaceImplementer(address, bytes32) returns address', account, _interfaceHash);
    }

    // 0x3d584063
    async getManager (account: TAddress): Promise<TAddress> {
        return this.$read('function getManager(address) returns address', account);
    }

    // 0xf712f3e8
    async implementsERC165Interface (account: TAddress, interfaceId: TBufferLike): Promise<boolean> {
        return this.$read('function implementsERC165Interface(address, bytes4) returns bool', account, interfaceId);
    }

    // 0xb7056765
    async implementsERC165InterfaceNoCache (account: TAddress, interfaceId: TBufferLike): Promise<boolean> {
        return this.$read('function implementsERC165InterfaceNoCache(address, bytes4) returns bool', account, interfaceId);
    }

    // 0x65ba36c1
    async interfaceHash (interfaceName: string): Promise<TBufferLike> {
        return this.$read('function interfaceHash(string) returns bytes32', interfaceName);
    }

    // 0x29965a1d
    async setInterfaceImplementer (sender: TSender, account: TAddress, _interfaceHash: TBufferLike, implementer: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setInterfaceImplementer'), sender, account, _interfaceHash, implementer);
    }

    // 0x5df8122f
    async setManager (sender: TSender, account: TAddress, newManager: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setManager'), sender, account, newManager);
    }

    // 0xa41e7d51
    async updateERC165Cache (sender: TSender, account: TAddress, interfaceId: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'updateERC165Cache'), sender, account, interfaceId);
    }

    onInterfaceImplementerSet (fn: (event: EventLog, account: TAddress, interfaceHash: TBufferLike, implementer: TAddress) => void): ClientEventsStream<any> {
        return this.$on('InterfaceImplementerSet', fn);
    }

    onManagerChanged (fn: (event: EventLog, account: TAddress, newManager: TAddress) => void): ClientEventsStream<any> {
        return this.$on('ManagerChanged', fn);
    }

    extractLogsInterfaceImplementerSet (tx: TransactionReceipt): ITxLogItem<TLogInterfaceImplementerSet>[] {
        let abi = this.$getAbiItem('event', 'InterfaceImplementerSet');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogInterfaceImplementerSet>[];
    }

    extractLogsManagerChanged (tx: TransactionReceipt): ITxLogItem<TLogManagerChanged>[] {
        let abi = this.$getAbiItem('event', 'ManagerChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogManagerChanged>[];
    }

    async getPastLogsInterfaceImplementerSet (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { account?: TAddress,interfaceHash?: TBufferLike,implementer?: TAddress }
    }): Promise<ITxLogItem<TLogInterfaceImplementerSet>[]> {
        let topic = '0x93baa6efbd2244243bfee6ce4cfdd1d04fc4c0e9a786abd3a41313bd352db153';
        let abi = this.$getAbiItem('event', 'InterfaceImplementerSet');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsManagerChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { account?: TAddress,newManager?: TAddress }
    }): Promise<ITxLogItem<TLogManagerChanged>[]> {
        let topic = '0x605c2dbf762e5f7d60a546d42e7205dcb1b011ebc62a61736a57c9089d3a4350';
        let abi = this.$getAbiItem('event', 'ManagerChanged');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"bytes32","name":"interfaceHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"implementer","type":"address"}],"name":"InterfaceImplementerSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"newManager","type":"address"}],"name":"ManagerChanged","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"_interfaceHash","type":"bytes32"}],"name":"getInterfaceImplementer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"implementsERC165Interface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"implementsERC165InterfaceNoCache","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"interfaceName","type":"string"}],"name":"interfaceHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"_interfaceHash","type":"bytes32"},{"internalType":"address","name":"implementer","type":"address"}],"name":"setInterfaceImplementer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"newManager","type":"address"}],"name":"setManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"updateERC165Cache","outputs":[],"stateMutability":"nonpayable","type":"function"}]
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogInterfaceImplementerSet = {
        account: TAddress, interfaceHash: TBufferLike, implementer: TAddress
    }
    type TLogManagerChanged = {
        account: TAddress, newManager: TAddress
    }

