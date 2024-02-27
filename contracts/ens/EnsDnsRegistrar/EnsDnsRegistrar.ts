/**
 *  AUTO-Generated Class: 2024-02-27 16:48
 *  Implementation: https://etherscan.io/address/0x58774Bb8acD458A640aF0B88238369A167546ef2#code
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



export class EnsDnsRegistrar extends ContractBase {
    constructor(
        public address: TEth.Address = '0x58774Bb8acD458A640aF0B88238369A167546ef2',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new EnsDnsRegistrarStorageReader(this.address, this.client, this.explorer);
    }

    $meta = {
        "class": "./contracts/ens/EnsDnsRegistrar/EnsDnsRegistrar.ts"
    }

    async $constructor (deployer: TSender, _dnssec: TAddress, _suffixes: TAddress, _ens: TAddress): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0xbe27b22c
    async claim (sender: TSender, name: TEth.Hex, proof: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'claim'), sender, name, proof);
    }

    // 0x3f15457f
    async ens (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'ens'));
    }

    // 0x7dc0d1d0
    async oracle (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'oracle'));
    }

    // 0x8bbedf75
    async proveAndClaim (sender: TSender, name: TEth.Hex, input: { rrset: TEth.Hex, sig: TEth.Hex }[], proof: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'proveAndClaim'), sender, name, input, proof);
    }

    // 0x224199c2
    async proveAndClaimWithResolver (sender: TSender, name: TEth.Hex, input: { rrset: TEth.Hex, sig: TEth.Hex }[], proof: TEth.Hex, resolver: TAddress, addr: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'proveAndClaimWithResolver'), sender, name, input, proof, resolver, addr);
    }

    // 0x7adbf973
    async setOracle (sender: TSender, _dnssec: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setOracle'), sender, _dnssec);
    }

    // 0x1ecfc411
    async setPublicSuffixList (sender: TSender, _suffixes: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setPublicSuffixList'), sender, _suffixes);
    }

    // 0x30349ebe
    async suffixes (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'suffixes'));
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceID: TEth.Hex): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'supportsInterface'), interfaceID);
    }

    $call () {
        return super.$call() as IEnsDnsRegistrarTxCaller;
    }
    $signed (): TOverrideReturns<IEnsDnsRegistrarTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IEnsDnsRegistrarTxData {
        return super.$data() as IEnsDnsRegistrarTxData;
    }
    $gas (): TOverrideReturns<IEnsDnsRegistrarTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TEnsDnsRegistrarTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TEnsDnsRegistrarTypes['Methods'][TMethod]['arguments']
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
        return await this.$getPastLogsParsed(mix, options) as any;
    }

    onClaim (fn?: (event: TClientEventsStreamData<TLogClaimParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogClaimParameters>> {
        return this.$onLog('Claim', fn);
    }

    onNewOracle (fn?: (event: TClientEventsStreamData<TLogNewOracleParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogNewOracleParameters>> {
        return this.$onLog('NewOracle', fn);
    }

    onNewPublicSuffixList (fn?: (event: TClientEventsStreamData<TLogNewPublicSuffixListParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogNewPublicSuffixListParameters>> {
        return this.$onLog('NewPublicSuffixList', fn);
    }

    extractLogsClaim (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Claim'>>[] {
        let abi = this.$getAbiItem('event', 'Claim');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Claim'>>[];
    }

    extractLogsNewOracle (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'NewOracle'>>[] {
        let abi = this.$getAbiItem('event', 'NewOracle');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'NewOracle'>>[];
    }

    extractLogsNewPublicSuffixList (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'NewPublicSuffixList'>>[] {
        let abi = this.$getAbiItem('event', 'NewPublicSuffixList');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'NewPublicSuffixList'>>[];
    }

    async getPastLogsClaim (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { node?: TEth.Hex,owner?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Claim'>>[]> {
        return await this.$getPastLogsParsed('Claim', options) as any;
    }

    async getPastLogsNewOracle (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'NewOracle'>>[]> {
        return await this.$getPastLogsParsed('NewOracle', options) as any;
    }

    async getPastLogsNewPublicSuffixList (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'NewPublicSuffixList'>>[]> {
        return await this.$getPastLogsParsed('NewPublicSuffixList', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"contract DNSSEC","name":"_dnssec","type":"address"},{"internalType":"contract PublicSuffixList","name":"_suffixes","type":"address"},{"internalType":"contract ENS","name":"_ens","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"node","type":"bytes32"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"bytes","name":"dnsname","type":"bytes"}],"name":"Claim","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oracle","type":"address"}],"name":"NewOracle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"suffixes","type":"address"}],"name":"NewPublicSuffixList","type":"event"},{"inputs":[{"internalType":"bytes","name":"name","type":"bytes"},{"internalType":"bytes","name":"proof","type":"bytes"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"ens","outputs":[{"internalType":"contract ENS","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oracle","outputs":[{"internalType":"contract DNSSEC","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"name","type":"bytes"},{"components":[{"internalType":"bytes","name":"rrset","type":"bytes"},{"internalType":"bytes","name":"sig","type":"bytes"}],"internalType":"struct DNSSEC.RRSetWithSignature[]","name":"input","type":"tuple[]"},{"internalType":"bytes","name":"proof","type":"bytes"}],"name":"proveAndClaim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"name","type":"bytes"},{"components":[{"internalType":"bytes","name":"rrset","type":"bytes"},{"internalType":"bytes","name":"sig","type":"bytes"}],"internalType":"struct DNSSEC.RRSetWithSignature[]","name":"input","type":"tuple[]"},{"internalType":"bytes","name":"proof","type":"bytes"},{"internalType":"address","name":"resolver","type":"address"},{"internalType":"address","name":"addr","type":"address"}],"name":"proveAndClaimWithResolver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract DNSSEC","name":"_dnssec","type":"address"}],"name":"setOracle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract PublicSuffixList","name":"_suffixes","type":"address"}],"name":"setPublicSuffixList","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"suffixes","outputs":[{"internalType":"contract PublicSuffixList","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"}]

    declare storage: EnsDnsRegistrarStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TEnsDnsRegistrarTypes = {
    Events: {
        Claim: {
            outputParams: { node: TEth.Hex, owner: TAddress, dnsname: TEth.Hex },
            outputArgs:   [ node: TEth.Hex, owner: TAddress, dnsname: TEth.Hex ],
        }
        NewOracle: {
            outputParams: { oracle: TAddress },
            outputArgs:   [ oracle: TAddress ],
        }
        NewPublicSuffixList: {
            outputParams: { suffixes: TAddress },
            outputArgs:   [ suffixes: TAddress ],
        }
    },
    Methods: {
        claim: {
          method: "claim"
          arguments: [ name: TEth.Hex, proof: TEth.Hex ]
        }
        ens: {
          method: "ens"
          arguments: [  ]
        }
        oracle: {
          method: "oracle"
          arguments: [  ]
        }
        proveAndClaim: {
          method: "proveAndClaim"
          arguments: [ name: TEth.Hex, input: { rrset: TEth.Hex, sig: TEth.Hex }[], proof: TEth.Hex ]
        }
        proveAndClaimWithResolver: {
          method: "proveAndClaimWithResolver"
          arguments: [ name: TEth.Hex, input: { rrset: TEth.Hex, sig: TEth.Hex }[], proof: TEth.Hex, resolver: TAddress, addr: TAddress ]
        }
        setOracle: {
          method: "setOracle"
          arguments: [ _dnssec: TAddress ]
        }
        setPublicSuffixList: {
          method: "setPublicSuffixList"
          arguments: [ _suffixes: TAddress ]
        }
        suffixes: {
          method: "suffixes"
          arguments: [  ]
        }
        supportsInterface: {
          method: "supportsInterface"
          arguments: [ interfaceID: TEth.Hex ]
        }
    }
}



class EnsDnsRegistrarStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }

    async oracle(): Promise<TAddress> {
        return this.$storage.get(['oracle', ]);
    }

    async ens(): Promise<TAddress> {
        return this.$storage.get(['ens', ]);
    }

    async suffixes(): Promise<TAddress> {
        return this.$storage.get(['suffixes', ]);
    }

    $slots = [
    {
        "slot": 0,
        "position": 0,
        "name": "oracle",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 1,
        "position": 0,
        "name": "ens",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 2,
        "position": 0,
        "name": "suffixes",
        "size": 160,
        "type": "address"
    }
]

}


interface IEnsDnsRegistrarTxCaller {
    claim (sender: TSender, name: TEth.Hex, proof: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    proveAndClaim (sender: TSender, name: TEth.Hex, input: { rrset: TEth.Hex, sig: TEth.Hex }[], proof: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    proveAndClaimWithResolver (sender: TSender, name: TEth.Hex, input: { rrset: TEth.Hex, sig: TEth.Hex }[], proof: TEth.Hex, resolver: TAddress, addr: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setOracle (sender: TSender, _dnssec: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setPublicSuffixList (sender: TSender, _suffixes: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IEnsDnsRegistrarTxData {
    claim (sender: TSender, name: TEth.Hex, proof: TEth.Hex): Promise<TEth.TxLike>
    proveAndClaim (sender: TSender, name: TEth.Hex, input: { rrset: TEth.Hex, sig: TEth.Hex }[], proof: TEth.Hex): Promise<TEth.TxLike>
    proveAndClaimWithResolver (sender: TSender, name: TEth.Hex, input: { rrset: TEth.Hex, sig: TEth.Hex }[], proof: TEth.Hex, resolver: TAddress, addr: TAddress): Promise<TEth.TxLike>
    setOracle (sender: TSender, _dnssec: TAddress): Promise<TEth.TxLike>
    setPublicSuffixList (sender: TSender, _suffixes: TAddress): Promise<TEth.TxLike>
}


type TEvents = TEnsDnsRegistrarTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
