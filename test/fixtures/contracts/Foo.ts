/**
 *  AUTO-Generated Class: 2022-05-23 00:46
 *  Implementation: https://etherscan.io/address/undefined#code
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
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
export class Foo extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan)
    ) {
        super(address, client, explorer)
    }

    // 0x17d7de7c
    async getName (): Promise<string> {
        return this.$read('function getName() returns string');
    }

    // 0x06fdde03
    async name (): Promise<string> {
        return this.$read('function name() returns string');
    }

    // 0xc47f0027
    async setName (eoa: TAccount, _name: string): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setName'), eoa, _name);
    }

    onUpdated (fn: (event: EventLog, newName: string) => void): ClientEventsStream<any> {
        return this.$on('Updated', fn);
    }

    extractLogsUpdated (tx: TransactionReceipt): ITxLogItem<TLogUpdated>[] {
        let abi = this.$getAbiItem('event', 'Updated');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogUpdated>[];
    }

    async getPastLogsUpdated (options: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogUpdated>[]> {
        let topic = '0x221d3d4161ff7c815e25a84cf3c2ec04f54111bee80f0b06d345c834581c9da3';
        let abi = this.$getAbiItem('event', 'Updated');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi = [{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"newName","type":"string"}],"name":"Updated","type":"event"},{"inputs":[],"name":"getName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"setName","outputs":[],"stateMutability":"nonpayable","type":"function"}]
}

type TAccount = string | {
    address?: TAddress,
    key?: string,
    name?: string,
    value?: string | number | bigint
}

    type TLogUpdated = {
        newName: string
    }

