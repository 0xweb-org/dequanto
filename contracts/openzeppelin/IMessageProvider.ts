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
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';

import type { TransactionReceipt, Transaction, EventLog, TransactionConfig } from 'web3-core';
import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { AbiItem } from 'web3-utils';
import type { BlockTransactionString } from 'web3-eth';


import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class IMessageProvider extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }



    $call () {
        return super.$call() as IIMessageProviderTxCaller;;
    }

    $data (): IIMessageProviderTxData {
        return super.$data() as IIMessageProviderTxData;
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

    onInboxMessageDelivered (fn?: (event: TClientEventsStreamData<TLogInboxMessageDeliveredParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogInboxMessageDeliveredParameters>> {
        return this.$onLog('InboxMessageDelivered', fn);
    }

    onInboxMessageDeliveredFromOrigin (fn?: (event: TClientEventsStreamData<TLogInboxMessageDeliveredFromOriginParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogInboxMessageDeliveredFromOriginParameters>> {
        return this.$onLog('InboxMessageDeliveredFromOrigin', fn);
    }

    extractLogsInboxMessageDelivered (tx: TransactionReceipt): ITxLogItem<TLogInboxMessageDelivered>[] {
        let abi = this.$getAbiItem('event', 'InboxMessageDelivered');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogInboxMessageDelivered>[];
    }

    extractLogsInboxMessageDeliveredFromOrigin (tx: TransactionReceipt): ITxLogItem<TLogInboxMessageDeliveredFromOrigin>[] {
        let abi = this.$getAbiItem('event', 'InboxMessageDeliveredFromOrigin');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogInboxMessageDeliveredFromOrigin>[];
    }

    async getPastLogsInboxMessageDelivered (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { messageNum?: bigint }
    }): Promise<ITxLogItem<TLogInboxMessageDelivered>[]> {
        return await this.$getPastLogsParsed('InboxMessageDelivered', options) as any;
    }

    async getPastLogsInboxMessageDeliveredFromOrigin (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { messageNum?: bigint }
    }): Promise<ITxLogItem<TLogInboxMessageDeliveredFromOrigin>[]> {
        return await this.$getPastLogsParsed('InboxMessageDeliveredFromOrigin', options) as any;
    }

    abi: AbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"messageNum","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"InboxMessageDelivered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"messageNum","type":"uint256"}],"name":"InboxMessageDeliveredFromOrigin","type":"event"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogInboxMessageDelivered = {
        messageNum: bigint, data: TBufferLike
    };
    type TLogInboxMessageDeliveredParameters = [ messageNum: bigint, data: TBufferLike ];
    type TLogInboxMessageDeliveredFromOrigin = {
        messageNum: bigint
    };
    type TLogInboxMessageDeliveredFromOriginParameters = [ messageNum: bigint ];

interface IEvents {
  InboxMessageDelivered: TLogInboxMessageDeliveredParameters
  InboxMessageDeliveredFromOrigin: TLogInboxMessageDeliveredFromOriginParameters
  '*': any[]
}





interface IMethods {
  '*': { method: string, arguments: any[] }
}






interface IIMessageProviderTxCaller {

}


interface IIMessageProviderTxData {

}


