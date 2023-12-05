/**
 *  AUTO-Generated Class: 2023-12-03 23:18
 *  Implementation: https://etherscan.io/address/0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb#code
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



export class EnsReverseRegistrar extends ContractBase {
    constructor(
        public address: TEth.Address = '0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new EnsReverseRegistrarStorageReader(this.address, this.client, this.explorer);
    }

    

    async $constructor (deployer: TSender, ensAddr: TAddress): Promise<TxWriter> {
        throw new Error('Not implemented. Use the ContractDeployer class to deploy the contract');
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
    async node (addr: TAddress): Promise<TBufferLike> {
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

    $data (): IEnsReverseRegistrarTxData {
        return super.$data() as IEnsReverseRegistrarTxData;
    }
    $gas (): TOverrideReturns<IEnsReverseRegistrarTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onControllerChanged (fn?: (event: TClientEventsStreamData<TLogControllerChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogControllerChangedParameters>> {
        return this.$onLog('ControllerChanged', fn);
    }

    onDefaultResolverChanged (fn?: (event: TClientEventsStreamData<TLogDefaultResolverChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDefaultResolverChangedParameters>> {
        return this.$onLog('DefaultResolverChanged', fn);
    }

    onOwnershipTransferred (fn?: (event: TClientEventsStreamData<TLogOwnershipTransferredParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogOwnershipTransferredParameters>> {
        return this.$onLog('OwnershipTransferred', fn);
    }

    onReverseClaimed (fn?: (event: TClientEventsStreamData<TLogReverseClaimedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogReverseClaimedParameters>> {
        return this.$onLog('ReverseClaimed', fn);
    }

    extractLogsControllerChanged (tx: TEth.TxReceipt): ITxLogItem<TLogControllerChanged>[] {
        let abi = this.$getAbiItem('event', 'ControllerChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogControllerChanged>[];
    }

    extractLogsDefaultResolverChanged (tx: TEth.TxReceipt): ITxLogItem<TLogDefaultResolverChanged>[] {
        let abi = this.$getAbiItem('event', 'DefaultResolverChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDefaultResolverChanged>[];
    }

    extractLogsOwnershipTransferred (tx: TEth.TxReceipt): ITxLogItem<TLogOwnershipTransferred>[] {
        let abi = this.$getAbiItem('event', 'OwnershipTransferred');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogOwnershipTransferred>[];
    }

    extractLogsReverseClaimed (tx: TEth.TxReceipt): ITxLogItem<TLogReverseClaimed>[] {
        let abi = this.$getAbiItem('event', 'ReverseClaimed');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogReverseClaimed>[];
    }

    async getPastLogsControllerChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { controller?: TAddress }
    }): Promise<ITxLogItem<TLogControllerChanged>[]> {
        return await this.$getPastLogsParsed('ControllerChanged', options) as any;
    }

    async getPastLogsDefaultResolverChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { resolver?: TAddress }
    }): Promise<ITxLogItem<TLogDefaultResolverChanged>[]> {
        return await this.$getPastLogsParsed('DefaultResolverChanged', options) as any;
    }

    async getPastLogsOwnershipTransferred (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { previousOwner?: TAddress,newOwner?: TAddress }
    }): Promise<ITxLogItem<TLogOwnershipTransferred>[]> {
        return await this.$getPastLogsParsed('OwnershipTransferred', options) as any;
    }

    async getPastLogsReverseClaimed (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { addr?: TAddress,node?: TBufferLike }
    }): Promise<ITxLogItem<TLogReverseClaimed>[]> {
        return await this.$getPastLogsParsed('ReverseClaimed', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"contract ENS","name":"ensAddr","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"controller","type":"address"},{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"ControllerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract NameResolver","name":"resolver","type":"address"}],"name":"DefaultResolverChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"}],"name":"ReverseClaimed","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"claim","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"resolver","type":"address"}],"name":"claimForAddr","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"resolver","type":"address"}],"name":"claimWithResolver","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"controllers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"defaultResolver","outputs":[{"internalType":"contract NameResolver","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ens","outputs":[{"internalType":"contract ENS","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"node","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"controller","type":"address"},{"internalType":"bool","name":"enabled","type":"bool"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"resolver","type":"address"}],"name":"setDefaultResolver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"setName","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"resolver","type":"address"},{"internalType":"string","name":"name","type":"string"}],"name":"setNameForAddr","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    storage: EnsReverseRegistrarStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogControllerChanged = {
        controller: TAddress, enabled: boolean
    };
    type TLogControllerChangedParameters = [ controller: TAddress, enabled: boolean ];
    type TLogDefaultResolverChanged = {
        resolver: TAddress
    };
    type TLogDefaultResolverChangedParameters = [ resolver: TAddress ];
    type TLogOwnershipTransferred = {
        previousOwner: TAddress, newOwner: TAddress
    };
    type TLogOwnershipTransferredParameters = [ previousOwner: TAddress, newOwner: TAddress ];
    type TLogReverseClaimed = {
        addr: TAddress, node: TBufferLike
    };
    type TLogReverseClaimedParameters = [ addr: TAddress, node: TBufferLike ];

interface IEvents {
  ControllerChanged: TLogControllerChangedParameters
  DefaultResolverChanged: TLogDefaultResolverChangedParameters
  OwnershipTransferred: TLogOwnershipTransferredParameters
  ReverseClaimed: TLogReverseClaimedParameters
  '*': any[] 
}



interface IMethodClaim {
  method: "claim"
  arguments: [ owner: TAddress ]
}

interface IMethodClaimForAddr {
  method: "claimForAddr"
  arguments: [ addr: TAddress, owner: TAddress, resolver: TAddress ]
}

interface IMethodClaimWithResolver {
  method: "claimWithResolver"
  arguments: [ owner: TAddress, resolver: TAddress ]
}

interface IMethodControllers {
  method: "controllers"
  arguments: [ input0: TAddress ]
}

interface IMethodDefaultResolver {
  method: "defaultResolver"
  arguments: [  ]
}

interface IMethodEns {
  method: "ens"
  arguments: [  ]
}

interface IMethodNode {
  method: "node"
  arguments: [ addr: TAddress ]
}

interface IMethodOwner {
  method: "owner"
  arguments: [  ]
}

interface IMethodRenounceOwnership {
  method: "renounceOwnership"
  arguments: [  ]
}

interface IMethodSetController {
  method: "setController"
  arguments: [ controller: TAddress, enabled: boolean ]
}

interface IMethodSetDefaultResolver {
  method: "setDefaultResolver"
  arguments: [ resolver: TAddress ]
}

interface IMethodSetName {
  method: "setName"
  arguments: [ name: string ]
}

interface IMethodSetNameForAddr {
  method: "setNameForAddr"
  arguments: [ addr: TAddress, owner: TAddress, resolver: TAddress, name: string ]
}

interface IMethodTransferOwnership {
  method: "transferOwnership"
  arguments: [ newOwner: TAddress ]
}

interface IMethods {
  claim: IMethodClaim
  claimForAddr: IMethodClaimForAddr
  claimWithResolver: IMethodClaimWithResolver
  controllers: IMethodControllers
  defaultResolver: IMethodDefaultResolver
  ens: IMethodEns
  node: IMethodNode
  owner: IMethodOwner
  renounceOwnership: IMethodRenounceOwnership
  setController: IMethodSetController
  setDefaultResolver: IMethodSetDefaultResolver
  setName: IMethodSetName
  setNameForAddr: IMethodSetNameForAddr
  transferOwnership: IMethodTransferOwnership
  '*': { method: string, arguments: any[] } 
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


