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



export class ITransparentUpgradeableProxy extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    Types: TITransparentUpgradeableProxyTypes;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/ITransparentUpgradeableProxy.ts"
    }

    // 0xf851a440
    async admin (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'admin'));
    }

    // 0x8f283970
    async changeAdmin (sender: TSender, input0: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'changeAdmin'), sender, input0);
    }

    // 0x5c60da1b
    async implementation (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'implementation'));
    }

    // 0x3659cfe6
    async upgradeTo (sender: TSender, input0: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'upgradeTo'), sender, input0);
    }

    // 0x4f1ef286
    async upgradeToAndCall (sender: TSender, input0: TAddress, input1: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'upgradeToAndCall'), sender, input0, input1);
    }

    $call () {
        return super.$call() as IITransparentUpgradeableProxyTxCaller;
    }
    $signed (): TOverrideReturns<IITransparentUpgradeableProxyTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IITransparentUpgradeableProxyTxData {
        return super.$data() as IITransparentUpgradeableProxyTxData;
    }
    $gas (): TOverrideReturns<IITransparentUpgradeableProxyTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TITransparentUpgradeableProxyTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TITransparentUpgradeableProxyTypes['Methods'][TMethod]['arguments']
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

    onAdminChanged (fn?: (event: TClientEventsStreamData<TEventArguments<'AdminChanged'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'AdminChanged'>>> {
        return this.$onLog('AdminChanged', fn);
    }

    onBeaconUpgraded (fn?: (event: TClientEventsStreamData<TEventArguments<'BeaconUpgraded'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'BeaconUpgraded'>>> {
        return this.$onLog('BeaconUpgraded', fn);
    }

    onUpgraded (fn?: (event: TClientEventsStreamData<TEventArguments<'Upgraded'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Upgraded'>>> {
        return this.$onLog('Upgraded', fn);
    }

    extractLogsAdminChanged (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'AdminChanged'>>[] {
        let abi = this.$getAbiItem('event', 'AdminChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'AdminChanged'>>[];
    }

    extractLogsBeaconUpgraded (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'BeaconUpgraded'>>[] {
        let abi = this.$getAbiItem('event', 'BeaconUpgraded');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'BeaconUpgraded'>>[];
    }

    extractLogsUpgraded (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Upgraded'>>[] {
        let abi = this.$getAbiItem('event', 'Upgraded');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Upgraded'>>[];
    }

    async getPastLogsAdminChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'AdminChanged'>>[]> {
        return await this.$getPastLogsParsed('AdminChanged', options) as any;
    }

    async getPastLogsBeaconUpgraded (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { beacon?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'BeaconUpgraded'>>[]> {
        return await this.$getPastLogsParsed('BeaconUpgraded', options) as any;
    }

    async getPastLogsUpgraded (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { implementation?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Upgraded'>>[]> {
        return await this.$getPastLogsParsed('Upgraded', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TITransparentUpgradeableProxyTypes = {
    Events: {
        AdminChanged: {
            outputParams: { previousAdmin: TAddress, newAdmin: TAddress },
            outputArgs:   [ previousAdmin: TAddress, newAdmin: TAddress ],
        }
        BeaconUpgraded: {
            outputParams: { beacon: TAddress },
            outputArgs:   [ beacon: TAddress ],
        }
        Upgraded: {
            outputParams: { implementation: TAddress },
            outputArgs:   [ implementation: TAddress ],
        }
    },
    Methods: {
        admin: {
          method: "admin"
          arguments: [  ]
        }
        changeAdmin: {
          method: "changeAdmin"
          arguments: [ input0: TAddress ]
        }
        implementation: {
          method: "implementation"
          arguments: [  ]
        }
        upgradeTo: {
          method: "upgradeTo"
          arguments: [ input0: TAddress ]
        }
        upgradeToAndCall: {
          method: "upgradeToAndCall"
          arguments: [ input0: TAddress, input1: TEth.Hex ]
        }
    }
}



interface IITransparentUpgradeableProxyTxCaller {
    changeAdmin (sender: TSender, input0: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    upgradeTo (sender: TSender, input0: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    upgradeToAndCall (sender: TSender, input0: TAddress, input1: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IITransparentUpgradeableProxyTxData {
    changeAdmin (sender: TSender, input0: TAddress): Promise<TEth.TxLike>
    upgradeTo (sender: TSender, input0: TAddress): Promise<TEth.TxLike>
    upgradeToAndCall (sender: TSender, input0: TAddress, input1: TEth.Hex): Promise<TEth.TxLike>
}


type TEvents = TITransparentUpgradeableProxyTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
