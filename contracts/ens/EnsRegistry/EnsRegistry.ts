/**
 *  AUTO-Generated Class: 2023-12-22 01:26
 *  Implementation: https://etherscan.io/address/0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e#code
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



export class EnsRegistry extends ContractBase {
    constructor(
        public address: TEth.Address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new EnsRegistryStorageReader(this.address, this.client, this.explorer);
    }

    

    async $constructor (deployer: TSender, _old: TAddress): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0xe985e9c5
    async isApprovedForAll (owner: TAddress, operator: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isApprovedForAll'), owner, operator);
    }

    // 0xb83f8663
    async old (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'old'));
    }

    // 0x02571be3
    async owner (node: TBufferLike): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'owner'), node);
    }

    // 0xf79fe538
    async recordExists (node: TBufferLike): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'recordExists'), node);
    }

    // 0x0178b8bf
    async resolver (node: TBufferLike): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'resolver'), node);
    }

    // 0xa22cb465
    async setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setApprovalForAll'), sender, operator, approved);
    }

    // 0x5b0fc9c3
    async setOwner (sender: TSender, node: TBufferLike, owner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setOwner'), sender, node, owner);
    }

    // 0xcf408823
    async setRecord (sender: TSender, node: TBufferLike, owner: TAddress, resolver: TAddress, ttl: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setRecord'), sender, node, owner, resolver, ttl);
    }

    // 0x1896f70a
    async setResolver (sender: TSender, node: TBufferLike, resolver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setResolver'), sender, node, resolver);
    }

    // 0x06ab5923
    async setSubnodeOwner (sender: TSender, node: TBufferLike, label: TBufferLike, owner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setSubnodeOwner'), sender, node, label, owner);
    }

    // 0x5ef2c7f0
    async setSubnodeRecord (sender: TSender, node: TBufferLike, label: TBufferLike, owner: TAddress, resolver: TAddress, ttl: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setSubnodeRecord'), sender, node, label, owner, resolver, ttl);
    }

    // 0x14ab9038
    async setTTL (sender: TSender, node: TBufferLike, ttl: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setTTL'), sender, node, ttl);
    }

    // 0x16a25cbd
    async ttl (node: TBufferLike): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'ttl'), node);
    }

    $call () {
        return super.$call() as IEnsRegistryTxCaller;
    }
    $signed (): TOverrideReturns<IEnsRegistryTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IEnsRegistryTxData {
        return super.$data() as IEnsRegistryTxData;
    }
    $gas (): TOverrideReturns<IEnsRegistryTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
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

    onApprovalForAll (fn?: (event: TClientEventsStreamData<TLogApprovalForAllParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogApprovalForAllParameters>> {
        return this.$onLog('ApprovalForAll', fn);
    }

    onNewOwner (fn?: (event: TClientEventsStreamData<TLogNewOwnerParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogNewOwnerParameters>> {
        return this.$onLog('NewOwner', fn);
    }

    onNewResolver (fn?: (event: TClientEventsStreamData<TLogNewResolverParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogNewResolverParameters>> {
        return this.$onLog('NewResolver', fn);
    }

    onNewTTL (fn?: (event: TClientEventsStreamData<TLogNewTTLParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogNewTTLParameters>> {
        return this.$onLog('NewTTL', fn);
    }

    onTransfer (fn?: (event: TClientEventsStreamData<TLogTransferParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogTransferParameters>> {
        return this.$onLog('Transfer', fn);
    }

    extractLogsApprovalForAll (tx: TEth.TxReceipt): ITxLogItem<TLogApprovalForAll>[] {
        let abi = this.$getAbiItem('event', 'ApprovalForAll');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApprovalForAll>[];
    }

    extractLogsNewOwner (tx: TEth.TxReceipt): ITxLogItem<TLogNewOwner>[] {
        let abi = this.$getAbiItem('event', 'NewOwner');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogNewOwner>[];
    }

    extractLogsNewResolver (tx: TEth.TxReceipt): ITxLogItem<TLogNewResolver>[] {
        let abi = this.$getAbiItem('event', 'NewResolver');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogNewResolver>[];
    }

    extractLogsNewTTL (tx: TEth.TxReceipt): ITxLogItem<TLogNewTTL>[] {
        let abi = this.$getAbiItem('event', 'NewTTL');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogNewTTL>[];
    }

    extractLogsTransfer (tx: TEth.TxReceipt): ITxLogItem<TLogTransfer>[] {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogTransfer>[];
    }

    async getPastLogsApprovalForAll (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress,operator?: TAddress }
    }): Promise<ITxLogItem<TLogApprovalForAll>[]> {
        return await this.$getPastLogsParsed('ApprovalForAll', options) as any;
    }

    async getPastLogsNewOwner (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TBufferLike,label?: TBufferLike }
    }): Promise<ITxLogItem<TLogNewOwner>[]> {
        return await this.$getPastLogsParsed('NewOwner', options) as any;
    }

    async getPastLogsNewResolver (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TBufferLike }
    }): Promise<ITxLogItem<TLogNewResolver>[]> {
        return await this.$getPastLogsParsed('NewResolver', options) as any;
    }

    async getPastLogsNewTTL (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TBufferLike }
    }): Promise<ITxLogItem<TLogNewTTL>[]> {
        return await this.$getPastLogsParsed('NewTTL', options) as any;
    }

    async getPastLogsTransfer (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TBufferLike }
    }): Promise<ITxLogItem<TLogTransfer>[]> {
        return await this.$getPastLogsParsed('Transfer', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"contract ENS","name":"_old","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"label","type":"bytes32"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"address","name":"resolver","type":"address"}],"name":"NewResolver","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"uint64","name":"ttl","type":"uint64"}],"name":"NewTTL","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"old","outputs":[{"internalType":"contract ENS","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"name":"recordExists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"name":"resolver","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"address","name":"owner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"resolver","type":"address"},{"internalType":"uint64","name":"ttl","type":"uint64"}],"name":"setRecord","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"address","name":"resolver","type":"address"}],"name":"setResolver","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"bytes32","name":"label","type":"bytes32"},{"internalType":"address","name":"owner","type":"address"}],"name":"setSubnodeOwner","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"bytes32","name":"label","type":"bytes32"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"resolver","type":"address"},{"internalType":"uint64","name":"ttl","type":"uint64"}],"name":"setSubnodeRecord","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"uint64","name":"ttl","type":"uint64"}],"name":"setTTL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"name":"ttl","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"}]

    storage: EnsRegistryStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogApprovalForAll = {
        owner: TAddress, operator: TAddress, approved: boolean
    };
    type TLogApprovalForAllParameters = [ owner: TAddress, operator: TAddress, approved: boolean ];
    type TLogNewOwner = {
        node: TBufferLike, label: TBufferLike, owner: TAddress
    };
    type TLogNewOwnerParameters = [ node: TBufferLike, label: TBufferLike, owner: TAddress ];
    type TLogNewResolver = {
        node: TBufferLike, resolver: TAddress
    };
    type TLogNewResolverParameters = [ node: TBufferLike, resolver: TAddress ];
    type TLogNewTTL = {
        node: TBufferLike, ttl: number
    };
    type TLogNewTTLParameters = [ node: TBufferLike, ttl: number ];
    type TLogTransfer = {
        node: TBufferLike, owner: TAddress
    };
    type TLogTransferParameters = [ node: TBufferLike, owner: TAddress ];

interface IEvents {
  ApprovalForAll: TLogApprovalForAllParameters
  NewOwner: TLogNewOwnerParameters
  NewResolver: TLogNewResolverParameters
  NewTTL: TLogNewTTLParameters
  Transfer: TLogTransferParameters
  '*': any[] 
}



interface IMethodIsApprovedForAll {
  method: "isApprovedForAll"
  arguments: [ owner: TAddress, operator: TAddress ]
}

interface IMethodOld {
  method: "old"
  arguments: [  ]
}

interface IMethodOwner {
  method: "owner"
  arguments: [ node: TBufferLike ]
}

interface IMethodRecordExists {
  method: "recordExists"
  arguments: [ node: TBufferLike ]
}

interface IMethodResolver {
  method: "resolver"
  arguments: [ node: TBufferLike ]
}

interface IMethodSetApprovalForAll {
  method: "setApprovalForAll"
  arguments: [ operator: TAddress, approved: boolean ]
}

interface IMethodSetOwner {
  method: "setOwner"
  arguments: [ node: TBufferLike, owner: TAddress ]
}

interface IMethodSetRecord {
  method: "setRecord"
  arguments: [ node: TBufferLike, owner: TAddress, resolver: TAddress, ttl: number ]
}

interface IMethodSetResolver {
  method: "setResolver"
  arguments: [ node: TBufferLike, resolver: TAddress ]
}

interface IMethodSetSubnodeOwner {
  method: "setSubnodeOwner"
  arguments: [ node: TBufferLike, label: TBufferLike, owner: TAddress ]
}

interface IMethodSetSubnodeRecord {
  method: "setSubnodeRecord"
  arguments: [ node: TBufferLike, label: TBufferLike, owner: TAddress, resolver: TAddress, ttl: number ]
}

interface IMethodSetTTL {
  method: "setTTL"
  arguments: [ node: TBufferLike, ttl: number ]
}

interface IMethodTtl {
  method: "ttl"
  arguments: [ node: TBufferLike ]
}

interface IMethods {
  isApprovedForAll: IMethodIsApprovedForAll
  old: IMethodOld
  owner: IMethodOwner
  recordExists: IMethodRecordExists
  resolver: IMethodResolver
  setApprovalForAll: IMethodSetApprovalForAll
  setOwner: IMethodSetOwner
  setRecord: IMethodSetRecord
  setResolver: IMethodSetResolver
  setSubnodeOwner: IMethodSetSubnodeOwner
  setSubnodeRecord: IMethodSetSubnodeRecord
  setTTL: IMethodSetTTL
  ttl: IMethodTtl
  '*': { method: string, arguments: any[] } 
}





class EnsRegistryStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }

    async records(key: TBufferLike): Promise<{ owner: TAddress, resolver: TAddress, ttl: number }> {
        return this.$storage.get(['records', key]);
    }

    async operators(key: TAddress): Promise<Record<TAddress, boolean>> {
        return this.$storage.get(['operators', key]);
    }

    async old(): Promise<TAddress> {
        return this.$storage.get(['old', ]);
    }

    $slots = [
    {
        "slot": 0,
        "position": 0,
        "name": "records",
        "size": null,
        "type": "mapping(bytes32 => (address owner, address resolver, uint64 ttl))"
    },
    {
        "slot": 1,
        "position": 0,
        "name": "operators",
        "size": null,
        "type": "mapping(address => mapping(address => bool))"
    },
    {
        "slot": 2,
        "position": 0,
        "name": "old",
        "size": 160,
        "type": "address"
    }
]

}



interface IEnsRegistryTxCaller {
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setOwner (sender: TSender, node: TBufferLike, owner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setRecord (sender: TSender, node: TBufferLike, owner: TAddress, resolver: TAddress, ttl: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setResolver (sender: TSender, node: TBufferLike, resolver: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setSubnodeOwner (sender: TSender, node: TBufferLike, label: TBufferLike, owner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setSubnodeRecord (sender: TSender, node: TBufferLike, label: TBufferLike, owner: TAddress, resolver: TAddress, ttl: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setTTL (sender: TSender, node: TBufferLike, ttl: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IEnsRegistryTxData {
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<TEth.TxLike>
    setOwner (sender: TSender, node: TBufferLike, owner: TAddress): Promise<TEth.TxLike>
    setRecord (sender: TSender, node: TBufferLike, owner: TAddress, resolver: TAddress, ttl: number): Promise<TEth.TxLike>
    setResolver (sender: TSender, node: TBufferLike, resolver: TAddress): Promise<TEth.TxLike>
    setSubnodeOwner (sender: TSender, node: TBufferLike, label: TBufferLike, owner: TAddress): Promise<TEth.TxLike>
    setSubnodeRecord (sender: TSender, node: TBufferLike, label: TBufferLike, owner: TAddress, resolver: TAddress, ttl: number): Promise<TEth.TxLike>
    setTTL (sender: TSender, node: TBufferLike, ttl: number): Promise<TEth.TxLike>
}

