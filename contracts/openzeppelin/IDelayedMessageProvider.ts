/**
 *  AUTO-Generated Class: 2023-10-05 18:18
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


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';


import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class IDelayedMessageProvider extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }



    $call () {
        return super.$call() as IIDelayedMessageProviderTxCaller;;
    }

    $data (): IIDelayedMessageProviderTxData {
        return super.$data() as IIDelayedMessageProviderTxData;
    }

    onTransaction <TMethod extends keyof IMethods> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: IMethods[TMethod]
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = method;
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

    extractLogsInboxMessageDelivered (tx: TEth.TxReceipt): ITxLogItem<TLogInboxMessageDelivered>[] {
        let abi = this.$getAbiItem('event', 'InboxMessageDelivered');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogInboxMessageDelivered>[];
    }

    extractLogsInboxMessageDeliveredFromOrigin (tx: TEth.TxReceipt): ITxLogItem<TLogInboxMessageDeliveredFromOrigin>[] {
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

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"messageNum","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"InboxMessageDelivered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"messageNum","type":"uint256"}],"name":"InboxMessageDeliveredFromOrigin","type":"event"}]


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






interface IIDelayedMessageProviderTxCaller {

}


interface IIDelayedMessageProviderTxData {

}


