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
export class IERC1363 extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0xdd62ed3e
    async allowance (owner: TAddress, spender: TAddress): Promise<bigint> {
        return this.$read('function allowance(address, address) returns uint256', owner, spender);
    }

    // 0x095ea7b3
    async approve (sender: TSender, spender: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approve'), sender, spender, amount);
    }

    // 0x3177029f
    async approveAndCall (sender: TSender, spender: TAddress, value: bigint): Promise<TxWriter>
    // 0xcae9ca51
    async approveAndCall (sender: TSender, spender: TAddress, value: bigint, data: TBufferLike): Promise<TxWriter>
    async approveAndCall (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function approveAndCall(address, uint256) returns bool', 'function approveAndCall(address, uint256, bytes) returns bool' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0x70a08231
    async balanceOf (account: TAddress): Promise<bigint> {
        return this.$read('function balanceOf(address) returns uint256', account);
    }

    // 0x01ffc9a7
    async supportsInterface (interfaceId: TBufferLike): Promise<boolean> {
        return this.$read('function supportsInterface(bytes4) returns bool', interfaceId);
    }

    // 0x18160ddd
    async totalSupply (): Promise<bigint> {
        return this.$read('function totalSupply() returns uint256');
    }

    // 0xa9059cbb
    async transfer (sender: TSender, to: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transfer'), sender, to, amount);
    }

    // 0x1296ee62
    async transferAndCall (sender: TSender, to: TAddress, value: bigint): Promise<TxWriter>
    // 0x4000aea0
    async transferAndCall (sender: TSender, to: TAddress, value: bigint, data: TBufferLike): Promise<TxWriter>
    async transferAndCall (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function transferAndCall(address, uint256) returns bool', 'function transferAndCall(address, uint256, bytes) returns bool' ], args);
        return this.$write(abi, sender, ...args);
    }

    // 0x23b872dd
    async transferFrom (sender: TSender, from: TAddress, to: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferFrom'), sender, from, to, amount);
    }

    // 0xc1d34b89
    async transferFromAndCall (sender: TSender, from: TAddress, to: TAddress, value: bigint, data: TBufferLike): Promise<TxWriter>
    // 0xd8fbe994
    async transferFromAndCall (sender: TSender, from: TAddress, to: TAddress, value: bigint): Promise<TxWriter>
    async transferFromAndCall (sender: TSender, ...args): Promise<TxWriter> {
        let abi = this.$getAbiItemOverload([ 'function transferFromAndCall(address, address, uint256, bytes) returns bool', 'function transferFromAndCall(address, address, uint256) returns bool' ], args);
        return this.$write(abi, sender, ...args);
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

    onApproval (fn?: (event: TClientEventsStreamData<TLogApprovalParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogApprovalParameters>> {
        return this.$onLog('Approval', fn);
    }

    onTransfer (fn?: (event: TClientEventsStreamData<TLogTransferParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogTransferParameters>> {
        return this.$onLog('Transfer', fn);
    }

    extractLogsApproval (tx: TransactionReceipt): ITxLogItem<TLogApproval>[] {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApproval>[];
    }

    extractLogsTransfer (tx: TransactionReceipt): ITxLogItem<TLogTransfer>[] {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogTransfer>[];
    }

    async getPastLogsApproval (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress,spender?: TAddress }
    }): Promise<ITxLogItem<TLogApproval>[]> {
        let topic = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925';
        let abi = this.$getAbiItem('event', 'Approval');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    async getPastLogsTransfer (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { from?: TAddress,to?: TAddress }
    }): Promise<ITxLogItem<TLogTransfer>[]> {
        let topic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
        let abi = this.$getAbiItem('event', 'Transfer');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi: AbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approveAndCall","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferAndCall","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"transferAndCall","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"transferFromAndCall","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFromAndCall","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogApproval = {
        owner: TAddress, spender: TAddress, value: bigint
    };
    type TLogApprovalParameters = [ owner: TAddress, spender: TAddress, value: bigint ];
    type TLogTransfer = {
        from: TAddress, to: TAddress, value: bigint
    };
    type TLogTransferParameters = [ from: TAddress, to: TAddress, value: bigint ];

interface IEvents {
  Approval: TLogApprovalParameters
  Transfer: TLogTransferParameters
  '*': any[] 
}



interface IMethodAllowance {
  method: "allowance"
  arguments: [ owner: TAddress, spender: TAddress ]
}

interface IMethodApprove {
  method: "approve"
  arguments: [ spender: TAddress, amount: bigint ]
}

interface IMethodApproveAndCall {
  method: "approveAndCall"
  arguments: [ spender: TAddress, value: bigint ] | [ spender: TAddress, value: bigint, data: TBufferLike ]
}

interface IMethodBalanceOf {
  method: "balanceOf"
  arguments: [ account: TAddress ]
}

interface IMethodSupportsInterface {
  method: "supportsInterface"
  arguments: [ interfaceId: TBufferLike ]
}

interface IMethodTotalSupply {
  method: "totalSupply"
  arguments: [  ]
}

interface IMethodTransfer {
  method: "transfer"
  arguments: [ to: TAddress, amount: bigint ]
}

interface IMethodTransferAndCall {
  method: "transferAndCall"
  arguments: [ to: TAddress, value: bigint ] | [ to: TAddress, value: bigint, data: TBufferLike ]
}

interface IMethodTransferFrom {
  method: "transferFrom"
  arguments: [ from: TAddress, to: TAddress, amount: bigint ]
}

interface IMethodTransferFromAndCall {
  method: "transferFromAndCall"
  arguments: [ from: TAddress, to: TAddress, value: bigint, data: TBufferLike ] | [ from: TAddress, to: TAddress, value: bigint ]
}

interface IMethods {
  allowance: IMethodAllowance
  approve: IMethodApprove
  approveAndCall: IMethodApproveAndCall
  balanceOf: IMethodBalanceOf
  supportsInterface: IMethodSupportsInterface
  totalSupply: IMethodTotalSupply
  transfer: IMethodTransfer
  transferAndCall: IMethodTransferAndCall
  transferFrom: IMethodTransferFrom
  transferFromAndCall: IMethodTransferFromAndCall
  '*': { method: string, arguments: any[] } 
}





