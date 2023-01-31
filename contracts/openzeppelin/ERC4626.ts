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
export class ERC4626 extends ContractBase {
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

    // 0x38d52e0f
    async asset (): Promise<TAddress> {
        return this.$read('function asset() returns address');
    }

    // 0x70a08231
    async balanceOf (account: TAddress): Promise<bigint> {
        return this.$read('function balanceOf(address) returns uint256', account);
    }

    // 0x07a2d13a
    async convertToAssets (shares: bigint): Promise<bigint> {
        return this.$read('function convertToAssets(uint256) returns uint256', shares);
    }

    // 0xc6e6f592
    async convertToShares (assets: bigint): Promise<bigint> {
        return this.$read('function convertToShares(uint256) returns uint256', assets);
    }

    // 0x313ce567
    async decimals (): Promise<number> {
        return this.$read('function decimals() returns uint8');
    }

    // 0xa457c2d7
    async decreaseAllowance (sender: TSender, spender: TAddress, subtractedValue: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'decreaseAllowance'), sender, spender, subtractedValue);
    }

    // 0x6e553f65
    async deposit (sender: TSender, assets: bigint, receiver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'deposit'), sender, assets, receiver);
    }

    // 0x39509351
    async increaseAllowance (sender: TSender, spender: TAddress, addedValue: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'increaseAllowance'), sender, spender, addedValue);
    }

    // 0x402d267d
    async maxDeposit (input0: TAddress): Promise<bigint> {
        return this.$read('function maxDeposit(address) returns uint256', input0);
    }

    // 0xc63d75b6
    async maxMint (input0: TAddress): Promise<bigint> {
        return this.$read('function maxMint(address) returns uint256', input0);
    }

    // 0xd905777e
    async maxRedeem (owner: TAddress): Promise<bigint> {
        return this.$read('function maxRedeem(address) returns uint256', owner);
    }

    // 0xce96cb77
    async maxWithdraw (owner: TAddress): Promise<bigint> {
        return this.$read('function maxWithdraw(address) returns uint256', owner);
    }

    // 0x94bf804d
    async mint (sender: TSender, shares: bigint, receiver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'mint'), sender, shares, receiver);
    }

    // 0x06fdde03
    async name (): Promise<string> {
        return this.$read('function name() returns string');
    }

    // 0xef8b30f7
    async previewDeposit (assets: bigint): Promise<bigint> {
        return this.$read('function previewDeposit(uint256) returns uint256', assets);
    }

    // 0xb3d7f6b9
    async previewMint (shares: bigint): Promise<bigint> {
        return this.$read('function previewMint(uint256) returns uint256', shares);
    }

    // 0x4cdad506
    async previewRedeem (shares: bigint): Promise<bigint> {
        return this.$read('function previewRedeem(uint256) returns uint256', shares);
    }

    // 0x0a28a477
    async previewWithdraw (assets: bigint): Promise<bigint> {
        return this.$read('function previewWithdraw(uint256) returns uint256', assets);
    }

    // 0xba087652
    async redeem (sender: TSender, shares: bigint, receiver: TAddress, owner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'redeem'), sender, shares, receiver, owner);
    }

    // 0x95d89b41
    async symbol (): Promise<string> {
        return this.$read('function symbol() returns string');
    }

    // 0x01e1d114
    async totalAssets (): Promise<bigint> {
        return this.$read('function totalAssets() returns uint256');
    }

    // 0x18160ddd
    async totalSupply (): Promise<bigint> {
        return this.$read('function totalSupply() returns uint256');
    }

    // 0xa9059cbb
    async transfer (sender: TSender, to: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transfer'), sender, to, amount);
    }

    // 0x23b872dd
    async transferFrom (sender: TSender, from: TAddress, to: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferFrom'), sender, from, to, amount);
    }

    // 0xb460af94
    async withdraw (sender: TSender, assets: bigint, receiver: TAddress, owner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdraw'), sender, assets, receiver, owner);
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

    onDeposit (fn?: (event: TClientEventsStreamData<TLogDepositParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogDepositParameters>> {
        return this.$onLog('Deposit', fn);
    }

    onTransfer (fn?: (event: TClientEventsStreamData<TLogTransferParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogTransferParameters>> {
        return this.$onLog('Transfer', fn);
    }

    onWithdraw (fn?: (event: TClientEventsStreamData<TLogWithdrawParameters>) => void): ClientEventsStream<TClientEventsStreamData<TLogWithdrawParameters>> {
        return this.$onLog('Withdraw', fn);
    }

    extractLogsApproval (tx: TransactionReceipt): ITxLogItem<TLogApproval>[] {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApproval>[];
    }

    extractLogsDeposit (tx: TransactionReceipt): ITxLogItem<TLogDeposit>[] {
        let abi = this.$getAbiItem('event', 'Deposit');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDeposit>[];
    }

    extractLogsTransfer (tx: TransactionReceipt): ITxLogItem<TLogTransfer>[] {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogTransfer>[];
    }

    extractLogsWithdraw (tx: TransactionReceipt): ITxLogItem<TLogWithdraw>[] {
        let abi = this.$getAbiItem('event', 'Withdraw');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogWithdraw>[];
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

    async getPastLogsDeposit (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { caller?: TAddress,owner?: TAddress }
    }): Promise<ITxLogItem<TLogDeposit>[]> {
        let topic = '0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7';
        let abi = this.$getAbiItem('event', 'Deposit');
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

    async getPastLogsWithdraw (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { caller?: TAddress,receiver?: TAddress,owner?: TAddress }
    }): Promise<ITxLogItem<TLogWithdraw>[]> {
        let topic = '0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db';
        let abi = this.$getAbiItem('event', 'Withdraw');
        let filters = await this.$getPastLogsFilters(abi, {
            topic,
            ...options
        });
        let logs= await this.$getPastLogs(filters);
        return logs.map(log => this.$extractLog(log, abi)) as any;
    }

    abi: AbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"assets","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"caller","type":"address"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"assets","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"asset","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"name":"convertToAssets","outputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"name":"convertToShares","outputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"deposit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"maxDeposit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"maxMint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"maxRedeem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"maxWithdraw","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"name":"previewDeposit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"name":"previewMint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"name":"previewRedeem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"name":"previewWithdraw","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"name":"redeem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAssets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"name":"withdraw","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogApproval = {
        owner: TAddress, spender: TAddress, value: bigint
    };
    type TLogApprovalParameters = [ owner: TAddress, spender: TAddress, value: bigint ];
    type TLogDeposit = {
        caller: TAddress, owner: TAddress, assets: bigint, shares: bigint
    };
    type TLogDepositParameters = [ caller: TAddress, owner: TAddress, assets: bigint, shares: bigint ];
    type TLogTransfer = {
        from: TAddress, to: TAddress, value: bigint
    };
    type TLogTransferParameters = [ from: TAddress, to: TAddress, value: bigint ];
    type TLogWithdraw = {
        caller: TAddress, receiver: TAddress, owner: TAddress, assets: bigint, shares: bigint
    };
    type TLogWithdrawParameters = [ caller: TAddress, receiver: TAddress, owner: TAddress, assets: bigint, shares: bigint ];

interface IEvents {
  Approval: TLogApprovalParameters
  Deposit: TLogDepositParameters
  Transfer: TLogTransferParameters
  Withdraw: TLogWithdrawParameters
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

interface IMethodAsset {
  method: "asset"
  arguments: [  ]
}

interface IMethodBalanceOf {
  method: "balanceOf"
  arguments: [ account: TAddress ]
}

interface IMethodConvertToAssets {
  method: "convertToAssets"
  arguments: [ shares: bigint ]
}

interface IMethodConvertToShares {
  method: "convertToShares"
  arguments: [ assets: bigint ]
}

interface IMethodDecimals {
  method: "decimals"
  arguments: [  ]
}

interface IMethodDecreaseAllowance {
  method: "decreaseAllowance"
  arguments: [ spender: TAddress, subtractedValue: bigint ]
}

interface IMethodDeposit {
  method: "deposit"
  arguments: [ assets: bigint, receiver: TAddress ]
}

interface IMethodIncreaseAllowance {
  method: "increaseAllowance"
  arguments: [ spender: TAddress, addedValue: bigint ]
}

interface IMethodMaxDeposit {
  method: "maxDeposit"
  arguments: [ input0: TAddress ]
}

interface IMethodMaxMint {
  method: "maxMint"
  arguments: [ input0: TAddress ]
}

interface IMethodMaxRedeem {
  method: "maxRedeem"
  arguments: [ owner: TAddress ]
}

interface IMethodMaxWithdraw {
  method: "maxWithdraw"
  arguments: [ owner: TAddress ]
}

interface IMethodMint {
  method: "mint"
  arguments: [ shares: bigint, receiver: TAddress ]
}

interface IMethodName {
  method: "name"
  arguments: [  ]
}

interface IMethodPreviewDeposit {
  method: "previewDeposit"
  arguments: [ assets: bigint ]
}

interface IMethodPreviewMint {
  method: "previewMint"
  arguments: [ shares: bigint ]
}

interface IMethodPreviewRedeem {
  method: "previewRedeem"
  arguments: [ shares: bigint ]
}

interface IMethodPreviewWithdraw {
  method: "previewWithdraw"
  arguments: [ assets: bigint ]
}

interface IMethodRedeem {
  method: "redeem"
  arguments: [ shares: bigint, receiver: TAddress, owner: TAddress ]
}

interface IMethodSymbol {
  method: "symbol"
  arguments: [  ]
}

interface IMethodTotalAssets {
  method: "totalAssets"
  arguments: [  ]
}

interface IMethodTotalSupply {
  method: "totalSupply"
  arguments: [  ]
}

interface IMethodTransfer {
  method: "transfer"
  arguments: [ to: TAddress, amount: bigint ]
}

interface IMethodTransferFrom {
  method: "transferFrom"
  arguments: [ from: TAddress, to: TAddress, amount: bigint ]
}

interface IMethodWithdraw {
  method: "withdraw"
  arguments: [ assets: bigint, receiver: TAddress, owner: TAddress ]
}

interface IMethods {
  allowance: IMethodAllowance
  approve: IMethodApprove
  asset: IMethodAsset
  balanceOf: IMethodBalanceOf
  convertToAssets: IMethodConvertToAssets
  convertToShares: IMethodConvertToShares
  decimals: IMethodDecimals
  decreaseAllowance: IMethodDecreaseAllowance
  deposit: IMethodDeposit
  increaseAllowance: IMethodIncreaseAllowance
  maxDeposit: IMethodMaxDeposit
  maxMint: IMethodMaxMint
  maxRedeem: IMethodMaxRedeem
  maxWithdraw: IMethodMaxWithdraw
  mint: IMethodMint
  name: IMethodName
  previewDeposit: IMethodPreviewDeposit
  previewMint: IMethodPreviewMint
  previewRedeem: IMethodPreviewRedeem
  previewWithdraw: IMethodPreviewWithdraw
  redeem: IMethodRedeem
  symbol: IMethodSymbol
  totalAssets: IMethodTotalAssets
  totalSupply: IMethodTotalSupply
  transfer: IMethodTransfer
  transferFrom: IMethodTransferFrom
  withdraw: IMethodWithdraw
  '*': { method: string, arguments: any[] } 
}





