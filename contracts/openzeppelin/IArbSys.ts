/**
 *  AUTO-Generated Class: 2023-06-15 23:19
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



export class IArbSys extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0xa3b1b31d
    async arbBlockNumber (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'arbBlockNumber'));
    }

    // 0xd127f54a
    async arbChainID (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'arbChainID'));
    }

    // 0x051038f2
    async arbOSVersion (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'arbOSVersion'));
    }

    // 0xa169625f
    async getStorageAt (account: TAddress, index: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getStorageAt'), account, index);
    }

    // 0xa94597ff
    async getStorageGasAvailable (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getStorageGasAvailable'));
    }

    // 0x23ca0cd2
    async getTransactionCount (account: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getTransactionCount'), account);
    }

    // 0x08bd624c
    async isTopLevelCall (): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'isTopLevelCall'));
    }

    // 0x4dbbd506
    async mapL1SenderContractAddressToL2Alias (_sender: TAddress, dest: TAddress): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'mapL1SenderContractAddressToL2Alias'), _sender, dest);
    }

    // 0xd74523b3
    async myCallersAddressWithoutAliasing (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'myCallersAddressWithoutAliasing'));
    }

    // 0x928c169a
    async sendTxToL1 (sender: TSender, destination: TAddress, calldataForL1: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'sendTxToL1'), sender, destination, calldataForL1);
    }

    // 0x175a260b
    async wasMyCallersAddressAliased (): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'wasMyCallersAddressAliased'));
    }

    // 0x25e16063
    async withdrawEth (sender: TSender, destination: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdrawEth'), sender, destination);
    }

    $call () {
        return super.$call() as IIArbSysTxCaller;;
    }

    $data (): IIArbSysTxData {
        return super.$data() as IIArbSysTxData;
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

    onL2ToL1Transaction (fn?: (event: TClientEventsStreamData<TLogL2ToL1TransactionParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogL2ToL1TransactionParameters>> {
        return this.$onLog('L2ToL1Transaction', fn);
    }

    extractLogsL2ToL1Transaction (tx: TransactionReceipt): ITxLogItem<TLogL2ToL1Transaction>[] {
        let abi = this.$getAbiItem('event', 'L2ToL1Transaction');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogL2ToL1Transaction>[];
    }

    async getPastLogsL2ToL1Transaction (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: {  }
    }): Promise<ITxLogItem<TLogL2ToL1Transaction>[]> {
        return await this.$getPastLogsParsed('L2ToL1Transaction', options) as any;
    }

    abi: AbiItem[] = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"caller","type":"address"},{"indexed":true,"internalType":"address","name":"destination","type":"address"},{"indexed":true,"internalType":"uint256","name":"uniqueId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"batchNumber","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"indexInBatch","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"arbBlockNum","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethBlockNum","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"callvalue","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"L2ToL1Transaction","type":"event"},{"inputs":[],"name":"arbBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"arbChainID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"arbOSVersion","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getStorageAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStorageGasAvailable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getTransactionCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isTopLevelCall","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"dest","type":"address"}],"name":"mapL1SenderContractAddressToL2Alias","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"myCallersAddressWithoutAliasing","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"bytes","name":"calldataForL1","type":"bytes"}],"name":"sendTxToL1","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"wasMyCallersAddressAliased","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"destination","type":"address"}],"name":"withdrawEth","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogL2ToL1Transaction = {
        caller: TAddress, destination: TAddress, uniqueId: bigint, batchNumber: bigint, indexInBatch: bigint, arbBlockNum: bigint, ethBlockNum: bigint, timestamp: bigint, callvalue: bigint, data: TBufferLike
    };
    type TLogL2ToL1TransactionParameters = [ caller: TAddress, destination: TAddress, uniqueId: bigint, batchNumber: bigint, indexInBatch: bigint, arbBlockNum: bigint, ethBlockNum: bigint, timestamp: bigint, callvalue: bigint, data: TBufferLike ];

interface IEvents {
  L2ToL1Transaction: TLogL2ToL1TransactionParameters
  '*': any[] 
}



interface IMethodArbBlockNumber {
  method: "arbBlockNumber"
  arguments: [  ]
}

interface IMethodArbChainID {
  method: "arbChainID"
  arguments: [  ]
}

interface IMethodArbOSVersion {
  method: "arbOSVersion"
  arguments: [  ]
}

interface IMethodGetStorageAt {
  method: "getStorageAt"
  arguments: [ account: TAddress, index: bigint ]
}

interface IMethodGetStorageGasAvailable {
  method: "getStorageGasAvailable"
  arguments: [  ]
}

interface IMethodGetTransactionCount {
  method: "getTransactionCount"
  arguments: [ account: TAddress ]
}

interface IMethodIsTopLevelCall {
  method: "isTopLevelCall"
  arguments: [  ]
}

interface IMethodMapL1SenderContractAddressToL2Alias {
  method: "mapL1SenderContractAddressToL2Alias"
  arguments: [ _sender: TAddress, dest: TAddress ]
}

interface IMethodMyCallersAddressWithoutAliasing {
  method: "myCallersAddressWithoutAliasing"
  arguments: [  ]
}

interface IMethodSendTxToL1 {
  method: "sendTxToL1"
  arguments: [ destination: TAddress, calldataForL1: TBufferLike ]
}

interface IMethodWasMyCallersAddressAliased {
  method: "wasMyCallersAddressAliased"
  arguments: [  ]
}

interface IMethodWithdrawEth {
  method: "withdrawEth"
  arguments: [ destination: TAddress ]
}

interface IMethods {
  arbBlockNumber: IMethodArbBlockNumber
  arbChainID: IMethodArbChainID
  arbOSVersion: IMethodArbOSVersion
  getStorageAt: IMethodGetStorageAt
  getStorageGasAvailable: IMethodGetStorageGasAvailable
  getTransactionCount: IMethodGetTransactionCount
  isTopLevelCall: IMethodIsTopLevelCall
  mapL1SenderContractAddressToL2Alias: IMethodMapL1SenderContractAddressToL2Alias
  myCallersAddressWithoutAliasing: IMethodMyCallersAddressWithoutAliasing
  sendTxToL1: IMethodSendTxToL1
  wasMyCallersAddressAliased: IMethodWasMyCallersAddressAliased
  withdrawEth: IMethodWithdrawEth
  '*': { method: string, arguments: any[] } 
}






interface IIArbSysTxCaller {
    sendTxToL1 (sender: TSender, destination: TAddress, calldataForL1: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    withdrawEth (sender: TSender, destination: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIArbSysTxData {
    sendTxToL1 (sender: TSender, destination: TAddress, calldataForL1: TBufferLike): Promise<TransactionConfig>
    withdrawEth (sender: TSender, destination: TAddress): Promise<TransactionConfig>
}


