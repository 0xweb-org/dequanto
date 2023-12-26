/**
 *  AUTO-Generated Class: 2023-12-26 12:42
 *  Implementation: https://etherscan.io/address/0x253553366Da8546fC250F225fe3d25d0C782303b#code
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

export namespace EnsEthRegistrarControllerErrors {
    export interface CommitmentTooNew {
        type: 'CommitmentTooNew'
        params: {
            commitment: TEth.Hex
        }
    }
    export interface CommitmentTooOld {
        type: 'CommitmentTooOld'
        params: {
            commitment: TEth.Hex
        }
    }
    export interface DurationTooShort {
        type: 'DurationTooShort'
        params: {
            duration: bigint
        }
    }
    export interface InsufficientValue {
        type: 'InsufficientValue'
        params: {
        }
    }
    export interface MaxCommitmentAgeTooHigh {
        type: 'MaxCommitmentAgeTooHigh'
        params: {
        }
    }
    export interface MaxCommitmentAgeTooLow {
        type: 'MaxCommitmentAgeTooLow'
        params: {
        }
    }
    export interface NameNotAvailable {
        type: 'NameNotAvailable'
        params: {
            name: string
        }
    }
    export interface ResolverRequiredWhenDataSupplied {
        type: 'ResolverRequiredWhenDataSupplied'
        params: {
        }
    }
    export interface UnexpiredCommitmentExists {
        type: 'UnexpiredCommitmentExists'
        params: {
            commitment: TEth.Hex
        }
    }
    export type Error = CommitmentTooNew | CommitmentTooOld | DurationTooShort | InsufficientValue | MaxCommitmentAgeTooHigh | MaxCommitmentAgeTooLow | NameNotAvailable | ResolverRequiredWhenDataSupplied | UnexpiredCommitmentExists
}

export class EnsEthRegistrarController extends ContractBase {
    constructor(
        public address: TEth.Address = '0x253553366Da8546fC250F225fe3d25d0C782303b',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new EnsEthRegistrarControllerStorageReader(this.address, this.client, this.explorer);
    }

    $meta = {
    "class": "./contracts/ens/EnsEthRegistrarController/EnsEthRegistrarController.ts"
}

    async $constructor (deployer: TSender, _base: TAddress, _prices: TAddress, _minCommitmentAge: bigint, _maxCommitmentAge: bigint, _reverseRegistrar: TAddress, _nameWrapper: TAddress, _ens: TAddress): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0x8a95b09f
    async MIN_REGISTRATION_DURATION (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'MIN_REGISTRATION_DURATION'));
    }

    // 0xaeb8ce9b
    async available (name: string): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'available'), name);
    }

    // 0xf14fcbc8
    async commit (sender: TSender, commitment: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'commit'), sender, commitment);
    }

    // 0x839df945
    async commitments (input0: TEth.Hex): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'commitments'), input0);
    }

    // 0x65a69dcf
    async makeCommitment (name: string, owner: TAddress, duration: bigint, secret: TEth.Hex, resolver: TAddress, data: TEth.Hex[], reverseRecord: boolean, ownerControlledFuses: number): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'makeCommitment'), name, owner, duration, secret, resolver, data, reverseRecord, ownerControlledFuses);
    }

    // 0xce1e09c0
    async maxCommitmentAge (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'maxCommitmentAge'));
    }

    // 0x8d839ffe
    async minCommitmentAge (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'minCommitmentAge'));
    }

    // 0xa8e5fbc0
    async nameWrapper (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'nameWrapper'));
    }

    // 0x8da5cb5b
    async owner (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'owner'));
    }

    // 0xd3419bf3
    async prices (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'prices'));
    }

    // 0x5d3590d5
    async recoverFunds (sender: TSender, _token: TAddress, _to: TAddress, _amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'recoverFunds'), sender, _token, _to, _amount);
    }

    // 0x74694a2b
    async register (sender: TSender, name: string, owner: TAddress, duration: bigint, secret: TEth.Hex, resolver: TAddress, data: TEth.Hex[], reverseRecord: boolean, ownerControlledFuses: number): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'register'), sender, name, owner, duration, secret, resolver, data, reverseRecord, ownerControlledFuses);
    }

    // 0xacf1a841
    async renew (sender: TSender, name: string, duration: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renew'), sender, name, duration);
    }

    // 0x715018a6
    async renounceOwnership (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renounceOwnership'), sender);
    }

    // 0x83e7f6ff
    async rentPrice (name: string, duration: bigint): Promise<{ base: bigint, premium: bigint }> {
        return this.$read(this.$getAbiItem('function', 'rentPrice'), name, duration);
    }

    // 0x80869853
    async reverseRegistrar (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'reverseRegistrar'));
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceID: TEth.Hex): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceID);
    }

    // 0xf2fde38b
    async transferOwnership (sender: TSender, newOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferOwnership'), sender, newOwner);
    }

    // 0x9791c097
    async valid (name: string): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'valid'), name);
    }

    // 0x3ccfd60b
    async withdraw (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdraw'), sender);
    }

    $call () {
        return super.$call() as IEnsEthRegistrarControllerTxCaller;
    }
    $signed (): TOverrideReturns<IEnsEthRegistrarControllerTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IEnsEthRegistrarControllerTxData {
        return super.$data() as IEnsEthRegistrarControllerTxData;
    }
    $gas (): TOverrideReturns<IEnsEthRegistrarControllerTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
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

    onNameRegistered (fn?: (event: TClientEventsStreamData<TLogNameRegisteredParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogNameRegisteredParameters>> {
        return this.$onLog('NameRegistered', fn);
    }

    onNameRenewed (fn?: (event: TClientEventsStreamData<TLogNameRenewedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogNameRenewedParameters>> {
        return this.$onLog('NameRenewed', fn);
    }

    onOwnershipTransferred (fn?: (event: TClientEventsStreamData<TLogOwnershipTransferredParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogOwnershipTransferredParameters>> {
        return this.$onLog('OwnershipTransferred', fn);
    }

    extractLogsNameRegistered (tx: TEth.TxReceipt): ITxLogItem<TLogNameRegistered>[] {
        let abi = this.$getAbiItem('event', 'NameRegistered');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogNameRegistered>[];
    }

    extractLogsNameRenewed (tx: TEth.TxReceipt): ITxLogItem<TLogNameRenewed>[] {
        let abi = this.$getAbiItem('event', 'NameRenewed');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogNameRenewed>[];
    }

    extractLogsOwnershipTransferred (tx: TEth.TxReceipt): ITxLogItem<TLogOwnershipTransferred>[] {
        let abi = this.$getAbiItem('event', 'OwnershipTransferred');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogOwnershipTransferred>[];
    }

    async getPastLogsNameRegistered (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogNameRegistered>[]> {
        return await this.$getPastLogsParsed('NameRegistered', options) as any;
    }

    async getPastLogsNameRenewed (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogNameRenewed>[]> {
        return await this.$getPastLogsParsed('NameRenewed', options) as any;
    }

    async getPastLogsOwnershipTransferred (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { previousOwner?: TAddress,newOwner?: TAddress }
    }): Promise<ITxLogItem<TLogOwnershipTransferred>[]> {
        return await this.$getPastLogsParsed('OwnershipTransferred', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"contract BaseRegistrarImplementation","name":"_base","type":"address"},{"internalType":"contract IPriceOracle","name":"_prices","type":"address"},{"internalType":"uint256","name":"_minCommitmentAge","type":"uint256"},{"internalType":"uint256","name":"_maxCommitmentAge","type":"uint256"},{"internalType":"contract ReverseRegistrar","name":"_reverseRegistrar","type":"address"},{"internalType":"contract INameWrapper","name":"_nameWrapper","type":"address"},{"internalType":"contract ENS","name":"_ens","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"bytes32","name":"commitment","type":"bytes32"}],"name":"CommitmentTooNew","type":"error"},{"inputs":[{"internalType":"bytes32","name":"commitment","type":"bytes32"}],"name":"CommitmentTooOld","type":"error"},{"inputs":[{"internalType":"uint256","name":"duration","type":"uint256"}],"name":"DurationTooShort","type":"error"},{"inputs":[],"name":"InsufficientValue","type":"error"},{"inputs":[],"name":"MaxCommitmentAgeTooHigh","type":"error"},{"inputs":[],"name":"MaxCommitmentAgeTooLow","type":"error"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"NameNotAvailable","type":"error"},{"inputs":[],"name":"ResolverRequiredWhenDataSupplied","type":"error"},{"inputs":[{"internalType":"bytes32","name":"commitment","type":"bytes32"}],"name":"UnexpiredCommitmentExists","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":true,"internalType":"bytes32","name":"label","type":"bytes32"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"baseCost","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"premium","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expires","type":"uint256"}],"name":"NameRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":true,"internalType":"bytes32","name":"label","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"cost","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expires","type":"uint256"}],"name":"NameRenewed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"MIN_REGISTRATION_DURATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"available","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"commitment","type":"bytes32"}],"name":"commit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"commitments","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"bytes32","name":"secret","type":"bytes32"},{"internalType":"address","name":"resolver","type":"address"},{"internalType":"bytes[]","name":"data","type":"bytes[]"},{"internalType":"bool","name":"reverseRecord","type":"bool"},{"internalType":"uint16","name":"ownerControlledFuses","type":"uint16"}],"name":"makeCommitment","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"maxCommitmentAge","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minCommitmentAge","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nameWrapper","outputs":[{"internalType":"contract INameWrapper","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"prices","outputs":[{"internalType":"contract IPriceOracle","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"recoverFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"duration","type":"uint256"},{"internalType":"bytes32","name":"secret","type":"bytes32"},{"internalType":"address","name":"resolver","type":"address"},{"internalType":"bytes[]","name":"data","type":"bytes[]"},{"internalType":"bool","name":"reverseRecord","type":"bool"},{"internalType":"uint16","name":"ownerControlledFuses","type":"uint16"}],"name":"register","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"duration","type":"uint256"}],"name":"renew","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"duration","type":"uint256"}],"name":"rentPrice","outputs":[{"components":[{"internalType":"uint256","name":"base","type":"uint256"},{"internalType":"uint256","name":"premium","type":"uint256"}],"internalType":"struct IPriceOracle.Price","name":"price","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reverseRegistrar","outputs":[{"internalType":"contract ReverseRegistrar","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"valid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]

    declare storage: EnsEthRegistrarControllerStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogNameRegistered = {
        name: string, label: TEth.Hex, owner: TAddress, baseCost: bigint, premium: bigint, expires: bigint
    };
    type TLogNameRegisteredParameters = [ name: string, label: TEth.Hex, owner: TAddress, baseCost: bigint, premium: bigint, expires: bigint ];
    type TLogNameRenewed = {
        name: string, label: TEth.Hex, cost: bigint, expires: bigint
    };
    type TLogNameRenewedParameters = [ name: string, label: TEth.Hex, cost: bigint, expires: bigint ];
    type TLogOwnershipTransferred = {
        previousOwner: TAddress, newOwner: TAddress
    };
    type TLogOwnershipTransferredParameters = [ previousOwner: TAddress, newOwner: TAddress ];

interface IEvents {
  NameRegistered: TLogNameRegisteredParameters
  NameRenewed: TLogNameRenewedParameters
  OwnershipTransferred: TLogOwnershipTransferredParameters
  '*': any[] 
}



interface IMethodMIN_REGISTRATION_DURATION {
  method: "MIN_REGISTRATION_DURATION"
  arguments: [  ]
}

interface IMethodAvailable {
  method: "available"
  arguments: [ name: string ]
}

interface IMethodCommit {
  method: "commit"
  arguments: [ commitment: TEth.Hex ]
}

interface IMethodCommitments {
  method: "commitments"
  arguments: [ input0: TEth.Hex ]
}

interface IMethodMakeCommitment {
  method: "makeCommitment"
  arguments: [ name: string, owner: TAddress, duration: bigint, secret: TEth.Hex, resolver: TAddress, data: TEth.Hex[], reverseRecord: boolean, ownerControlledFuses: number ]
}

interface IMethodMaxCommitmentAge {
  method: "maxCommitmentAge"
  arguments: [  ]
}

interface IMethodMinCommitmentAge {
  method: "minCommitmentAge"
  arguments: [  ]
}

interface IMethodNameWrapper {
  method: "nameWrapper"
  arguments: [  ]
}

interface IMethodOwner {
  method: "owner"
  arguments: [  ]
}

interface IMethodPrices {
  method: "prices"
  arguments: [  ]
}

interface IMethodRecoverFunds {
  method: "recoverFunds"
  arguments: [ _token: TAddress, _to: TAddress, _amount: bigint ]
}

interface IMethodRegister {
  method: "register"
  arguments: [ name: string, owner: TAddress, duration: bigint, secret: TEth.Hex, resolver: TAddress, data: TEth.Hex[], reverseRecord: boolean, ownerControlledFuses: number ]
}

interface IMethodRenew {
  method: "renew"
  arguments: [ name: string, duration: bigint ]
}

interface IMethodRenounceOwnership {
  method: "renounceOwnership"
  arguments: [  ]
}

interface IMethodRentPrice {
  method: "rentPrice"
  arguments: [ name: string, duration: bigint ]
}

interface IMethodReverseRegistrar {
  method: "reverseRegistrar"
  arguments: [  ]
}

interface IMethodSupportsInterface {
  method: "supportsInterface"
  arguments: [ interfaceID: TEth.Hex ]
}

interface IMethodTransferOwnership {
  method: "transferOwnership"
  arguments: [ newOwner: TAddress ]
}

interface IMethodValid {
  method: "valid"
  arguments: [ name: string ]
}

interface IMethodWithdraw {
  method: "withdraw"
  arguments: [  ]
}

interface IMethods {
  MIN_REGISTRATION_DURATION: IMethodMIN_REGISTRATION_DURATION
  available: IMethodAvailable
  commit: IMethodCommit
  commitments: IMethodCommitments
  makeCommitment: IMethodMakeCommitment
  maxCommitmentAge: IMethodMaxCommitmentAge
  minCommitmentAge: IMethodMinCommitmentAge
  nameWrapper: IMethodNameWrapper
  owner: IMethodOwner
  prices: IMethodPrices
  recoverFunds: IMethodRecoverFunds
  register: IMethodRegister
  renew: IMethodRenew
  renounceOwnership: IMethodRenounceOwnership
  rentPrice: IMethodRentPrice
  reverseRegistrar: IMethodReverseRegistrar
  supportsInterface: IMethodSupportsInterface
  transferOwnership: IMethodTransferOwnership
  valid: IMethodValid
  withdraw: IMethodWithdraw
  '*': { method: string, arguments: any[] } 
}





class EnsEthRegistrarControllerStorageReader extends ContractStorageReaderBase {
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

    async commitments(key: TEth.Hex): Promise<bigint> {
        return this.$storage.get(['commitments', key]);
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
        "name": "commitments",
        "size": null,
        "type": "mapping(bytes32 => uint256)"
    }
]

}



interface IEnsEthRegistrarControllerTxCaller {
    commit (sender: TSender, commitment: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    recoverFunds (sender: TSender, _token: TAddress, _to: TAddress, _amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    register (sender: TSender, name: string, owner: TAddress, duration: bigint, secret: TEth.Hex, resolver: TAddress, data: TEth.Hex[], reverseRecord: boolean, ownerControlledFuses: number): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renew (sender: TSender, name: string, duration: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    renounceOwnership (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    withdraw (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IEnsEthRegistrarControllerTxData {
    commit (sender: TSender, commitment: TEth.Hex): Promise<TEth.TxLike>
    recoverFunds (sender: TSender, _token: TAddress, _to: TAddress, _amount: bigint): Promise<TEth.TxLike>
    register (sender: TSender, name: string, owner: TAddress, duration: bigint, secret: TEth.Hex, resolver: TAddress, data: TEth.Hex[], reverseRecord: boolean, ownerControlledFuses: number): Promise<TEth.TxLike>
    renew (sender: TSender, name: string, duration: bigint): Promise<TEth.TxLike>
    renounceOwnership (sender: TSender, ): Promise<TEth.TxLike>
    transferOwnership (sender: TSender, newOwner: TAddress): Promise<TEth.TxLike>
    withdraw (sender: TSender, ): Promise<TEth.TxLike>
}


