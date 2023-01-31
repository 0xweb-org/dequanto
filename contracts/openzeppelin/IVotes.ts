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
export class IVotes extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0x5c19a95c
    async delegate (sender: TSender, delegatee: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'delegate'), sender, delegatee);
    }

    // 0xc3cda520
    async delegateBySig (sender: TSender, delegatee: TAddress, nonce: bigint, expiry: bigint, v: number, r: TBufferLike, s: TBufferLike): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'delegateBySig'), sender, delegatee, nonce, expiry, v, r, s);
    }

    // 0x587cde1e
    async delegates (account: TAddress): Promise<TAddress> {
        return this.$read('function delegates(address) returns address', account);
    }

    // 0x8e539e8c
    async getPastTotalSupply (blockNumber: bigint): Promise<bigint> {
        return this.$read('function getPastTotalSupply(uint256) returns uint256', blockNumber);
    }

    // 0x3a46b1a8
    async getPastVotes (account: TAddress, blockNumber: bigint): Promise<bigint> {
        return this.$read('function getPastVotes(address, uint256) returns uint256', account, blockNumber);
    }

    // 0x9ab24eb0
    async getVotes (account: TAddress): Promise<bigint> {
        return this.$read('function getVotes(address) returns uint256', account);
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

    onDelegateChanged (fn?: (event: TClientEventsStreamData<TLogDelegateChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDelegateChangedParameters>> {
        return this.$onLog('DelegateChanged', fn);
    }

    onDelegateVotesChanged (fn?: (event: TClientEventsStreamData<TLogDelegateVotesChangedParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDelegateVotesChangedParameters>> {
        return this.$onLog('DelegateVotesChanged', fn);
    }

    extractLogsDelegateChanged (tx: TransactionReceipt): ITxLogItem<TLogDelegateChanged>[] {
        let abi = this.$getAbiItem('event', 'DelegateChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDelegateChanged>[];
    }

    extractLogsDelegateVotesChanged (tx: TransactionReceipt): ITxLogItem<TLogDelegateVotesChanged>[] {
        let abi = this.$getAbiItem('event', 'DelegateVotesChanged');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDelegateVotesChanged>[];
    }

    async getPastLogsDelegateChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { delegator?: TAddress,fromDelegate?: TAddress,toDelegate?: TAddress }
    }): Promise<ITxLogItem<TLogDelegateChanged>[]> {
        let topic = '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f';
        let abi = this.$getAbiItem('event', 'DelegateChanged');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsDelegateVotesChanged (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { delegate?: TAddress }
    }): Promise<ITxLogItem<TLogDelegateVotesChanged>[]> {
        let topic = '0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724';
        let abi = this.$getAbiItem('event', 'DelegateVotesChanged');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi: AbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPastTotalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPastVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogDelegateChanged = {
        delegator: TAddress, fromDelegate: TAddress, toDelegate: TAddress
    };
    type TLogDelegateChangedParameters = [ delegator: TAddress, fromDelegate: TAddress, toDelegate: TAddress ];
    type TLogDelegateVotesChanged = {
        delegate: TAddress, previousBalance: bigint, newBalance: bigint
    };
    type TLogDelegateVotesChangedParameters = [ delegate: TAddress, previousBalance: bigint, newBalance: bigint ];

interface IEvents {
  DelegateChanged: TLogDelegateChangedParameters
  DelegateVotesChanged: TLogDelegateVotesChangedParameters
  '*': any[] 
}



interface IMethodDelegate {
  method: "delegate"
  arguments: [ delegatee: TAddress ]
}

interface IMethodDelegateBySig {
  method: "delegateBySig"
  arguments: [ delegatee: TAddress, nonce: bigint, expiry: bigint, v: number, r: TBufferLike, s: TBufferLike ]
}

interface IMethodDelegates {
  method: "delegates"
  arguments: [ account: TAddress ]
}

interface IMethodGetPastTotalSupply {
  method: "getPastTotalSupply"
  arguments: [ blockNumber: bigint ]
}

interface IMethodGetPastVotes {
  method: "getPastVotes"
  arguments: [ account: TAddress, blockNumber: bigint ]
}

interface IMethodGetVotes {
  method: "getVotes"
  arguments: [ account: TAddress ]
}

interface IMethods {
  delegate: IMethodDelegate
  delegateBySig: IMethodDelegateBySig
  delegates: IMethodDelegates
  getPastTotalSupply: IMethodGetPastTotalSupply
  getPastVotes: IMethodGetPastVotes
  getVotes: IMethodGetVotes
  '*': { method: string, arguments: any[] } 
}





