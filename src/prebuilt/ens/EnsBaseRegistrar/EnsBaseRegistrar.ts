/**
 *  AUTO-Generated Class: 2024-05-17 00:25
 *  Implementation: https://etherscan.io/address/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85#code
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



export class EnsBaseRegistrar extends ContractBase {
    constructor(
        public address: TEth.Address = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new EnsBaseRegistrarStorageReader(this.address, this.client, this.explorer);
    }

    Types: TEnsBaseRegistrarTypes;

    $meta = {
        "class": "./src/prebuilt/ens/EnsBaseRegistrar/EnsBaseRegistrar.ts"
    }

    async $constructor (deployer: TSender, _ens: TAddress, _baseNode: TEth.Hex): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0xc1a287e2
    async GRACE_PERIOD (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'GRACE_PERIOD'));
    }

    // 0xa7fc7a07
    async addController (sender: TSender, controller: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'addController'), sender, controller);
    }

    // 0x095ea7b3
    async approve (sender: TSender, to: TAddress, tokenId: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approve'), sender, to, tokenId);
    }

    // 0x96e494e8
    async available (id: bigint): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'available'), id);
    }

    // 0x70a08231
    async balanceOf (owner: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'balanceOf'), owner);
    }

    // 0xddf7fcb0
    async baseNode (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'baseNode'));
    }

    // 0xda8c229e
    async controllers (input0: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'controllers'), input0);
    }

    // 0x3f15457f
    async ens (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'ens'));
    }

    // 0x081812fc
    async getApproved (tokenId: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getApproved'), tokenId);
    }

    // 0xe985e9c5
    async isApprovedForAll (owner: TAddress, operator: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isApprovedForAll'), owner, operator);
    }

    // 0x8f32d59b
    async isOwner (): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isOwner'));
    }

    // 0xd6e4fa86
    async nameExpires (id: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'nameExpires'), id);
    }

    // 0x8da5cb5b
    async owner (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'owner'));
    }

    // 0x6352211e
    async ownerOf (tokenId: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'ownerOf'), tokenId);
    }

    // 0x28ed4f6c
    async reclaim (sender: TSender, id: bigint, owner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'reclaim'), sender, id, owner);
    }

    // 0xfca247ac
    async register (sender: TSender, id: bigint, owner: TAddress, duration: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'register'), sender, id, owner, duration);
    }

    // 0x0e297b45
    async registerOnly (sender: TSender, id: bigint, owner: TAddress, duration: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'registerOnly'), sender, id, owner, duration);
    }

    // 0xf6a74ed7
    async removeController (sender: TSender, controller: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'removeController'), sender, controller);
    }

    // 0xc475abff
    async renew (sender: TSender, id: bigint, duration: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renew'), sender, id, duration);
    }

    // 0x715018a6
    async renounceOwnership (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renounceOwnership'), sender);
    }

    // 0x42842e0e
    async safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<TxWriter>
    // 0xb88d4fde
    async safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint, _data: TEth.Hex): Promise<TxWriter>
    async safeTransferFrom (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function safeTransferFrom(address, address, uint256)', 'function safeTransferFrom(address, address, uint256, bytes)' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0xa22cb465
    async setApprovalForAll (sender: TSender, to: TAddress, approved: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setApprovalForAll'), sender, to, approved);
    }

    // 0x4e543b26
    async setResolver (sender: TSender, resolver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setResolver'), sender, resolver);
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceID: TEth.Hex): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceID);
    }

    // 0x23b872dd
    async transferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferFrom'), sender, from, to, tokenId);
    }

    // 0xf2fde38b
    async transferOwnership (sender: TSender, newOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferOwnership'), sender, newOwner);
    }

    $call () {
        return super.$call() as IEnsBaseRegistrarTxCaller;
    }
    $signed (): TOverrideReturns<IEnsBaseRegistrarTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IEnsBaseRegistrarTxData {
        return super.$data() as IEnsBaseRegistrarTxData;
    }
    $gas (): TOverrideReturns<IEnsBaseRegistrarTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TEnsBaseRegistrarTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TEnsBaseRegistrarTypes['Methods'][TMethod]['arguments']
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

    onApproval (fn?: (event: TClientEventsStreamData<TEventArguments<'Approval'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Approval'>>> {
        return this.$onLog('Approval', fn);
    }

    onApprovalForAll (fn?: (event: TClientEventsStreamData<TEventArguments<'ApprovalForAll'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ApprovalForAll'>>> {
        return this.$onLog('ApprovalForAll', fn);
    }

    onControllerAdded (fn?: (event: TClientEventsStreamData<TEventArguments<'ControllerAdded'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ControllerAdded'>>> {
        return this.$onLog('ControllerAdded', fn);
    }

    onControllerRemoved (fn?: (event: TClientEventsStreamData<TEventArguments<'ControllerRemoved'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ControllerRemoved'>>> {
        return this.$onLog('ControllerRemoved', fn);
    }

    onNameMigrated (fn?: (event: TClientEventsStreamData<TEventArguments<'NameMigrated'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'NameMigrated'>>> {
        return this.$onLog('NameMigrated', fn);
    }

    onNameRegistered (fn?: (event: TClientEventsStreamData<TEventArguments<'NameRegistered'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'NameRegistered'>>> {
        return this.$onLog('NameRegistered', fn);
    }

    onNameRenewed (fn?: (event: TClientEventsStreamData<TEventArguments<'NameRenewed'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'NameRenewed'>>> {
        return this.$onLog('NameRenewed', fn);
    }

    onOwnershipTransferred (fn?: (event: TClientEventsStreamData<TEventArguments<'OwnershipTransferred'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'OwnershipTransferred'>>> {
        return this.$onLog('OwnershipTransferred', fn);
    }

    onTransfer (fn?: (event: TClientEventsStreamData<TEventArguments<'Transfer'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Transfer'>>> {
        return this.$onLog('Transfer', fn);
    }

    extractLogsApproval (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Approval'>>[] {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Approval'>>[];
    }

    extractLogsApprovalForAll (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ApprovalForAll'>>[] {
        let abi = this.$getAbiItem('event', 'ApprovalForAll');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ApprovalForAll'>>[];
    }

    extractLogsControllerAdded (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ControllerAdded'>>[] {
        let abi = this.$getAbiItem('event', 'ControllerAdded');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ControllerAdded'>>[];
    }

    extractLogsControllerRemoved (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ControllerRemoved'>>[] {
        let abi = this.$getAbiItem('event', 'ControllerRemoved');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ControllerRemoved'>>[];
    }

    extractLogsNameMigrated (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'NameMigrated'>>[] {
        let abi = this.$getAbiItem('event', 'NameMigrated');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'NameMigrated'>>[];
    }

    extractLogsNameRegistered (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'NameRegistered'>>[] {
        let abi = this.$getAbiItem('event', 'NameRegistered');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'NameRegistered'>>[];
    }

    extractLogsNameRenewed (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'NameRenewed'>>[] {
        let abi = this.$getAbiItem('event', 'NameRenewed');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'NameRenewed'>>[];
    }

    extractLogsOwnershipTransferred (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'OwnershipTransferred'>>[] {
        let abi = this.$getAbiItem('event', 'OwnershipTransferred');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'OwnershipTransferred'>>[];
    }

    extractLogsTransfer (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Transfer'>>[] {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Transfer'>>[];
    }

    async getPastLogsApproval (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress,approved?: TAddress,tokenId?: bigint }
    }): Promise<ITxLogItem<TEventParams<'Approval'>>[]> {
        return await this.$getPastLogsParsed('Approval', options) as any;
    }

    async getPastLogsApprovalForAll (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress,operator?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ApprovalForAll'>>[]> {
        return await this.$getPastLogsParsed('ApprovalForAll', options) as any;
    }

    async getPastLogsControllerAdded (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { controller?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ControllerAdded'>>[]> {
        return await this.$getPastLogsParsed('ControllerAdded', options) as any;
    }

    async getPastLogsControllerRemoved (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { controller?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ControllerRemoved'>>[]> {
        return await this.$getPastLogsParsed('ControllerRemoved', options) as any;
    }

    async getPastLogsNameMigrated (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { id?: bigint,owner?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'NameMigrated'>>[]> {
        return await this.$getPastLogsParsed('NameMigrated', options) as any;
    }

    async getPastLogsNameRegistered (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { id?: bigint,owner?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'NameRegistered'>>[]> {
        return await this.$getPastLogsParsed('NameRegistered', options) as any;
    }

    async getPastLogsNameRenewed (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { id?: bigint }
    }): Promise<ITxLogItem<TEventParams<'NameRenewed'>>[]> {
        return await this.$getPastLogsParsed('NameRenewed', options) as any;
    }

    async getPastLogsOwnershipTransferred (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { previousOwner?: TAddress,newOwner?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'OwnershipTransferred'>>[]> {
        return await this.$getPastLogsParsed('OwnershipTransferred', options) as any;
    }

    async getPastLogsTransfer (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { from?: TAddress,to?: TAddress,tokenId?: bigint }
    }): Promise<ITxLogItem<TEventParams<'Transfer'>>[]> {
        return await this.$getPastLogsParsed('Transfer', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"contract ENS","name":"_ens","type":"address"},{"internalType":"bytes32","name":"_baseNode","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"controller","type":"address"}],"name":"ControllerAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"controller","type":"address"}],"name":"ControllerRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"expires","type":"uint256"}],"name":"NameMigrated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"expires","type":"uint256"}],"name":"NameRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expires","type":"uint256"}],"name":"NameRenewed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"GRACE_PERIOD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"controller","type":"address"}],"name":"addController","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"available","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"baseNode","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"controllers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ens","outputs":[{"internalType":"contract ENS","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"nameExpires","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"owner","type":"address"}],"name":"reclaim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"duration","type":"uint256"}],"name":"register","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"duration","type":"uint256"}],"name":"registerOnly","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"controller","type":"address"}],"name":"removeController","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"}],"name":"renew","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"resolver","type":"address"}],"name":"setResolver","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]

    declare storage: EnsBaseRegistrarStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TEnsBaseRegistrarTypes = {
    Events: {
        Approval: {
            outputParams: { owner: TAddress, approved: TAddress, tokenId: bigint },
            outputArgs:   [ owner: TAddress, approved: TAddress, tokenId: bigint ],
        }
        ApprovalForAll: {
            outputParams: { owner: TAddress, operator: TAddress, approved: boolean },
            outputArgs:   [ owner: TAddress, operator: TAddress, approved: boolean ],
        }
        ControllerAdded: {
            outputParams: { controller: TAddress },
            outputArgs:   [ controller: TAddress ],
        }
        ControllerRemoved: {
            outputParams: { controller: TAddress },
            outputArgs:   [ controller: TAddress ],
        }
        NameMigrated: {
            outputParams: { id: bigint, owner: TAddress, expires: bigint },
            outputArgs:   [ id: bigint, owner: TAddress, expires: bigint ],
        }
        NameRegistered: {
            outputParams: { id: bigint, owner: TAddress, expires: bigint },
            outputArgs:   [ id: bigint, owner: TAddress, expires: bigint ],
        }
        NameRenewed: {
            outputParams: { id: bigint, expires: bigint },
            outputArgs:   [ id: bigint, expires: bigint ],
        }
        OwnershipTransferred: {
            outputParams: { previousOwner: TAddress, newOwner: TAddress },
            outputArgs:   [ previousOwner: TAddress, newOwner: TAddress ],
        }
        Transfer: {
            outputParams: { from: TAddress, to: TAddress, tokenId: bigint },
            outputArgs:   [ from: TAddress, to: TAddress, tokenId: bigint ],
        }
    },
    Methods: {
        GRACE_PERIOD: {
          method: "GRACE_PERIOD"
          arguments: [  ]
        }
        addController: {
          method: "addController"
          arguments: [ controller: TAddress ]
        }
        approve: {
          method: "approve"
          arguments: [ to: TAddress, tokenId: bigint ]
        }
        available: {
          method: "available"
          arguments: [ id: bigint ]
        }
        balanceOf: {
          method: "balanceOf"
          arguments: [ owner: TAddress ]
        }
        baseNode: {
          method: "baseNode"
          arguments: [  ]
        }
        controllers: {
          method: "controllers"
          arguments: [ input0: TAddress ]
        }
        ens: {
          method: "ens"
          arguments: [  ]
        }
        getApproved: {
          method: "getApproved"
          arguments: [ tokenId: bigint ]
        }
        isApprovedForAll: {
          method: "isApprovedForAll"
          arguments: [ owner: TAddress, operator: TAddress ]
        }
        isOwner: {
          method: "isOwner"
          arguments: [  ]
        }
        nameExpires: {
          method: "nameExpires"
          arguments: [ id: bigint ]
        }
        owner: {
          method: "owner"
          arguments: [  ]
        }
        ownerOf: {
          method: "ownerOf"
          arguments: [ tokenId: bigint ]
        }
        reclaim: {
          method: "reclaim"
          arguments: [ id: bigint, owner: TAddress ]
        }
        register: {
          method: "register"
          arguments: [ id: bigint, owner: TAddress, duration: bigint ]
        }
        registerOnly: {
          method: "registerOnly"
          arguments: [ id: bigint, owner: TAddress, duration: bigint ]
        }
        removeController: {
          method: "removeController"
          arguments: [ controller: TAddress ]
        }
        renew: {
          method: "renew"
          arguments: [ id: bigint, duration: bigint ]
        }
        renounceOwnership: {
          method: "renounceOwnership"
          arguments: [  ]
        }
        safeTransferFrom: {
          method: "safeTransferFrom"
          arguments: [ from: TAddress, to: TAddress, tokenId: bigint ] | [ from: TAddress, to: TAddress, tokenId: bigint, _data: TEth.Hex ]
        }
        setApprovalForAll: {
          method: "setApprovalForAll"
          arguments: [ to: TAddress, approved: boolean ]
        }
        setResolver: {
          method: "setResolver"
          arguments: [ resolver: TAddress ]
        }
        supportsInterface: {
          method: "supportsInterface"
          arguments: [ interfaceID: TEth.Hex ]
        }
        transferFrom: {
          method: "transferFrom"
          arguments: [ from: TAddress, to: TAddress, tokenId: bigint ]
        }
        transferOwnership: {
          method: "transferOwnership"
          arguments: [ newOwner: TAddress ]
        }
    }
}



class EnsBaseRegistrarStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }

    async _owner(): Promise<TAddress> {
        return this.$storage.get(['_owner', ]);
    }

    async ens(): Promise<TAddress> {
        return this.$storage.get(['ens', ]);
    }

    async baseNode(): Promise<TEth.Hex> {
        return this.$storage.get(['baseNode', ]);
    }

    async controllers(key: TAddress): Promise<boolean> {
        return this.$storage.get(['controllers', key]);
    }

    async _supportedInterfaces(key: TEth.Hex): Promise<boolean> {
        return this.$storage.get(['_supportedInterfaces', key]);
    }

    async _tokenOwner(key: bigint): Promise<TAddress> {
        return this.$storage.get(['_tokenOwner', key]);
    }

    async _tokenApprovals(key: bigint): Promise<TAddress> {
        return this.$storage.get(['_tokenApprovals', key]);
    }

    async _ownedTokensCount(key: TAddress): Promise<bigint> {
        return this.$storage.get(['_ownedTokensCount', key]);
    }

    async _operatorApprovals(key: TAddress): Promise<Record<string | number, boolean>> {
        return this.$storage.get(['_operatorApprovals', key]);
    }

    async expiries(key: bigint): Promise<number> {
        return this.$storage.get(['expiries', key]);
    }

    $slots = [
    {
        "slot": 0,
        "position": 0,
        "name": "_owner",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 1,
        "position": 0,
        "name": "ens",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 2,
        "position": 0,
        "name": "baseNode",
        "size": 256,
        "type": "bytes32"
    },
    {
        "slot": 3,
        "position": 0,
        "name": "controllers",
        "size": null,
        "type": "mapping(address => bool)"
    },
    {
        "slot": 4,
        "position": 0,
        "name": "_supportedInterfaces",
        "size": null,
        "type": "mapping(bytes4 => bool)"
    },
    {
        "slot": 5,
        "position": 0,
        "name": "_tokenOwner",
        "size": null,
        "type": "mapping(uint256 => address)"
    },
    {
        "slot": 6,
        "position": 0,
        "name": "_tokenApprovals",
        "size": null,
        "type": "mapping(uint256 => address)"
    },
    {
        "slot": 7,
        "position": 0,
        "name": "_ownedTokensCount",
        "size": null,
        "type": "mapping(address => uint256)"
    },
    {
        "slot": 8,
        "position": 0,
        "name": "_operatorApprovals",
        "size": null,
        "type": "mapping(address => mapping(address => bool))"
    },
    {
        "slot": 9,
        "position": 0,
        "name": "expiries",
        "size": null,
        "type": "mapping(uint256 => uint)"
    }
]

}


interface IEnsBaseRegistrarTxCaller {
    addController (sender: TSender, controller: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    approve (sender: TSender, to: TAddress, tokenId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    reclaim (sender: TSender, id: bigint, owner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    register (sender: TSender, id: bigint, owner: TAddress, duration: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    registerOnly (sender: TSender, id: bigint, owner: TAddress, duration: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    removeController (sender: TSender, controller: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renew (sender: TSender, id: bigint, duration: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceOwnership (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint, _data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setApprovalForAll (sender: TSender, to: TAddress, approved: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setResolver (sender: TSender, resolver: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IEnsBaseRegistrarTxData {
    addController (sender: TSender, controller: TAddress): Promise<TEth.TxLike>
    approve (sender: TSender, to: TAddress, tokenId: bigint): Promise<TEth.TxLike>
    reclaim (sender: TSender, id: bigint, owner: TAddress): Promise<TEth.TxLike>
    register (sender: TSender, id: bigint, owner: TAddress, duration: bigint): Promise<TEth.TxLike>
    registerOnly (sender: TSender, id: bigint, owner: TAddress, duration: bigint): Promise<TEth.TxLike>
    removeController (sender: TSender, controller: TAddress): Promise<TEth.TxLike>
    renew (sender: TSender, id: bigint, duration: bigint): Promise<TEth.TxLike>
    renounceOwnership (sender: TSender, ): Promise<TEth.TxLike>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<TEth.TxLike>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint, _data: TEth.Hex): Promise<TEth.TxLike>
    setApprovalForAll (sender: TSender, to: TAddress, approved: boolean): Promise<TEth.TxLike>
    setResolver (sender: TSender, resolver: TAddress): Promise<TEth.TxLike>
    transferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<TEth.TxLike>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<TEth.TxLike>
}


type TEvents = TEnsBaseRegistrarTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
