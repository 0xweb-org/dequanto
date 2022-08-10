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
export class Pausable extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan)
    ) {
        super(address, client, explorer)
    }

    // 0x5c975abb
    async paused (): Promise<boolean> {
        return this.$read('function paused() returns bool');
    }

    onPaused (fn: (event: EventLog, account: TAddress) => void): ClientEventsStream<any> {
        return this.$on('Paused', fn);
    }

    onUnpaused (fn: (event: EventLog, account: TAddress) => void): ClientEventsStream<any> {
        return this.$on('Unpaused', fn);
    }

    extractLogsPaused (tx: TransactionReceipt): ITxLogItem<TLogPaused>[] {
        let abi = this.$getAbiItem('event', 'Paused');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogPaused>[];
    }

    extractLogsUnpaused (tx: TransactionReceipt): ITxLogItem<TLogUnpaused>[] {
        let abi = this.$getAbiItem('event', 'Unpaused');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogUnpaused>[];
    }

    async getPastLogsPaused (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogPaused>[]> {
        let topic = '0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258';
        let abi = this.$getAbiItem('event', 'Paused');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsUnpaused (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogUnpaused>[]> {
        let topic = '0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa';
        let abi = this.$getAbiItem('event', 'Unpaused');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogPaused = {
        account: TAddress
    }
    type TLogUnpaused = {
        account: TAddress
    }

