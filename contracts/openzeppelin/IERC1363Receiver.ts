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



export class IERC1363Receiver extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0x88a7ca5c
    async onTransferReceived (sender: TSender, operator: TAddress, from: TAddress, amount: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'onTransferReceived'), sender, operator, from, amount, data);
    }

    $call () {
        return super.$call() as IIERC1363ReceiverTxCaller;;
    }

    $data (): IIERC1363ReceiverTxData {
        return super.$data() as IIERC1363ReceiverTxData;
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







    abi: TAbiItem[] = [{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"onTransferReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}



interface IEvents {
  '*': any[]
}



interface IMethodOnTransferReceived {
  method: "onTransferReceived"
  arguments: [ operator: TAddress, from: TAddress, amount: bigint, data: TBufferLike ]
}

interface IMethods {
  onTransferReceived: IMethodOnTransferReceived
  '*': { method: string, arguments: any[] }
}






interface IIERC1363ReceiverTxCaller {
    onTransferReceived (sender: TSender, operator: TAddress, from: TAddress, amount: bigint, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIERC1363ReceiverTxData {
    onTransferReceived (sender: TSender, operator: TAddress, from: TAddress, amount: bigint, data: TBufferLike): Promise<TEth.TxLike>
}


