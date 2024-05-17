/**
 *  AUTO-Generated Class: 2024-05-17 00:25
 *  Implementation: https://etherscan.io/address/undefined#code
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



export class IERC4626 extends ContractBase {
    constructor(
        public address: TEth.Address = null,
        public client: Web3Client = di.resolve(EthWeb3Client, ),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan, ),
    ) {
        super(address, client, explorer)

        
    }

    Types: TIERC4626Types;

    $meta = {
        "class": "./src/prebuilt/openzeppelin/IERC4626.ts"
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
        return super.$call() as IIERC4626TxCaller;
    }
    $signed (): TOverrideReturns<IIERC4626TxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IIERC4626TxData {
        return super.$data() as IIERC4626TxData;
    }
    $gas (): TOverrideReturns<IIERC4626TxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TIERC4626Types['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TIERC4626Types['Methods'][TMethod]['arguments']
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

    onApproval (fn?: (event: TClientEventsStreamData<TEventArguments<'Approval'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Approval'>>> {
        return this.$onLog('Approval', fn);
    }

    onDeposit (fn?: (event: TClientEventsStreamData<TEventArguments<'Deposit'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Deposit'>>> {
        return this.$onLog('Deposit', fn);
    }

    onTransfer (fn?: (event: TClientEventsStreamData<TEventArguments<'Transfer'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Transfer'>>> {
        return this.$onLog('Transfer', fn);
    }

    onWithdraw (fn?: (event: TClientEventsStreamData<TEventArguments<'Withdraw'>>) => void): ClientEventsStream<TClientEventsStreamData<TEventArguments<'Withdraw'>>> {
        return this.$onLog('Withdraw', fn);
    }

    extractLogsApproval (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Approval'>>[] {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Approval'>>[];
    }

    extractLogsDeposit (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Deposit'>>[] {
        let abi = this.$getAbiItem('event', 'Deposit');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Deposit'>>[];
    }

    extractLogsTransfer (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Transfer'>>[] {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Transfer'>>[];
    }

    extractLogsWithdraw (tx: TEth.TxReceipt): ITxLogItem<TEventParams<'Withdraw'>>[] {
        let abi = this.$getAbiItem('event', 'Withdraw');
        return this.$extractLogs(tx, abi) as any as ITxLogItem<TEventParams<'Withdraw'>>[];
    }

    async getPastLogsApproval (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { owner?: TAddress,spender?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Approval'>>[]> {
        return await this.$getPastLogsParsed('Approval', options) as any;
    }

    async getPastLogsDeposit (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress,owner?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Deposit'>>[]> {
        return await this.$getPastLogsParsed('Deposit', options) as any;
    }

    async getPastLogsTransfer (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { from?: TAddress,to?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Transfer'>>[]> {
        return await this.$getPastLogsParsed('Transfer', options) as any;
    }

    async getPastLogsWithdraw (options?: {
        fromBlock?: number | Date
        toBlock?: number | Date
        params?: { sender?: TAddress,receiver?: TAddress,owner?: TAddress }
    }): Promise<ITxLogItem<TEventParams<'Withdraw'>>[]> {
        return await this.$getPastLogsParsed('Withdraw', options) as any;
    }

    abi: TAbiItem[] = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"assets","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"assets","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"shares","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"asset","outputs":[{"internalType":"address","name":"assetTokenAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"name":"convertToAssets","outputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"name":"convertToShares","outputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"deposit","outputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"maxDeposit","outputs":[{"internalType":"uint256","name":"maxAssets","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"maxMint","outputs":[{"internalType":"uint256","name":"maxShares","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"maxRedeem","outputs":[{"internalType":"uint256","name":"maxShares","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"maxWithdraw","outputs":[{"internalType":"uint256","name":"maxAssets","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"name":"previewDeposit","outputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"name":"previewMint","outputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"name":"previewRedeem","outputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"name":"previewWithdraw","outputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"shares","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"name":"redeem","outputs":[{"internalType":"uint256","name":"assets","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAssets","outputs":[{"internalType":"uint256","name":"totalManagedAssets","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"assets","type":"uint256"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"name":"withdraw","outputs":[{"internalType":"uint256","name":"shares","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]

    
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TIERC4626Types = {
    Events: {
        Approval: {
            outputParams: { owner: TAddress, spender: TAddress, value: bigint },
            outputArgs:   [ owner: TAddress, spender: TAddress, value: bigint ],
        }
        Deposit: {
            outputParams: { _sender: TAddress, owner: TAddress, assets: bigint, shares: bigint },
            outputArgs:   [ _sender: TAddress, owner: TAddress, assets: bigint, shares: bigint ],
        }
        Transfer: {
            outputParams: { from: TAddress, to: TAddress, value: bigint },
            outputArgs:   [ from: TAddress, to: TAddress, value: bigint ],
        }
        Withdraw: {
            outputParams: { _sender: TAddress, receiver: TAddress, owner: TAddress, assets: bigint, shares: bigint },
            outputArgs:   [ _sender: TAddress, receiver: TAddress, owner: TAddress, assets: bigint, shares: bigint ],
        }
    },
    Methods: {
        allowance: {
          method: "allowance"
          arguments: [ owner: TAddress, spender: TAddress ]
        }
        approve: {
          method: "approve"
          arguments: [ spender: TAddress, amount: bigint ]
        }
        asset: {
          method: "asset"
          arguments: [  ]
        }
        balanceOf: {
          method: "balanceOf"
          arguments: [ account: TAddress ]
        }
        convertToAssets: {
          method: "convertToAssets"
          arguments: [ shares: bigint ]
        }
        convertToShares: {
          method: "convertToShares"
          arguments: [ assets: bigint ]
        }
        decimals: {
          method: "decimals"
          arguments: [  ]
        }
        deposit: {
          method: "deposit"
          arguments: [ assets: bigint, receiver: TAddress ]
        }
        maxDeposit: {
          method: "maxDeposit"
          arguments: [ receiver: TAddress ]
        }
        maxMint: {
          method: "maxMint"
          arguments: [ receiver: TAddress ]
        }
        maxRedeem: {
          method: "maxRedeem"
          arguments: [ owner: TAddress ]
        }
        maxWithdraw: {
          method: "maxWithdraw"
          arguments: [ owner: TAddress ]
        }
        mint: {
          method: "mint"
          arguments: [ shares: bigint, receiver: TAddress ]
        }
        name: {
          method: "name"
          arguments: [  ]
        }
        previewDeposit: {
          method: "previewDeposit"
          arguments: [ assets: bigint ]
        }
        previewMint: {
          method: "previewMint"
          arguments: [ shares: bigint ]
        }
        previewRedeem: {
          method: "previewRedeem"
          arguments: [ shares: bigint ]
        }
        previewWithdraw: {
          method: "previewWithdraw"
          arguments: [ assets: bigint ]
        }
        redeem: {
          method: "redeem"
          arguments: [ shares: bigint, receiver: TAddress, owner: TAddress ]
        }
        symbol: {
          method: "symbol"
          arguments: [  ]
        }
        totalAssets: {
          method: "totalAssets"
          arguments: [  ]
        }
        totalSupply: {
          method: "totalSupply"
          arguments: [  ]
        }
        transfer: {
          method: "transfer"
          arguments: [ to: TAddress, amount: bigint ]
        }
        transferFrom: {
          method: "transferFrom"
          arguments: [ from: TAddress, to: TAddress, amount: bigint ]
        }
        withdraw: {
          method: "withdraw"
          arguments: [ assets: bigint, receiver: TAddress, owner: TAddress ]
        }
    }
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


type TEvents = TIERC4626Types['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
