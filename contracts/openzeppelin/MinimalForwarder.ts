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



export class MinimalForwarder extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0x47153f82
    async execute (sender: TSender, req: { from: TAddress, to: TAddress, value: bigint, gas: bigint, nonce: bigint, data: TBufferLike }, signature: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'execute'), sender, req, signature);
    }

    // 0x2d0335ab
    async getNonce (from: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getNonce'), from);
    }

    // 0xbf5d3bdb
    async verify (req: { from: TAddress, to: TAddress, value: bigint, gas: bigint, nonce: bigint, data: TBufferLike }, signature: TBufferLike): Promise<boolean> {
        return this.$read(this.$getAbiItem('function', 'verify'), req, signature);
    }

    $call () {
        return super.$call() as IMinimalForwarderTxCaller;;
    }

    $data (): IMinimalForwarderTxData {
        return super.$data() as IMinimalForwarderTxData;
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







    abi: AbiItem[] = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"gas","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct MinimalForwarder.ForwardRequest","name":"req","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"execute","outputs":[{"internalType":"bool","name":"","type":"bool"},{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"}],"name":"getNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"gas","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct MinimalForwarder.ForwardRequest","name":"req","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"verify","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}



interface IEvents {
  '*': any[] 
}



interface IMethodExecute {
  method: "execute"
  arguments: [ req: { from: TAddress, to: TAddress, value: bigint, gas: bigint, nonce: bigint, data: TBufferLike }, signature: TBufferLike ]
}

interface IMethodGetNonce {
  method: "getNonce"
  arguments: [ from: TAddress ]
}

interface IMethodVerify {
  method: "verify"
  arguments: [ req: { from: TAddress, to: TAddress, value: bigint, gas: bigint, nonce: bigint, data: TBufferLike }, signature: TBufferLike ]
}

interface IMethods {
  execute: IMethodExecute
  getNonce: IMethodGetNonce
  verify: IMethodVerify
  '*': { method: string, arguments: any[] } 
}






interface IMinimalForwarderTxCaller {
    execute (sender: TSender, req: { from: TAddress, to: TAddress, value: bigint, gas: bigint, nonce: bigint, data: TBufferLike }, signature: TBufferLike): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IMinimalForwarderTxData {
    execute (sender: TSender, req: { from: TAddress, to: TAddress, value: bigint, gas: bigint, nonce: bigint, data: TBufferLike }, signature: TBufferLike): Promise<TransactionConfig>
}


