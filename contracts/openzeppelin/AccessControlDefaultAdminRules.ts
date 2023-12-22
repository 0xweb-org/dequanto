/**
 *  AUTO-Generated Class: 2023-12-22 01:26
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



export class AccessControlDefaultAdminRules extends ContractBase {
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

    // 0xcefc1429
    async acceptDefaultAdminTransfer (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'acceptDefaultAdminTransfer'), sender);
    }

    // 0x634e93da
    async beginDefaultAdminTransfer (sender: TSender, newAdmin: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'beginDefaultAdminTransfer'), sender, newAdmin);
    }

    // 0xd602b9fd
    async cancelDefaultAdminTransfer (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'cancelDefaultAdminTransfer'), sender);
    }

    // 0x649a5ec7
    async changeDefaultAdminDelay (sender: TSender, newDelay: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'changeDefaultAdminDelay'), sender, newDelay);
    }

    // 0x84ef8ffc
    async defaultAdmin (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'defaultAdmin'));
    }

    // 0xcc8463c8
    async defaultAdminDelay (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'defaultAdminDelay'));
    }

    // 0x022d63fb
    async defaultAdminDelayIncreaseWait (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'defaultAdminDelayIncreaseWait'));
    }

    // 0x248a9ca3
    async getRoleAdmin (role: TBufferLike): Promise<TBufferLike> {
        return this.$read(this.$getAbiItem('function', 'getRoleAdmin'), role);
    }

    // 0x2f2ff15d
    async grantRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'grantRole'), sender, role, account);
    }

    // 0x91d14854
    async hasRole (role: TBufferLike, account: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'hasRole'), role, account);
    }

    // 0x8da5cb5b
    async owner (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'owner'));
    }

    // 0xcf6eefb7
    async pendingDefaultAdmin (): Promise<{ newAdmin: TAddress, schedule: number }> {
        return this.$read(this.$getAbiItem('function', 'pendingDefaultAdmin'));
    }

    // 0xa1eda53c
    async pendingDefaultAdminDelay (): Promise<{ newDelay: number, schedule: number }> {
        return this.$read(this.$getAbiItem('function', 'pendingDefaultAdminDelay'));
    }

    // 0x36568abe
    async renounceRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renounceRole'), sender, role, account);
    }

    // 0xd547741f
    async revokeRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'revokeRole'), sender, role, account);
    }

    // 0x0aa6220b
    async rollbackDefaultAdminDelay (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'rollbackDefaultAdminDelay'), sender);
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceId: TBufferLike): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceId);
    }

    $call () {
        return super.$call() as IAccessControlDefaultAdminRulesTxCaller;
    }
    $signed (): TOverrideReturns<IAccessControlDefaultAdminRulesTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IAccessControlDefaultAdminRulesTxData {
        return super.$data() as IAccessControlDefaultAdminRulesTxData;
    }
    $gas (): TOverrideReturns<IAccessControlDefaultAdminRulesTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onDefaultAdminDelayChangeCanceled (fn?: (event: TClientEventsStreamData<TLogDefaultAdminDelayChangeCanceledParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDefaultAdminDelayChangeCanceledParameters>> {
        return this.$onLog('DefaultAdminDelayChangeCanceled', fn);
    }

    onDefaultAdminDelayChangeScheduled (fn?: (event: TClientEventsStreamData<TLogDefaultAdminDelayChangeScheduledParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDefaultAdminDelayChangeScheduledParameters>> {
        return this.$onLog('DefaultAdminDelayChangeScheduled', fn);
    }

    onDefaultAdminTransferCanceled (fn?: (event: TClientEventsStreamData<TLogDefaultAdminTransferCanceledParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDefaultAdminTransferCanceledParameters>> {
        return this.$onLog('DefaultAdminTransferCanceled', fn);
    }

    onDefaultAdminTransferScheduled (fn?: (event: TClientEventsStreamData<TLogDefaultAdminTransferScheduledParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDefaultAdminTransferScheduledParameters>> {
        return this.$onLog('DefaultAdminTransferScheduled', fn);
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

    extractLogsDefaultAdminDelayChangeCanceled (tx: TEth.TxReceipt): ITxLogItem<TLogDefaultAdminDelayChangeCanceled>[] {
        let abi = this.$getAbiItem('event', 'DefaultAdminDelayChangeCanceled');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDefaultAdminDelayChangeCanceled>[];
    }

    extractLogsDefaultAdminDelayChangeScheduled (tx: TEth.TxReceipt): ITxLogItem<TLogDefaultAdminDelayChangeScheduled>[] {
        let abi = this.$getAbiItem('event', 'DefaultAdminDelayChangeScheduled');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDefaultAdminDelayChangeScheduled>[];
    }

    extractLogsDefaultAdminTransferCanceled (tx: TEth.TxReceipt): ITxLogItem<TLogDefaultAdminTransferCanceled>[] {
        let abi = this.$getAbiItem('event', 'DefaultAdminTransferCanceled');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDefaultAdminTransferCanceled>[];
    }

    extractLogsDefaultAdminTransferScheduled (tx: TEth.TxReceipt): ITxLogItem<TLogDefaultAdminTransferScheduled>[] {
        let abi = this.$getAbiItem('event', 'DefaultAdminTransferScheduled');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDefaultAdminTransferScheduled>[];
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

    async getPastLogsDefaultAdminDelayChangeCanceled (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogDefaultAdminDelayChangeCanceled>[]> {
        return await this.$getPastLogsParsed('DefaultAdminDelayChangeCanceled', options) as any;
    }

    async getPastLogsDefaultAdminDelayChangeScheduled (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogDefaultAdminDelayChangeScheduled>[]> {
        return await this.$getPastLogsParsed('DefaultAdminDelayChangeScheduled', options) as any;
    }

    async getPastLogsDefaultAdminTransferCanceled (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogDefaultAdminTransferCanceled>[]> {
        return await this.$getPastLogsParsed('DefaultAdminTransferCanceled', options) as any;
    }

    async getPastLogsDefaultAdminTransferScheduled (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { newAdmin?: TAddress }
    }): Promise<ITxLogItem<TLogDefaultAdminTransferScheduled>[]> {
        return await this.$getPastLogsParsed('DefaultAdminTransferScheduled', options) as any;
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

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[],"name":"DefaultAdminDelayChangeCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint48","name":"newDelay","type":"uint48"},{"indexed":false,"internalType":"uint48","name":"effectSchedule","type":"uint48"}],"name":"DefaultAdminDelayChangeScheduled","type":"event"},{"anonymous":false,"inputs":[],"name":"DefaultAdminTransferCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newAdmin","type":"address"},{"indexed":false,"internalType":"uint48","name":"acceptSchedule","type":"uint48"}],"name":"DefaultAdminTransferScheduled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"acceptDefaultAdminTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"beginDefaultAdminTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cancelDefaultAdminTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint48","name":"newDelay","type":"uint48"}],"name":"changeDefaultAdminDelay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"defaultAdmin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"defaultAdminDelay","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"defaultAdminDelayIncreaseWait","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingDefaultAdmin","outputs":[{"internalType":"address","name":"newAdmin","type":"address"},{"internalType":"uint48","name":"schedule","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingDefaultAdminDelay","outputs":[{"internalType":"uint48","name":"newDelay","type":"uint48"},{"internalType":"uint48","name":"schedule","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rollbackDefaultAdminDelay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogDefaultAdminDelayChangeCanceled = {
        
    };
    type TLogDefaultAdminDelayChangeCanceledParameters = [  ];
    type TLogDefaultAdminDelayChangeScheduled = {
        newDelay: number, effectSchedule: number
    };
    type TLogDefaultAdminDelayChangeScheduledParameters = [ newDelay: number, effectSchedule: number ];
    type TLogDefaultAdminTransferCanceled = {
        
    };
    type TLogDefaultAdminTransferCanceledParameters = [  ];
    type TLogDefaultAdminTransferScheduled = {
        newAdmin: TAddress, acceptSchedule: number
    };
    type TLogDefaultAdminTransferScheduledParameters = [ newAdmin: TAddress, acceptSchedule: number ];
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

interface IEvents {
  DefaultAdminDelayChangeCanceled: TLogDefaultAdminDelayChangeCanceledParameters
  DefaultAdminDelayChangeScheduled: TLogDefaultAdminDelayChangeScheduledParameters
  DefaultAdminTransferCanceled: TLogDefaultAdminTransferCanceledParameters
  DefaultAdminTransferScheduled: TLogDefaultAdminTransferScheduledParameters
  RoleAdminChanged: TLogRoleAdminChangedParameters
  RoleGranted: TLogRoleGrantedParameters
  RoleRevoked: TLogRoleRevokedParameters
  '*': any[] 
}



interface IMethodDEFAULT_ADMIN_ROLE {
  method: "DEFAULT_ADMIN_ROLE"
  arguments: [  ]
}

interface IMethodAcceptDefaultAdminTransfer {
  method: "acceptDefaultAdminTransfer"
  arguments: [  ]
}

interface IMethodBeginDefaultAdminTransfer {
  method: "beginDefaultAdminTransfer"
  arguments: [ newAdmin: TAddress ]
}

interface IMethodCancelDefaultAdminTransfer {
  method: "cancelDefaultAdminTransfer"
  arguments: [  ]
}

interface IMethodChangeDefaultAdminDelay {
  method: "changeDefaultAdminDelay"
  arguments: [ newDelay: number ]
}

interface IMethodDefaultAdmin {
  method: "defaultAdmin"
  arguments: [  ]
}

interface IMethodDefaultAdminDelay {
  method: "defaultAdminDelay"
  arguments: [  ]
}

interface IMethodDefaultAdminDelayIncreaseWait {
  method: "defaultAdminDelayIncreaseWait"
  arguments: [  ]
}

interface IMethodGetRoleAdmin {
  method: "getRoleAdmin"
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

interface IMethodOwner {
  method: "owner"
  arguments: [  ]
}

interface IMethodPendingDefaultAdmin {
  method: "pendingDefaultAdmin"
  arguments: [  ]
}

interface IMethodPendingDefaultAdminDelay {
  method: "pendingDefaultAdminDelay"
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

interface IMethodRollbackDefaultAdminDelay {
  method: "rollbackDefaultAdminDelay"
  arguments: [  ]
}

interface IMethodSupportsInterface {
  method: "supportsInterface"
  arguments: [ interfaceId: TBufferLike ]
}

interface IMethods {
  DEFAULT_ADMIN_ROLE: IMethodDEFAULT_ADMIN_ROLE
  acceptDefaultAdminTransfer: IMethodAcceptDefaultAdminTransfer
  beginDefaultAdminTransfer: IMethodBeginDefaultAdminTransfer
  cancelDefaultAdminTransfer: IMethodCancelDefaultAdminTransfer
  changeDefaultAdminDelay: IMethodChangeDefaultAdminDelay
  defaultAdmin: IMethodDefaultAdmin
  defaultAdminDelay: IMethodDefaultAdminDelay
  defaultAdminDelayIncreaseWait: IMethodDefaultAdminDelayIncreaseWait
  getRoleAdmin: IMethodGetRoleAdmin
  grantRole: IMethodGrantRole
  hasRole: IMethodHasRole
  owner: IMethodOwner
  pendingDefaultAdmin: IMethodPendingDefaultAdmin
  pendingDefaultAdminDelay: IMethodPendingDefaultAdminDelay
  renounceRole: IMethodRenounceRole
  revokeRole: IMethodRevokeRole
  rollbackDefaultAdminDelay: IMethodRollbackDefaultAdminDelay
  supportsInterface: IMethodSupportsInterface
  '*': { method: string, arguments: any[] } 
}






interface IAccessControlDefaultAdminRulesTxCaller {
    acceptDefaultAdminTransfer (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    beginDefaultAdminTransfer (sender: TSender, newAdmin: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    cancelDefaultAdminTransfer (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    changeDefaultAdminDelay (sender: TSender, newDelay: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    grantRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    revokeRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    rollbackDefaultAdminDelay (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IAccessControlDefaultAdminRulesTxData {
    acceptDefaultAdminTransfer (sender: TSender, ): Promise<TEth.TxLike>
    beginDefaultAdminTransfer (sender: TSender, newAdmin: TAddress): Promise<TEth.TxLike>
    cancelDefaultAdminTransfer (sender: TSender, ): Promise<TEth.TxLike>
    changeDefaultAdminDelay (sender: TSender, newDelay: number): Promise<TEth.TxLike>
    grantRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<TEth.TxLike>
    renounceRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<TEth.TxLike>
    revokeRole (sender: TSender, role: TBufferLike, account: TAddress): Promise<TEth.TxLike>
    rollbackDefaultAdminDelay (sender: TSender, ): Promise<TEth.TxLike>
}


