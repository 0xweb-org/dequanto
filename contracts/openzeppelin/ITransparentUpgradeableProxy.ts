/**
 *  AUTO-Generated Class: 2023-11-05 00:36
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
    async upgradeToAndCall (sender: TSender, input0: TAddress, input1: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'upgradeToAndCall'), sender, input0, input1);
    }

    $call () {
        return super.$call() as IITransparentUpgradeableProxyTxCaller;
    }

    $data (): IITransparentUpgradeableProxyTxData {
        return super.$data() as IITransparentUpgradeableProxyTxData;
    }
    $gas (): TOverrideReturns<IITransparentUpgradeableProxyTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onAdminChanged (fn?: (event: TClientEventsStreamData<TLogAdminChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogAdminChangedParameters>> {
        return this.$onLog('AdminChanged', fn);
    }

    onBeaconUpgraded (fn?: (event: TClientEventsStreamData<TLogBeaconUpgradedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogBeaconUpgradedParameters>> {
        return this.$onLog('BeaconUpgraded', fn);
    }

    onUpgraded (fn?: (event: TClientEventsStreamData<TLogUpgradedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogUpgradedParameters>> {
        return this.$onLog('Upgraded', fn);
    }

    extractLogsAdminChanged (tx: TEth.TxReceipt): ITxLogItem<TLogAdminChanged>[] {
        let abi = this.$getAbiItem('event', 'AdminChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogAdminChanged>[];
    }

    extractLogsBeaconUpgraded (tx: TEth.TxReceipt): ITxLogItem<TLogBeaconUpgraded>[] {
        let abi = this.$getAbiItem('event', 'BeaconUpgraded');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogBeaconUpgraded>[];
    }

    extractLogsUpgraded (tx: TEth.TxReceipt): ITxLogItem<TLogUpgraded>[] {
        let abi = this.$getAbiItem('event', 'Upgraded');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogUpgraded>[];
    }

    async getPastLogsAdminChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogAdminChanged>[]> {
        return await this.$getPastLogsParsed('AdminChanged', options) as any;
    }

    async getPastLogsBeaconUpgraded (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { beacon?: TAddress }
    }): Promise<ITxLogItem<TLogBeaconUpgraded>[]> {
        return await this.$getPastLogsParsed('BeaconUpgraded', options) as any;
    }

    async getPastLogsUpgraded (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { implementation?: TAddress }
    }): Promise<ITxLogItem<TLogUpgraded>[]> {
        return await this.$getPastLogsParsed('Upgraded', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogAdminChanged = {
        previousAdmin: TAddress, newAdmin: TAddress
    };
    type TLogAdminChangedParameters = [ previousAdmin: TAddress, newAdmin: TAddress ];
    type TLogBeaconUpgraded = {
        beacon: TAddress
    };
    type TLogBeaconUpgradedParameters = [ beacon: TAddress ];
    type TLogUpgraded = {
        implementation: TAddress
    };
    type TLogUpgradedParameters = [ implementation: TAddress ];

interface IEvents {
  AdminChanged: TLogAdminChangedParameters
  BeaconUpgraded: TLogBeaconUpgradedParameters
  Upgraded: TLogUpgradedParameters
  '*': any[] 
}



interface IMethodAdmin {
  method: "admin"
  arguments: [  ]
}

interface IMethodChangeAdmin {
  method: "changeAdmin"
  arguments: [ input0: TAddress ]
}

interface IMethodImplementation {
  method: "implementation"
  arguments: [  ]
}

interface IMethodUpgradeTo {
  method: "upgradeTo"
  arguments: [ input0: TAddress ]
}

interface IMethodUpgradeToAndCall {
  method: "upgradeToAndCall"
  arguments: [ input0: TAddress, input1: TBufferLike ]
}

interface IMethods {
  admin: IMethodAdmin
  changeAdmin: IMethodChangeAdmin
  implementation: IMethodImplementation
  upgradeTo: IMethodUpgradeTo
  upgradeToAndCall: IMethodUpgradeToAndCall
  '*': { method: string, arguments: any[] } 
}






interface IITransparentUpgradeableProxyTxCaller {
    changeAdmin (sender: TSender, input0: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    upgradeTo (sender: TSender, input0: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    upgradeToAndCall (sender: TSender, input0: TAddress, input1: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IITransparentUpgradeableProxyTxData {
    changeAdmin (sender: TSender, input0: TAddress): Promise<TEth.TxLike>
    upgradeTo (sender: TSender, input0: TAddress): Promise<TEth.TxLike>
    upgradeToAndCall (sender: TSender, input0: TAddress, input1: TBufferLike): Promise<TEth.TxLike>
}


