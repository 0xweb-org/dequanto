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



export class IAccessControlDefaultAdminRules extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    Types: TIAccessControlDefaultAdminRulesTypes;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/IAccessControlDefaultAdminRules.ts"
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
    async getRoleAdmin (role: TEth.Hex): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'getRoleAdmin'), role);
    }

    // 0x2f2ff15d
    async grantRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'grantRole'), sender, role, account);
    }

    // 0x91d14854
    async hasRole (role: TEth.Hex, account: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'hasRole'), role, account);
    }

    // 0xcf6eefb7
    async pendingDefaultAdmin (): Promise<{ newAdmin: TAddress, acceptSchedule: number }> {
        return this.$read(this.$getAbiItem('function', 'pendingDefaultAdmin'));
    }

    // 0xa1eda53c
    async pendingDefaultAdminDelay (): Promise<{ newDelay: number, effectSchedule: number }> {
        return this.$read(this.$getAbiItem('function', 'pendingDefaultAdminDelay'));
    }

    // 0x36568abe
    async renounceRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renounceRole'), sender, role, account);
    }

    // 0xd547741f
    async revokeRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'revokeRole'), sender, role, account);
    }

    // 0x0aa6220b
    async rollbackDefaultAdminDelay (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'rollbackDefaultAdminDelay'), sender);
    }

    $call () {
        return super.$call() as IIAccessControlDefaultAdminRulesTxCaller;
    }
    $signed (): TOverrideReturns<IIAccessControlDefaultAdminRulesTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IIAccessControlDefaultAdminRulesTxData {
        return super.$data() as IIAccessControlDefaultAdminRulesTxData;
    }
    $gas (): TOverrideReturns<IIAccessControlDefaultAdminRulesTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TIAccessControlDefaultAdminRulesTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TIAccessControlDefaultAdminRulesTypes['Methods'][TMethod]['arguments']
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

    onDefaultAdminDelayChangeCanceled (fn?: (event: TClientEventsStreamData<TEventArguments<'DefaultAdminDelayChangeCanceled'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'DefaultAdminDelayChangeCanceled'>>> {
        return this.$onLog('DefaultAdminDelayChangeCanceled', fn);
    }

    onDefaultAdminDelayChangeScheduled (fn?: (event: TClientEventsStreamData<TEventArguments<'DefaultAdminDelayChangeScheduled'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'DefaultAdminDelayChangeScheduled'>>> {
        return this.$onLog('DefaultAdminDelayChangeScheduled', fn);
    }

    onDefaultAdminTransferCanceled (fn?: (event: TClientEventsStreamData<TEventArguments<'DefaultAdminTransferCanceled'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'DefaultAdminTransferCanceled'>>> {
        return this.$onLog('DefaultAdminTransferCanceled', fn);
    }

    onDefaultAdminTransferScheduled (fn?: (event: TClientEventsStreamData<TEventArguments<'DefaultAdminTransferScheduled'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'DefaultAdminTransferScheduled'>>> {
        return this.$onLog('DefaultAdminTransferScheduled', fn);
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

    extractLogsDefaultAdminDelayChangeCanceled (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'DefaultAdminDelayChangeCanceled'>>[] {
        let abi = this.$getAbiItem('event', 'DefaultAdminDelayChangeCanceled');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'DefaultAdminDelayChangeCanceled'>>[];
    }

    extractLogsDefaultAdminDelayChangeScheduled (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'DefaultAdminDelayChangeScheduled'>>[] {
        let abi = this.$getAbiItem('event', 'DefaultAdminDelayChangeScheduled');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'DefaultAdminDelayChangeScheduled'>>[];
    }

    extractLogsDefaultAdminTransferCanceled (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'DefaultAdminTransferCanceled'>>[] {
        let abi = this.$getAbiItem('event', 'DefaultAdminTransferCanceled');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'DefaultAdminTransferCanceled'>>[];
    }

    extractLogsDefaultAdminTransferScheduled (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'DefaultAdminTransferScheduled'>>[] {
        let abi = this.$getAbiItem('event', 'DefaultAdminTransferScheduled');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'DefaultAdminTransferScheduled'>>[];
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

    async getPastLogsDefaultAdminDelayChangeCanceled (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'DefaultAdminDelayChangeCanceled'>>[]> {
        return await this.$getPastLogsParsed('DefaultAdminDelayChangeCanceled', options) as any;
    }

    async getPastLogsDefaultAdminDelayChangeScheduled (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'DefaultAdminDelayChangeScheduled'>>[]> {
        return await this.$getPastLogsParsed('DefaultAdminDelayChangeScheduled', options) as any;
    }

    async getPastLogsDefaultAdminTransferCanceled (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'DefaultAdminTransferCanceled'>>[]> {
        return await this.$getPastLogsParsed('DefaultAdminTransferCanceled', options) as any;
    }

    async getPastLogsDefaultAdminTransferScheduled (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { newAdmin?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'DefaultAdminTransferScheduled'>>[]> {
        return await this.$getPastLogsParsed('DefaultAdminTransferScheduled', options) as any;
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

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[],"name":"DefaultAdminDelayChangeCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint48","name":"newDelay","type":"uint48"},{"indexed":false,"internalType":"uint48","name":"effectSchedule","type":"uint48"}],"name":"DefaultAdminDelayChangeScheduled","type":"event"},{"anonymous":false,"inputs":[],"name":"DefaultAdminTransferCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newAdmin","type":"address"},{"indexed":false,"internalType":"uint48","name":"acceptSchedule","type":"uint48"}],"name":"DefaultAdminTransferScheduled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[],"name":"acceptDefaultAdminTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"beginDefaultAdminTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cancelDefaultAdminTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint48","name":"newDelay","type":"uint48"}],"name":"changeDefaultAdminDelay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"defaultAdmin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"defaultAdminDelay","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"defaultAdminDelayIncreaseWait","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingDefaultAdmin","outputs":[{"internalType":"address","name":"newAdmin","type":"address"},{"internalType":"uint48","name":"acceptSchedule","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingDefaultAdminDelay","outputs":[{"internalType":"uint48","name":"newDelay","type":"uint48"},{"internalType":"uint48","name":"effectSchedule","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rollbackDefaultAdminDelay","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TIAccessControlDefaultAdminRulesTypes = {
    Events: {
        DefaultAdminDelayChangeCanceled: {
            outputParams: {  },
            outputArgs:   [  ],
        }
        DefaultAdminDelayChangeScheduled: {
            outputParams: { newDelay: number, effectSchedule: number },
            outputArgs:   [ newDelay: number, effectSchedule: number ],
        }
        DefaultAdminTransferCanceled: {
            outputParams: {  },
            outputArgs:   [  ],
        }
        DefaultAdminTransferScheduled: {
            outputParams: { newAdmin: TAddress, acceptSchedule: number },
            outputArgs:   [ newAdmin: TAddress, acceptSchedule: number ],
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
    },
    Methods: {
        acceptDefaultAdminTransfer: {
          method: "acceptDefaultAdminTransfer"
          arguments: [  ]
        }
        beginDefaultAdminTransfer: {
          method: "beginDefaultAdminTransfer"
          arguments: [ newAdmin: TAddress ]
        }
        cancelDefaultAdminTransfer: {
          method: "cancelDefaultAdminTransfer"
          arguments: [  ]
        }
        changeDefaultAdminDelay: {
          method: "changeDefaultAdminDelay"
          arguments: [ newDelay: number ]
        }
        defaultAdmin: {
          method: "defaultAdmin"
          arguments: [  ]
        }
        defaultAdminDelay: {
          method: "defaultAdminDelay"
          arguments: [  ]
        }
        defaultAdminDelayIncreaseWait: {
          method: "defaultAdminDelayIncreaseWait"
          arguments: [  ]
        }
        getRoleAdmin: {
          method: "getRoleAdmin"
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
        pendingDefaultAdmin: {
          method: "pendingDefaultAdmin"
          arguments: [  ]
        }
        pendingDefaultAdminDelay: {
          method: "pendingDefaultAdminDelay"
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
        rollbackDefaultAdminDelay: {
          method: "rollbackDefaultAdminDelay"
          arguments: [  ]
        }
    }
}



interface IIAccessControlDefaultAdminRulesTxCaller {
    acceptDefaultAdminTransfer (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    beginDefaultAdminTransfer (sender: TSender, newAdmin: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    cancelDefaultAdminTransfer (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    changeDefaultAdminDelay (sender: TSender, newDelay: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    grantRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    revokeRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    rollbackDefaultAdminDelay (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIAccessControlDefaultAdminRulesTxData {
    acceptDefaultAdminTransfer (sender: TSender, ): Promise<TEth.TxLike>
    beginDefaultAdminTransfer (sender: TSender, newAdmin: TAddress): Promise<TEth.TxLike>
    cancelDefaultAdminTransfer (sender: TSender, ): Promise<TEth.TxLike>
    changeDefaultAdminDelay (sender: TSender, newDelay: number): Promise<TEth.TxLike>
    grantRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TEth.TxLike>
    renounceRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TEth.TxLike>
    revokeRole (sender: TSender, role: TEth.Hex, account: TAddress): Promise<TEth.TxLike>
    rollbackDefaultAdminDelay (sender: TSender, ): Promise<TEth.TxLike>
}


type TEvents = TIAccessControlDefaultAdminRulesTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
