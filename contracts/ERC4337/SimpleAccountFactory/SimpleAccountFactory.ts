/**
 *  AUTO-Generated Class: 2023-06-07 23:30
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
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';

import type { TransactionReceipt, Transaction, EventLog, TransactionConfig } from 'web3-core';
import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { AbiItem } from 'web3-utils';
import type { BlockTransactionString } from 'web3-eth';


import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'



export class SimpleAccountFactory extends ContractBase {
    constructor(
        public address: TAddress = '',
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
        tx: Transaction
        block: BlockTransactionString
        calldata: IMethods[TMethod]
    }> {
        options ??= {};
        options.filter ??= {};
        options.filter.method = <any> method;
        return <any> this.$onTransaction(options);
    }

    onLog (event: keyof IEvents, cb?: (event: TClientEventsStreamData) => void): ClientEventsStream<TClientEventsStreamData> {
        return this.$onLog(event, cb);
    }







    abi: AbiItem[] = [{"inputs":[{"internalType":"contract IEntryPoint","name":"_entryPoint","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"accountImplementation","outputs":[{"internalType":"contract SimpleAccount","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"salt","type":"uint256"}],"name":"createAccount","outputs":[{"internalType":"contract SimpleAccount","name":"ret","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"salt","type":"uint256"}],"name":"getAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

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

    async verifyingSigner(): Promise<TAddress> {
        return this.$storage.get(['verifyingSigner', ]);
    }

    async senderNonce(key: TAddress): Promise<bigint> {
        return this.$storage.get(['senderNonce', key]);
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
        "name": "verifyingSigner",
        "size": 160,
        "type": "address"
    },
    {
        "slot": 3,
        "position": 0,
        "name": "senderNonce",
        "size": null,
        "type": "mapping(address => uint256)"
    }
]

}



interface ISimpleAccountFactoryTxCaller {
    createAccount (sender: TSender, owner: TAddress, salt: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface ISimpleAccountFactoryTxData {
    createAccount (sender: TSender, owner: TAddress, salt: bigint): Promise<TransactionConfig>
}


