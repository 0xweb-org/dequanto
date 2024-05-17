/**
 *  AUTO-Generated Class: 2024-05-17 00:25
 *  Implementation: https://etherscan.io/address/undefined#code
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TAccount } from '@dequanto/models/TAccount';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream, TClientEventsStreamData } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { ContractBaseUtils } from '@dequanto/contracts/utils/ContractBaseUtils';
import { ContractStorageReaderBase } from '@dequanto/contracts/ContractStorageReaderBase';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';
import type { TOverrideReturns } from '@dequanto/utils/types';


import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class ERC1155URIStorage extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    Types: TERC1155URIStorageTypes;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/ERC1155URIStorage.ts"
    }

    // 0x00fdd58e
    async balanceOf (account: TAddress, id: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'balanceOf'), account, id);
    }

    // 0x4e1273f4
    async balanceOfBatch (accounts: TAddress[], ids: bigint[]): Promise<bigint[]> {
        return this.$read(this.$getAbiItem('function', 'balanceOfBatch'), accounts, ids);
    }

    // 0xe985e9c5
    async isApprovedForAll (account: TAddress, operator: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isApprovedForAll'), account, operator);
    }

    // 0x2eb2c2d6
    async safeBatchTransferFrom (sender: TSender, from: TAddress, to: TAddress, ids: bigint[], amounts: bigint[], data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'safeBatchTransferFrom'), sender, from, to, ids, amounts, data);
    }

    // 0xf242432a
    async safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, id: bigint, amount: bigint, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'safeTransferFrom'), sender, from, to, id, amount, data);
    }

    // 0xa22cb465
    async setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setApprovalForAll'), sender, operator, approved);
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceId: TEth.Hex): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceId);
    }

    // 0x0e89341c
    async uri (tokenId: bigint): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'uri'), tokenId);
    }

    $call () {
        return super.$call() as IERC1155URIStorageTxCaller;
    }
    $signed (): TOverrideReturns<IERC1155URIStorageTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IERC1155URIStorageTxData {
        return super.$data() as IERC1155URIStorageTxData;
    }
    $gas (): TOverrideReturns<IERC1155URIStorageTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TERC1155URIStorageTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TERC1155URIStorageTypes['Methods'][TMethod]['arguments']
        }
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = method;
        return <any> this.$onTransaction(options);
    }

    onLog (event: keyof TEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
        return this.$onLog(event, cb);
    }

    async getPastLogs <TEventName extends keyof TEvents> (
        events: TEventName[]
        , options?: TEventLogOptions<TEventParams<TEventName>>
    ): Promise<ITxLogItem<TEventParams<TEventName>, TEventName>[]>
    async getPastLogs <TEventName extends keyof TEvents> (
        event: TEventName
        , options?: TEventLogOptions<TEventParams<TEventName>>
    ): Promise<ITxLogItem<TEventParams<TEventName>, TEventName>[]>
    async getPastLogs (mix: any, options?): Promise<any> {
        return await super.getPastLogs(mix, options) as any;
    }

    onApprovalForAll (fn?: (event: TClientEventsStreamData<TEventArguments<'ApprovalForAll'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ApprovalForAll'>>> {
        return this.$onLog('ApprovalForAll', fn);
    }

    onTransferBatch (fn?: (event: TClientEventsStreamData<TEventArguments<'TransferBatch'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'TransferBatch'>>> {
        return this.$onLog('TransferBatch', fn);
    }

    onTransferSingle (fn?: (event: TClientEventsStreamData<TEventArguments<'TransferSingle'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'TransferSingle'>>> {
        return this.$onLog('TransferSingle', fn);
    }

    onURI (fn?: (event: TClientEventsStreamData<TEventArguments<'URI'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'URI'>>> {
        return this.$onLog('URI', fn);
    }

    extractLogsApprovalForAll (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ApprovalForAll'>>[] {
        let abi = this.$getAbiItem('event', 'ApprovalForAll');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ApprovalForAll'>>[];
    }

    extractLogsTransferBatch (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'TransferBatch'>>[] {
        let abi = this.$getAbiItem('event', 'TransferBatch');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'TransferBatch'>>[];
    }

    extractLogsTransferSingle (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'TransferSingle'>>[] {
        let abi = this.$getAbiItem('event', 'TransferSingle');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'TransferSingle'>>[];
    }

    extractLogsURI (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'URI'>>[] {
        let abi = this.$getAbiItem('event', 'URI');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'URI'>>[];
    }

    async getPastLogsApprovalForAll (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { account?: TAddress,operator?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ApprovalForAll'>>[]> {
        return await this.$getPastLogsParsed('ApprovalForAll', options) as any;
    }

    async getPastLogsTransferBatch (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { operator?: TAddress,from?: TAddress,to?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'TransferBatch'>>[]> {
        return await this.$getPastLogsParsed('TransferBatch', options) as any;
    }

    async getPastLogsTransferSingle (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { operator?: TAddress,from?: TAddress,to?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'TransferSingle'>>[]> {
        return await this.$getPastLogsParsed('TransferSingle', options) as any;
    }

    async getPastLogsURI (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'URI'>>[]> {
        return await this.$getPastLogsParsed('URI', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TERC1155URIStorageTypes = {
    Events: {
        ApprovalForAll: {
            outputParams: { account: TAddress, operator: TAddress, approved: boolean },
            outputArgs:   [ account: TAddress, operator: TAddress, approved: boolean ],
        }
        TransferBatch: {
            outputParams: { operator: TAddress, from: TAddress, to: TAddress, ids: bigint[], values: bigint[] },
            outputArgs:   [ operator: TAddress, from: TAddress, to: TAddress, ids: bigint[], values: bigint[] ],
        }
        TransferSingle: {
            outputParams: { operator: TAddress, from: TAddress, to: TAddress, id: bigint, value: bigint },
            outputArgs:   [ operator: TAddress, from: TAddress, to: TAddress, id: bigint, value: bigint ],
        }
        URI: {
            outputParams: { value: string, id: bigint },
            outputArgs:   [ value: string, id: bigint ],
        }
    },
    Methods: {
        balanceOf: {
          method: "balanceOf"
          arguments: [ account: TAddress, id: bigint ]
        }
        balanceOfBatch: {
          method: "balanceOfBatch"
          arguments: [ accounts: TAddress[], ids: bigint[] ]
        }
        isApprovedForAll: {
          method: "isApprovedForAll"
          arguments: [ account: TAddress, operator: TAddress ]
        }
        safeBatchTransferFrom: {
          method: "safeBatchTransferFrom"
          arguments: [ from: TAddress, to: TAddress, ids: bigint[], amounts: bigint[], data: TEth.Hex ]
        }
        safeTransferFrom: {
          method: "safeTransferFrom"
          arguments: [ from: TAddress, to: TAddress, id: bigint, amount: bigint, data: TEth.Hex ]
        }
        setApprovalForAll: {
          method: "setApprovalForAll"
          arguments: [ operator: TAddress, approved: boolean ]
        }
        supportsInterface: {
          method: "supportsInterface"
          arguments: [ interfaceId: TEth.Hex ]
        }
        uri: {
          method: "uri"
          arguments: [ tokenId: bigint ]
        }
    }
}



interface IERC1155URIStorageTxCaller {
    safeBatchTransferFrom (sender: TSender, from: TAddress, to: TAddress, ids: bigint[], amounts: bigint[], data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, id: bigint, amount: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IERC1155URIStorageTxData {
    safeBatchTransferFrom (sender: TSender, from: TAddress, to: TAddress, ids: bigint[], amounts: bigint[], data: TEth.Hex): Promise<TEth.TxLike>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, id: bigint, amount: bigint, data: TEth.Hex): Promise<TEth.TxLike>
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<TEth.TxLike>
}


type TEvents = TERC1155URIStorageTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
