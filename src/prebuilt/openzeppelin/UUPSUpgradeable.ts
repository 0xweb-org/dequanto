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



export class UUPSUpgradeable extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockchainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)


    }

    Types: TUUPSUpgradeableTypes;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/UUPSUpgradeable.ts"
    }

    // 0x52d1902d
    async proxiableUUID (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'proxiableUUID'));
    }

    // 0x3659cfe6
    async upgradeTo (sender: TSender, newImplementation: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'upgradeTo'), sender, newImplementation);
    }

    // 0x4f1ef286
    async upgradeToAndCall (sender: TSender, newImplementation: TAddress, data: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'upgradeToAndCall'), sender, newImplementation, data);
    }

    $call () {
        return super.$call() as IUUPSUpgradeableTxCaller;
    }
    $signed (): TOverrideReturns<IUUPSUpgradeableTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IUUPSUpgradeableTxData {
        return super.$data() as IUUPSUpgradeableTxData;
    }
    $gas (): TOverrideReturns<IUUPSUpgradeableTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TUUPSUpgradeableTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TUUPSUpgradeableTypes['Methods'][TMethod]['arguments']
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

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TUUPSUpgradeableTypes = {
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
        proxiableUUID: {
          method: "proxiableUUID"
          arguments: [  ]
        }
        upgradeTo: {
          method: "upgradeTo"
          arguments: [ newImplementation: TAddress ]
        }
        upgradeToAndCall: {
          method: "upgradeToAndCall"
          arguments: [ newImplementation: TAddress, data: TEth.Hex ]
        }
    }
}



interface IUUPSUpgradeableTxCaller {
    upgradeTo (sender: TSender, newImplementation: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    upgradeToAndCall (sender: TSender, newImplementation: TAddress, data: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IUUPSUpgradeableTxData {
    upgradeTo (sender: TSender, newImplementation: TAddress): Promise<TEth.TxLike>
    upgradeToAndCall (sender: TSender, newImplementation: TAddress, data: TEth.Hex): Promise<TEth.TxLike>
}


type TEvents = TUUPSUpgradeableTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
