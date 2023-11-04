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



export class IERC4626 extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)
    }

    // 0xdd62ed3e
    async allowance (owner: TAddress, spender: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'allowance'), owner, spender);
    }

    // 0x095ea7b3
    async approve (sender: TSender, spender: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approve'), sender, spender, amount);
    }

    // 0x38d52e0f
    async asset (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'asset'));
    }

    // 0x70a08231
    async balanceOf (account: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'balanceOf'), account);
    }

    // 0x07a2d13a
    async convertToAssets (shares: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'convertToAssets'), shares);
    }

    // 0xc6e6f592
    async convertToShares (assets: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'convertToShares'), assets);
    }

    // 0x313ce567
    async decimals (): Promise<number> {
        return this.$read(this.$getAbiItem('function', 'decimals'));
    }

    // 0x6e553f65
    async deposit (sender: TSender, assets: bigint, receiver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'deposit'), sender, assets, receiver);
    }

    // 0x402d267d
    async maxDeposit (receiver: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'maxDeposit'), receiver);
    }

    // 0xc63d75b6
    async maxMint (receiver: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'maxMint'), receiver);
    }

    // 0xd905777e
    async maxRedeem (owner: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'maxRedeem'), owner);
    }

    // 0xce96cb77
    async maxWithdraw (owner: TAddress): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'maxWithdraw'), owner);
    }

    // 0x94bf804d
    async mint (sender: TSender, shares: bigint, receiver: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'mint'), sender, shares, receiver);
    }

    // 0x06fdde03
    async name (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'name'));
    }

    // 0xef8b30f7
    async previewDeposit (assets: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'previewDeposit'), assets);
    }

    // 0xb3d7f6b9
    async previewMint (shares: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'previewMint'), shares);
    }

    // 0x4cdad506
    async previewRedeem (shares: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'previewRedeem'), shares);
    }

    // 0x0a28a477
    async previewWithdraw (assets: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'previewWithdraw'), assets);
    }

    // 0xba087652
    async redeem (sender: TSender, shares: bigint, receiver: TAddress, owner: TAddress): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'redeem'), sender, shares, receiver, owner);
    }

    // 0x95d89b41
    async symbol (): Promise<string> {
        return this.$read(this.$getAbiItem('function', 'symbol'));
    }

    // 0x01e1d114
    async totalAssets (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'totalAssets'));
    }

    // 0x18160ddd
    async totalSupply (): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'totalSupply'));
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

    $call () {
        return super.$call() as IIERC4626TxCaller;;
    }

    $data (): IIERC4626TxData {
        return super.$data() as IIERC4626TxData;
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

    extractLogsApproval (tx: TEth.TxReceipt): ITxLogItem<TLogApproval>[] {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogApproval>[];
    }

    extractLogsDeposit (tx: TEth.TxReceipt): ITxLogItem<TLogDeposit>[] {
        let abi = this.$getAbiItem('event', 'Deposit');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogDeposit>[];
    }

    extractLogsTransfer (tx: TEth.TxReceipt): ITxLogItem<TLogTransfer>[] {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogTransfer>[];
    }

    extractLogsWithdraw (tx: TEth.TxReceipt): ITxLogItem<TLogWithdraw>[] {
        let abi = this.$getAbiItem('event', 'Withdraw');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TLogWithdraw>[];
    }

    async getPastLogsApproval (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress,spender?: TAddress }
    }): Promise<ITxLogItem<TLogApproval>[]> {
        return await this.$getPastLogsParsed('Approval', options) as any;
    }

    async getPastLogsDeposit (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress,owner?: TAddress }
    }): Promise<ITxLogItem<TLogDeposit>[]> {
        return await this.$getPastLogsParsed('Deposit', options) as any;
    }

    async getPastLogsTransfer (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { from?: TAddress,to?: TAddress }
    }): Promise<ITxLogItem<TLogTransfer>[]> {
        return await this.$getPastLogsParsed('Transfer', options) as any;
    }

    async getPastLogsWithdraw (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress,receiver?: TAddress,owner?: TAddress }
    }): Promise<ITxLogItem<TLogWithdraw>[]> {
        return await this.$getPastLogsParsed('Withdraw', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"assets","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"assets","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"asset","outputs":[{"internalType":"address","name":"assetTokenAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"name":"convertToAssets","outputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"name":"convertToShares","outputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"deposit","outputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"maxDeposit","outputs":[{"internalType":"uint256","name":"maxAssets","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"maxMint","outputs":[{"internalType":"uint256","name":"maxShares","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"maxRedeem","outputs":[{"internalType":"uint256","name":"maxShares","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"maxWithdraw","outputs":[{"internalType":"uint256","name":"maxAssets","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"name":"previewDeposit","outputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"name":"previewMint","outputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"name":"previewRedeem","outputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"name":"previewWithdraw","outputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"name":"redeem","outputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAssets","outputs":[{"internalType":"uint256","name":"totalManagedAssets","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"name":"withdraw","outputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]


}

type TSender = TAccount & {
    value?: string | number | bigint
}

    type TLogApproval = {
        owner: TAddress, spender: TAddress, value: bigint
    };
    type TLogApprovalParameters = [ owner: TAddress, spender: TAddress, value: bigint ];
    type TLogDeposit = {
        _sender: TAddress, owner: TAddress, assets: bigint, shares: bigint
    };
    type TLogDepositParameters = [ _sender: TAddress, owner: TAddress, assets: bigint, shares: bigint ];
    type TLogTransfer = {
        from: TAddress, to: TAddress, value: bigint
    };
    type TLogTransferParameters = [ from: TAddress, to: TAddress, value: bigint ];
    type TLogWithdraw = {
        _sender: TAddress, receiver: TAddress, owner: TAddress, assets: bigint, shares: bigint
    };
    type TLogWithdrawParameters = [ _sender: TAddress, receiver: TAddress, owner: TAddress, assets: bigint, shares: bigint ];

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

interface IMethodDeposit {
  method: "deposit"
  arguments: [ assets: bigint, receiver: TAddress ]
}

interface IMethodMaxDeposit {
  method: "maxDeposit"
  arguments: [ receiver: TAddress ]
}

interface IMethodMaxMint {
  method: "maxMint"
  arguments: [ receiver: TAddress ]
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
  deposit: IMethodDeposit
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






interface IIERC4626TxCaller {
    approve (sender: TSender, spender: TAddress, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    deposit (sender: TSender, assets: bigint, receiver: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    mint (sender: TSender, shares: bigint, receiver: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    redeem (sender: TSender, shares: bigint, receiver: TAddress, owner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transfer (sender: TSender, to: TAddress, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    transferFrom (sender: TSender, from: TAddress, to: TAddress, amount: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    withdraw (sender: TSender, assets: bigint, receiver: TAddress, owner: TAddress): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IIERC4626TxData {
    approve (sender: TSender, spender: TAddress, amount: bigint): Promise<TEth.TxLike>
    deposit (sender: TSender, assets: bigint, receiver: TAddress): Promise<TEth.TxLike>
    mint (sender: TSender, shares: bigint, receiver: TAddress): Promise<TEth.TxLike>
    redeem (sender: TSender, shares: bigint, receiver: TAddress, owner: TAddress): Promise<TEth.TxLike>
    transfer (sender: TSender, to: TAddress, amount: bigint): Promise<TEth.TxLike>
    transferFrom (sender: TSender, from: TAddress, to: TAddress, amount: bigint): Promise<TEth.TxLike>
    withdraw (sender: TSender, assets: bigint, receiver: TAddress, owner: TAddress): Promise<TEth.TxLike>
}


