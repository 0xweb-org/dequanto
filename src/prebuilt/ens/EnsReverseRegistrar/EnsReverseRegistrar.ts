/**
 *  AUTO-Generated Class: 2024-05-17 00:25
 *  Implementation: https://etherscan.io/address/0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb#code
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



export class EnsReverseRegistrar extends ContractBase {
    constructor(
        public address: TEth.Address = '0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new EnsReverseRegistrarStorageReader(this.address, this.client, this.explorer);
    }

    Types: TEnsReverseRegistrarTypes;

    $meta = {
        "class": "./src/prebuilt/ens/EnsReverseRegistrar/EnsReverseRegistrar.ts"
    }

    async $constructor (deployer: TSender, ensAddr: TAddress): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0x1e83409a
    async claim (sender: TSender, owner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'claim'), sender, owner);
    }

    // 0x65669631
    async claimForAddr (sender: TSender, addr: TAddress, owner: TAddress, resolver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'claimForAddr'), sender, addr, owner, resolver);
    }

    // 0x0f5a5466
    async claimWithResolver (sender: TSender, owner: TAddress, resolver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'claimWithResolver'), sender, owner, resolver);
    }

    // 0xda8c229e
    async controllers (input0: TAddress): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'controllers'), input0);
    }

    // 0x828eab0e
    async defaultResolver (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'defaultResolver'));
    }

    // 0x3f15457f
    async ens (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'ens'));
    }

    // 0xbffbe61c
    async node (addr: TAddress): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'node'), addr);
    }

    // 0x8da5cb5b
    async owner (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'owner'));
    }

    // 0x715018a6
    async renounceOwnership (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renounceOwnership'), sender);
    }

    // 0xe0dba60f
    async setController (sender: TSender, controller: TAddress, enabled: boolean): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setController'), sender, controller, enabled);
    }

    // 0xc66485b2
    async setDefaultResolver (sender: TSender, resolver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setDefaultResolver'), sender, resolver);
    }

    // 0xc47f0027
    async setName (sender: TSender, name: string): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setName'), sender, name);
    }

    // 0x7a806d6b
    async setNameForAddr (sender: TSender, addr: TAddress, owner: TAddress, resolver: TAddress, name: string): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setNameForAddr'), sender, addr, owner, resolver, name);
    }

    // 0xf2fde38b
    async transferOwnership (sender: TSender, newOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferOwnership'), sender, newOwner);
    }

    $call () {
        return super.$call() as IEnsReverseRegistrarTxCaller;
    }
    $signed (): TOverrideReturns<IEnsReverseRegistrarTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IEnsReverseRegistrarTxData {
        return super.$data() as IEnsReverseRegistrarTxData;
    }
    $gas (): TOverrideReturns<IEnsReverseRegistrarTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TEnsReverseRegistrarTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TEnsReverseRegistrarTypes['Methods'][TMethod]['arguments']
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

    onControllerChanged (fn?: (event: TClientEventsStreamData<TEventArguments<'ControllerChanged'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ControllerChanged'>>> {
        return this.$onLog('ControllerChanged', fn);
    }

    onDefaultResolverChanged (fn?: (event: TClientEventsStreamData<TEventArguments<'DefaultResolverChanged'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'DefaultResolverChanged'>>> {
        return this.$onLog('DefaultResolverChanged', fn);
    }

    onOwnershipTransferred (fn?: (event: TClientEventsStreamData<TEventArguments<'OwnershipTransferred'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'OwnershipTransferred'>>> {
        return this.$onLog('OwnershipTransferred', fn);
    }

    onReverseClaimed (fn?: (event: TClientEventsStreamData<TEventArguments<'ReverseClaimed'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ReverseClaimed'>>> {
        return this.$onLog('ReverseClaimed', fn);
    }

    extractLogsControllerChanged (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ControllerChanged'>>[] {
        let abi = this.$getAbiItem('event', 'ControllerChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ControllerChanged'>>[];
    }

    extractLogsDefaultResolverChanged (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'DefaultResolverChanged'>>[] {
        let abi = this.$getAbiItem('event', 'DefaultResolverChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'DefaultResolverChanged'>>[];
    }

    extractLogsOwnershipTransferred (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'OwnershipTransferred'>>[] {
        let abi = this.$getAbiItem('event', 'OwnershipTransferred');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'OwnershipTransferred'>>[];
    }

    extractLogsReverseClaimed (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ReverseClaimed'>>[] {
        let abi = this.$getAbiItem('event', 'ReverseClaimed');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ReverseClaimed'>>[];
    }

    async getPastLogsControllerChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { controller?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ControllerChanged'>>[]> {
        return await this.$getPastLogsParsed('ControllerChanged', options) as any;
    }

    async getPastLogsDefaultResolverChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { resolver?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'DefaultResolverChanged'>>[]> {
        return await this.$getPastLogsParsed('DefaultResolverChanged', options) as any;
    }

    async getPastLogsOwnershipTransferred (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { previousOwner?: TAddress,newOwner?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'OwnershipTransferred'>>[]> {
        return await this.$getPastLogsParsed('OwnershipTransferred', options) as any;
    }

    async getPastLogsReverseClaimed (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { addr?: TAddress,node?: TEth.Hex }
    }): Promise<ITxLogItem<TEventParams<'ReverseClaimed'>>[]> {
        return await this.$getPastLogsParsed('ReverseClaimed', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"contract ENS","name":"ensAddr","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"controller","type":"address"},{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"ControllerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract NameResolver","name":"resolver","type":"address"}],"name":"DefaultResolverChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"}],"name":"ReverseClaimed","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"claim","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"resolver","type":"address"}],"name":"claimForAddr","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"resolver","type":"address"}],"name":"claimWithResolver","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"controllers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"defaultResolver","outputs":[{"internalType":"contract NameResolver","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ens","outputs":[{"internalType":"contract ENS","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"node","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"controller","type":"address"},{"internalType":"bool","name":"enabled","type":"bool"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"resolver","type":"address"}],"name":"setDefaultResolver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"setName","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"resolver","type":"address"},{"internalType":"string","name":"name","type":"string"}],"name":"setNameForAddr","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    declare storage: EnsReverseRegistrarStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TEnsReverseRegistrarTypes = {
    Events: {
        ControllerChanged: {
            outputParams: { controller: TAddress, enabled: boolean },
            outputArgs:   [ controller: TAddress, enabled: boolean ],
        }
        DefaultResolverChanged: {
            outputParams: { resolver: TAddress },
            outputArgs:   [ resolver: TAddress ],
        }
        OwnershipTransferred: {
            outputParams: { previousOwner: TAddress, newOwner: TAddress },
            outputArgs:   [ previousOwner: TAddress, newOwner: TAddress ],
        }
        ReverseClaimed: {
            outputParams: { addr: TAddress, node: TEth.Hex },
            outputArgs:   [ addr: TAddress, node: TEth.Hex ],
        }
    },
    Methods: {
        claim: {
          method: "claim"
          arguments: [ owner: TAddress ]
        }
        claimForAddr: {
          method: "claimForAddr"
          arguments: [ addr: TAddress, owner: TAddress, resolver: TAddress ]
        }
        claimWithResolver: {
          method: "claimWithResolver"
          arguments: [ owner: TAddress, resolver: TAddress ]
        }
        controllers: {
          method: "controllers"
          arguments: [ input0: TAddress ]
        }
        defaultResolver: {
          method: "defaultResolver"
          arguments: [  ]
        }
        ens: {
          method: "ens"
          arguments: [  ]
        }
        node: {
          method: "node"
          arguments: [ addr: TAddress ]
        }
        owner: {
          method: "owner"
          arguments: [  ]
        }
        renounceOwnership: {
          method: "renounceOwnership"
          arguments: [  ]
        }
        setController: {
          method: "setController"
          arguments: [ controller: TAddress, enabled: boolean ]
        }
        setDefaultResolver: {
          method: "setDefaultResolver"
          arguments: [ resolver: TAddress ]
        }
        setName: {
          method: "setName"
          arguments: [ name: string ]
        }
        setNameForAddr: {
          method: "setNameForAddr"
          arguments: [ addr: TAddress, owner: TAddress, resolver: TAddress, name: string ]
        }
        transferOwnership: {
          method: "transferOwnership"
          arguments: [ newOwner: TAddress ]
        }
    }
}



class EnsReverseRegistrarStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }

    async _owner(): Promise<TAddress> {
        return this.$storage.get(['_owner', ]);
    }

    async controllers(key: TAddress): Promise<boolean> {
        return this.$storage.get(['controllers', key]);
    }

    async defaultResolver(): Promise<TAddress> {
        return this.$storage.get(['defaultResolver', ]);
    }

    $slots = [
    {
        "slot": 0,
        "position": 0,
        "name": "_owner",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 1,
        "position": 0,
        "name": "controllers",
        "size": null,
        "type": "mapping(address => bool)"
    },
    {
        "slot": 2,
        "position": 0,
        "name": "defaultResolver",
        "size": 160,
        "type": "address"
    }
]

}


interface IEnsReverseRegistrarTxCaller {
    claim (sender: TSender, owner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    claimForAddr (sender: TSender, addr: TAddress, owner: TAddress, resolver: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    claimWithResolver (sender: TSender, owner: TAddress, resolver: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceOwnership (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setController (sender: TSender, controller: TAddress, enabled: boolean): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setDefaultResolver (sender: TSender, resolver: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setName (sender: TSender, name: string): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setNameForAddr (sender: TSender, addr: TAddress, owner: TAddress, resolver: TAddress, name: string): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IEnsReverseRegistrarTxData {
    claim (sender: TSender, owner: TAddress): Promise<TEth.TxLike>
    claimForAddr (sender: TSender, addr: TAddress, owner: TAddress, resolver: TAddress): Promise<TEth.TxLike>
    claimWithResolver (sender: TSender, owner: TAddress, resolver: TAddress): Promise<TEth.TxLike>
    renounceOwnership (sender: TSender, ): Promise<TEth.TxLike>
    setController (sender: TSender, controller: TAddress, enabled: boolean): Promise<TEth.TxLike>
    setDefaultResolver (sender: TSender, resolver: TAddress): Promise<TEth.TxLike>
    setName (sender: TSender, name: string): Promise<TEth.TxLike>
    setNameForAddr (sender: TSender, addr: TAddress, owner: TAddress, resolver: TAddress, name: string): Promise<TEth.TxLike>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<TEth.TxLike>
}


type TEvents = TEnsReverseRegistrarTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
