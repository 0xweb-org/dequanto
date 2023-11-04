/**
 *  AUTO-Generated Class: 2023-10-05 18:18
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


import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class SimpleAccountFactory extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0x11464fbe
    async accountImplementation (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'accountImplementation'));
    }

    // 0x5fbfb9cf
    async createAccount (sender: TSender, owner: TAddress, salt: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'createAccount'), sender, owner, salt);
    }

    // 0x8cb84e18
    async getAddress (owner: TAddress, salt: bigint): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'getAddress'), owner, salt);
    }

    $call () {
        return super.$call() as ISimpleAccountFactoryTxCaller;;
    }

    $data (): ISimpleAccountFactoryTxData {
        return super.$data() as ISimpleAccountFactoryTxData;
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







    abi: TAbiItem[] = [{"inputs":[{"internalType":"contract IEntryPoint","name":"_entryPoint","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"accountImplementation","outputs":[{"internalType":"contract SimpleAccount","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"salt","type":"uint256"}],"name":"createAccount","outputs":[{"internalType":"contract SimpleAccount","name":"ret","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"salt","type":"uint256"}],"name":"getAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

    storage = new SimpleAccountFactoryStorageReader(this.address, this.client, this.explorer);
}

type TSender = TAccount & {
    value?: string | number | bigint
}



interface IEvents {
  '*': any[]
}



interface IMethodAccountImplementation {
  method: "accountImplementation"
  arguments: [  ]
}

interface IMethodCreateAccount {
  method: "createAccount"
  arguments: [ owner: TAddress, salt: bigint ]
}

interface IMethodGetAddress {
  method: "getAddress"
  arguments: [ owner: TAddress, salt: bigint ]
}

interface IMethods {
  accountImplementation: IMethodAccountImplementation
  createAccount: IMethodCreateAccount
  getAddress: IMethodGetAddress
  '*': { method: string, arguments: any[] }
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

    async _owner(): Promise<TAddress> {
        return this.$storage.get(['_owner', ]);
    }

    async entryPoint(): Promise<TAddress> {
        return this.$storage.get(['entryPoint', ]);
    }

    async _balances(key: TAddress): Promise<bigint> {
        return this.$storage.get(['_balances', key]);
    }

    async _allowances(key: TAddress): Promise<Record<TAddress, bigint>> {
        return this.$storage.get(['_allowances', key]);
    }

    async _totalSupply(): Promise<bigint> {
        return this.$storage.get(['_totalSupply', ]);
    }

    async _name(): Promise<string> {
        return this.$storage.get(['_name', ]);
    }

    async _symbol(): Promise<string> {
        return this.$storage.get(['_symbol', ]);
    }

    async theFactory(): Promise<TAddress> {
        return this.$storage.get(['theFactory', ]);
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
        "name": "entryPoint",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 2,
        "position": 0,
        "name": "_balances",
        "size": null,
        "type": "mapping(address => uint256)"
    },
    {
        "slot": 3,
        "position": 0,
        "name": "_allowances",
        "size": null,
        "type": "mapping(address => mapping(address => uint256))"
    },
    {
        "slot": 4,
        "position": 0,
        "name": "_totalSupply",
        "size": 256,
        "type": "uint256"
    },
    {
        "slot": 5,
        "position": 0,
        "name": "_name",
        "size": null,
        "type": "string"
    },
    {
        "slot": 6,
        "position": 0,
        "name": "_symbol",
        "size": null,
        "type": "string"
    },
    {
        "slot": 7,
        "position": 0,
        "name": "theFactory",
        "size": 160,
        "type": "address"
    }
]

}



interface ISimpleAccountFactoryTxCaller {
    createAccount (sender: TSender, owner: TAddress, salt: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface ISimpleAccountFactoryTxData {
    createAccount (sender: TSender, owner: TAddress, salt: bigint): Promise<TEth.TxLike>
}


