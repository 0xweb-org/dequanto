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



export class IERC2309 extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }



    $call () {
        return super.$call() as IIERC2309TxCaller;;
    }

    $data (): IIERC2309TxData {
        return super.$data() as IIERC2309TxData;
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

    onConsecutiveTransfer (fn?: (event: TClientEventsStreamData<TLogConsecutiveTransferParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogConsecutiveTransferParameters>> {
        return this.$onLog('ConsecutiveTransfer', fn);
    }

    extractLogsConsecutiveTransfer (tx: TEth.TxReceipt): ITxLogItem<TLogConsecutiveTransfer>[] {
        let abi = this.$getAbiItem('event', 'ConsecutiveTransfer');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogConsecutiveTransfer>[];
    }

    async getPastLogsConsecutiveTransfer (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { fromTokenId?: bigint }
    }): Promise<ITxLogItem<TLogConsecutiveTransfer>[]> {
        return await this.$getPastLogsParsed('ConsecutiveTransfer', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"fromTokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"toTokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"fromAddress","type":"address"},{"indexed":true,"internalType":"address","name":"toAddress","type":"address"}],"name":"ConsecutiveTransfer","type":"event"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogConsecutiveTransfer = {
        fromTokenId: bigint, toTokenId: bigint, fromAddress: TAddress, toAddress: TAddress
    };
    type TLogConsecutiveTransferParameters = [ fromTokenId: bigint, toTokenId: bigint, fromAddress: TAddress, toAddress: TAddress ];

interface IEvents {
  ConsecutiveTransfer: TLogConsecutiveTransferParameters
  '*': any[]
}





interface IMethods {
  '*': { method: string, arguments: any[] }
}






interface IIERC2309TxCaller {

}


interface IIERC2309TxData {

}


