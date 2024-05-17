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



export class VestingWallet extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    Types: TVestingWalletTypes;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/VestingWallet.ts"
    }

    async $constructor (deployer: TSender, beneficiaryAddress: TAddress, startTimestamp: number, durationSeconds: number): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0x38af3eed
    async beneficiary (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'beneficiary'));
    }

    // 0x0fb5a6b4
    async duration (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'duration'));
    }

    // 0xa3f8eace
    async releasable (token: TAddress): Promise<bigint>
    // 0xfbccedae
    async releasable (): Promise<bigint>
    async releasable (...args): Promise<bigint> {
        let abi = this.$getAbiItemOverload([ 'function releasable(address) returns uint256', 'function releasable() returns uint256' ], args);
        return this.$read(abi, ...args);
    }

    // 0x19165587
    async release (sender: TSender, token: TAddress): Promise<TxWriter>
    // 0x86d1a69f
    async release (sender: TSender, ): Promise<TxWriter>
    async release (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function release(address)', 'function release()' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0x96132521
    async released (): Promise<bigint>
    // 0x9852595c
    async released (token: TAddress): Promise<bigint>
    async released (...args): Promise<bigint> {
        let abi = this.$getAbiItemOverload([ 'function released() returns uint256', 'function released(address) returns uint256' ], args);
        return this.$read(abi, ...args);
    }

    // 0xbe9a6555
    async start (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'start'));
    }

    // 0x0a17b06b
    async vestedAmount (timestamp: number): Promise<bigint>
    // 0x810ec23b
    async vestedAmount (token: TAddress, timestamp: number): Promise<bigint>
    async vestedAmount (...args): Promise<bigint> {
        let abi = this.$getAbiItemOverload([ 'function vestedAmount(uint64) returns uint256', 'function vestedAmount(address, uint64) returns uint256' ], args);
        return this.$read(abi, ...args);
    }

    $call () {
        return super.$call() as IVestingWalletTxCaller;
    }
    $signed (): TOverrideReturns<IVestingWalletTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IVestingWalletTxData {
        return super.$data() as IVestingWalletTxData;
    }
    $gas (): TOverrideReturns<IVestingWalletTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TVestingWalletTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TVestingWalletTypes['Methods'][TMethod]['arguments']
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

    onERC20Released (fn?: (event: TClientEventsStreamData<TEventArguments<'ERC20Released'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'ERC20Released'>>> {
        return this.$onLog('ERC20Released', fn);
    }

    onEtherReleased (fn?: (event: TClientEventsStreamData<TEventArguments<'EtherReleased'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'EtherReleased'>>> {
        return this.$onLog('EtherReleased', fn);
    }

    extractLogsERC20Released (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'ERC20Released'>>[] {
        let abi = this.$getAbiItem('event', 'ERC20Released');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'ERC20Released'>>[];
    }

    extractLogsEtherReleased (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'EtherReleased'>>[] {
        let abi = this.$getAbiItem('event', 'EtherReleased');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'EtherReleased'>>[];
    }

    async getPastLogsERC20Released (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { token?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'ERC20Released'>>[]> {
        return await this.$getPastLogsParsed('ERC20Released', options) as any;
    }

    async getPastLogsEtherReleased (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TEventParams<'EtherReleased'>>[]> {
        return await this.$getPastLogsParsed('EtherReleased', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"address","name":"beneficiaryAddress","type":"address"},{"internalType":"uint64","name":"startTimestamp","type":"uint64"},{"internalType":"uint64","name":"durationSeconds","type":"uint64"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ERC20Released","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EtherReleased","type":"event"},{"inputs":[],"name":"beneficiary","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"duration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"releasable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"released","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"released","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"start","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint64","name":"timestamp","type":"uint64"}],"name":"vestedAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint64","name":"timestamp","type":"uint64"}],"name":"vestedAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TVestingWalletTypes = {
    Events: {
        ERC20Released: {
            outputParams: { token: TAddress, amount: bigint },
            outputArgs:   [ token: TAddress, amount: bigint ],
        }
        EtherReleased: {
            outputParams: { amount: bigint },
            outputArgs:   [ amount: bigint ],
        }
    },
    Methods: {
        beneficiary: {
          method: "beneficiary"
          arguments: [  ]
        }
        duration: {
          method: "duration"
          arguments: [  ]
        }
        releasable: {
          method: "releasable"
          arguments: [ token: TAddress ] | [  ]
        }
        release: {
          method: "release"
          arguments: [ token: TAddress ] | [  ]
        }
        released: {
          method: "released"
          arguments: [  ] | [ token: TAddress ]
        }
        start: {
          method: "start"
          arguments: [  ]
        }
        vestedAmount: {
          method: "vestedAmount"
          arguments: [ timestamp: number ] | [ token: TAddress, timestamp: number ]
        }
    }
}



interface IVestingWalletTxCaller {
    release (sender: TSender, token: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    release (sender: TSender, ): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IVestingWalletTxData {
    release (sender: TSender, token: TAddress): Promise<TEth.TxLike>
    release (sender: TSender, ): Promise<TEth.TxLike>
}


type TEvents = TVestingWalletTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
