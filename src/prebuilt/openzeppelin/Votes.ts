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

export namespace VotesErrors {
    export interface InvalidShortString {
        type: 'InvalidShortString'
        params: {
        }
    }
    export interface StringTooLong {
        type: 'StringTooLong'
        params: {
            str: string
        }
    }
    export type Error = InvalidShortString | StringTooLong
}

export class Votes extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockchainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)


    }

    Types: TVotesTypes;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/Votes.ts"
    }

    // 0x4bf5d7e9
    async CLOCK_MODE (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'CLOCK_MODE'));
    }

    // 0x3644e515
    async DOMAIN_SEPARATOR (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'DOMAIN_SEPARATOR'));
    }

    // 0x91ddadf4
    async clock (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'clock'));
    }

    // 0x5c19a95c
    async delegate (sender: TSender, delegatee: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'delegate'), sender, delegatee);
    }

    // 0xc3cda520
    async delegateBySig (sender: TSender, delegatee: TAddress, nonce: bigint, expiry: bigint, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'delegateBySig'), sender, delegatee, nonce, expiry, v, r, s);
    }

    // 0x587cde1e
    async delegates (account: TAddress): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'delegates'), account);
    }

    // 0x84b0196e
    async eip712Domain (): Promise<{ fields: TEth.Hex, name: string, version: string, chainId: bigint, verifyingContract: TAddress, salt: TEth.Hex, extensions: bigint[] }> {
        return this.$read(this.$getAbiItem('function', 'eip712Domain'));
    }

    // 0x8e539e8c
    async getPastTotalSupply (timepoint: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getPastTotalSupply'), timepoint);
    }

    // 0x3a46b1a8
    async getPastVotes (account: TAddress, timepoint: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getPastVotes'), account, timepoint);
    }

    // 0x9ab24eb0
    async getVotes (account: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getVotes'), account);
    }

    // 0x7ecebe00
    async nonces (owner: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'nonces'), owner);
    }

    $call () {
        return super.$call() as IVotesTxCaller;
    }
    $signed (): TOverrideReturns<IVotesTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IVotesTxData {
        return super.$data() as IVotesTxData;
    }
    $gas (): TOverrideReturns<IVotesTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TVotesTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TVotesTypes['Methods'][TMethod]['arguments']
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

    onDelegateChanged (fn?: (event: TClientEventsStreamData<TEventArguments<'DelegateChanged'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'DelegateChanged'>>> {
        return this.$onLog('DelegateChanged', fn);
    }

    onDelegateVotesChanged (fn?: (event: TClientEventsStreamData<TEventArguments<'DelegateVotesChanged'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'DelegateVotesChanged'>>> {
        return this.$onLog('DelegateVotesChanged', fn);
    }

    onEIP712DomainChanged (fn?: (event: TClientEventsStreamData<TEventArguments<'EIP712DomainChanged'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'EIP712DomainChanged'>>> {
        return this.$onLog('EIP712DomainChanged', fn);
    }

    extractLogsDelegateChanged (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'DelegateChanged'>>[] {
        let abi = this.$getAbiItem('event', 'DelegateChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'DelegateChanged'>>[];
    }

    extractLogsDelegateVotesChanged (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'DelegateVotesChanged'>>[] {
        let abi = this.$getAbiItem('event', 'DelegateVotesChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'DelegateVotesChanged'>>[];
    }

    extractLogsEIP712DomainChanged (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'EIP712DomainChanged'>>[] {
        let abi = this.$getAbiItem('event', 'EIP712DomainChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'EIP712DomainChanged'>>[];
    }

    async getPastLogsDelegateChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { delegator?: TAddress,fromDelegate?: TAddress,toDelegate?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'DelegateChanged'>>[]> {
        return await this.$getPastLogsParsed('DelegateChanged', options) as any;
    }

    async getPastLogsDelegateVotesChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { delegate?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'DelegateVotesChanged'>>[]> {
        return await this.$getPastLogsParsed('DelegateVotesChanged', options) as any;
    }

    async getPastLogsEIP712DomainChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'EIP712DomainChanged'>>[]> {
        return await this.$getPastLogsParsed('EIP712DomainChanged', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[],"name":"InvalidShortString","type":"error"},{"inputs":[{"internalType":"string","name":"str","type":"string"}],"name":"StringTooLong","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[],"name":"EIP712DomainChanged","type":"event"},{"inputs":[],"name":"CLOCK_MODE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"clock","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"eip712Domain","outputs":[{"internalType":"bytes1","name":"fields","type":"bytes1"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"verifyingContract","type":"address"},{"internalType":"bytes32","name":"salt","type":"bytes32"},{"internalType":"uint256[]","name":"extensions","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getPastTotalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"timepoint","type":"uint256"}],"name":"getPastVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TVotesTypes = {
    Events: {
        DelegateChanged: {
            outputParams: { delegator: TAddress, fromDelegate: TAddress, toDelegate: TAddress },
            outputArgs:   [ delegator: TAddress, fromDelegate: TAddress, toDelegate: TAddress ],
        }
        DelegateVotesChanged: {
            outputParams: { delegate: TAddress, previousBalance: bigint, newBalance: bigint },
            outputArgs:   [ delegate: TAddress, previousBalance: bigint, newBalance: bigint ],
        }
        EIP712DomainChanged: {
            outputParams: {  },
            outputArgs:   [  ],
        }
    },
    Methods: {
        CLOCK_MODE: {
          method: "CLOCK_MODE"
          arguments: [  ]
        }
        DOMAIN_SEPARATOR: {
          method: "DOMAIN_SEPARATOR"
          arguments: [  ]
        }
        clock: {
          method: "clock"
          arguments: [  ]
        }
        delegate: {
          method: "delegate"
          arguments: [ delegatee: TAddress ]
        }
        delegateBySig: {
          method: "delegateBySig"
          arguments: [ delegatee: TAddress, nonce: bigint, expiry: bigint, v: number, r: TEth.Hex, s: TEth.Hex ]
        }
        delegates: {
          method: "delegates"
          arguments: [ account: TAddress ]
        }
        eip712Domain: {
          method: "eip712Domain"
          arguments: [  ]
        }
        getPastTotalSupply: {
          method: "getPastTotalSupply"
          arguments: [ timepoint: bigint ]
        }
        getPastVotes: {
          method: "getPastVotes"
          arguments: [ account: TAddress, timepoint: bigint ]
        }
        getVotes: {
          method: "getVotes"
          arguments: [ account: TAddress ]
        }
        nonces: {
          method: "nonces"
          arguments: [ owner: TAddress ]
        }
    }
}



interface IVotesTxCaller {
    delegate (sender: TSender, delegatee: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    delegateBySig (sender: TSender, delegatee: TAddress, nonce: bigint, expiry: bigint, v: number, r: TEth.Hex, s: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IVotesTxData {
    delegate (sender: TSender, delegatee: TAddress): Promise<TEth.TxLike>
    delegateBySig (sender: TSender, delegatee: TAddress, nonce: bigint, expiry: bigint, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TEth.TxLike>
}


type TEvents = TVotesTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
