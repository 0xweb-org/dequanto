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
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';
import type { TOverrideReturns } from '@dequanto/utils/types';


import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class ERC1155PresetMinterPauser extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockchainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)


    }

    Types: TERC1155PresetMinterPauserTypes;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/ERC1155PresetMinterPauser.ts"
    }

    async $constructor (deployer: TSender, uri: string): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0xa217fddf
    async DEFAULT_ADMIN_ROLE (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'DEFAULT_ADMIN_ROLE'));
    }

    // 0xd5391393
    async MINTER_ROLE (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'MINTER_ROLE'));
    }

    // 0xe63ab1e9
    async PAUSER_ROLE (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'PAUSER_ROLE'));
    }

    // 0x00fdd58e
    async balanceOf (account: TAddress, id: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'balanceOf'), account, id);
    }

    // 0x4e1273f4
    async balanceOfBatch (accounts: TAddress[], ids: bigint[]): Promise<bigint[]> {
        return this.$read(this.$getAbiItem('function', 'balanceOfBatch'), accounts, ids);
    }

    // 0xf5298aca
    async burn (sender: TSender, account: TAddress, id: bigint, value: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'burn'), sender, account, id, value);
    }

    // 0x6b20c454
    async burnBatch (sender: TSender, account: TAddress, ids: bigint[], values: bigint[]): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'burnBatch'), sender, account, ids, values);
    }

    // 0x248a9ca3
    async getRoleAdmin (role: TEth.Hex): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'getRoleAdmin'), role);
    }

    // 0x9010d07c
    async getRoleMember (role: TEth.Hex, index: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getRoleMember'), role, index);
    }

    // 0xca15c873
    async getRoleMemberCount (role: TEth.Hex): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getRoleMemberCount'), role);
    }

    // 0x2f2ff15d
    async grantRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'grantRole'), sender, role, account);
    }

    // 0x91d14854
    async hasRole (role: TEth.Hex, account: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'hasRole'), role, account);
    }

    // 0xe985e9c5
    async isApprovedForAll (account: TAddress, operator: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isApprovedForAll'), account, operator);
    }

    // 0x731133e9
    async mint (sender: TSender, to: TAddress, id: bigint, amount: bigint, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'mint'), sender, to, id, amount, data);
    }

    // 0x1f7fdffa
    async mintBatch (sender: TSender, to: TAddress, ids: bigint[], amounts: bigint[], data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'mintBatch'), sender, to, ids, amounts, data);
    }

    // 0x8456cb59
    async pause (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'pause'), sender);
    }

    // 0x5c975abb
    async paused (): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'paused'));
    }

    // 0x36568abe
    async renounceRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renounceRole'), sender, role, account);
    }

    // 0xd547741f
    async revokeRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'revokeRole'), sender, role, account);
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

    // 0x3f4ba83a
    async unpause (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'unpause'), sender);
    }

    // 0x0e89341c
    async uri (input0: bigint): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'uri'), input0);
    }

    $call () {
        return super.$call() as IERC1155PresetMinterPauserTxCaller;
    }
    $signed (): TOverrideReturns<IERC1155PresetMinterPauserTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IERC1155PresetMinterPauserTxData {
        return super.$data() as IERC1155PresetMinterPauserTxData;
    }
    $gas (): TOverrideReturns<IERC1155PresetMinterPauserTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TERC1155PresetMinterPauserTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TERC1155PresetMinterPauserTypes['Methods'][TMethod]['arguments']
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

    onPaused (fn?: (event: TClientEventsStreamData<TEventArguments<'Paused'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Paused'>>> {
        return this.$onLog('Paused', fn);
    }

    onRoleAdminChanged (fn?: (event: TClientEventsStreamData<TEventArguments<'RoleAdminChanged'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'RoleAdminChanged'>>> {
        return this.$onLog('RoleAdminChanged', fn);
    }

    onRoleGranted (fn?: (event: TClientEventsStreamData<TEventArguments<'RoleGranted'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'RoleGranted'>>> {
        return this.$onLog('RoleGranted', fn);
    }

    onRoleRevoked (fn?: (event: TClientEventsStreamData<TEventArguments<'RoleRevoked'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'RoleRevoked'>>> {
        return this.$onLog('RoleRevoked', fn);
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

    onUnpaused (fn?: (event: TClientEventsStreamData<TEventArguments<'Unpaused'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Unpaused'>>> {
        return this.$onLog('Unpaused', fn);
    }

    extractLogsApprovalForAll (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ApprovalForAll'>>[] {
        let abi = this.$getAbiItem('event', 'ApprovalForAll');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ApprovalForAll'>>[];
    }

    extractLogsPaused (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Paused'>>[] {
        let abi = this.$getAbiItem('event', 'Paused');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Paused'>>[];
    }

    extractLogsRoleAdminChanged (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'RoleAdminChanged'>>[] {
        let abi = this.$getAbiItem('event', 'RoleAdminChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'RoleAdminChanged'>>[];
    }

    extractLogsRoleGranted (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'RoleGranted'>>[] {
        let abi = this.$getAbiItem('event', 'RoleGranted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'RoleGranted'>>[];
    }

    extractLogsRoleRevoked (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'RoleRevoked'>>[] {
        let abi = this.$getAbiItem('event', 'RoleRevoked');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'RoleRevoked'>>[];
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

    extractLogsUnpaused (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Unpaused'>>[] {
        let abi = this.$getAbiItem('event', 'Unpaused');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Unpaused'>>[];
    }

    async getPastLogsApprovalForAll (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { account?: TAddress,operator?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ApprovalForAll'>>[]> {
        return await this.$getPastLogsParsed('ApprovalForAll', options) as any;
    }

    async getPastLogsPaused (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'Paused'>>[]> {
        return await this.$getPastLogsParsed('Paused', options) as any;
    }

    async getPastLogsRoleAdminChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { role?: TEth.Hex,previousAdminRole?: TEth.Hex,newAdminRole?: TEth.Hex }
    }): Promise<ITxLogItem<TEventParams<'RoleAdminChanged'>>[]> {
        return await this.$getPastLogsParsed('RoleAdminChanged', options) as any;
    }

    async getPastLogsRoleGranted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { role?: TEth.Hex,account?: TAddress,sender?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'RoleGranted'>>[]> {
        return await this.$getPastLogsParsed('RoleGranted', options) as any;
    }

    async getPastLogsRoleRevoked (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { role?: TEth.Hex,account?: TAddress,sender?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'RoleRevoked'>>[]> {
        return await this.$getPastLogsParsed('RoleRevoked', options) as any;
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

    async getPastLogsUnpaused (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'Unpaused'>>[]> {
        return await this.$getPastLogsParsed('Unpaused', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"string","name":"uri","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAUSER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"burnBatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"mintBatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TERC1155PresetMinterPauserTypes = {
    Events: {
        ApprovalForAll: {
            outputParams: { account: TAddress, operator: TAddress, approved: boolean },
            outputArgs:   [ account: TAddress, operator: TAddress, approved: boolean ],
        }
        Paused: {
            outputParams: { account: TAddress },
            outputArgs:   [ account: TAddress ],
        }
        RoleAdminChanged: {
            outputParams: { role: TEth.Hex, previousAdminRole: TEth.Hex, newAdminRole: TEth.Hex },
            outputArgs:   [ role: TEth.Hex, previousAdminRole: TEth.Hex, newAdminRole: TEth.Hex ],
        }
        RoleGranted: {
            outputParams: { role: TEth.Hex, account: TAddress, _sender: TAddress },
            outputArgs:   [ role: TEth.Hex, account: TAddress, _sender: TAddress ],
        }
        RoleRevoked: {
            outputParams: { role: TEth.Hex, account: TAddress, _sender: TAddress },
            outputArgs:   [ role: TEth.Hex, account: TAddress, _sender: TAddress ],
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
        Unpaused: {
            outputParams: { account: TAddress },
            outputArgs:   [ account: TAddress ],
        }
    },
    Methods: {
        DEFAULT_ADMIN_ROLE: {
          method: "DEFAULT_ADMIN_ROLE"
          arguments: [  ]
        }
        MINTER_ROLE: {
          method: "MINTER_ROLE"
          arguments: [  ]
        }
        PAUSER_ROLE: {
          method: "PAUSER_ROLE"
          arguments: [  ]
        }
        balanceOf: {
          method: "balanceOf"
          arguments: [ account: TAddress, id: bigint ]
        }
        balanceOfBatch: {
          method: "balanceOfBatch"
          arguments: [ accounts: TAddress[], ids: bigint[] ]
        }
        burn: {
          method: "burn"
          arguments: [ account: TAddress, id: bigint, value: bigint ]
        }
        burnBatch: {
          method: "burnBatch"
          arguments: [ account: TAddress, ids: bigint[], values: bigint[] ]
        }
        getRoleAdmin: {
          method: "getRoleAdmin"
          arguments: [ role: TEth.Hex ]
        }
        getRoleMember: {
          method: "getRoleMember"
          arguments: [ role: TEth.Hex, index: bigint ]
        }
        getRoleMemberCount: {
          method: "getRoleMemberCount"
          arguments: [ role: TEth.Hex ]
        }
        grantRole: {
          method: "grantRole"
          arguments: [ role: TEth.Hex, account: TAddress ]
        }
        hasRole: {
          method: "hasRole"
          arguments: [ role: TEth.Hex, account: TAddress ]
        }
        isApprovedForAll: {
          method: "isApprovedForAll"
          arguments: [ account: TAddress, operator: TAddress ]
        }
        mint: {
          method: "mint"
          arguments: [ to: TAddress, id: bigint, amount: bigint, data: TEth.Hex ]
        }
        mintBatch: {
          method: "mintBatch"
          arguments: [ to: TAddress, ids: bigint[], amounts: bigint[], data: TEth.Hex ]
        }
        pause: {
          method: "pause"
          arguments: [  ]
        }
        paused: {
          method: "paused"
          arguments: [  ]
        }
        renounceRole: {
          method: "renounceRole"
          arguments: [ role: TEth.Hex, account: TAddress ]
        }
        revokeRole: {
          method: "revokeRole"
          arguments: [ role: TEth.Hex, account: TAddress ]
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
        unpause: {
          method: "unpause"
          arguments: [  ]
        }
        uri: {
          method: "uri"
          arguments: [ input0: bigint ]
        }
    }
}



interface IERC1155PresetMinterPauserTxCaller {
    burn (sender: TSender, account: TAddress, id: bigint, value: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    burnBatch (sender: TSender, account: TAddress, ids: bigint[], values: bigint[]): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    grantRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    mint (sender: TSender, to: TAddress, id: bigint, amount: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    mintBatch (sender: TSender, to: TAddress, ids: bigint[], amounts: bigint[], data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    pause (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    revokeRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    safeBatchTransferFrom (sender: TSender, from: TAddress, to: TAddress, ids: bigint[], amounts: bigint[], data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, id: bigint, amount: bigint, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    unpause (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IERC1155PresetMinterPauserTxData {
    burn (sender: TSender, account: TAddress, id: bigint, value: bigint): Promise<TEth.TxLike>
    burnBatch (sender: TSender, account: TAddress, ids: bigint[], values: bigint[]): Promise<TEth.TxLike>
    grantRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TEth.TxLike>
    mint (sender: TSender, to: TAddress, id: bigint, amount: bigint, data: TEth.Hex): Promise<TEth.TxLike>
    mintBatch (sender: TSender, to: TAddress, ids: bigint[], amounts: bigint[], data: TEth.Hex): Promise<TEth.TxLike>
    pause (sender: TSender, ): Promise<TEth.TxLike>
    renounceRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TEth.TxLike>
    revokeRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TEth.TxLike>
    safeBatchTransferFrom (sender: TSender, from: TAddress, to: TAddress, ids: bigint[], amounts: bigint[], data: TEth.Hex): Promise<TEth.TxLike>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, id: bigint, amount: bigint, data: TEth.Hex): Promise<TEth.TxLike>
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<TEth.TxLike>
    unpause (sender: TSender, ): Promise<TEth.TxLike>
}


type TEvents = TERC1155PresetMinterPauserTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
