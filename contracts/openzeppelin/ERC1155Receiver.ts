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



export class ERC1155Receiver extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0xbc197c81
    async onERC1155BatchReceived (sender: TSender, operator: TAddress, from: TAddress, ids: bigint[], values: bigint[], data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'onERC1155BatchReceived'), sender, operator, from, ids, values, data);
    }

    // 0xf23a6e61
    async onERC1155Received (sender: TSender, operator: TAddress, from: TAddress, id: bigint, value: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'onERC1155Received'), sender, operator, from, id, value, data);
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceId: TBufferLike): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceId);
    }

    $call () {
        return super.$call() as IERC1155ReceiverTxCaller;;
    }

    $data (): IERC1155ReceiverTxData {
        return super.$data() as IERC1155ReceiverTxData;
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







    abi: TAbiItem[] = [{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"onERC1155BatchReceived","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"onERC1155Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}



interface IEvents {
  '*': any[]
}



interface IMethodOnERC1155BatchReceived {
  method: "onERC1155BatchReceived"
  arguments: [ operator: TAddress, from: TAddress, ids: bigint[], values: bigint[], data: TBufferLike ]
}

interface IMethodOnERC1155Received {
  method: "onERC1155Received"
  arguments: [ operator: TAddress, from: TAddress, id: bigint, value: bigint, data: TBufferLike ]
}

interface IMethodSupportsInterface {
  method: "supportsInterface"
  arguments: [ interfaceId: TBufferLike ]
}

interface IMethods {
  onERC1155BatchReceived: IMethodOnERC1155BatchReceived
  onERC1155Received: IMethodOnERC1155Received
  supportsInterface: IMethodSupportsInterface
  '*': { method: string, arguments: any[] }
}






interface IERC1155ReceiverTxCaller {
    onERC1155BatchReceived (sender: TSender, operator: TAddress, from: TAddress, ids: bigint[], values: bigint[], data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    onERC1155Received (sender: TSender, operator: TAddress, from: TAddress, id: bigint, value: bigint, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IERC1155ReceiverTxData {
    onERC1155BatchReceived (sender: TSender, operator: TAddress, from: TAddress, ids: bigint[], values: bigint[], data: TBufferLike): Promise<TEth.TxLike>
    onERC1155Received (sender: TSender, operator: TAddress, from: TAddress, id: bigint, value: bigint, data: TBufferLike): Promise<TEth.TxLike>
}


