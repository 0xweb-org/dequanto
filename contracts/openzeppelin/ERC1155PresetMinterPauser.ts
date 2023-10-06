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



export class ERC1155PresetMinterPauser extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0xa217fddf
    async DEFAULT_ADMIN_ROLE (): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'DEFAULT_ADMIN_ROLE'));
    }

    // 0xd5391393
    async MINTER_ROLE (): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'MINTER_ROLE'));
    }

    // 0xe63ab1e9
    async PAUSER_ROLE (): Promise<TBufferLike> {
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
    async getRoleAdmin (role: TBufferLike): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'getRoleAdmin'), role);
    }

    // 0x9010d07c
    async getRoleMember (role: TBufferLike, index: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getRoleMember'), role, index);
    }

    // 0xca15c873
    async getRoleMemberCount (role: TBufferLike): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getRoleMemberCount'), role);
    }

    // 0x2f2ff15d
    async grantRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'grantRole'), sender, role, account);
    }

    // 0x91d14854
    async hasRole (role: TBufferLike, account: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'hasRole'), role, account);
    }

    // 0xe985e9c5
    async isApprovedForAll (account: TAddress, operator: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isApprovedForAll'), account, operator);
    }

    // 0x731133e9
    async mint (sender: TSender, to: TAddress, id: bigint, amount: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'mint'), sender, to, id, amount, data);
    }

    // 0x1f7fdffa
    async mintBatch (sender: TSender, to: TAddress, ids: bigint[], amounts: bigint[], data: TBufferLike): Promise<TxWriter> {
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
    async renounceRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renounceRole'), sender, role, account);
    }

    // 0xd547741f
    async revokeRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'revokeRole'), sender, role, account);
    }

    // 0x2eb2c2d6
    async safeBatchTransferFrom (sender: TSender, from: TAddress, to: TAddress, ids: bigint[], amounts: bigint[], data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'safeBatchTransferFrom'), sender, from, to, ids, amounts, data);
    }

    // 0xf242432a
    async safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, id: bigint, amount: bigint, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'safeTransferFrom'), sender, from, to, id, amount, data);
    }

    // 0xa22cb465
    async setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setApprovalForAll'), sender, operator, approved);
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceId: TBufferLike): Promise<boolean> {
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
        return super.$call() as IERC1155PresetMinterPauserTxCaller;;
    }

    $data (): IERC1155PresetMinterPauserTxData {
        return super.$data() as IERC1155PresetMinterPauserTxData;
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

    onPaused (fn?: (event: TClientEventsStreamData<TLogPausedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogPausedParameters>> {
        return this.$onLog('Paused', fn);
    }

    onRoleAdminChanged (fn?: (event: TClientEventsStreamData<TLogRoleAdminChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogRoleAdminChangedParameters>> {
        return this.$onLog('RoleAdminChanged', fn);
    }

    onRoleGranted (fn?: (event: TClientEventsStreamData<TLogRoleGrantedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogRoleGrantedParameters>> {
        return this.$onLog('RoleGranted', fn);
    }

    onRoleRevoked (fn?: (event: TClientEventsStreamData<TLogRoleRevokedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogRoleRevokedParameters>> {
        return this.$onLog('RoleRevoked', fn);
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

    onUnpaused (fn?: (event: TClientEventsStreamData<TLogUnpausedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogUnpausedParameters>> {
        return this.$onLog('Unpaused', fn);
    }

    extractLogsApprovalForAll (tx: TEth.TxReceipt): ITxLogItem<TLogApprovalForAll>[] {
        let abi = this.$getAbiItem('event', 'ApprovalForAll');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApprovalForAll>[];
    }

    extractLogsPaused (tx: TEth.TxReceipt): ITxLogItem<TLogPaused>[] {
        let abi = this.$getAbiItem('event', 'Paused');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogPaused>[];
    }

    extractLogsRoleAdminChanged (tx: TEth.TxReceipt): ITxLogItem<TLogRoleAdminChanged>[] {
        let abi = this.$getAbiItem('event', 'RoleAdminChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogRoleAdminChanged>[];
    }

    extractLogsRoleGranted (tx: TEth.TxReceipt): ITxLogItem<TLogRoleGranted>[] {
        let abi = this.$getAbiItem('event', 'RoleGranted');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogRoleGranted>[];
    }

    extractLogsRoleRevoked (tx: TEth.TxReceipt): ITxLogItem<TLogRoleRevoked>[] {
        let abi = this.$getAbiItem('event', 'RoleRevoked');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogRoleRevoked>[];
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

    extractLogsUnpaused (tx: TEth.TxReceipt): ITxLogItem<TLogUnpaused>[] {
        let abi = this.$getAbiItem('event', 'Unpaused');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogUnpaused>[];
    }

    async getPastLogsApprovalForAll (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { account?: TAddress,operator?: TAddress }
    }): Promise<ITxLogItem<TLogApprovalForAll>[]> {
        return await this.$getPastLogsParsed('ApprovalForAll', options) as any;
    }

    async getPastLogsPaused (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogPaused>[]> {
        return await this.$getPastLogsParsed('Paused', options) as any;
    }

    async getPastLogsRoleAdminChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { role?: TBufferLike,previousAdminRole?: TBufferLike,newAdminRole?: TBufferLike }
    }): Promise<ITxLogItem<TLogRoleAdminChanged>[]> {
        return await this.$getPastLogsParsed('RoleAdminChanged', options) as any;
    }

    async getPastLogsRoleGranted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { role?: TBufferLike,account?: TAddress,sender?: TAddress }
    }): Promise<ITxLogItem<TLogRoleGranted>[]> {
        return await this.$getPastLogsParsed('RoleGranted', options) as any;
    }

    async getPastLogsRoleRevoked (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { role?: TBufferLike,account?: TAddress,sender?: TAddress }
    }): Promise<ITxLogItem<TLogRoleRevoked>[]> {
        return await this.$getPastLogsParsed('RoleRevoked', options) as any;
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

    async getPastLogsUnpaused (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogUnpaused>[]> {
        return await this.$getPastLogsParsed('Unpaused', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"string","name":"uri","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAUSER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"burnBatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"mintBatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogApprovalForAll = {
        account: TAddress, operator: TAddress, approved: boolean
    };
    type TLogApprovalForAllParameters = [ account: TAddress, operator: TAddress, approved: boolean ];
    type TLogPaused = {
        account: TAddress
    };
    type TLogPausedParameters = [ account: TAddress ];
    type TLogRoleAdminChanged = {
        role: TBufferLike, previousAdminRole: TBufferLike, newAdminRole: TBufferLike
    };
    type TLogRoleAdminChangedParameters = [ role: TBufferLike, previousAdminRole: TBufferLike, newAdminRole: TBufferLike ];
    type TLogRoleGranted = {
        role: TBufferLike, account: TAddress, _sender: TAddress
    };
    type TLogRoleGrantedParameters = [ role: TBufferLike, account: TAddress, _sender: TAddress ];
    type TLogRoleRevoked = {
        role: TBufferLike, account: TAddress, _sender: TAddress
    };
    type TLogRoleRevokedParameters = [ role: TBufferLike, account: TAddress, _sender: TAddress ];
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
    type TLogUnpaused = {
        account: TAddress
    };
    type TLogUnpausedParameters = [ account: TAddress ];

interface IEvents {
  ApprovalForAll: TLogApprovalForAllParameters
  Paused: TLogPausedParameters
  RoleAdminChanged: TLogRoleAdminChangedParameters
  RoleGranted: TLogRoleGrantedParameters
  RoleRevoked: TLogRoleRevokedParameters
  TransferBatch: TLogTransferBatchParameters
  TransferSingle: TLogTransferSingleParameters
  URI: TLogURIParameters
  Unpaused: TLogUnpausedParameters
  '*': any[] 
}



interface IMethodDEFAULT_ADMIN_ROLE {
  method: "DEFAULT_ADMIN_ROLE"
  arguments: [  ]
}

interface IMethodMINTER_ROLE {
  method: "MINTER_ROLE"
  arguments: [  ]
}

interface IMethodPAUSER_ROLE {
  method: "PAUSER_ROLE"
  arguments: [  ]
}

interface IMethodBalanceOf {
  method: "balanceOf"
  arguments: [ account: TAddress, id: bigint ]
}

interface IMethodBalanceOfBatch {
  method: "balanceOfBatch"
  arguments: [ accounts: TAddress[], ids: bigint[] ]
}

interface IMethodBurn {
  method: "burn"
  arguments: [ account: TAddress, id: bigint, value: bigint ]
}

interface IMethodBurnBatch {
  method: "burnBatch"
  arguments: [ account: TAddress, ids: bigint[], values: bigint[] ]
}

interface IMethodGetRoleAdmin {
  method: "getRoleAdmin"
  arguments: [ role: TBufferLike ]
}

interface IMethodGetRoleMember {
  method: "getRoleMember"
  arguments: [ role: TBufferLike, index: bigint ]
}

interface IMethodGetRoleMemberCount {
  method: "getRoleMemberCount"
  arguments: [ role: TBufferLike ]
}

interface IMethodGrantRole {
  method: "grantRole"
  arguments: [ role: TBufferLike, account: TAddress ]
}

interface IMethodHasRole {
  method: "hasRole"
  arguments: [ role: TBufferLike, account: TAddress ]
}

interface IMethodIsApprovedForAll {
  method: "isApprovedForAll"
  arguments: [ account: TAddress, operator: TAddress ]
}

interface IMethodMint {
  method: "mint"
  arguments: [ to: TAddress, id: bigint, amount: bigint, data: TBufferLike ]
}

interface IMethodMintBatch {
  method: "mintBatch"
  arguments: [ to: TAddress, ids: bigint[], amounts: bigint[], data: TBufferLike ]
}

interface IMethodPause {
  method: "pause"
  arguments: [  ]
}

interface IMethodPaused {
  method: "paused"
  arguments: [  ]
}

interface IMethodRenounceRole {
  method: "renounceRole"
  arguments: [ role: TBufferLike, account: TAddress ]
}

interface IMethodRevokeRole {
  method: "revokeRole"
  arguments: [ role: TBufferLike, account: TAddress ]
}

interface IMethodSafeBatchTransferFrom {
  method: "safeBatchTransferFrom"
  arguments: [ from: TAddress, to: TAddress, ids: bigint[], amounts: bigint[], data: TBufferLike ]
}

interface IMethodSafeTransferFrom {
  method: "safeTransferFrom"
  arguments: [ from: TAddress, to: TAddress, id: bigint, amount: bigint, data: TBufferLike ]
}

interface IMethodSetApprovalForAll {
  method: "setApprovalForAll"
  arguments: [ operator: TAddress, approved: boolean ]
}

interface IMethodSupportsInterface {
  method: "supportsInterface"
  arguments: [ interfaceId: TBufferLike ]
}

interface IMethodUnpause {
  method: "unpause"
  arguments: [  ]
}

interface IMethodUri {
  method: "uri"
  arguments: [ input0: bigint ]
}

interface IMethods {
  DEFAULT_ADMIN_ROLE: IMethodDEFAULT_ADMIN_ROLE
  MINTER_ROLE: IMethodMINTER_ROLE
  PAUSER_ROLE: IMethodPAUSER_ROLE
  balanceOf: IMethodBalanceOf
  balanceOfBatch: IMethodBalanceOfBatch
  burn: IMethodBurn
  burnBatch: IMethodBurnBatch
  getRoleAdmin: IMethodGetRoleAdmin
  getRoleMember: IMethodGetRoleMember
  getRoleMemberCount: IMethodGetRoleMemberCount
  grantRole: IMethodGrantRole
  hasRole: IMethodHasRole
  isApprovedForAll: IMethodIsApprovedForAll
  mint: IMethodMint
  mintBatch: IMethodMintBatch
  pause: IMethodPause
  paused: IMethodPaused
  renounceRole: IMethodRenounceRole
  revokeRole: IMethodRevokeRole
  safeBatchTransferFrom: IMethodSafeBatchTransferFrom
  safeTransferFrom: IMethodSafeTransferFrom
  setApprovalForAll: IMethodSetApprovalForAll
  supportsInterface: IMethodSupportsInterface
  unpause: IMethodUnpause
  uri: IMethodUri
  '*': { method: string, arguments: any[] } 
}






interface IERC1155PresetMinterPauserTxCaller {
    burn (sender: TSender, account: TAddress, id: bigint, value: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    burnBatch (sender: TSender, account: TAddress, ids: bigint[], values: bigint[]): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    grantRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    mint (sender: TSender, to: TAddress, id: bigint, amount: bigint, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    mintBatch (sender: TSender, to: TAddress, ids: bigint[], amounts: bigint[], data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    pause (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    revokeRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    safeBatchTransferFrom (sender: TSender, from: TAddress, to: TAddress, ids: bigint[], amounts: bigint[], data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, id: bigint, amount: bigint, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    unpause (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IERC1155PresetMinterPauserTxData {
    burn (sender: TSender, account: TAddress, id: bigint, value: bigint): Promise<TEth.TxLike>
    burnBatch (sender: TSender, account: TAddress, ids: bigint[], values: bigint[]): Promise<TEth.TxLike>
    grantRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<TEth.TxLike>
    mint (sender: TSender, to: TAddress, id: bigint, amount: bigint, data: TBufferLike): Promise<TEth.TxLike>
    mintBatch (sender: TSender, to: TAddress, ids: bigint[], amounts: bigint[], data: TBufferLike): Promise<TEth.TxLike>
    pause (sender: TSender, ): Promise<TEth.TxLike>
    renounceRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<TEth.TxLike>
    revokeRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<TEth.TxLike>
    safeBatchTransferFrom (sender: TSender, from: TAddress, to: TAddress, ids: bigint[], amounts: bigint[], data: TBufferLike): Promise<TEth.TxLike>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, id: bigint, amount: bigint, data: TBufferLike): Promise<TEth.TxLike>
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<TEth.TxLike>
    unpause (sender: TSender, ): Promise<TEth.TxLike>
}


