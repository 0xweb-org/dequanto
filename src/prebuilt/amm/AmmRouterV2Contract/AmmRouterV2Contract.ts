/**
 *  AUTO-Generated Class: 2024-05-17 00:25
 *  Implementation: https://bscscan.com/address/0x10ED43C718714eb63d5aA57B78B54704E256024E#code
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
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { SubjectStream } from '@dequanto/class/SubjectStream';


import type { ContractWriter } from '@dequanto/contracts/ContractWriter';
import type { TAbiItem } from '@dequanto/types/TAbi';
import type { TEth } from '@dequanto/models/TEth';
import type { TOverrideReturns } from '@dequanto/utils/types';


import { Bscscan } from '@dequanto/explorer/Bscscan'
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client'



export class AmmRouterV2Contract extends ContractBase {
    constructor(
        public address: TEth.Address = '0x10ED43C718714eb63d5aA57B78B54704E256024E',
        public client: Web3Client = di.resolve(BscWeb3Client, ),
        public explorer: IBlockchainExplorer = di.resolve(Bscscan, ),
    ) {
        super(address, client, explorer)

        this.storage = new AmmRouterV2ContractStorageReader(this.address, this.client, this.explorer);
    }

    Types: TAmmRouterV2ContractTypes;

    $meta = {
        "class": "./src/prebuilt/amm/AmmRouterV2Contract/AmmRouterV2Contract.ts"
    }

    async $constructor (deployer: TSender, _factory: TAddress, _WETH: TAddress): Promise<TxWriter> {
        throw new Error('Not implemented. Typing purpose. Use the ContractDeployer class to deploy the contract');
    }

    // 0xad5c4648
    async WETH (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'WETH'));
    }

    // 0xe8e33700
    async addLiquidity (sender: TSender, tokenA: TAddress, tokenB: TAddress, amountADesired: bigint, amountBDesired: bigint, amountAMin: bigint, amountBMin: bigint, to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'addLiquidity'), sender, tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline);
    }

    // 0xf305d719
    async addLiquidityETH (sender: TSender, token: TAddress, amountTokenDesired: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'addLiquidityETH'), sender, token, amountTokenDesired, amountTokenMin, amountETHMin, to, deadline);
    }

    // 0xc45a0155
    async factory (): Promise<TAddress> {
        return this.$read(this.$getAbiItem('function', 'factory'));
    }

    // 0x85f8c259
    async getAmountIn (amountOut: bigint, reserveIn: bigint, reserveOut: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getAmountIn'), amountOut, reserveIn, reserveOut);
    }

    // 0x054d50d4
    async getAmountOut (amountIn: bigint, reserveIn: bigint, reserveOut: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'getAmountOut'), amountIn, reserveIn, reserveOut);
    }

    // 0x1f00ca74
    async getAmountsIn (amountOut: bigint, path: TAddress[]): Promise<bigint[]> {
        return this.$read(this.$getAbiItem('function', 'getAmountsIn'), amountOut, path);
    }

    // 0xd06ca61f
    async getAmountsOut (amountIn: bigint, path: TAddress[]): Promise<bigint[]> {
        return this.$read(this.$getAbiItem('function', 'getAmountsOut'), amountIn, path);
    }

    // 0xad615dec
    async quote (amountA: bigint, reserveA: bigint, reserveB: bigint): Promise<bigint> {
        return this.$read(this.$getAbiItem('function', 'quote'), amountA, reserveA, reserveB);
    }

    // 0xbaa2abde
    async removeLiquidity (sender: TSender, tokenA: TAddress, tokenB: TAddress, liquidity: bigint, amountAMin: bigint, amountBMin: bigint, to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'removeLiquidity'), sender, tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline);
    }

    // 0x02751cec
    async removeLiquidityETH (sender: TSender, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'removeLiquidityETH'), sender, token, liquidity, amountTokenMin, amountETHMin, to, deadline);
    }

    // 0xaf2979eb
    async removeLiquidityETHSupportingFeeOnTransferTokens (sender: TSender, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'removeLiquidityETHSupportingFeeOnTransferTokens'), sender, token, liquidity, amountTokenMin, amountETHMin, to, deadline);
    }

    // 0xded9382a
    async removeLiquidityETHWithPermit (sender: TSender, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint, approveMax: boolean, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'removeLiquidityETHWithPermit'), sender, token, liquidity, amountTokenMin, amountETHMin, to, deadline, approveMax, v, r, s);
    }

    // 0x5b0d5984
    async removeLiquidityETHWithPermitSupportingFeeOnTransferTokens (sender: TSender, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint, approveMax: boolean, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens'), sender, token, liquidity, amountTokenMin, amountETHMin, to, deadline, approveMax, v, r, s);
    }

    // 0x2195995c
    async removeLiquidityWithPermit (sender: TSender, tokenA: TAddress, tokenB: TAddress, liquidity: bigint, amountAMin: bigint, amountBMin: bigint, to: TAddress, deadline: bigint, approveMax: boolean, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'removeLiquidityWithPermit'), sender, tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline, approveMax, v, r, s);
    }

    // 0xfb3bdb41
    async swapETHForExactTokens (sender: TSender, amountOut: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swapETHForExactTokens'), sender, amountOut, path, to, deadline);
    }

    // 0x7ff36ab5
    async swapExactETHForTokens (sender: TSender, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swapExactETHForTokens'), sender, amountOutMin, path, to, deadline);
    }

    // 0xb6f9de95
    async swapExactETHForTokensSupportingFeeOnTransferTokens (sender: TSender, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swapExactETHForTokensSupportingFeeOnTransferTokens'), sender, amountOutMin, path, to, deadline);
    }

    // 0x18cbafe5
    async swapExactTokensForETH (sender: TSender, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swapExactTokensForETH'), sender, amountIn, amountOutMin, path, to, deadline);
    }

    // 0x791ac947
    async swapExactTokensForETHSupportingFeeOnTransferTokens (sender: TSender, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swapExactTokensForETHSupportingFeeOnTransferTokens'), sender, amountIn, amountOutMin, path, to, deadline);
    }

    // 0x38ed1739
    async swapExactTokensForTokens (sender: TSender, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swapExactTokensForTokens'), sender, amountIn, amountOutMin, path, to, deadline);
    }

    // 0x5c11d795
    async swapExactTokensForTokensSupportingFeeOnTransferTokens (sender: TSender, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swapExactTokensForTokensSupportingFeeOnTransferTokens'), sender, amountIn, amountOutMin, path, to, deadline);
    }

    // 0x4a25d94a
    async swapTokensForExactETH (sender: TSender, amountOut: bigint, amountInMax: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swapTokensForExactETH'), sender, amountOut, amountInMax, path, to, deadline);
    }

    // 0x8803dbee
    async swapTokensForExactTokens (sender: TSender, amountOut: bigint, amountInMax: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swapTokensForExactTokens'), sender, amountOut, amountInMax, path, to, deadline);
    }

    $call () {
        return super.$call() as IAmmRouterV2ContractTxCaller;
    }
    $signed (): TOverrideReturns<IAmmRouterV2ContractTxCaller, Promise<{ signed: TEth.Hex, error?: Error & { data?: { type: string, params } } }>> {
        return super.$signed() as any;
    }
    $data (): IAmmRouterV2ContractTxData {
        return super.$data() as IAmmRouterV2ContractTxData;
    }
    $gas (): TOverrideReturns<IAmmRouterV2ContractTxCaller, Promise<{ gas?: bigint, price?: bigint, error?: Error & { data?: { type: string, params } } }>> {
        return super.$gas() as any;
    }

    onTransaction <TMethod extends keyof TAmmRouterV2ContractTypes['Methods']> (method: TMethod, options: Parameters<ContractBase['$onTransaction']>[0]): SubjectStream<{
        tx: TEth.Tx
        block: TEth.Block<TEth.Hex>
        calldata: {
            method: TMethod
            arguments: TAmmRouterV2ContractTypes['Methods'][TMethod]['arguments']
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







    abi: TAbiItem[] = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]

    declare storage: AmmRouterV2ContractStorageReader
}

type TSender = TAccount & {
    value?: string | number | bigint
}

type TEventLogOptions<TParams> = {
    fromBlock?: number | Date
    toBlock?: number | Date
    params?: TParams
}

export type TAmmRouterV2ContractTypes = {
    Events: {

    },
    Methods: {
        WETH: {
          method: "WETH"
          arguments: [  ]
        }
        addLiquidity: {
          method: "addLiquidity"
          arguments: [ tokenA: TAddress, tokenB: TAddress, amountADesired: bigint, amountBDesired: bigint, amountAMin: bigint, amountBMin: bigint, to: TAddress, deadline: bigint ]
        }
        addLiquidityETH: {
          method: "addLiquidityETH"
          arguments: [ token: TAddress, amountTokenDesired: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint ]
        }
        factory: {
          method: "factory"
          arguments: [  ]
        }
        getAmountIn: {
          method: "getAmountIn"
          arguments: [ amountOut: bigint, reserveIn: bigint, reserveOut: bigint ]
        }
        getAmountOut: {
          method: "getAmountOut"
          arguments: [ amountIn: bigint, reserveIn: bigint, reserveOut: bigint ]
        }
        getAmountsIn: {
          method: "getAmountsIn"
          arguments: [ amountOut: bigint, path: TAddress[] ]
        }
        getAmountsOut: {
          method: "getAmountsOut"
          arguments: [ amountIn: bigint, path: TAddress[] ]
        }
        quote: {
          method: "quote"
          arguments: [ amountA: bigint, reserveA: bigint, reserveB: bigint ]
        }
        removeLiquidity: {
          method: "removeLiquidity"
          arguments: [ tokenA: TAddress, tokenB: TAddress, liquidity: bigint, amountAMin: bigint, amountBMin: bigint, to: TAddress, deadline: bigint ]
        }
        removeLiquidityETH: {
          method: "removeLiquidityETH"
          arguments: [ token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint ]
        }
        removeLiquidityETHSupportingFeeOnTransferTokens: {
          method: "removeLiquidityETHSupportingFeeOnTransferTokens"
          arguments: [ token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint ]
        }
        removeLiquidityETHWithPermit: {
          method: "removeLiquidityETHWithPermit"
          arguments: [ token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint, approveMax: boolean, v: number, r: TEth.Hex, s: TEth.Hex ]
        }
        removeLiquidityETHWithPermitSupportingFeeOnTransferTokens: {
          method: "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens"
          arguments: [ token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint, approveMax: boolean, v: number, r: TEth.Hex, s: TEth.Hex ]
        }
        removeLiquidityWithPermit: {
          method: "removeLiquidityWithPermit"
          arguments: [ tokenA: TAddress, tokenB: TAddress, liquidity: bigint, amountAMin: bigint, amountBMin: bigint, to: TAddress, deadline: bigint, approveMax: boolean, v: number, r: TEth.Hex, s: TEth.Hex ]
        }
        swapETHForExactTokens: {
          method: "swapETHForExactTokens"
          arguments: [ amountOut: bigint, path: TAddress[], to: TAddress, deadline: bigint ]
        }
        swapExactETHForTokens: {
          method: "swapExactETHForTokens"
          arguments: [ amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint ]
        }
        swapExactETHForTokensSupportingFeeOnTransferTokens: {
          method: "swapExactETHForTokensSupportingFeeOnTransferTokens"
          arguments: [ amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint ]
        }
        swapExactTokensForETH: {
          method: "swapExactTokensForETH"
          arguments: [ amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint ]
        }
        swapExactTokensForETHSupportingFeeOnTransferTokens: {
          method: "swapExactTokensForETHSupportingFeeOnTransferTokens"
          arguments: [ amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint ]
        }
        swapExactTokensForTokens: {
          method: "swapExactTokensForTokens"
          arguments: [ amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint ]
        }
        swapExactTokensForTokensSupportingFeeOnTransferTokens: {
          method: "swapExactTokensForTokensSupportingFeeOnTransferTokens"
          arguments: [ amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint ]
        }
        swapTokensForExactETH: {
          method: "swapTokensForExactETH"
          arguments: [ amountOut: bigint, amountInMax: bigint, path: TAddress[], to: TAddress, deadline: bigint ]
        }
        swapTokensForExactTokens: {
          method: "swapTokensForExactTokens"
          arguments: [ amountOut: bigint, amountInMax: bigint, path: TAddress[], to: TAddress, deadline: bigint ]
        }
    }
}



class AmmRouterV2ContractStorageReader extends ContractStorageReaderBase {
    constructor(
        public address: TAddress,
        public client: Web3Client,
        public explorer: IBlockchainExplorer,
    ) {
        super(address, client, explorer);

        this.$createHandler(this.$slots);
    }



    $slots = []

}


interface IAmmRouterV2ContractTxCaller {
    addLiquidity (sender: TSender, tokenA: TAddress, tokenB: TAddress, amountADesired: bigint, amountBDesired: bigint, amountAMin: bigint, amountBMin: bigint, to: TAddress, deadline: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    addLiquidityETH (sender: TSender, token: TAddress, amountTokenDesired: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    removeLiquidity (sender: TSender, tokenA: TAddress, tokenB: TAddress, liquidity: bigint, amountAMin: bigint, amountBMin: bigint, to: TAddress, deadline: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    removeLiquidityETH (sender: TSender, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    removeLiquidityETHSupportingFeeOnTransferTokens (sender: TSender, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    removeLiquidityETHWithPermit (sender: TSender, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint, approveMax: boolean, v: number, r: TEth.Hex, s: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    removeLiquidityETHWithPermitSupportingFeeOnTransferTokens (sender: TSender, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint, approveMax: boolean, v: number, r: TEth.Hex, s: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    removeLiquidityWithPermit (sender: TSender, tokenA: TAddress, tokenB: TAddress, liquidity: bigint, amountAMin: bigint, amountBMin: bigint, to: TAddress, deadline: bigint, approveMax: boolean, v: number, r: TEth.Hex, s: TEth.Hex): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swapETHForExactTokens (sender: TSender, amountOut: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swapExactETHForTokens (sender: TSender, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swapExactETHForTokensSupportingFeeOnTransferTokens (sender: TSender, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swapExactTokensForETH (sender: TSender, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swapExactTokensForETHSupportingFeeOnTransferTokens (sender: TSender, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swapExactTokensForTokens (sender: TSender, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swapExactTokensForTokensSupportingFeeOnTransferTokens (sender: TSender, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swapTokensForExactETH (sender: TSender, amountOut: bigint, amountInMax: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
    swapTokensForExactTokens (sender: TSender, amountOut: bigint, amountInMax: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<{ error?: Error & { data?: { type: string, params } }, result? }>
}


interface IAmmRouterV2ContractTxData {
    addLiquidity (sender: TSender, tokenA: TAddress, tokenB: TAddress, amountADesired: bigint, amountBDesired: bigint, amountAMin: bigint, amountBMin: bigint, to: TAddress, deadline: bigint): Promise<TEth.TxLike>
    addLiquidityETH (sender: TSender, token: TAddress, amountTokenDesired: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint): Promise<TEth.TxLike>
    removeLiquidity (sender: TSender, tokenA: TAddress, tokenB: TAddress, liquidity: bigint, amountAMin: bigint, amountBMin: bigint, to: TAddress, deadline: bigint): Promise<TEth.TxLike>
    removeLiquidityETH (sender: TSender, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint): Promise<TEth.TxLike>
    removeLiquidityETHSupportingFeeOnTransferTokens (sender: TSender, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint): Promise<TEth.TxLike>
    removeLiquidityETHWithPermit (sender: TSender, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint, approveMax: boolean, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TEth.TxLike>
    removeLiquidityETHWithPermitSupportingFeeOnTransferTokens (sender: TSender, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint, approveMax: boolean, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TEth.TxLike>
    removeLiquidityWithPermit (sender: TSender, tokenA: TAddress, tokenB: TAddress, liquidity: bigint, amountAMin: bigint, amountBMin: bigint, to: TAddress, deadline: bigint, approveMax: boolean, v: number, r: TEth.Hex, s: TEth.Hex): Promise<TEth.TxLike>
    swapETHForExactTokens (sender: TSender, amountOut: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TEth.TxLike>
    swapExactETHForTokens (sender: TSender, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TEth.TxLike>
    swapExactETHForTokensSupportingFeeOnTransferTokens (sender: TSender, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TEth.TxLike>
    swapExactTokensForETH (sender: TSender, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TEth.TxLike>
    swapExactTokensForETHSupportingFeeOnTransferTokens (sender: TSender, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TEth.TxLike>
    swapExactTokensForTokens (sender: TSender, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TEth.TxLike>
    swapExactTokensForTokensSupportingFeeOnTransferTokens (sender: TSender, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TEth.TxLike>
    swapTokensForExactETH (sender: TSender, amountOut: bigint, amountInMax: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TEth.TxLike>
    swapTokensForExactTokens (sender: TSender, amountOut: bigint, amountInMax: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TEth.TxLike>
}


type TEvents = TAmmRouterV2ContractTypes['Events'];
type TEventParams<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputParams']>;
type TEventArguments<TEventName extends keyof TEvents> = Partial<TEvents[TEventName]['outputArgs']>;
