/**
 *  AUTO-Generated Class: 2023-01-31 13:27
 *  Implementation: https://etherscan.io/address/undefined#code
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { TAccount } from '@dequanto/models/TAccount';
import { TBufferLike } from '@dequanto/models/TBufferLike';
import { ClientEventsStream, TClientEventsStreamData } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { ContractStorageReaderBase } from '@dequanto/contracts/ContractStorageReaderBase';
import { type AbiItem } from 'web3-utils';
import type { BlockTransactionString } from 'web3-eth';
import { TransactionReceipt, Transaction, EventLog } from 'web3-core';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';



import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'
export class ProxyAdmin extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0x7eff275e
    async changeProxyAdmin (sender: TSender, proxy: TAddress, newAdmin: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'changeProxyAdmin'), sender, proxy, newAdmin);
    }

    // 0xf3b7dead
    async getProxyAdmin (proxy: TAddress): Promise<TAddress> {
        return this.$read('function getProxyAdmin(address) returns address', proxy);
    }

    // 0x204e1c7a
    async getProxyImplementation (proxy: TAddress): Promise<TAddress> {
        return this.$read('function getProxyImplementation(address) returns address', proxy);
    }

    // 0x8da5cb5b
    async owner (): Promise<TAddress> {
        return this.$read('function owner() returns address');
    }

    // 0x715018a6
    async renounceOwnership (sender: TSender, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'renounceOwnership'), sender);
    }

    // 0xf2fde38b
    async transferOwnership (sender: TSender, newOwner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferOwnership'), sender, newOwner);
    }

    // 0x99a88ec4
    async upgrade (sender: TSender, proxy: TAddress, implementation: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'upgrade'), sender, proxy, implementation);
    }

    // 0x9623609d
    async upgradeAndCall (sender: TSender, proxy: TAddress, implementation: TAddress, data: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'upgradeAndCall'), sender, proxy, implementation, data);
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

    onOwnershipTransferred (fn?: (event: TClientEventsStreamData<TLogOwnershipTransferredParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogOwnershipTransferredParameters>> {
        return this.$onLog('OwnershipTransferred', fn);
    }

    extractLogsOwnershipTransferred (tx: TransactionReceipt): ITxLogItem<TLogOwnershipTransferred>[] {
        let abi = this.$getAbiItem('event', 'OwnershipTransferred');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogOwnershipTransferred>[];
    }

    async getPastLogsOwnershipTransferred (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { previousOwner?: TAddress,newOwner?: TAddress }
    }): Promise<ITxLogItem<TLogOwnershipTransferred>[]> {
        let topic = '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0';
        let abi = this.$getAbiItem('event', 'OwnershipTransferred');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi: AbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"contract TransparentUpgradeableProxy","name":"proxy","type":"address"},{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeProxyAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract TransparentUpgradeableProxy","name":"proxy","type":"address"}],"name":"getProxyAdmin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract TransparentUpgradeableProxy","name":"proxy","type":"address"}],"name":"getProxyImplementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract TransparentUpgradeableProxy","name":"proxy","type":"address"},{"internalType":"address","name":"implementation","type":"address"}],"name":"upgrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract TransparentUpgradeableProxy","name":"proxy","type":"address"},{"internalType":"address","name":"implementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeAndCall","outputs":[],"stateMutability":"payable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogOwnershipTransferred = {
        previousOwner: TAddress, newOwner: TAddress
    };
    type TLogOwnershipTransferredParameters = [ previousOwner: TAddress, newOwner: TAddress ];

interface IEvents {
  OwnershipTransferred: TLogOwnershipTransferredParameters
  '*': any[] 
}



interface IMethodChangeProxyAdmin {
  method: "changeProxyAdmin"
  arguments: [ proxy: TAddress, newAdmin: TAddress ]
}

interface IMethodGetProxyAdmin {
  method: "getProxyAdmin"
  arguments: [ proxy: TAddress ]
}

interface IMethodGetProxyImplementation {
  method: "getProxyImplementation"
  arguments: [ proxy: TAddress ]
}

interface IMethodOwner {
  method: "owner"
  arguments: [  ]
}

interface IMethodRenounceOwnership {
  method: "renounceOwnership"
  arguments: [  ]
}

interface IMethodTransferOwnership {
  method: "transferOwnership"
  arguments: [ newOwner: TAddress ]
}

interface IMethodUpgrade {
  method: "upgrade"
  arguments: [ proxy: TAddress, implementation: TAddress ]
}

interface IMethodUpgradeAndCall {
  method: "upgradeAndCall"
  arguments: [ proxy: TAddress, implementation: TAddress, data: TBufferLike ]
}

interface IMethods {
  changeProxyAdmin: IMethodChangeProxyAdmin
  getProxyAdmin: IMethodGetProxyAdmin
  getProxyImplementation: IMethodGetProxyImplementation
  owner: IMethodOwner
  renounceOwnership: IMethodRenounceOwnership
  transferOwnership: IMethodTransferOwnership
  upgrade: IMethodUpgrade
  upgradeAndCall: IMethodUpgradeAndCall
  '*': { method: string, arguments: any[] } 
}





