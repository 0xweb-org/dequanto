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



export class ERC721PresetMinterPauserAutoId extends ContractBase {
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

    // 0x095ea7b3
    async approve (sender: TSender, to: TAddress, tokenId: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approve'), sender, to, tokenId);
    }

    // 0x70a08231
    async balanceOf (owner: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'balanceOf'), owner);
    }

    // 0x42966c68
    async burn (sender: TSender, tokenId: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'burn'), sender, tokenId);
    }

    // 0x081812fc
    async getApproved (tokenId: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getApproved'), tokenId);
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
    async isApprovedForAll (owner: TAddress, operator: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isApprovedForAll'), owner, operator);
    }

    // 0x6a627842
    async mint (sender: TSender, to: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'mint'), sender, to);
    }

    // 0x06fdde03
    async name (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'name'));
    }

    // 0x6352211e
    async ownerOf (tokenId: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'ownerOf'), tokenId);
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

    // 0x95d89b41
    async symbol (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'symbol'));
    }

    // 0x4f6ccce7
    async tokenByIndex (index: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'tokenByIndex'), index);
    }

    // 0x2f745c59
    async tokenOfOwnerByIndex (owner: TAddress, index: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'tokenOfOwnerByIndex'), owner, index);
    }

    // 0xc87b56dd
    async tokenURI (tokenId: bigint): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'tokenURI'), tokenId);
    }

    // 0x18160ddd
    async totalSupply (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'totalSupply'));
    }

    // 0x23b872dd
    async transferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferFrom'), sender, from, to, tokenId);
    }

    // 0x3f4ba83a
    async unpause (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'unpause'), sender);
    }

    $call () {
        return super.$call() as IERC721PresetMinterPauserAutoIdTxCaller;;
    }

    $data (): IERC721PresetMinterPauserAutoIdTxData {
        return super.$data() as IERC721PresetMinterPauserAutoIdTxData;
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

    onTransfer (fn?: (event: TClientEventsStreamData<TLogTransferParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogTransferParameters>> {
        return this.$onLog('Transfer', fn);
    }

    onUnpaused (fn?: (event: TClientEventsStreamData<TLogUnpausedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogUnpausedParameters>> {
        return this.$onLog('Unpaused', fn);
    }

    extractLogsApproval (tx: TEth.TxReceipt): ITxLogItem<TLogApproval>[] {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApproval>[];
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

    extractLogsTransfer (tx: TEth.TxReceipt): ITxLogItem<TLogTransfer>[] {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogTransfer>[];
    }

    extractLogsUnpaused (tx: TEth.TxReceipt): ITxLogItem<TLogUnpaused>[] {
        let abi = this.$getAbiItem('event', 'Unpaused');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogUnpaused>[];
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

    async getPastLogsTransfer (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { from?: TAddress,to?: TAddress,tokenId?: bigint }
    }): Promise<ITxLogItem<TLogTransfer>[]> {
        return await this.$getPastLogsParsed('Transfer', options) as any;
    }

    async getPastLogsUnpaused (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogUnpaused>[]> {
        return await this.$getPastLogsParsed('Unpaused', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"string","name":"baseTokenURI","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAUSER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    
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
    type TLogTransfer = {
        from: TAddress, to: TAddress, tokenId: bigint
    };
    type TLogTransferParameters = [ from: TAddress, to: TAddress, tokenId: bigint ];
    type TLogUnpaused = {
        account: TAddress
    };
    type TLogUnpausedParameters = [ account: TAddress ];

interface IEvents {
  Approval: TLogApprovalParameters
  ApprovalForAll: TLogApprovalForAllParameters
  Paused: TLogPausedParameters
  RoleAdminChanged: TLogRoleAdminChangedParameters
  RoleGranted: TLogRoleGrantedParameters
  RoleRevoked: TLogRoleRevokedParameters
  Transfer: TLogTransferParameters
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

interface IMethodApprove {
  method: "approve"
  arguments: [ to: TAddress, tokenId: bigint ]
}

interface IMethodBalanceOf {
  method: "balanceOf"
  arguments: [ owner: TAddress ]
}

interface IMethodBurn {
  method: "burn"
  arguments: [ tokenId: bigint ]
}

interface IMethodGetApproved {
  method: "getApproved"
  arguments: [ tokenId: bigint ]
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
  arguments: [ owner: TAddress, operator: TAddress ]
}

interface IMethodMint {
  method: "mint"
  arguments: [ to: TAddress ]
}

interface IMethodName {
  method: "name"
  arguments: [  ]
}

interface IMethodOwnerOf {
  method: "ownerOf"
  arguments: [ tokenId: bigint ]
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

interface IMethodSymbol {
  method: "symbol"
  arguments: [  ]
}

interface IMethodTokenByIndex {
  method: "tokenByIndex"
  arguments: [ index: bigint ]
}

interface IMethodTokenOfOwnerByIndex {
  method: "tokenOfOwnerByIndex"
  arguments: [ owner: TAddress, index: bigint ]
}

interface IMethodTokenURI {
  method: "tokenURI"
  arguments: [ tokenId: bigint ]
}

interface IMethodTotalSupply {
  method: "totalSupply"
  arguments: [  ]
}

interface IMethodTransferFrom {
  method: "transferFrom"
  arguments: [ from: TAddress, to: TAddress, tokenId: bigint ]
}

interface IMethodUnpause {
  method: "unpause"
  arguments: [  ]
}

interface IMethods {
  DEFAULT_ADMIN_ROLE: IMethodDEFAULT_ADMIN_ROLE
  MINTER_ROLE: IMethodMINTER_ROLE
  PAUSER_ROLE: IMethodPAUSER_ROLE
  approve: IMethodApprove
  balanceOf: IMethodBalanceOf
  burn: IMethodBurn
  getApproved: IMethodGetApproved
  getRoleAdmin: IMethodGetRoleAdmin
  getRoleMember: IMethodGetRoleMember
  getRoleMemberCount: IMethodGetRoleMemberCount
  grantRole: IMethodGrantRole
  hasRole: IMethodHasRole
  isApprovedForAll: IMethodIsApprovedForAll
  mint: IMethodMint
  name: IMethodName
  ownerOf: IMethodOwnerOf
  pause: IMethodPause
  paused: IMethodPaused
  renounceRole: IMethodRenounceRole
  revokeRole: IMethodRevokeRole
  safeTransferFrom: IMethodSafeTransferFrom
  setApprovalForAll: IMethodSetApprovalForAll
  supportsInterface: IMethodSupportsInterface
  symbol: IMethodSymbol
  tokenByIndex: IMethodTokenByIndex
  tokenOfOwnerByIndex: IMethodTokenOfOwnerByIndex
  tokenURI: IMethodTokenURI
  totalSupply: IMethodTotalSupply
  transferFrom: IMethodTransferFrom
  unpause: IMethodUnpause
  '*': { method: string, arguments: any[] } 
}






interface IERC721PresetMinterPauserAutoIdTxCaller {
    approve (sender: TSender, to: TAddress, tokenId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    burn (sender: TSender, tokenId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    grantRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    mint (sender: TSender, to: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    pause (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    revokeRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint, data: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    unpause (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IERC721PresetMinterPauserAutoIdTxData {
    approve (sender: TSender, to: TAddress, tokenId: bigint): Promise<TEth.TxLike>
    burn (sender: TSender, tokenId: bigint): Promise<TEth.TxLike>
    grantRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<TEth.TxLike>
    mint (sender: TSender, to: TAddress): Promise<TEth.TxLike>
    pause (sender: TSender, ): Promise<TEth.TxLike>
    renounceRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<TEth.TxLike>
    revokeRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<TEth.TxLike>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<TEth.TxLike>
    safeTransferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint, data: TBufferLike): Promise<TEth.TxLike>
    setApprovalForAll (sender: TSender, operator: TAddress, approved: boolean): Promise<TEth.TxLike>
    transferFrom (sender: TSender, from: TAddress, to: TAddress, tokenId: bigint): Promise<TEth.TxLike>
    unpause (sender: TSender, ): Promise<TEth.TxLike>
}


