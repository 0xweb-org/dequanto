/**
 *  AUTO-Generated Class: 2023-12-26 12:42
 *  Implementation: https://etherscan.io/address/0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401#code
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

export namespace EnsNameWrapperErrors {
    export interface CannotUpgrade {
        type: 'CannotUpgrade'
        params: {
        }
    }
    export interface IncompatibleParent {
        type: 'IncompatibleParent'
        params: {
        }
    }
    export interface IncorrectTargetOwner {
        type: 'IncorrectTargetOwner'
        params: {
            owner: TAddress
        }
    }
    export interface IncorrectTokenType {
        type: 'IncorrectTokenType'
        params: {
        }
    }
    export interface LabelMismatch {
        type: 'LabelMismatch'
        params: {
            labelHash: TEth.Hex
            expectedLabelhash: TEth.Hex
        }
    }
    export interface LabelTooLong {
        type: 'LabelTooLong'
        params: {
            label: string
        }
    }
    export interface LabelTooShort {
        type: 'LabelTooShort'
        params: {
        }
    }
    export interface NameIsNotWrapped {
        type: 'NameIsNotWrapped'
        params: {
        }
    }
    export interface OperationProhibited {
        type: 'OperationProhibited'
        params: {
            node: TEth.Hex
        }
    }
    export interface Unauthorised {
        type: 'Unauthorised'
        params: {
            node: TEth.Hex
            addr: TAddress
        }
    }
    export type Error = CannotUpgrade | IncompatibleParent | IncorrectTargetOwner | IncorrectTokenType | LabelMismatch | LabelTooLong | LabelTooShort | NameIsNotWrapped | OperationProhibited | Unauthorised
}

export class EnsNameWrapper extends ContractBase {
    constructor(
        public address: TEth.Address = '0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new EnsNameWrapperStorageReader(this.address, this.client, this.explorer);
    }

    $meta = {
    "class": "./contracts/ens/EnsNameWrapper/EnsNameWrapper.ts"
}

    async $constructor (deployer: TSender, _ens: TAddress, _registrar: TAddress, _metadataService: TAddress): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0xed70554d
    async _tokens (input0: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', '_tokens'), input0);
    }

    // 0xadf4960a
    async allFusesBurned (node: TEth.Hex, fuseMask: number): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'allFusesBurned'), node, fuseMask);
    }

    // 0x095ea7b3
    async approve (sender: TSender, to: TAddress, tokenId: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approve'), sender, to, tokenId);
    }

    // 0x00fdd58e
    async balanceOf (account: TAddress, id: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'balanceOf'), account, id);
    }

    // 0x4e1273f4
    async balanceOfBatch (accounts: TAddress[], ids: bigint[]): Promise<bigint[]> {
        return this.$read(this.$getAbiItem('function', 'balanceOfBatch'), accounts, ids);
    }

    // 0x0e4cd725
    async canExtendSubnames (node: TEth.Hex, addr: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'canExtendSubnames'), node, addr);
    }

    // 0x41415eab
    async canModifyName (node: TEth.Hex, addr: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'canModifyName'), node, addr);
    }

    // 0xda8c229e
    async controllers (input0: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'controllers'), input0);
    }

    // 0x3f15457f
    async ens (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'ens'));
    }

    // 0x6e5d6ad2
    async extendExpiry (sender: TSender, parentNode: TEth.Hex, labelhash: TEth.Hex, expiry: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'extendExpiry'), sender, parentNode, labelhash, expiry);
    }

    // 0x081812fc
    async getApproved (id: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getApproved'), id);
    }

    // 0x0178fe3f
    async getData (id: bigint): Promise<{ owner: TAddress, fuses: number, expiry: number }> {
        return this.$read(this.$getAbiItem('function', 'getData'), id);
    }

    // 0xe985e9c5
    async isApprovedForAll (account: TAddress, operator: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isApprovedForAll'), account, operator);
    }

    // 0xd9a50c12
    async isWrapped (parentNode: TEth.Hex, labelhash: TEth.Hex): Promise<boolean>
    // 0xfd0cd0d9
    async isWrapped (node: TEth.Hex): Promise<boolean>
    async isWrapped (...args): Promise<boolean> {
        let abi = this.$getAbiItemOverload([ 'function isWrapped(bytes32, bytes32) returns bool', 'function isWrapped(bytes32) returns bool' ], args);
        return this.$read(abi, ...args);
    }

    // 0x53095467
    async metadataService (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'metadataService'));
    }

    // 0x06fdde03
    async name (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'name'));
    }

    // 0x20c38e2b
    async names (input0: TEth.Hex): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'names'), input0);
    }

    // 0x150b7a02
    async onERC721Received (sender: TSender, to: TAddress, input1: TAddress, tokenId: bigint, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'onERC721Received'), sender, to, input1, tokenId, data);
    }

    // 0x8da5cb5b
    async owner (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'owner'));
    }

    // 0x6352211e
    async ownerOf (id: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'ownerOf'), id);
    }

    // 0x5d3590d5
    async recoverFunds (sender: TSender, _token: TAddress, _to: TAddress, _amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'recoverFunds'), sender, _token, _to, _amount);
    }

    // 0xa4014982
    async registerAndWrapETH2LD (sender: TSender, label: string, wrappedOwner: TAddress, duration: bigint, resolver: TAddress, ownerControlledFuses: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'registerAndWrapETH2LD'), sender, label, wrappedOwner, duration, resolver, ownerControlledFuses);
    }

    // 0x2b20e397
    async registrar (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'registrar'));
    }

    // 0xc475abff
    async renew (sender: TSender, tokenId: bigint, duration: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renew'), sender, tokenId, duration);
    }

    // 0x715018a6
    async renounceOwnership (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renounceOwnership'), sender);
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

    // 0x33c69ea9
    async setChildFuses (sender: TSender, parentNode: TEth.Hex, labelhash: TEth.Hex, fuses: number, expiry: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setChildFuses'), sender, parentNode, labelhash, fuses, expiry);
    }

    // 0xe0dba60f
    async setController (sender: TSender, controller: TAddress, active: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setController'), sender, controller, active);
    }

    // 0x402906fc
    async setFuses (sender: TSender, node: TEth.Hex, ownerControlledFuses: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setFuses'), sender, node, ownerControlledFuses);
    }

    // 0x1534e177
    async setMetadataService (sender: TSender, _metadataService: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setMetadataService'), sender, _metadataService);
    }

    // 0xcf408823
    async setRecord (sender: TSender, node: TEth.Hex, owner: TAddress, resolver: TAddress, ttl: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setRecord'), sender, node, owner, resolver, ttl);
    }

    // 0x1896f70a
    async setResolver (sender: TSender, node: TEth.Hex, resolver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setResolver'), sender, node, resolver);
    }

    // 0xc658e086
    async setSubnodeOwner (sender: TSender, parentNode: TEth.Hex, label: string, owner: TAddress, fuses: number, expiry: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setSubnodeOwner'), sender, parentNode, label, owner, fuses, expiry);
    }

    // 0x24c1af44
    async setSubnodeRecord (sender: TSender, parentNode: TEth.Hex, label: string, owner: TAddress, resolver: TAddress, ttl: number, fuses: number, expiry: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setSubnodeRecord'), sender, parentNode, label, owner, resolver, ttl, fuses, expiry);
    }

    // 0x14ab9038
    async setTTL (sender: TSender, node: TEth.Hex, ttl: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setTTL'), sender, node, ttl);
    }

    // 0xb6bcad26
    async setUpgradeContract (sender: TSender, _upgradeAddress: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setUpgradeContract'), sender, _upgradeAddress);
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceId: TEth.Hex): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceId);
    }

    // 0xf2fde38b
    async transferOwnership (sender: TSender, newOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferOwnership'), sender, newOwner);
    }

    // 0xd8c9921a
    async unwrap (sender: TSender, parentNode: TEth.Hex, labelhash: TEth.Hex, controller: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'unwrap'), sender, parentNode, labelhash, controller);
    }

    // 0x8b4dfa75
    async unwrapETH2LD (sender: TSender, labelhash: TEth.Hex, registrant: TAddress, controller: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'unwrapETH2LD'), sender, labelhash, registrant, controller);
    }

    // 0xc93ab3fd
    async upgrade (sender: TSender, name: TEth.Hex, extraData: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'upgrade'), sender, name, extraData);
    }

    // 0x1f4e1504
    async upgradeContract (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'upgradeContract'));
    }

    // 0x0e89341c
    async uri (tokenId: bigint): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'uri'), tokenId);
    }

    // 0xeb8ae530
    async wrap (sender: TSender, name: TEth.Hex, wrappedOwner: TAddress, resolver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'wrap'), sender, name, wrappedOwner, resolver);
    }

    // 0x8cf8b41e
    async wrapETH2LD (sender: TSender, label: string, wrappedOwner: TAddress, ownerControlledFuses: number, resolver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'wrapETH2LD'), sender, label, wrappedOwner, ownerControlledFuses, resolver);
    }

    $call () {
        return super.$call() as IEnsNameWrapperTxCaller;
    }
    $signed (): TOverrideReturns<IEnsNameWrapperTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IEnsNameWrapperTxData {
        return super.$data() as IEnsNameWrapperTxData;
    }
    $gas (): TOverrideReturns<IEnsNameWrapperTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onApproval (fn?: (event: TClientEventsStreamData<TLogApprovalParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogApprovalParameters>> {
        return this.$onLog('Approval', fn);
    }

    onApprovalForAll (fn?: (event: TClientEventsStreamData<TLogApprovalForAllParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogApprovalForAllParameters>> {
        return this.$onLog('ApprovalForAll', fn);
    }

    onControllerChanged (fn?: (event: TClientEventsStreamData<TLogControllerChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogControllerChangedParameters>> {
        return this.$onLog('ControllerChanged', fn);
    }

    onExpiryExtended (fn?: (event: TClientEventsStreamData<TLogExpiryExtendedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogExpiryExtendedParameters>> {
        return this.$onLog('ExpiryExtended', fn);
    }

    onFusesSet (fn?: (event: TClientEventsStreamData<TLogFusesSetParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogFusesSetParameters>> {
        return this.$onLog('FusesSet', fn);
    }

    onNameUnwrapped (fn?: (event: TClientEventsStreamData<TLogNameUnwrappedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogNameUnwrappedParameters>> {
        return this.$onLog('NameUnwrapped', fn);
    }

    onNameWrapped (fn?: (event: TClientEventsStreamData<TLogNameWrappedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogNameWrappedParameters>> {
        return this.$onLog('NameWrapped', fn);
    }

    onOwnershipTransferred (fn?: (event: TClientEventsStreamData<TLogOwnershipTransferredParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogOwnershipTransferredParameters>> {
        return this.$onLog('OwnershipTransferred', fn);
    }

    onTransferBatch (fn?: (event: TClientEventsStreamData<TLogTransferBatchParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogTransferBatchParameters>> {
        return this.$onLog('TransferBatch', fn);
    }

    onTransferSingle (fn?: (event: TClientEventsStreamData<TLogTransferSingleParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogTransferSingleParameters>> {
        return this.$onLog('TransferSingle', fn);
    }

    onURI (fn?: (event: TClientEventsStreamData<TLogURIParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogURIParameters>> {
        return this.$onLog('URI', fn);
    }

    extractLogsApproval (tx: TEth.TxReceipt): ITxLogItem<TLogApproval>[] {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApproval>[];
    }

    extractLogsApprovalForAll (tx: TEth.TxReceipt): ITxLogItem<TLogApprovalForAll>[] {
        let abi = this.$getAbiItem('event', 'ApprovalForAll');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApprovalForAll>[];
    }

    extractLogsControllerChanged (tx: TEth.TxReceipt): ITxLogItem<TLogControllerChanged>[] {
        let abi = this.$getAbiItem('event', 'ControllerChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogControllerChanged>[];
    }

    extractLogsExpiryExtended (tx: TEth.TxReceipt): ITxLogItem<TLogExpiryExtended>[] {
        let abi = this.$getAbiItem('event', 'ExpiryExtended');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogExpiryExtended>[];
    }

    extractLogsFusesSet (tx: TEth.TxReceipt): ITxLogItem<TLogFusesSet>[] {
        let abi = this.$getAbiItem('event', 'FusesSet');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogFusesSet>[];
    }

    extractLogsNameUnwrapped (tx: TEth.TxReceipt): ITxLogItem<TLogNameUnwrapped>[] {
        let abi = this.$getAbiItem('event', 'NameUnwrapped');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogNameUnwrapped>[];
    }

    extractLogsNameWrapped (tx: TEth.TxReceipt): ITxLogItem<TLogNameWrapped>[] {
        let abi = this.$getAbiItem('event', 'NameWrapped');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogNameWrapped>[];
    }

    extractLogsOwnershipTransferred (tx: TEth.TxReceipt): ITxLogItem<TLogOwnershipTransferred>[] {
        let abi = this.$getAbiItem('event', 'OwnershipTransferred');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogOwnershipTransferred>[];
    }

    extractLogsTransferBatch (tx: TEth.TxReceipt): ITxLogItem<TLogTransferBatch>[] {
        let abi = this.$getAbiItem('event', 'TransferBatch');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogTransferBatch>[];
    }

    extractLogsTransferSingle (tx: TEth.TxReceipt): ITxLogItem<TLogTransferSingle>[] {
        let abi = this.$getAbiItem('event', 'TransferSingle');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogTransferSingle>[];
    }

    extractLogsURI (tx: TEth.TxReceipt): ITxLogItem<TLogURI>[] {
        let abi = this.$getAbiItem('event', 'URI');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogURI>[];
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
        params?: { account?: TAddress,operator?: TAddress }
    }): Promise<ITxLogItem<TLogApprovalForAll>[]> {
        return await this.$getPastLogsParsed('ApprovalForAll', options) as any;
    }

    async getPastLogsControllerChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { controller?: TAddress }
    }): Promise<ITxLogItem<TLogControllerChanged>[]> {
        return await this.$getPastLogsParsed('ControllerChanged', options) as any;
    }

    async getPastLogsExpiryExtended (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex }
    }): Promise<ITxLogItem<TLogExpiryExtended>[]> {
        return await this.$getPastLogsParsed('ExpiryExtended', options) as any;
    }

    async getPastLogsFusesSet (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex }
    }): Promise<ITxLogItem<TLogFusesSet>[]> {
        return await this.$getPastLogsParsed('FusesSet', options) as any;
    }

    async getPastLogsNameUnwrapped (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex }
    }): Promise<ITxLogItem<TLogNameUnwrapped>[]> {
        return await this.$getPastLogsParsed('NameUnwrapped', options) as any;
    }

    async getPastLogsNameWrapped (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex }
    }): Promise<ITxLogItem<TLogNameWrapped>[]> {
        return await this.$getPastLogsParsed('NameWrapped', options) as any;
    }

    async getPastLogsOwnershipTransferred (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { previousOwner?: TAddress,newOwner?: TAddress }
    }): Promise<ITxLogItem<TLogOwnershipTransferred>[]> {
        return await this.$getPastLogsParsed('OwnershipTransferred', options) as any;
    }

    async getPastLogsTransferBatch (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { operator?: TAddress,from?: TAddress,to?: TAddress }
    }): Promise<ITxLogItem<TLogTransferBatch>[]> {
        return await this.$getPastLogsParsed('TransferBatch', options) as any;
    }

    async getPastLogsTransferSingle (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { operator?: TAddress,from?: TAddress,to?: TAddress }
    }): Promise<ITxLogItem<TLogTransferSingle>[]> {
        return await this.$getPastLogsParsed('TransferSingle', options) as any;
    }

    async getPastLogsURI (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogURI>[]> {
        return await this.$getPastLogsParsed('URI', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"contract ENS","name":"_ens","type":"address"},{"internalType":"contract IBaseRegistrar","name":"_registrar","type":"address"},{"internalType":"contract IMetadataService","name":"_metadataService","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"CannotUpgrade","type":"error"},{"inputs":[],"name":"IncompatibleParent","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"IncorrectTargetOwner","type":"error"},{"inputs":[],"name":"IncorrectTokenType","type":"error"},{"inputs":[{"internalType":"bytes32","name":"labelHash","type":"bytes32"},{"internalType":"bytes32","name":"expectedLabelhash","type":"bytes32"}],"name":"LabelMismatch","type":"error"},{"inputs":[{"internalType":"string","name":"label","type":"string"}],"name":"LabelTooLong","type":"error"},{"inputs":[],"name":"LabelTooShort","type":"error"},{"inputs":[],"name":"NameIsNotWrapped","type":"error"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"name":"OperationProhibited","type":"error"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"address","name":"addr","type":"address"}],"name":"Unauthorised","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"controller","type":"address"},{"indexed":false,"internalType":"bool","name":"active","type":"bool"}],"name":"ControllerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"uint64","name":"expiry","type":"uint64"}],"name":"ExpiryExtended","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"uint32","name":"fuses","type":"uint32"}],"name":"FusesSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"NameUnwrapped","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"name","type":"bytes"},{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint32","name":"fuses","type":"uint32"},{"indexed":false,"internalType":"uint64","name":"expiry","type":"uint64"}],"name":"NameWrapped","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_tokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"uint32","name":"fuseMask","type":"uint32"}],"name":"allFusesBurned","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"address","name":"addr","type":"address"}],"name":"canExtendSubnames","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"address","name":"addr","type":"address"}],"name":"canModifyName","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"controllers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ens","outputs":[{"internalType":"contract ENS","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"parentNode","type":"bytes32"},{"internalType":"bytes32","name":"labelhash","type":"bytes32"},{"internalType":"uint64","name":"expiry","type":"uint64"}],"name":"extendExpiry","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"operator","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getData","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint32","name":"fuses","type":"uint32"},{"internalType":"uint64","name":"expiry","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"parentNode","type":"bytes32"},{"internalType":"bytes32","name":"labelhash","type":"bytes32"}],"name":"isWrapped","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"name":"isWrapped","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"metadataService","outputs":[{"internalType":"contract IMetadataService","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"names","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"recoverFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"label","type":"string"},{"internalType":"address","name":"wrappedOwner","type":"address"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"address","name":"resolver","type":"address"},{"internalType":"uint16","name":"ownerControlledFuses","type":"uint16"}],"name":"registerAndWrapETH2LD","outputs":[{"internalType":"uint256","name":"registrarExpiry","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"registrar","outputs":[{"internalType":"contract IBaseRegistrar","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"duration","type":"uint256"}],"name":"renew","outputs":[{"internalType":"uint256","name":"expires","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"parentNode","type":"bytes32"},{"internalType":"bytes32","name":"labelhash","type":"bytes32"},{"internalType":"uint32","name":"fuses","type":"uint32"},{"internalType":"uint64","name":"expiry","type":"uint64"}],"name":"setChildFuses","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"controller","type":"address"},{"internalType":"bool","name":"active","type":"bool"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"uint16","name":"ownerControlledFuses","type":"uint16"}],"name":"setFuses","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IMetadataService","name":"_metadataService","type":"address"}],"name":"setMetadataService","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"resolver","type":"address"},{"internalType":"uint64","name":"ttl","type":"uint64"}],"name":"setRecord","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"address","name":"resolver","type":"address"}],"name":"setResolver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"parentNode","type":"bytes32"},{"internalType":"string","name":"label","type":"string"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint32","name":"fuses","type":"uint32"},{"internalType":"uint64","name":"expiry","type":"uint64"}],"name":"setSubnodeOwner","outputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"parentNode","type":"bytes32"},{"internalType":"string","name":"label","type":"string"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"resolver","type":"address"},{"internalType":"uint64","name":"ttl","type":"uint64"},{"internalType":"uint32","name":"fuses","type":"uint32"},{"internalType":"uint64","name":"expiry","type":"uint64"}],"name":"setSubnodeRecord","outputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"uint64","name":"ttl","type":"uint64"}],"name":"setTTL","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract INameWrapperUpgrade","name":"_upgradeAddress","type":"address"}],"name":"setUpgradeContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"parentNode","type":"bytes32"},{"internalType":"bytes32","name":"labelhash","type":"bytes32"},{"internalType":"address","name":"controller","type":"address"}],"name":"unwrap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"labelhash","type":"bytes32"},{"internalType":"address","name":"registrant","type":"address"},{"internalType":"address","name":"controller","type":"address"}],"name":"unwrapETH2LD","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"name","type":"bytes"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"name":"upgrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"upgradeContract","outputs":[{"internalType":"contract INameWrapperUpgrade","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"name","type":"bytes"},{"internalType":"address","name":"wrappedOwner","type":"address"},{"internalType":"address","name":"resolver","type":"address"}],"name":"wrap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"label","type":"string"},{"internalType":"address","name":"wrappedOwner","type":"address"},{"internalType":"uint16","name":"ownerControlledFuses","type":"uint16"},{"internalType":"address","name":"resolver","type":"address"}],"name":"wrapETH2LD","outputs":[{"internalType":"uint64","name":"expiry","type":"uint64"}],"stateMutability":"nonpayable","type":"function"}]

    declare storage: EnsNameWrapperStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogApproval = {
        owner: TAddress, approved: TAddress, tokenId: bigint
    };
    type TLogApprovalParameters = [ owner: TAddress, approved: TAddress, tokenId: bigint ];
    type TLogApprovalForAll = {
        account: TAddress, operator: TAddress, approved: boolean
    };
    type TLogApprovalForAllParameters = [ account: TAddress, operator: TAddress, approved: boolean ];
    type TLogControllerChanged = {
        controller: TAddress, active: boolean
    };
    type TLogControllerChangedParameters = [ controller: TAddress, active: boolean ];
    type TLogExpiryExtended = {
        node: TEth.Hex, expiry: number
    };
    type TLogExpiryExtendedParameters = [ node: TEth.Hex, expiry: number ];
    type TLogFusesSet = {
        node: TEth.Hex, fuses: number
    };
    type TLogFusesSetParameters = [ node: TEth.Hex, fuses: number ];
    type TLogNameUnwrapped = {
        node: TEth.Hex, owner: TAddress
    };
    type TLogNameUnwrappedParameters = [ node: TEth.Hex, owner: TAddress ];
    type TLogNameWrapped = {
        node: TEth.Hex, name: TEth.Hex, owner: TAddress, fuses: number, expiry: number
    };
    type TLogNameWrappedParameters = [ node: TEth.Hex, name: TEth.Hex, owner: TAddress, fuses: number, expiry: number ];
    type TLogOwnershipTransferred = {
        previousOwner: TAddress, newOwner: TAddress
    };
    type TLogOwnershipTransferredParameters = [ previousOwner: TAddress, newOwner: TAddress ];
    type TLogTransferBatch = {
        operator: TAddress, from: TAddress, to: TAddress, ids: bigint[], values: bigint[]
    };
    type TLogTransferBatchParameters = [ operator: TAddress, from: TAddress, to: TAddress, ids: bigint[], values: bigint[] ];
    type TLogTransferSingle = {
        operator: TAddress, from: TAddress, to: TAddress, id: bigint, value: bigint
    };
    type TLogTransferSingleParameters = [ operator: TAddress, from: TAddress, to: TAddress, id: bigint, value: bigint ];
    type TLogURI = {
        value: string, id: bigint
    };
    type TLogURIParameters = [ value: string, id: bigint ];

interface IEvents {
  Approval: TLogApprovalParameters
  ApprovalForAll: TLogApprovalForAllParameters
  ControllerChanged: TLogControllerChangedParameters
  ExpiryExtended: TLogExpiryExtendedParameters
  FusesSet: TLogFusesSetParameters
  NameUnwrapped: TLogNameUnwrappedParameters
  NameWrapped: TLogNameWrappedParameters
  OwnershipTransferred: TLogOwnershipTransferredParameters
  TransferBatch: TLogTransferBatchParameters
  TransferSingle: TLogTransferSingleParameters
  URI: TLogURIParameters
  '*': any[] 
}



interface IMethod_tokens {
  method: "_tokens"
  arguments: [ input0: bigint ]
}

interface IMethodAllFusesBurned {
  method: "allFusesBurned"
  arguments: [ node: TEth.Hex, fuseMask: number ]
}

interface IMethodApprove {
  method: "approve"
  arguments: [ to: TAddress, tokenId: bigint ]
}

interface IMethodBalanceOf {
  method: "balanceOf"
  arguments: [ account: TAddress, id: bigint ]
}

interface IMethodBalanceOfBatch {
  method: "balanceOfBatch"
  arguments: [ accounts: TAddress[], ids: bigint[] ]
}

interface IMethodCanExtendSubnames {
  method: "canExtendSubnames"
  arguments: [ node: TEth.Hex, addr: TAddress ]
}

interface IMethodCanModifyName {
  method: "canModifyName"
  arguments: [ node: TEth.Hex, addr: TAddress ]
}

interface IMethodControllers {
  method: "controllers"
  arguments: [ input0: TAddress ]
}

interface IMethodEns {
  method: "ens"
  arguments: [  ]
}

interface IMethodExtendExpiry {
  method: "extendExpiry"
  arguments: [ parentNode: TEth.Hex, labelhash: TEth.Hex, expiry: number ]
}

interface IMethodGetApproved {
  method: "getApproved"
  arguments: [ id: bigint ]
}

interface IMethodGetData {
  method: "getData"
  arguments: [ id: bigint ]
}

interface IMethodIsApprovedForAll {
  method: "isApprovedForAll"
  arguments: [ account: TAddress, operator: TAddress ]
}

interface IMethodIsWrapped {
  method: "isWrapped"
  arguments: [ parentNode: TEth.Hex, labelhash: TEth.Hex ] | [ node: TEth.Hex ]
}

interface IMethodMetadataService {
  method: "metadataService"
  arguments: [  ]
}

interface IMethodName {
  method: "name"
  arguments: [  ]
}

interface IMethodNames {
  method: "names"
  arguments: [ input0: TEth.Hex ]
}

interface IMethodOnERC721Received {
  method: "onERC721Received"
  arguments: [ to: TAddress, input1: TAddress, tokenId: bigint, data: TEth.Hex ]
}

interface IMethodOwner {
  method: "owner"
  arguments: [  ]
}

interface IMethodOwnerOf {
  method: "ownerOf"
  arguments: [ id: bigint ]
}

interface IMethodRecoverFunds {
  method: "recoverFunds"
  arguments: [ _token: TAddress, _to: TAddress, _amount: bigint ]
}

interface IMethodRegisterAndWrapETH2LD {
  method: "registerAndWrapETH2LD"
  arguments: [ label: string, wrappedOwner: TAddress, duration: bigint, resolver: TAddress, ownerControlledFuses: number ]
}

interface IMethodRegistrar {
  method: "registrar"
  arguments: [  ]
}

interface IMethodRenew {
  method: "renew"
  arguments: [ tokenId: bigint, duration: bigint ]
}

interface IMethodRenounceOwnership {
  method: "renounceOwnership"
  arguments: [  ]
}

interface IMethodSafeBatchTransferFrom {
  method: "safeBatchTransferFrom"
  arguments: [ from: TAddress, to: TAddress, ids: bigint[], amounts: bigint[], data: TEth.Hex ]
}

interface IMethodSafeTransferFrom {
  method: "safeTransferFrom"
  arguments: [ from: TAddress, to: TAddress, id: bigint, amount: bigint, data: TEth.Hex ]
}

interface IMethodSetApprovalForAll {
  method: "setApprovalForAll"
  arguments: [ operator: TAddress, approved: boolean ]
}

interface IMethodSetChildFuses {
  method: "setChildFuses"
  arguments: [ parentNode: TEth.Hex, labelhash: TEth.Hex, fuses: number, expiry: number ]
}

interface IMethodSetController {
  method: "setController"
  arguments: [ controller: TAddress, active: boolean ]
}

interface IMethodSetFuses {
  method: "setFuses"
  arguments: [ node: TEth.Hex, ownerControlledFuses: number ]
}

interface IMethodSetMetadataService {
  method: "setMetadataService"
  arguments: [ _metadataService: TAddress ]
}

interface IMethodSetRecord {
  method: "setRecord"
  arguments: [ node: TEth.Hex, owner: TAddress, resolver: TAddress, ttl: number ]
}

interface IMethodSetResolver {
  method: "setResolver"
  arguments: [ node: TEth.Hex, resolver: TAddress ]
}

interface IMethodSetSubnodeOwner {
  method: "setSubnodeOwner"
  arguments: [ parentNode: TEth.Hex, label: string, owner: TAddress, fuses: number, expiry: number ]
}

interface IMethodSetSubnodeRecord {
  method: "setSubnodeRecord"
  arguments: [ parentNode: TEth.Hex, label: string, owner: TAddress, resolver: TAddress, ttl: number, fuses: number, expiry: number ]
}

interface IMethodSetTTL {
  method: "setTTL"
  arguments: [ node: TEth.Hex, ttl: number ]
}

interface IMethodSetUpgradeContract {
  method: "setUpgradeContract"
  arguments: [ _upgradeAddress: TAddress ]
}

interface IMethodSupportsInterface {
  method: "supportsInterface"
  arguments: [ interfaceId: TEth.Hex ]
}

interface IMethodTransferOwnership {
  method: "transferOwnership"
  arguments: [ newOwner: TAddress ]
}

interface IMethodUnwrap {
  method: "unwrap"
  arguments: [ parentNode: TEth.Hex, labelhash: TEth.Hex, controller: TAddress ]
}

interface IMethodUnwrapETH2LD {
  method: "unwrapETH2LD"
  arguments: [ labelhash: TEth.Hex, registrant: TAddress, controller: TAddress ]
}

interface IMethodUpgrade {
  method: "upgrade"
  arguments: [ name: TEth.Hex, extraData: TEth.Hex ]
}

interface IMethodUpgradeContract {
  method: "upgradeContract"
  arguments: [  ]
}

interface IMethodUri {
  method: "uri"
  arguments: [ tokenId: bigint ]
}

interface IMethodWrap {
  method: "wrap"
  arguments: [ name: TEth.Hex, wrappedOwner: TAddress, resolver: TAddress ]
}

interface IMethodWrapETH2LD {
  method: "wrapETH2LD"
  arguments: [ label: string, wrappedOwner: TAddress, ownerControlledFuses: number, resolver: TAddress ]
}

interface IMethods {
  _tokens: IMethod_tokens
  allFusesBurned: IMethodAllFusesBurned
  approve: IMethodApprove
  balanceOf: IMethodBalanceOf
  balanceOfBatch: IMethodBalanceOfBatch
  canExtendSubnames: IMethodCanExtendSubnames
  canModifyName: IMethodCanModifyName
  controllers: IMethodControllers
  ens: IMethodEns
  extendExpiry: IMethodExtendExpiry
  getApproved: IMethodGetApproved
  getData: IMethodGetData
  isApprovedForAll: IMethodIsApprovedForAll
  isWrapped: IMethodIsWrapped
  metadataService: IMethodMetadataService
  name: IMethodName
  names: IMethodNames
  onERC721Received: IMethodOnERC721Received
  owner: IMethodOwner
  ownerOf: IMethodOwnerOf
  recoverFunds: IMethodRecoverFunds
  registerAndWrapETH2LD: IMethodRegisterAndWrapETH2LD
  registrar: IMethodRegistrar
  renew: IMethodRenew
  renounceOwnership: IMethodRenounceOwnership
  safeBatchTransferFrom: IMethodSafeBatchTransferFrom
  safeTransferFrom: IMethodSafeTransferFrom
  setApprovalForAll: IMethodSetApprovalForAll
  setChildFuses: IMethodSetChildFuses
  setController: IMethodSetController
  setFuses: IMethodSetFuses
  setMetadataService: IMethodSetMetadataService
  setRecord: IMethodSetRecord
  setResolver: IMethodSetResolver
  setSubnodeOwner: IMethodSetSubnodeOwner
  setSubnodeRecord: IMethodSetSubnodeRecord
  setTTL: IMethodSetTTL
  setUpgradeContract: IMethodSetUpgradeContract
  supportsInterface: IMethodSupportsInterface
  transferOwnership: IMethodTransferOwnership
  unwrap: IMethodUnwrap
  unwrapETH2LD: IMethodUnwrapETH2LD
  upgrade: IMethodUpgrade
  upgradeContract: IMethodUpgradeContract
  uri: IMethodUri
  wrap: IMethodWrap
  wrapETH2LD: IMethodWrapETH2LD
  '*': { method: string, arguments: any[] } 
}





class EnsNameWrapperStorageReader extends ContractStorageReaderBase {
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

    async _tokens(key: bigint): Promise<bigint> {
        return this.$storage.get(['_tokens', key]);
    }

    async _operatorApprovals(key: TAddress): Promise<Record<string | number, boolean>> {
        return this.$storage.get(['_operatorApprovals', key]);
    }

    async _tokenApprovals(key: bigint): Promise<TAddress> {
        return this.$storage.get(['_tokenApprovals', key]);
    }

    async controllers(key: TAddress): Promise<boolean> {
        return this.$storage.get(['controllers', key]);
    }

    async metadataService(): Promise<TAddress> {
        return this.$storage.get(['metadataService', ]);
    }

    async names(key: TEth.Hex): Promise<TEth.Hex> {
        return this.$storage.get(['names', key]);
    }

    async upgradeContract(): Promise<TAddress> {
        return this.$storage.get(['upgradeContract', ]);
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
        "name": "_tokens",
        "size": null,
        "type": "mapping(uint256 => uint256)"
    },
    {
        "slot": 2,
        "position": 0,
        "name": "_operatorApprovals",
        "size": null,
        "type": "mapping(address => mapping(address => bool))"
    },
    {
        "slot": 3,
        "position": 0,
        "name": "_tokenApprovals",
        "size": null,
        "type": "mapping(uint256 => address)"
    },
    {
        "slot": 4,
        "position": 0,
        "name": "controllers",
        "size": null,
        "type": "mapping(address => bool)"
    },
    {
        "slot": 5,
        "position": 0,
        "name": "metadataService",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 6,
        "position": 0,
        "name": "names",
        "size": null,
        "type": "mapping(bytes32 => bytes)"
    },
    {
        "slot": 7,
        "position": 0,
        "name": "upgradeContract",
        "size": 160,
        "type": "address"
    }
]

}



interface IEnsNameWrapperTxCaller {
    approve (sender: TSender, to: TAddress, tokenId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    extendExpiry (sender: TSender, parentNode: TEth.Hex, labelhash: TEth.Hex, expiry: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    onERC721Received (sender: TSender, to: TAddress, input1: TAddress, tokenId: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    recoverFunds (sender: TSender, _token: TAddress, _to: TAddress, _amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    registerAndWrapETH2LD (sender: TSender, label: string, wrappedOwner: TAddress, duration: bigint, resolver: TAddress, ownerControlledFuses: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renew (sender: TSender, tokenId: bigint, duration: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceOwnership (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    safeBatchTransferFrom (sender: TSender, from: TAddress, to: TAddress, ids: bigint[], amounts: bigint[], data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, id: bigint, amount: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setChildFuses (sender: TSender, parentNode: TEth.Hex, labelhash: TEth.Hex, fuses: number, expiry: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setController (sender: TSender, controller: TAddress, active: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setFuses (sender: TSender, node: TEth.Hex, ownerControlledFuses: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setMetadataService (sender: TSender, _metadataService: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setRecord (sender: TSender, node: TEth.Hex, owner: TAddress, resolver: TAddress, ttl: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setResolver (sender: TSender, node: TEth.Hex, resolver: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setSubnodeOwner (sender: TSender, parentNode: TEth.Hex, label: string, owner: TAddress, fuses: number, expiry: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setSubnodeRecord (sender: TSender, parentNode: TEth.Hex, label: string, owner: TAddress, resolver: TAddress, ttl: number, fuses: number, expiry: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setTTL (sender: TSender, node: TEth.Hex, ttl: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setUpgradeContract (sender: TSender, _upgradeAddress: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    unwrap (sender: TSender, parentNode: TEth.Hex, labelhash: TEth.Hex, controller: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    unwrapETH2LD (sender: TSender, labelhash: TEth.Hex, registrant: TAddress, controller: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    upgrade (sender: TSender, name: TEth.Hex, extraData: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    wrap (sender: TSender, name: TEth.Hex, wrappedOwner: TAddress, resolver: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    wrapETH2LD (sender: TSender, label: string, wrappedOwner: TAddress, ownerControlledFuses: number, resolver: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IEnsNameWrapperTxData {
    approve (sender: TSender, to: TAddress, tokenId: bigint): Promise<TEth.TxLike>
    extendExpiry (sender: TSender, parentNode: TEth.Hex, labelhash: TEth.Hex, expiry: number): Promise<TEth.TxLike>
    onERC721Received (sender: TSender, to: TAddress, input1: TAddress, tokenId: bigint, data: TEth.Hex): Promise<TEth.TxLike>
    recoverFunds (sender: TSender, _token: TAddress, _to: TAddress, _amount: bigint): Promise<TEth.TxLike>
    registerAndWrapETH2LD (sender: TSender, label: string, wrappedOwner: TAddress, duration: bigint, resolver: TAddress, ownerControlledFuses: number): Promise<TEth.TxLike>
    renew (sender: TSender, tokenId: bigint, duration: bigint): Promise<TEth.TxLike>
    renounceOwnership (sender: TSender, ): Promise<TEth.TxLike>
    safeBatchTransferFrom (sender: TSender, from: TAddress, to: TAddress, ids: bigint[], amounts: bigint[], data: TEth.Hex): Promise<TEth.TxLike>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, id: bigint, amount: bigint, data: TEth.Hex): Promise<TEth.TxLike>
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<TEth.TxLike>
    setChildFuses (sender: TSender, parentNode: TEth.Hex, labelhash: TEth.Hex, fuses: number, expiry: number): Promise<TEth.TxLike>
    setController (sender: TSender, controller: TAddress, active: boolean): Promise<TEth.TxLike>
    setFuses (sender: TSender, node: TEth.Hex, ownerControlledFuses: number): Promise<TEth.TxLike>
    setMetadataService (sender: TSender, _metadataService: TAddress): Promise<TEth.TxLike>
    setRecord (sender: TSender, node: TEth.Hex, owner: TAddress, resolver: TAddress, ttl: number): Promise<TEth.TxLike>
    setResolver (sender: TSender, node: TEth.Hex, resolver: TAddress): Promise<TEth.TxLike>
    setSubnodeOwner (sender: TSender, parentNode: TEth.Hex, label: string, owner: TAddress, fuses: number, expiry: number): Promise<TEth.TxLike>
    setSubnodeRecord (sender: TSender, parentNode: TEth.Hex, label: string, owner: TAddress, resolver: TAddress, ttl: number, fuses: number, expiry: number): Promise<TEth.TxLike>
    setTTL (sender: TSender, node: TEth.Hex, ttl: number): Promise<TEth.TxLike>
    setUpgradeContract (sender: TSender, _upgradeAddress: TAddress): Promise<TEth.TxLike>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<TEth.TxLike>
    unwrap (sender: TSender, parentNode: TEth.Hex, labelhash: TEth.Hex, controller: TAddress): Promise<TEth.TxLike>
    unwrapETH2LD (sender: TSender, labelhash: TEth.Hex, registrant: TAddress, controller: TAddress): Promise<TEth.TxLike>
    upgrade (sender: TSender, name: TEth.Hex, extraData: TEth.Hex): Promise<TEth.TxLike>
    wrap (sender: TSender, name: TEth.Hex, wrappedOwner: TAddress, resolver: TAddress): Promise<TEth.TxLike>
    wrapETH2LD (sender: TSender, label: string, wrappedOwner: TAddress, ownerControlledFuses: number, resolver: TAddress): Promise<TEth.TxLike>
}


