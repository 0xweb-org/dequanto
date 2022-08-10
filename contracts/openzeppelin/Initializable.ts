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
export class Initializable extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan)
    ) {
        super(address, client, explorer)
    }



    onInitialized (fn: (event: EventLog, version: number) => void): ClientEventsStream<any> {
        return this.$on('Initialized', fn);
    }

    extractLogsInitialized (tx: TransactionReceipt): ITxLogItem<TLogInitialized>[] {
        let abi = this.$getAbiItem('event', 'Initialized');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogInitialized>[];
    }

    async getPastLogsInitialized (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogInitialized>[]> {
        let topic = '0x7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498';
        let abi = this.$getAbiItem('event', 'Initialized');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"}]
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogInitialized = {
        version: number
    }

