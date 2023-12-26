/**
 *  AUTO-Generated Class: 2023-12-26 12:42
 *  Implementation: https://etherscan.io/address/0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63#code
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



export class EnsPublicResolver extends ContractBase {
    constructor(
        public address: TEth.Address = '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new EnsPublicResolverStorageReader(this.address, this.client, this.explorer);
    }

    $meta = {
    "class": "./contracts/ens/EnsPublicResolver/EnsPublicResolver.ts"
}

    async $constructor (deployer: TSender, _ens: TAddress, wrapperAddress: TAddress, _trustedETHController: TAddress, _trustedReverseRegistrar: TAddress): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0x2203ab56
    async ABI (node: TEth.Hex, contentTypes: bigint): Promise<[ bigint, TEth.Hex ]> {
        return this.$read(this.$getAbiItem('function', 'ABI'), node, contentTypes);
    }

    // 0x3b3b57de
    async addr (node: TEth.Hex): Promise<TAddress>
    // 0xf1cb7e06
    async addr (node: TEth.Hex, coinType: bigint): Promise<TEth.Hex>
    async addr (...args): Promise<TAddress> {
        let abi = this.$getAbiItemOverload([ 'function addr(bytes32) returns address', 'function addr(bytes32, uint256) returns bytes' ], args);
        return this.$read(abi, ...args);
    }

    // 0xa4b91a01
    async approve (sender: TSender, node: TEth.Hex, delegate: TAddress, approved: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approve'), sender, node, delegate, approved);
    }

    // 0x3603d758
    async clearRecords (sender: TSender, node: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'clearRecords'), sender, node);
    }

    // 0xbc1c58d1
    async contenthash (node: TEth.Hex): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'contenthash'), node);
    }

    // 0xa8fa5682
    async dnsRecord (node: TEth.Hex, name: TEth.Hex, resource: number): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'dnsRecord'), node, name, resource);
    }

    // 0x4cbf6ba4
    async hasDNSRecords (node: TEth.Hex, name: TEth.Hex): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'hasDNSRecords'), node, name);
    }

    // 0x124a319c
    async interfaceImplementer (node: TEth.Hex, interfaceID: TEth.Hex): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'interfaceImplementer'), node, interfaceID);
    }

    // 0xa9784b3e
    async isApprovedFor (owner: TAddress, node: TEth.Hex, delegate: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isApprovedFor'), owner, node, delegate);
    }

    // 0xe985e9c5
    async isApprovedForAll (account: TAddress, operator: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isApprovedForAll'), account, operator);
    }

    // 0xac9650d8
    async multicall (sender: TSender, data: TEth.Hex[]): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'multicall'), sender, data);
    }

    // 0xe32954eb
    async multicallWithNodeCheck (sender: TSender, nodehash: TEth.Hex, data: TEth.Hex[]): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'multicallWithNodeCheck'), sender, nodehash, data);
    }

    // 0x691f3431
    async name (node: TEth.Hex): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'name'), node);
    }

    // 0xc8690233
    async pubkey (node: TEth.Hex): Promise<{ x: TEth.Hex, y: TEth.Hex }> {
        return this.$read(this.$getAbiItem('function', 'pubkey'), node);
    }

    // 0xd700ff33
    async recordVersions (input0: TEth.Hex): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'recordVersions'), input0);
    }

    // 0x623195b0
    async setABI (sender: TSender, node: TEth.Hex, contentType: bigint, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setABI'), sender, node, contentType, data);
    }

    // 0x8b95dd71
    async setAddr (sender: TSender, node: TEth.Hex, coinType: bigint, a: TEth.Hex): Promise<TxWriter>
    // 0xd5fa2b00
    async setAddr (sender: TSender, node: TEth.Hex, a: TAddress): Promise<TxWriter>
    async setAddr (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function setAddr(bytes32, uint256, bytes)', 'function setAddr(bytes32, address)' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0xa22cb465
    async setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setApprovalForAll'), sender, operator, approved);
    }

    // 0x304e6ade
    async setContenthash (sender: TSender, node: TEth.Hex, hash: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setContenthash'), sender, node, hash);
    }

    // 0x0af179d7
    async setDNSRecords (sender: TSender, node: TEth.Hex, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setDNSRecords'), sender, node, data);
    }

    // 0xe59d895d
    async setInterface (sender: TSender, node: TEth.Hex, interfaceID: TEth.Hex, implementer: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setInterface'), sender, node, interfaceID, implementer);
    }

    // 0x77372213
    async setName (sender: TSender, node: TEth.Hex, newName: string): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setName'), sender, node, newName);
    }

    // 0x29cd62ea
    async setPubkey (sender: TSender, node: TEth.Hex, x: TEth.Hex, y: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setPubkey'), sender, node, x, y);
    }

    // 0x10f13a8c
    async setText (sender: TSender, node: TEth.Hex, key: string, value: string): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setText'), sender, node, key, value);
    }

    // 0xce3decdc
    async setZonehash (sender: TSender, node: TEth.Hex, hash: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setZonehash'), sender, node, hash);
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceID: TEth.Hex): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceID);
    }

    // 0x59d1d43c
    async text (node: TEth.Hex, key: string): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'text'), node, key);
    }

    // 0x5c98042b
    async zonehash (node: TEth.Hex): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'zonehash'), node);
    }

    $call () {
        return super.$call() as IEnsPublicResolverTxCaller;
    }
    $signed (): TOverrideReturns<IEnsPublicResolverTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IEnsPublicResolverTxData {
        return super.$data() as IEnsPublicResolverTxData;
    }
    $gas (): TOverrideReturns<IEnsPublicResolverTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onABIChanged (fn?: (event: TClientEventsStreamData<TLogABIChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogABIChangedParameters>> {
        return this.$onLog('ABIChanged', fn);
    }

    onAddrChanged (fn?: (event: TClientEventsStreamData<TLogAddrChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogAddrChangedParameters>> {
        return this.$onLog('AddrChanged', fn);
    }

    onAddressChanged (fn?: (event: TClientEventsStreamData<TLogAddressChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogAddressChangedParameters>> {
        return this.$onLog('AddressChanged', fn);
    }

    onApprovalForAll (fn?: (event: TClientEventsStreamData<TLogApprovalForAllParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogApprovalForAllParameters>> {
        return this.$onLog('ApprovalForAll', fn);
    }

    onApproved (fn?: (event: TClientEventsStreamData<TLogApprovedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogApprovedParameters>> {
        return this.$onLog('Approved', fn);
    }

    onContenthashChanged (fn?: (event: TClientEventsStreamData<TLogContenthashChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogContenthashChangedParameters>> {
        return this.$onLog('ContenthashChanged', fn);
    }

    onDNSRecordChanged (fn?: (event: TClientEventsStreamData<TLogDNSRecordChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDNSRecordChangedParameters>> {
        return this.$onLog('DNSRecordChanged', fn);
    }

    onDNSRecordDeleted (fn?: (event: TClientEventsStreamData<TLogDNSRecordDeletedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDNSRecordDeletedParameters>> {
        return this.$onLog('DNSRecordDeleted', fn);
    }

    onDNSZonehashChanged (fn?: (event: TClientEventsStreamData<TLogDNSZonehashChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDNSZonehashChangedParameters>> {
        return this.$onLog('DNSZonehashChanged', fn);
    }

    onInterfaceChanged (fn?: (event: TClientEventsStreamData<TLogInterfaceChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogInterfaceChangedParameters>> {
        return this.$onLog('InterfaceChanged', fn);
    }

    onNameChanged (fn?: (event: TClientEventsStreamData<TLogNameChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogNameChangedParameters>> {
        return this.$onLog('NameChanged', fn);
    }

    onPubkeyChanged (fn?: (event: TClientEventsStreamData<TLogPubkeyChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogPubkeyChangedParameters>> {
        return this.$onLog('PubkeyChanged', fn);
    }

    onTextChanged (fn?: (event: TClientEventsStreamData<TLogTextChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogTextChangedParameters>> {
        return this.$onLog('TextChanged', fn);
    }

    onVersionChanged (fn?: (event: TClientEventsStreamData<TLogVersionChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogVersionChangedParameters>> {
        return this.$onLog('VersionChanged', fn);
    }

    extractLogsABIChanged (tx: TEth.TxReceipt): ITxLogItem<TLogABIChanged>[] {
        let abi = this.$getAbiItem('event', 'ABIChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogABIChanged>[];
    }

    extractLogsAddrChanged (tx: TEth.TxReceipt): ITxLogItem<TLogAddrChanged>[] {
        let abi = this.$getAbiItem('event', 'AddrChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogAddrChanged>[];
    }

    extractLogsAddressChanged (tx: TEth.TxReceipt): ITxLogItem<TLogAddressChanged>[] {
        let abi = this.$getAbiItem('event', 'AddressChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogAddressChanged>[];
    }

    extractLogsApprovalForAll (tx: TEth.TxReceipt): ITxLogItem<TLogApprovalForAll>[] {
        let abi = this.$getAbiItem('event', 'ApprovalForAll');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApprovalForAll>[];
    }

    extractLogsApproved (tx: TEth.TxReceipt): ITxLogItem<TLogApproved>[] {
        let abi = this.$getAbiItem('event', 'Approved');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApproved>[];
    }

    extractLogsContenthashChanged (tx: TEth.TxReceipt): ITxLogItem<TLogContenthashChanged>[] {
        let abi = this.$getAbiItem('event', 'ContenthashChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogContenthashChanged>[];
    }

    extractLogsDNSRecordChanged (tx: TEth.TxReceipt): ITxLogItem<TLogDNSRecordChanged>[] {
        let abi = this.$getAbiItem('event', 'DNSRecordChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDNSRecordChanged>[];
    }

    extractLogsDNSRecordDeleted (tx: TEth.TxReceipt): ITxLogItem<TLogDNSRecordDeleted>[] {
        let abi = this.$getAbiItem('event', 'DNSRecordDeleted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDNSRecordDeleted>[];
    }

    extractLogsDNSZonehashChanged (tx: TEth.TxReceipt): ITxLogItem<TLogDNSZonehashChanged>[] {
        let abi = this.$getAbiItem('event', 'DNSZonehashChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDNSZonehashChanged>[];
    }

    extractLogsInterfaceChanged (tx: TEth.TxReceipt): ITxLogItem<TLogInterfaceChanged>[] {
        let abi = this.$getAbiItem('event', 'InterfaceChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogInterfaceChanged>[];
    }

    extractLogsNameChanged (tx: TEth.TxReceipt): ITxLogItem<TLogNameChanged>[] {
        let abi = this.$getAbiItem('event', 'NameChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogNameChanged>[];
    }

    extractLogsPubkeyChanged (tx: TEth.TxReceipt): ITxLogItem<TLogPubkeyChanged>[] {
        let abi = this.$getAbiItem('event', 'PubkeyChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogPubkeyChanged>[];
    }

    extractLogsTextChanged (tx: TEth.TxReceipt): ITxLogItem<TLogTextChanged>[] {
        let abi = this.$getAbiItem('event', 'TextChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogTextChanged>[];
    }

    extractLogsVersionChanged (tx: TEth.TxReceipt): ITxLogItem<TLogVersionChanged>[] {
        let abi = this.$getAbiItem('event', 'VersionChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogVersionChanged>[];
    }

    async getPastLogsABIChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex,contentType?: bigint }
    }): Promise<ITxLogItem<TLogABIChanged>[]> {
        return await this.$getPastLogsParsed('ABIChanged', options) as any;
    }

    async getPastLogsAddrChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex }
    }): Promise<ITxLogItem<TLogAddrChanged>[]> {
        return await this.$getPastLogsParsed('AddrChanged', options) as any;
    }

    async getPastLogsAddressChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex }
    }): Promise<ITxLogItem<TLogAddressChanged>[]> {
        return await this.$getPastLogsParsed('AddressChanged', options) as any;
    }

    async getPastLogsApprovalForAll (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress,operator?: TAddress }
    }): Promise<ITxLogItem<TLogApprovalForAll>[]> {
        return await this.$getPastLogsParsed('ApprovalForAll', options) as any;
    }

    async getPastLogsApproved (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogApproved>[]> {
        return await this.$getPastLogsParsed('Approved', options) as any;
    }

    async getPastLogsContenthashChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex }
    }): Promise<ITxLogItem<TLogContenthashChanged>[]> {
        return await this.$getPastLogsParsed('ContenthashChanged', options) as any;
    }

    async getPastLogsDNSRecordChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex }
    }): Promise<ITxLogItem<TLogDNSRecordChanged>[]> {
        return await this.$getPastLogsParsed('DNSRecordChanged', options) as any;
    }

    async getPastLogsDNSRecordDeleted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex }
    }): Promise<ITxLogItem<TLogDNSRecordDeleted>[]> {
        return await this.$getPastLogsParsed('DNSRecordDeleted', options) as any;
    }

    async getPastLogsDNSZonehashChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex }
    }): Promise<ITxLogItem<TLogDNSZonehashChanged>[]> {
        return await this.$getPastLogsParsed('DNSZonehashChanged', options) as any;
    }

    async getPastLogsInterfaceChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex,interfaceID?: TEth.Hex }
    }): Promise<ITxLogItem<TLogInterfaceChanged>[]> {
        return await this.$getPastLogsParsed('InterfaceChanged', options) as any;
    }

    async getPastLogsNameChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex }
    }): Promise<ITxLogItem<TLogNameChanged>[]> {
        return await this.$getPastLogsParsed('NameChanged', options) as any;
    }

    async getPastLogsPubkeyChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex }
    }): Promise<ITxLogItem<TLogPubkeyChanged>[]> {
        return await this.$getPastLogsParsed('PubkeyChanged', options) as any;
    }

    async getPastLogsTextChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex,indexedKey?: string }
    }): Promise<ITxLogItem<TLogTextChanged>[]> {
        return await this.$getPastLogsParsed('TextChanged', options) as any;
    }

    async getPastLogsVersionChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex }
    }): Promise<ITxLogItem<TLogVersionChanged>[]> {
        return await this.$getPastLogsParsed('VersionChanged', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"contract ENS","name":"_ens","type":"address"},{"internalType":"contract INameWrapper","name":"wrapperAddress","type":"address"},{"internalType":"address","name":"_trustedETHController","type":"address"},{"internalType":"address","name":"_trustedReverseRegistrar","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":true,"internalType":"uint256","name":"contentType","type":"uint256"}],"name":"ABIChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"AddrChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"coinType","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"newAddress","type":"bytes"}],"name":"AddressChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":true,"internalType":"bool","name":"approved","type":"bool"}],"name":"Approved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"hash","type":"bytes"}],"name":"ContenthashChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"name","type":"bytes"},{"indexed":false,"internalType":"uint16","name":"resource","type":"uint16"},{"indexed":false,"internalType":"bytes","name":"record","type":"bytes"}],"name":"DNSRecordChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"name","type":"bytes"},{"indexed":false,"internalType":"uint16","name":"resource","type":"uint16"}],"name":"DNSRecordDeleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"lastzonehash","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"zonehash","type":"bytes"}],"name":"DNSZonehashChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":true,"internalType":"bytes4","name":"interfaceID","type":"bytes4"},{"indexed":false,"internalType":"address","name":"implementer","type":"address"}],"name":"InterfaceChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"string","name":"name","type":"string"}],"name":"NameChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"x","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"y","type":"bytes32"}],"name":"PubkeyChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":true,"internalType":"string","name":"indexedKey","type":"string"},{"indexed":false,"internalType":"string","name":"key","type":"string"},{"indexed":false,"internalType":"string","name":"value","type":"string"}],"name":"TextChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":false,"internalType":"uint64","name":"newVersion","type":"uint64"}],"name":"VersionChanged","type":"event"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"uint256","name":"contentTypes","type":"uint256"}],"name":"ABI","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"name":"addr","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"uint256","name":"coinType","type":"uint256"}],"name":"addr","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"address","name":"delegate","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"name":"clearRecords","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"name":"contenthash","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"bytes32","name":"name","type":"bytes32"},{"internalType":"uint16","name":"resource","type":"uint16"}],"name":"dnsRecord","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"bytes32","name":"name","type":"bytes32"}],"name":"hasDNSRecords","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"bytes4","name":"interfaceID","type":"bytes4"}],"name":"interfaceImplementer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"address","name":"delegate","type":"address"}],"name":"isApprovedFor","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"nodehash","type":"bytes32"},{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicallWithNodeCheck","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"name":"pubkey","outputs":[{"internalType":"bytes32","name":"x","type":"bytes32"},{"internalType":"bytes32","name":"y","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"recordVersions","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"uint256","name":"contentType","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"setABI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"uint256","name":"coinType","type":"uint256"},{"internalType":"bytes","name":"a","type":"bytes"}],"name":"setAddr","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"address","name":"a","type":"address"}],"name":"setAddr","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"bytes","name":"hash","type":"bytes"}],"name":"setContenthash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"setDNSRecords","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"bytes4","name":"interfaceID","type":"bytes4"},{"internalType":"address","name":"implementer","type":"address"}],"name":"setInterface","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"string","name":"newName","type":"string"}],"name":"setName","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"bytes32","name":"x","type":"bytes32"},{"internalType":"bytes32","name":"y","type":"bytes32"}],"name":"setPubkey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"setText","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"bytes","name":"hash","type":"bytes"}],"name":"setZonehash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"},{"internalType":"string","name":"key","type":"string"}],"name":"text","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"node","type":"bytes32"}],"name":"zonehash","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"}]

    declare storage: EnsPublicResolverStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogABIChanged = {
        node: TEth.Hex, contentType: bigint
    };
    type TLogABIChangedParameters = [ node: TEth.Hex, contentType: bigint ];
    type TLogAddrChanged = {
        node: TEth.Hex, a: TAddress
    };
    type TLogAddrChangedParameters = [ node: TEth.Hex, a: TAddress ];
    type TLogAddressChanged = {
        node: TEth.Hex, coinType: bigint, newAddress: TEth.Hex
    };
    type TLogAddressChangedParameters = [ node: TEth.Hex, coinType: bigint, newAddress: TEth.Hex ];
    type TLogApprovalForAll = {
        owner: TAddress, operator: TAddress, approved: boolean
    };
    type TLogApprovalForAllParameters = [ owner: TAddress, operator: TAddress, approved: boolean ];
    type TLogApproved = {
        owner: TAddress, node: TEth.Hex, delegate: TAddress, approved: boolean
    };
    type TLogApprovedParameters = [ owner: TAddress, node: TEth.Hex, delegate: TAddress, approved: boolean ];
    type TLogContenthashChanged = {
        node: TEth.Hex, hash: TEth.Hex
    };
    type TLogContenthashChangedParameters = [ node: TEth.Hex, hash: TEth.Hex ];
    type TLogDNSRecordChanged = {
        node: TEth.Hex, name: TEth.Hex, resource: number, record: TEth.Hex
    };
    type TLogDNSRecordChangedParameters = [ node: TEth.Hex, name: TEth.Hex, resource: number, record: TEth.Hex ];
    type TLogDNSRecordDeleted = {
        node: TEth.Hex, name: TEth.Hex, resource: number
    };
    type TLogDNSRecordDeletedParameters = [ node: TEth.Hex, name: TEth.Hex, resource: number ];
    type TLogDNSZonehashChanged = {
        node: TEth.Hex, lastzonehash: TEth.Hex, zonehash: TEth.Hex
    };
    type TLogDNSZonehashChangedParameters = [ node: TEth.Hex, lastzonehash: TEth.Hex, zonehash: TEth.Hex ];
    type TLogInterfaceChanged = {
        node: TEth.Hex, interfaceID: TEth.Hex, implementer: TAddress
    };
    type TLogInterfaceChangedParameters = [ node: TEth.Hex, interfaceID: TEth.Hex, implementer: TAddress ];
    type TLogNameChanged = {
        node: TEth.Hex, name: string
    };
    type TLogNameChangedParameters = [ node: TEth.Hex, name: string ];
    type TLogPubkeyChanged = {
        node: TEth.Hex, x: TEth.Hex, y: TEth.Hex
    };
    type TLogPubkeyChangedParameters = [ node: TEth.Hex, x: TEth.Hex, y: TEth.Hex ];
    type TLogTextChanged = {
        node: TEth.Hex, indexedKey: string, key: string, value: string
    };
    type TLogTextChangedParameters = [ node: TEth.Hex, indexedKey: string, key: string, value: string ];
    type TLogVersionChanged = {
        node: TEth.Hex, newVersion: number
    };
    type TLogVersionChangedParameters = [ node: TEth.Hex, newVersion: number ];

interface IEvents {
  ABIChanged: TLogABIChangedParameters
  AddrChanged: TLogAddrChangedParameters
  AddressChanged: TLogAddressChangedParameters
  ApprovalForAll: TLogApprovalForAllParameters
  Approved: TLogApprovedParameters
  ContenthashChanged: TLogContenthashChangedParameters
  DNSRecordChanged: TLogDNSRecordChangedParameters
  DNSRecordDeleted: TLogDNSRecordDeletedParameters
  DNSZonehashChanged: TLogDNSZonehashChangedParameters
  InterfaceChanged: TLogInterfaceChangedParameters
  NameChanged: TLogNameChangedParameters
  PubkeyChanged: TLogPubkeyChangedParameters
  TextChanged: TLogTextChangedParameters
  VersionChanged: TLogVersionChangedParameters
  '*': any[] 
}



interface IMethodABI {
  method: "ABI"
  arguments: [ node: TEth.Hex, contentTypes: bigint ]
}

interface IMethodAddr {
  method: "addr"
  arguments: [ node: TEth.Hex ] | [ node: TEth.Hex, coinType: bigint ]
}

interface IMethodApprove {
  method: "approve"
  arguments: [ node: TEth.Hex, delegate: TAddress, approved: boolean ]
}

interface IMethodClearRecords {
  method: "clearRecords"
  arguments: [ node: TEth.Hex ]
}

interface IMethodContenthash {
  method: "contenthash"
  arguments: [ node: TEth.Hex ]
}

interface IMethodDnsRecord {
  method: "dnsRecord"
  arguments: [ node: TEth.Hex, name: TEth.Hex, resource: number ]
}

interface IMethodHasDNSRecords {
  method: "hasDNSRecords"
  arguments: [ node: TEth.Hex, name: TEth.Hex ]
}

interface IMethodInterfaceImplementer {
  method: "interfaceImplementer"
  arguments: [ node: TEth.Hex, interfaceID: TEth.Hex ]
}

interface IMethodIsApprovedFor {
  method: "isApprovedFor"
  arguments: [ owner: TAddress, node: TEth.Hex, delegate: TAddress ]
}

interface IMethodIsApprovedForAll {
  method: "isApprovedForAll"
  arguments: [ account: TAddress, operator: TAddress ]
}

interface IMethodMulticall {
  method: "multicall"
  arguments: [ data: TEth.Hex[] ]
}

interface IMethodMulticallWithNodeCheck {
  method: "multicallWithNodeCheck"
  arguments: [ nodehash: TEth.Hex, data: TEth.Hex[] ]
}

interface IMethodName {
  method: "name"
  arguments: [ node: TEth.Hex ]
}

interface IMethodPubkey {
  method: "pubkey"
  arguments: [ node: TEth.Hex ]
}

interface IMethodRecordVersions {
  method: "recordVersions"
  arguments: [ input0: TEth.Hex ]
}

interface IMethodSetABI {
  method: "setABI"
  arguments: [ node: TEth.Hex, contentType: bigint, data: TEth.Hex ]
}

interface IMethodSetAddr {
  method: "setAddr"
  arguments: [ node: TEth.Hex, coinType: bigint, a: TEth.Hex ] | [ node: TEth.Hex, a: TAddress ]
}

interface IMethodSetApprovalForAll {
  method: "setApprovalForAll"
  arguments: [ operator: TAddress, approved: boolean ]
}

interface IMethodSetContenthash {
  method: "setContenthash"
  arguments: [ node: TEth.Hex, hash: TEth.Hex ]
}

interface IMethodSetDNSRecords {
  method: "setDNSRecords"
  arguments: [ node: TEth.Hex, data: TEth.Hex ]
}

interface IMethodSetInterface {
  method: "setInterface"
  arguments: [ node: TEth.Hex, interfaceID: TEth.Hex, implementer: TAddress ]
}

interface IMethodSetName {
  method: "setName"
  arguments: [ node: TEth.Hex, newName: string ]
}

interface IMethodSetPubkey {
  method: "setPubkey"
  arguments: [ node: TEth.Hex, x: TEth.Hex, y: TEth.Hex ]
}

interface IMethodSetText {
  method: "setText"
  arguments: [ node: TEth.Hex, key: string, value: string ]
}

interface IMethodSetZonehash {
  method: "setZonehash"
  arguments: [ node: TEth.Hex, hash: TEth.Hex ]
}

interface IMethodSupportsInterface {
  method: "supportsInterface"
  arguments: [ interfaceID: TEth.Hex ]
}

interface IMethodText {
  method: "text"
  arguments: [ node: TEth.Hex, key: string ]
}

interface IMethodZonehash {
  method: "zonehash"
  arguments: [ node: TEth.Hex ]
}

interface IMethods {
  ABI: IMethodABI
  addr: IMethodAddr
  approve: IMethodApprove
  clearRecords: IMethodClearRecords
  contenthash: IMethodContenthash
  dnsRecord: IMethodDnsRecord
  hasDNSRecords: IMethodHasDNSRecords
  interfaceImplementer: IMethodInterfaceImplementer
  isApprovedFor: IMethodIsApprovedFor
  isApprovedForAll: IMethodIsApprovedForAll
  multicall: IMethodMulticall
  multicallWithNodeCheck: IMethodMulticallWithNodeCheck
  name: IMethodName
  pubkey: IMethodPubkey
  recordVersions: IMethodRecordVersions
  setABI: IMethodSetABI
  setAddr: IMethodSetAddr
  setApprovalForAll: IMethodSetApprovalForAll
  setContenthash: IMethodSetContenthash
  setDNSRecords: IMethodSetDNSRecords
  setInterface: IMethodSetInterface
  setName: IMethodSetName
  setPubkey: IMethodSetPubkey
  setText: IMethodSetText
  setZonehash: IMethodSetZonehash
  supportsInterface: IMethodSupportsInterface
  text: IMethodText
  zonehash: IMethodZonehash
  '*': { method: string, arguments: any[] } 
}





class EnsPublicResolverStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }

    async recordVersions(key: TEth.Hex): Promise<number> {
        return this.$storage.get(['recordVersions', key]);
    }

    async versionable_abis(key: number): Promise<Record<string | number, Record<string | number, TEth.Hex>>> {
        return this.$storage.get(['versionable_abis', key]);
    }

    async versionable_addresses(key: number): Promise<Record<string | number, Record<string | number, TEth.Hex>>> {
        return this.$storage.get(['versionable_addresses', key]);
    }

    async versionable_hashes(key: number): Promise<Record<string | number, TEth.Hex>> {
        return this.$storage.get(['versionable_hashes', key]);
    }

    async versionable_zonehashes(key: number): Promise<Record<string | number, TEth.Hex>> {
        return this.$storage.get(['versionable_zonehashes', key]);
    }

    async versionable_records(key: number): Promise<Record<string | number, Record<string | number, Record<string | number, TEth.Hex>>>> {
        return this.$storage.get(['versionable_records', key]);
    }

    async versionable_nameEntriesCount(key: number): Promise<Record<string | number, Record<string | number, number>>> {
        return this.$storage.get(['versionable_nameEntriesCount', key]);
    }

    async versionable_interfaces(key: number): Promise<Record<string | number, Record<string | number, TAddress>>> {
        return this.$storage.get(['versionable_interfaces', key]);
    }

    async versionable_names(key: number): Promise<Record<string | number, string>> {
        return this.$storage.get(['versionable_names', key]);
    }

    async versionable_pubkeys(key: number): Promise<Record<string | number, { x: TEth.Hex, y: TEth.Hex }>> {
        return this.$storage.get(['versionable_pubkeys', key]);
    }

    async versionable_texts(key: number): Promise<Record<string | number, Record<string | number, string>>> {
        return this.$storage.get(['versionable_texts', key]);
    }

    async _operatorApprovals(key: TAddress): Promise<Record<string | number, boolean>> {
        return this.$storage.get(['_operatorApprovals', key]);
    }

    async _tokenApprovals(key: TAddress): Promise<Record<string | number, Record<string | number, boolean>>> {
        return this.$storage.get(['_tokenApprovals', key]);
    }

    $slots = [
    {
        "slot": 0,
        "position": 0,
        "name": "recordVersions",
        "size": null,
        "type": "mapping(bytes32 => uint64)"
    },
    {
        "slot": 1,
        "position": 0,
        "name": "versionable_abis",
        "size": null,
        "type": "mapping(uint64 => mapping(bytes32 => mapping(uint256 => bytes)))"
    },
    {
        "slot": 2,
        "position": 0,
        "name": "versionable_addresses",
        "size": null,
        "type": "mapping(uint64 => mapping(bytes32 => mapping(uint256 => bytes)))"
    },
    {
        "slot": 3,
        "position": 0,
        "name": "versionable_hashes",
        "size": null,
        "type": "mapping(uint64 => mapping(bytes32 => bytes))"
    },
    {
        "slot": 4,
        "position": 0,
        "name": "versionable_zonehashes",
        "size": null,
        "type": "mapping(uint64 => mapping(bytes32 => bytes))"
    },
    {
        "slot": 5,
        "position": 0,
        "name": "versionable_records",
        "size": null,
        "type": "mapping(uint64 => mapping(bytes32 => mapping(bytes32 => mapping(uint16 => bytes))))"
    },
    {
        "slot": 6,
        "position": 0,
        "name": "versionable_nameEntriesCount",
        "size": null,
        "type": "mapping(uint64 => mapping(bytes32 => mapping(bytes32 => uint16)))"
    },
    {
        "slot": 7,
        "position": 0,
        "name": "versionable_interfaces",
        "size": null,
        "type": "mapping(uint64 => mapping(bytes32 => mapping(bytes4 => address)))"
    },
    {
        "slot": 8,
        "position": 0,
        "name": "versionable_names",
        "size": null,
        "type": "mapping(uint64 => mapping(bytes32 => string))"
    },
    {
        "slot": 9,
        "position": 0,
        "name": "versionable_pubkeys",
        "size": null,
        "type": "mapping(uint64 => mapping(bytes32 => (bytes32 x, bytes32 y)))"
    },
    {
        "slot": 10,
        "position": 0,
        "name": "versionable_texts",
        "size": null,
        "type": "mapping(uint64 => mapping(bytes32 => mapping(string => string)))"
    },
    {
        "slot": 11,
        "position": 0,
        "name": "_operatorApprovals",
        "size": null,
        "type": "mapping(address => mapping(address => bool))"
    },
    {
        "slot": 12,
        "position": 0,
        "name": "_tokenApprovals",
        "size": null,
        "type": "mapping(address => mapping(bytes32 => mapping(address => bool)))"
    }
]

}



interface IEnsPublicResolverTxCaller {
    approve (sender: TSender, node: TEth.Hex, delegate: TAddress, approved: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    clearRecords (sender: TSender, node: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    multicall (sender: TSender, data: TEth.Hex[]): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    multicallWithNodeCheck (sender: TSender, nodehash: TEth.Hex, data: TEth.Hex[]): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setABI (sender: TSender, node: TEth.Hex, contentType: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setAddr (sender: TSender, node: TEth.Hex, coinType: bigint, a: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setAddr (sender: TSender, node: TEth.Hex, a: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setContenthash (sender: TSender, node: TEth.Hex, hash: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setDNSRecords (sender: TSender, node: TEth.Hex, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setInterface (sender: TSender, node: TEth.Hex, interfaceID: TEth.Hex, implementer: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setName (sender: TSender, node: TEth.Hex, newName: string): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setPubkey (sender: TSender, node: TEth.Hex, x: TEth.Hex, y: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setText (sender: TSender, node: TEth.Hex, key: string, value: string): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setZonehash (sender: TSender, node: TEth.Hex, hash: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IEnsPublicResolverTxData {
    approve (sender: TSender, node: TEth.Hex, delegate: TAddress, approved: boolean): Promise<TEth.TxLike>
    clearRecords (sender: TSender, node: TEth.Hex): Promise<TEth.TxLike>
    multicall (sender: TSender, data: TEth.Hex[]): Promise<TEth.TxLike>
    multicallWithNodeCheck (sender: TSender, nodehash: TEth.Hex, data: TEth.Hex[]): Promise<TEth.TxLike>
    setABI (sender: TSender, node: TEth.Hex, contentType: bigint, data: TEth.Hex): Promise<TEth.TxLike>
    setAddr (sender: TSender, node: TEth.Hex, coinType: bigint, a: TEth.Hex): Promise<TEth.TxLike>
    setAddr (sender: TSender, node: TEth.Hex, a: TAddress): Promise<TEth.TxLike>
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<TEth.TxLike>
    setContenthash (sender: TSender, node: TEth.Hex, hash: TEth.Hex): Promise<TEth.TxLike>
    setDNSRecords (sender: TSender, node: TEth.Hex, data: TEth.Hex): Promise<TEth.TxLike>
    setInterface (sender: TSender, node: TEth.Hex, interfaceID: TEth.Hex, implementer: TAddress): Promise<TEth.TxLike>
    setName (sender: TSender, node: TEth.Hex, newName: string): Promise<TEth.TxLike>
    setPubkey (sender: TSender, node: TEth.Hex, x: TEth.Hex, y: TEth.Hex): Promise<TEth.TxLike>
    setText (sender: TSender, node: TEth.Hex, key: string, value: string): Promise<TEth.TxLike>
    setZonehash (sender: TSender, node: TEth.Hex, hash: TEth.Hex): Promise<TEth.TxLike>
}


