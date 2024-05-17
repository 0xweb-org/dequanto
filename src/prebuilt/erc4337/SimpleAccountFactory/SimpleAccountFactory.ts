/**
 *  AUTO-Generated Class: 2024-05-17 00:25
 *  Implementation: ./test/fixtures/erc4337/samples/SimpleAccountFactory.sol
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



export class SimpleAccountFactory extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new SimpleAccountFactoryStorageReader(this.address, this.client, this.explorer);
    }

    Types: TSimpleAccountFactoryTypes;

    $meta = {
        "source": "./test/fixtures/erc4337/samples/SimpleAccountFactory.sol",
        "class": "./src/prebuilt/erc4337/SimpleAccountFactory/SimpleAccountFactory.ts"
    }

    async $constructor (deployer: TSender, _entryPoint: TAddress): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0x5fbfb9cf
    async createAccount (sender: TSender, owner: TAddress, salt: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'createAccount'), sender, owner, salt);
    }

    // 0x8cb84e18
    async getAddress (owner: TAddress, salt: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getAddress'), owner, salt);
    }

    // 0x11464fbe
    async accountImplementation (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'accountImplementation'));
    }

    $call () {
        return super.$call() as ISimpleAccountFactoryTxCaller;
    }
    $signed (): TOverrideReturns<ISimpleAccountFactoryTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): ISimpleAccountFactoryTxData {
        return super.$data() as ISimpleAccountFactoryTxData;
    }
    $gas (): TOverrideReturns<ISimpleAccountFactoryTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TSimpleAccountFactoryTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TSimpleAccountFactoryTypes['Methods'][TMethod]['arguments']
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







    abi: TAbiItem[] = [{"type":"constructor","name":"constructor","inputs":[{"name":"_entryPoint","type":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"createAccount","inputs":[{"name":"owner","type":"address"},{"name":"salt","type":"uint256"}],"outputs":[{"name":"ret","type":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"getAddress","inputs":[{"name":"owner","type":"address"},{"name":"salt","type":"uint256"}],"outputs":[{"type":"address"}],"stateMutability":"view"},{"type":"function","name":"accountImplementation","inputs":[],"outputs":[{"name":"accountImplementation","type":"address"}],"stateMutability":"view"}]

    declare storage: SimpleAccountFactoryStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TSimpleAccountFactoryTypes = {
    Events: {
        
    },
    Methods: {
        createAccount: {
          method: "createAccount"
          arguments: [ owner: TAddress, salt: bigint ]
        }
        getAddress: {
          method: "getAddress"
          arguments: [ owner: TAddress, salt: bigint ]
        }
        accountImplementation: {
          method: "accountImplementation"
          arguments: [  ]
        }
    }
}



class SimpleAccountFactoryStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockChainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }



    $slots = []

}


interface ISimpleAccountFactoryTxCaller {
    createAccount (sender: TSender, owner: TAddress, salt: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface ISimpleAccountFactoryTxData {
    createAccount (sender: TSender, owner: TAddress, salt: bigint): Promise<TEth.TxLike>
}


type TEvents = TSimpleAccountFactoryTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
