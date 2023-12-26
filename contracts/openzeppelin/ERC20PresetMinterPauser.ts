/**
 *  AUTO-Generated Class: 2023-12-26 12:42
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



export class ERC20PresetMinterPauser extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    $meta = {
    "class": "./contracts/openzeppelin/ERC20PresetMinterPauser.ts"
}

    async $constructor (deployer: TSender, name: string, symbol: string): Promise<TxWriter> {
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

    // 0xdd62ed3e
    async allowance (owner: TAddress, spender: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'allowance'), owner, spender);
    }

    // 0x095ea7b3
    async approve (sender: TSender, spender: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approve'), sender, spender, amount);
    }

    // 0x70a08231
    async balanceOf (account: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'balanceOf'), account);
    }

    // 0x42966c68
    async burn (sender: TSender, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'burn'), sender, amount);
    }

    // 0x79cc6790
    async burnFrom (sender: TSender, account: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'burnFrom'), sender, account, amount);
    }

    // 0x313ce567
    async decimals (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'decimals'));
    }

    // 0xa457c2d7
    async decreaseAllowance (sender: TSender, spender: TAddress, subtractedValue: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'decreaseAllowance'), sender, spender, subtractedValue);
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

    // 0x39509351
    async increaseAllowance (sender: TSender, spender: TAddress, addedValue: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'increaseAllowance'), sender, spender, addedValue);
    }

    // 0x40c10f19
    async mint (sender: TSender, to: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'mint'), sender, to, amount);
    }

    // 0x06fdde03
    async name (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'name'));
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

    // 0x01ffc9a7
    async supportsInterface (interfaceId: TEth.Hex): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceId);
    }

    // 0x95d89b41
    async symbol (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'symbol'));
    }

    // 0x18160ddd
    async totalSupply (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'totalSupply'));
    }

    // 0xa9059cbb
    async transfer (sender: TSender, to: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transfer'), sender, to, amount);
    }

    // 0x23b872dd
    async transferFrom (sender: TSender, from: TAddress, to: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferFrom'), sender, from, to, amount);
    }

    // 0x3f4ba83a
    async unpause (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'unpause'), sender);
    }

    $call () {
        return super.$call() as IERC20PresetMinterPauserTxCaller;
    }
    $signed (): TOverrideReturns<IERC20PresetMinterPauserTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IERC20PresetMinterPauserTxData {
        return super.$data() as IERC20PresetMinterPauserTxData;
    }
    $gas (): TOverrideReturns<IERC20PresetMinterPauserTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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
        params?: { owner?: TAddress,spender?: TAddress }
    }): Promise<ITxLogItem<TLogApproval>[]> {
        return await this.$getPastLogsParsed('Approval', options) as any;
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
        params?: { role?: TEth.Hex,previousAdminRole?: TEth.Hex,newAdminRole?: TEth.Hex }
    }): Promise<ITxLogItem<TLogRoleAdminChanged>[]> {
        return await this.$getPastLogsParsed('RoleAdminChanged', options) as any;
    }

    async getPastLogsRoleGranted (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { role?: TEth.Hex,account?: TAddress,sender?: TAddress }
    }): Promise<ITxLogItem<TLogRoleGranted>[]> {
        return await this.$getPastLogsParsed('RoleGranted', options) as any;
    }

    async getPastLogsRoleRevoked (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { role?: TEth.Hex,account?: TAddress,sender?: TAddress }
    }): Promise<ITxLogItem<TLogRoleRevoked>[]> {
        return await this.$getPastLogsParsed('RoleRevoked', options) as any;
    }

    async getPastLogsTransfer (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { from?: TAddress,to?: TAddress }
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

    abi: TAbiItem[] = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAUSER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogApproval = {
        owner: TAddress, spender: TAddress, value: bigint
    };
    type TLogApprovalParameters = [ owner: TAddress, spender: TAddress, value: bigint ];
    type TLogPaused = {
        account: TAddress
    };
    type TLogPausedParameters = [ account: TAddress ];
    type TLogRoleAdminChanged = {
        role: TEth.Hex, previousAdminRole: TEth.Hex, newAdminRole: TEth.Hex
    };
    type TLogRoleAdminChangedParameters = [ role: TEth.Hex, previousAdminRole: TEth.Hex, newAdminRole: TEth.Hex ];
    type TLogRoleGranted = {
        role: TEth.Hex, account: TAddress, _sender: TAddress
    };
    type TLogRoleGrantedParameters = [ role: TEth.Hex, account: TAddress, _sender: TAddress ];
    type TLogRoleRevoked = {
        role: TEth.Hex, account: TAddress, _sender: TAddress
    };
    type TLogRoleRevokedParameters = [ role: TEth.Hex, account: TAddress, _sender: TAddress ];
    type TLogTransfer = {
        from: TAddress, to: TAddress, value: bigint
    };
    type TLogTransferParameters = [ from: TAddress, to: TAddress, value: bigint ];
    type TLogUnpaused = {
        account: TAddress
    };
    type TLogUnpausedParameters = [ account: TAddress ];

interface IEvents {
  Approval: TLogApprovalParameters
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

interface IMethodAllowance {
  method: "allowance"
  arguments: [ owner: TAddress, spender: TAddress ]
}

interface IMethodApprove {
  method: "approve"
  arguments: [ spender: TAddress, amount: bigint ]
}

interface IMethodBalanceOf {
  method: "balanceOf"
  arguments: [ account: TAddress ]
}

interface IMethodBurn {
  method: "burn"
  arguments: [ amount: bigint ]
}

interface IMethodBurnFrom {
  method: "burnFrom"
  arguments: [ account: TAddress, amount: bigint ]
}

interface IMethodDecimals {
  method: "decimals"
  arguments: [  ]
}

interface IMethodDecreaseAllowance {
  method: "decreaseAllowance"
  arguments: [ spender: TAddress, subtractedValue: bigint ]
}

interface IMethodGetRoleAdmin {
  method: "getRoleAdmin"
  arguments: [ role: TEth.Hex ]
}

interface IMethodGetRoleMember {
  method: "getRoleMember"
  arguments: [ role: TEth.Hex, index: bigint ]
}

interface IMethodGetRoleMemberCount {
  method: "getRoleMemberCount"
  arguments: [ role: TEth.Hex ]
}

interface IMethodGrantRole {
  method: "grantRole"
  arguments: [ role: TEth.Hex, account: TAddress ]
}

interface IMethodHasRole {
  method: "hasRole"
  arguments: [ role: TEth.Hex, account: TAddress ]
}

interface IMethodIncreaseAllowance {
  method: "increaseAllowance"
  arguments: [ spender: TAddress, addedValue: bigint ]
}

interface IMethodMint {
  method: "mint"
  arguments: [ to: TAddress, amount: bigint ]
}

interface IMethodName {
  method: "name"
  arguments: [  ]
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
  arguments: [ role: TEth.Hex, account: TAddress ]
}

interface IMethodRevokeRole {
  method: "revokeRole"
  arguments: [ role: TEth.Hex, account: TAddress ]
}

interface IMethodSupportsInterface {
  method: "supportsInterface"
  arguments: [ interfaceId: TEth.Hex ]
}

interface IMethodSymbol {
  method: "symbol"
  arguments: [  ]
}

interface IMethodTotalSupply {
  method: "totalSupply"
  arguments: [  ]
}

interface IMethodTransfer {
  method: "transfer"
  arguments: [ to: TAddress, amount: bigint ]
}

interface IMethodTransferFrom {
  method: "transferFrom"
  arguments: [ from: TAddress, to: TAddress, amount: bigint ]
}

interface IMethodUnpause {
  method: "unpause"
  arguments: [  ]
}

interface IMethods {
  DEFAULT_ADMIN_ROLE: IMethodDEFAULT_ADMIN_ROLE
  MINTER_ROLE: IMethodMINTER_ROLE
  PAUSER_ROLE: IMethodPAUSER_ROLE
  allowance: IMethodAllowance
  approve: IMethodApprove
  balanceOf: IMethodBalanceOf
  burn: IMethodBurn
  burnFrom: IMethodBurnFrom
  decimals: IMethodDecimals
  decreaseAllowance: IMethodDecreaseAllowance
  getRoleAdmin: IMethodGetRoleAdmin
  getRoleMember: IMethodGetRoleMember
  getRoleMemberCount: IMethodGetRoleMemberCount
  grantRole: IMethodGrantRole
  hasRole: IMethodHasRole
  increaseAllowance: IMethodIncreaseAllowance
  mint: IMethodMint
  name: IMethodName
  pause: IMethodPause
  paused: IMethodPaused
  renounceRole: IMethodRenounceRole
  revokeRole: IMethodRevokeRole
  supportsInterface: IMethodSupportsInterface
  symbol: IMethodSymbol
  totalSupply: IMethodTotalSupply
  transfer: IMethodTransfer
  transferFrom: IMethodTransferFrom
  unpause: IMethodUnpause
  '*': { method: string, arguments: any[] } 
}






interface IERC20PresetMinterPauserTxCaller {
    approve (sender: TSender, spender: TAddress, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    burn (sender: TSender, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    burnFrom (sender: TSender, account: TAddress, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    decreaseAllowance (sender: TSender, spender: TAddress, subtractedValue: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    grantRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    increaseAllowance (sender: TSender, spender: TAddress, addedValue: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    mint (sender: TSender, to: TAddress, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    pause (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    revokeRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transfer (sender: TSender, to: TAddress, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferFrom (sender: TSender, from: TAddress, to: TAddress, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    unpause (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IERC20PresetMinterPauserTxData {
    approve (sender: TSender, spender: TAddress, amount: bigint): Promise<TEth.TxLike>
    burn (sender: TSender, amount: bigint): Promise<TEth.TxLike>
    burnFrom (sender: TSender, account: TAddress, amount: bigint): Promise<TEth.TxLike>
    decreaseAllowance (sender: TSender, spender: TAddress, subtractedValue: bigint): Promise<TEth.TxLike>
    grantRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TEth.TxLike>
    increaseAllowance (sender: TSender, spender: TAddress, addedValue: bigint): Promise<TEth.TxLike>
    mint (sender: TSender, to: TAddress, amount: bigint): Promise<TEth.TxLike>
    pause (sender: TSender, ): Promise<TEth.TxLike>
    renounceRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TEth.TxLike>
    revokeRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TEth.TxLike>
    transfer (sender: TSender, to: TAddress, amount: bigint): Promise<TEth.TxLike>
    transferFrom (sender: TSender, from: TAddress, to: TAddress, amount: bigint): Promise<TEth.TxLike>
    unpause (sender: TSender, ): Promise<TEth.TxLike>
}


