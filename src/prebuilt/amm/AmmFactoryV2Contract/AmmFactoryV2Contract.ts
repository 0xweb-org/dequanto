/**
 *  AUTO-Generated Class: 2024-05-17 00:25
 *  Implementation: https://bscscan.com/address/0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73#code
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


import { Bscscan } from '@dequanto/explorer/Bscscan'
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client'



export class AmmFactoryV2Contract extends ContractBase {
    constructor(
        public address: TEth.Address = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
        public client: Web3Client = di.resolve(BscWeb3Client, ),
        public explorer: IBlockchainExplorer = di.resolve(Bscscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new AmmFactoryV2ContractStorageReader(this.address, this.client, this.explorer);
    }

    Types: TAmmFactoryV2ContractTypes;

    $meta = {
        "class": "./src/prebuilt/amm/AmmFactoryV2Contract/AmmFactoryV2Contract.ts"
    }

    async $constructor (deployer: TSender, _feeToSetter: TAddress): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0x5855a25a
    async INIT_CODE_PAIR_HASH (): Promise<TEth.Hex> {
        return this.$read(this.$getAbiItem('function', 'INIT_CODE_PAIR_HASH'));
    }

    // 0x1e3dd18b
    async allPairs (input0: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'allPairs'), input0);
    }

    // 0x574f2ba3
    async allPairsLength (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'allPairsLength'));
    }

    // 0xc9c65396
    async createPair (sender: TSender, tokenA: TAddress, tokenB: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'createPair'), sender, tokenA, tokenB);
    }

    // 0x017e7e58
    async feeTo (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'feeTo'));
    }

    // 0x094b7415
    async feeToSetter (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'feeToSetter'));
    }

    // 0xe6a43905
    async getPair (input0: TAddress, input1: TAddress): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getPair'), input0, input1);
    }

    // 0xf46901ed
    async setFeeTo (sender: TSender, _feeTo: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setFeeTo'), sender, _feeTo);
    }

    // 0xa2e74af6
    async setFeeToSetter (sender: TSender, _feeToSetter: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'setFeeToSetter'), sender, _feeToSetter);
    }

    $call () {
        return super.$call() as IAmmFactoryV2ContractTxCaller;
    }
    $signed (): TOverrideReturns<IAmmFactoryV2ContractTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IAmmFactoryV2ContractTxData {
        return super.$data() as IAmmFactoryV2ContractTxData;
    }
    $gas (): TOverrideReturns<IAmmFactoryV2ContractTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TAmmFactoryV2ContractTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TAmmFactoryV2ContractTypes['Methods'][TMethod]['arguments']
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

    onPairCreated (fn?: (event: TClientEventsStreamData<TEventArguments<'PairCreated'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'PairCreated'>>> {
        return this.$onLog('PairCreated', fn);
    }

    extractLogsPairCreated (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'PairCreated'>>[] {
        let abi = this.$getAbiItem('event', 'PairCreated');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'PairCreated'>>[];
    }

    async getPastLogsPairCreated (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { token0?: TAddress,token1?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'PairCreated'>>[]> {
        return await this.$getPastLogsParsed('PairCreated', options) as any;
    }

    abi: TAbiItem[] = [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]

    declare storage: AmmFactoryV2ContractStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TAmmFactoryV2ContractTypes = {
    Events: {
        PairCreated: {
            outputParams: { token0: TAddress, token1: TAddress, pair: TAddress, input3: bigint },
            outputArgs:   [ token0: TAddress, token1: TAddress, pair: TAddress, input3: bigint ],
        }
    },
    Methods: {
        INIT_CODE_PAIR_HASH: {
          method: "INIT_CODE_PAIR_HASH"
          arguments: [  ]
        }
        allPairs: {
          method: "allPairs"
          arguments: [ input0: bigint ]
        }
        allPairsLength: {
          method: "allPairsLength"
          arguments: [  ]
        }
        createPair: {
          method: "createPair"
          arguments: [ tokenA: TAddress, tokenB: TAddress ]
        }
        feeTo: {
          method: "feeTo"
          arguments: [  ]
        }
        feeToSetter: {
          method: "feeToSetter"
          arguments: [  ]
        }
        getPair: {
          method: "getPair"
          arguments: [ input0: TAddress, input1: TAddress ]
        }
        setFeeTo: {
          method: "setFeeTo"
          arguments: [ _feeTo: TAddress ]
        }
        setFeeToSetter: {
          method: "setFeeToSetter"
          arguments: [ _feeToSetter: TAddress ]
        }
    }
}



class AmmFactoryV2ContractStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockchainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }

    async feeTo(): Promise<TAddress> {
        return this.$storage.get(['feeTo', ]);
    }

    async feeToSetter(): Promise<TAddress> {
        return this.$storage.get(['feeToSetter', ]);
    }

    async getPair(key: TAddress): Promise<Record<string | number, TAddress>> {
        return this.$storage.get(['getPair', key]);
    }

    async allPairs(): Promise<TAddress[]> {
        return this.$storage.get(['allPairs', ]);
    }

    $slots = [
    {
        "slot": 0,
        "position": 0,
        "name": "feeTo",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 1,
        "position": 0,
        "name": "feeToSetter",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 2,
        "position": 0,
        "name": "getPair",
        "size": null,
        "type": "mapping(address => mapping(address => address))"
    },
    {
        "slot": 3,
        "position": 0,
        "name": "allPairs",
        "size": null,
        "type": "address[]"
    }
]

}


interface IAmmFactoryV2ContractTxCaller {
    createPair (sender: TSender, tokenA: TAddress, tokenB: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setFeeTo (sender: TSender, _feeTo: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    setFeeToSetter (sender: TSender, _feeToSetter: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IAmmFactoryV2ContractTxData {
    createPair (sender: TSender, tokenA: TAddress, tokenB: TAddress): Promise<TEth.TxLike>
    setFeeTo (sender: TSender, _feeTo: TAddress): Promise<TEth.TxLike>
    setFeeToSetter (sender: TSender, _feeToSetter: TAddress): Promise<TEth.TxLike>
}


type TEvents = TAmmFactoryV2ContractTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
