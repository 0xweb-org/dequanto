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
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';


import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class IERC4906 extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0x095ea7b3
    async approve (sender: TSender, to: TAddress, tokenId: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approve'), sender, to, tokenId);
    }

    // 0x70a08231
    async balanceOf (owner: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'balanceOf'), owner);
    }

    // 0x081812fc
    async getApproved (tokenId: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getApproved'), tokenId);
    }

    // 0xe985e9c5
    async isApprovedForAll (owner: TAddress, operator: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isApprovedForAll'), owner, operator);
    }

    // 0x6352211e
    async ownerOf (tokenId: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'ownerOf'), tokenId);
    }

    // 0x42842e0e
    async safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<TxWriter>
    // 0xb88d4fde
    async safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint, data: TBufferLike): Promise<TxWriter>
    async safeTransferFrom (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function safeTransferFrom(address, address, uint256)', 'function safeTransferFrom(address, address, uint256, bytes)' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0xa22cb465
    async setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setApprovalForAll'), sender, operator, approved);
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceId: TBufferLike): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceId);
    }

    // 0x23b872dd
    async transferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferFrom'), sender, from, to, tokenId);
    }

    $call () {
        return super.$call() as IIERC4906TxCaller;;
    }

    $data (): IIERC4906TxData {
        return super.$data() as IIERC4906TxData;
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

    onApproval (fn?: (event: TClientEventsStreamData<TLogApprovalParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogApprovalParameters>> {
        return this.$onLog('Approval', fn);
    }

    onApprovalForAll (fn?: (event: TClientEventsStreamData<TLogApprovalForAllParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogApprovalForAllParameters>> {
        return this.$onLog('ApprovalForAll', fn);
    }

    onBatchMetadataUpdate (fn?: (event: TClientEventsStreamData<TLogBatchMetadataUpdateParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogBatchMetadataUpdateParameters>> {
        return this.$onLog('BatchMetadataUpdate', fn);
    }

    onMetadataUpdate (fn?: (event: TClientEventsStreamData<TLogMetadataUpdateParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogMetadataUpdateParameters>> {
        return this.$onLog('MetadataUpdate', fn);
    }

    onTransfer (fn?: (event: TClientEventsStreamData<TLogTransferParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogTransferParameters>> {
        return this.$onLog('Transfer', fn);
    }

    extractLogsApproval (tx: TEth.TxReceipt): ITxLogItem<TLogApproval>[] {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApproval>[];
    }

    extractLogsApprovalForAll (tx: TEth.TxReceipt): ITxLogItem<TLogApprovalForAll>[] {
        let abi = this.$getAbiItem('event', 'ApprovalForAll');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApprovalForAll>[];
    }

    extractLogsBatchMetadataUpdate (tx: TEth.TxReceipt): ITxLogItem<TLogBatchMetadataUpdate>[] {
        let abi = this.$getAbiItem('event', 'BatchMetadataUpdate');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogBatchMetadataUpdate>[];
    }

    extractLogsMetadataUpdate (tx: TEth.TxReceipt): ITxLogItem<TLogMetadataUpdate>[] {
        let abi = this.$getAbiItem('event', 'MetadataUpdate');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogMetadataUpdate>[];
    }

    extractLogsTransfer (tx: TEth.TxReceipt): ITxLogItem<TLogTransfer>[] {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogTransfer>[];
    }

    async getPastLogsApproval (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress,approved?: TAddress,tokenId?: bigint }
    }): Promise<ITxLogItem<TLogApproval>[]> {
        return await this.$getPastLogsParsed('Approval', options) as any;
    }

    async getPastLogsApprovalForAll (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress,operator?: TAddress }
    }): Promise<ITxLogItem<TLogApprovalForAll>[]> {
        return await this.$getPastLogsParsed('ApprovalForAll', options) as any;
    }

    async getPastLogsBatchMetadataUpdate (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogBatchMetadataUpdate>[]> {
        return await this.$getPastLogsParsed('BatchMetadataUpdate', options) as any;
    }

    async getPastLogsMetadataUpdate (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogMetadataUpdate>[]> {
        return await this.$getPastLogsParsed('MetadataUpdate', options) as any;
    }

    async getPastLogsTransfer (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { from?: TAddress,to?: TAddress,tokenId?: bigint }
    }): Promise<ITxLogItem<TLogTransfer>[]> {
        return await this.$getPastLogsParsed('Transfer', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_fromTokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_toTokenId","type":"uint256"}],"name":"BatchMetadataUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"MetadataUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"operator","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogApproval = {
        owner: TAddress, approved: TAddress, tokenId: bigint
    };
    type TLogApprovalParameters = [ owner: TAddress, approved: TAddress, tokenId: bigint ];
    type TLogApprovalForAll = {
        owner: TAddress, operator: TAddress, approved: boolean
    };
    type TLogApprovalForAllParameters = [ owner: TAddress, operator: TAddress, approved: boolean ];
    type TLogBatchMetadataUpdate = {
        _fromTokenId: bigint, _toTokenId: bigint
    };
    type TLogBatchMetadataUpdateParameters = [ _fromTokenId: bigint, _toTokenId: bigint ];
    type TLogMetadataUpdate = {
        _tokenId: bigint
    };
    type TLogMetadataUpdateParameters = [ _tokenId: bigint ];
    type TLogTransfer = {
        from: TAddress, to: TAddress, tokenId: bigint
    };
    type TLogTransferParameters = [ from: TAddress, to: TAddress, tokenId: bigint ];

interface IEvents {
  Approval: TLogApprovalParameters
  ApprovalForAll: TLogApprovalForAllParameters
  BatchMetadataUpdate: TLogBatchMetadataUpdateParameters
  MetadataUpdate: TLogMetadataUpdateParameters
  Transfer: TLogTransferParameters
  '*': any[] 
}



interface IMethodApprove {
  method: "approve"
  arguments: [ to: TAddress, tokenId: bigint ]
}

interface IMethodBalanceOf {
  method: "balanceOf"
  arguments: [ owner: TAddress ]
}

interface IMethodGetApproved {
  method: "getApproved"
  arguments: [ tokenId: bigint ]
}

interface IMethodIsApprovedForAll {
  method: "isApprovedForAll"
  arguments: [ owner: TAddress, operator: TAddress ]
}

interface IMethodOwnerOf {
  method: "ownerOf"
  arguments: [ tokenId: bigint ]
}

interface IMethodSafeTransferFrom {
  method: "safeTransferFrom"
  arguments: [ from: TAddress, to: TAddress, tokenId: bigint ] | [ from: TAddress, to: TAddress, tokenId: bigint, data: TBufferLike ]
}

interface IMethodSetApprovalForAll {
  method: "setApprovalForAll"
  arguments: [ operator: TAddress, approved: boolean ]
}

interface IMethodSupportsInterface {
  method: "supportsInterface"
  arguments: [ interfaceId: TBufferLike ]
}

interface IMethodTransferFrom {
  method: "transferFrom"
  arguments: [ from: TAddress, to: TAddress, tokenId: bigint ]
}

interface IMethods {
  approve: IMethodApprove
  balanceOf: IMethodBalanceOf
  getApproved: IMethodGetApproved
  isApprovedForAll: IMethodIsApprovedForAll
  ownerOf: IMethodOwnerOf
  safeTransferFrom: IMethodSafeTransferFrom
  setApprovalForAll: IMethodSetApprovalForAll
  supportsInterface: IMethodSupportsInterface
  transferFrom: IMethodTransferFrom
  '*': { method: string, arguments: any[] } 
}






interface IIERC4906TxCaller {
    approve (sender: TSender, to: TAddress, tokenId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIERC4906TxData {
    approve (sender: TSender, to: TAddress, tokenId: bigint): Promise<TEth.TxLike>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<TEth.TxLike>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint, data: TBufferLike): Promise<TEth.TxLike>
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<TEth.TxLike>
    transferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<TEth.TxLike>
}

