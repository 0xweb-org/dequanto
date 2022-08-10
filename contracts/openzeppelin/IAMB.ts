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
export class IAMB extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan)
    ) {
        super(address, client, explorer)
    }

    // 0xb0750611
    async destinationChainId (): Promise<bigint> {
        return this.$read('function destinationChainId() returns uint256');
    }

    // 0xe37c3289
    async failedMessageDataHash (_messageId: TBufferLike): Promise<TBufferLike> {
        return this.$read('function failedMessageDataHash(bytes32) returns bytes32', _messageId);
    }

    // 0x3f9a8e7e
    async failedMessageReceiver (_messageId: TBufferLike): Promise<TAddress> {
        return this.$read('function failedMessageReceiver(bytes32) returns address', _messageId);
    }

    // 0x4a610b04
    async failedMessageSender (_messageId: TBufferLike): Promise<TAddress> {
        return this.$read('function failedMessageSender(bytes32) returns address', _messageId);
    }

    // 0xe5789d03
    async maxGasPerTx (): Promise<bigint> {
        return this.$read('function maxGasPerTx() returns uint256');
    }

    // 0xcb08a10c
    async messageCallStatus (_messageId: TBufferLike): Promise<boolean> {
        return this.$read('function messageCallStatus(bytes32) returns bool', _messageId);
    }

    // 0x669f618b
    async messageId (): Promise<TBufferLike> {
        return this.$read('function messageId() returns bytes32');
    }

    // 0xd67bdd25
    async messageSender (): Promise<TAddress> {
        return this.$read('function messageSender() returns address');
    }

    // 0x9e307dff
    async messageSourceChainId (): Promise<TBufferLike> {
        return this.$read('function messageSourceChainId() returns bytes32');
    }

    // 0x94643f71
    async requireToConfirmMessage (sender: TSender, _contract: TAddress, _data: TBufferLike, _gas: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'requireToConfirmMessage'), sender, _contract, _data, _gas);
    }

    // 0xdc8601b3
    async requireToPassMessage (sender: TSender, _contract: TAddress, _data: TBufferLike, _gas: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'requireToPassMessage'), sender, _contract, _data, _gas);
    }

    // 0x1544298e
    async sourceChainId (): Promise<bigint> {
        return this.$read('function sourceChainId() returns uint256');
    }

    // 0x0ac1c313
    async transactionHash (): Promise<TBufferLike> {
        return this.$read('function transactionHash() returns bytes32');
    }

    onAffirmationCompleted (fn: (event: EventLog, _sender: TAddress, executor: TAddress, messageId: TBufferLike, status: boolean) => void): ClientEventsStream<any> {
        return this.$on('AffirmationCompleted', fn);
    }

    onRelayedMessage (fn: (event: EventLog, _sender: TAddress, executor: TAddress, messageId: TBufferLike, status: boolean) => void): ClientEventsStream<any> {
        return this.$on('RelayedMessage', fn);
    }

    onUserRequestForAffirmation (fn: (event: EventLog, messageId: TBufferLike, encodedData: TBufferLike) => void): ClientEventsStream<any> {
        return this.$on('UserRequestForAffirmation', fn);
    }

    onUserRequestForSignature (fn: (event: EventLog, messageId: TBufferLike, encodedData: TBufferLike) => void): ClientEventsStream<any> {
        return this.$on('UserRequestForSignature', fn);
    }

    extractLogsAffirmationCompleted (tx: TransactionReceipt): ITxLogItem<TLogAffirmationCompleted>[] {
        let abi = this.$getAbiItem('event', 'AffirmationCompleted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogAffirmationCompleted>[];
    }

    extractLogsRelayedMessage (tx: TransactionReceipt): ITxLogItem<TLogRelayedMessage>[] {
        let abi = this.$getAbiItem('event', 'RelayedMessage');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogRelayedMessage>[];
    }

    extractLogsUserRequestForAffirmation (tx: TransactionReceipt): ITxLogItem<TLogUserRequestForAffirmation>[] {
        let abi = this.$getAbiItem('event', 'UserRequestForAffirmation');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogUserRequestForAffirmation>[];
    }

    extractLogsUserRequestForSignature (tx: TransactionReceipt): ITxLogItem<TLogUserRequestForSignature>[] {
        let abi = this.$getAbiItem('event', 'UserRequestForSignature');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogUserRequestForSignature>[];
    }

    async getPastLogsAffirmationCompleted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress,executor?: TAddress,messageId?: TBufferLike }
    }): Promise<ITxLogItem<TLogAffirmationCompleted>[]> {
        let topic = '0xe194ef610f9150a2db4110b3db5116fd623175dca3528d7ae7046a1042f84fe7';
        let abi = this.$getAbiItem('event', 'AffirmationCompleted');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsRelayedMessage (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress,executor?: TAddress,messageId?: TBufferLike }
    }): Promise<ITxLogItem<TLogRelayedMessage>[]> {
        let topic = '0x27333edb8bdcd40a0ae944fb121b5e2d62ea782683946654a0f5e607a908d578';
        let abi = this.$getAbiItem('event', 'RelayedMessage');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsUserRequestForAffirmation (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { messageId?: TBufferLike }
    }): Promise<ITxLogItem<TLogUserRequestForAffirmation>[]> {
        let topic = '0x482515ce3d9494a37ce83f18b72b363449458435fafdd7a53ddea7460fe01b58';
        let abi = this.$getAbiItem('event', 'UserRequestForAffirmation');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsUserRequestForSignature (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { messageId?: TBufferLike }
    }): Promise<ITxLogItem<TLogUserRequestForSignature>[]> {
        let topic = '0x520d2afde79cbd5db58755ac9480f81bc658e5c517fcae7365a3d832590b0183';
        let abi = this.$getAbiItem('event', 'UserRequestForSignature');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"executor","type":"address"},{"indexed":true,"internalType":"bytes32","name":"messageId","type":"bytes32"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"AffirmationCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"executor","type":"address"},{"indexed":true,"internalType":"bytes32","name":"messageId","type":"bytes32"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"RelayedMessage","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"messageId","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"encodedData","type":"bytes"}],"name":"UserRequestForAffirmation","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"messageId","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"encodedData","type":"bytes"}],"name":"UserRequestForSignature","type":"event"},{"inputs":[],"name":"destinationChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_messageId","type":"bytes32"}],"name":"failedMessageDataHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_messageId","type":"bytes32"}],"name":"failedMessageReceiver","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_messageId","type":"bytes32"}],"name":"failedMessageSender","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxGasPerTx","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_messageId","type":"bytes32"}],"name":"messageCallStatus","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"messageId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"messageSender","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"messageSourceChainId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"uint256","name":"_gas","type":"uint256"}],"name":"requireToConfirmMessage","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_contract","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"uint256","name":"_gas","type":"uint256"}],"name":"requireToPassMessage","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sourceChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"transactionHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"}]
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogAffirmationCompleted = {
        _sender: TAddress, executor: TAddress, messageId: TBufferLike, status: boolean
    }
    type TLogRelayedMessage = {
        _sender: TAddress, executor: TAddress, messageId: TBufferLike, status: boolean
    }
    type TLogUserRequestForAffirmation = {
        messageId: TBufferLike, encodedData: TBufferLike
    }
    type TLogUserRequestForSignature = {
        messageId: TBufferLike, encodedData: TBufferLike
    }

