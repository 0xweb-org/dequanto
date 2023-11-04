/**
 *  AUTO-Generated Class: 2021-11-09 14:26
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';

import { Bscscan } from '@dequanto/explorer/Bscscan';
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client';
import { ClientEventsStream } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { AbiItem } from 'web3-utils';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';

export class AmmRouterV2ContractBase extends ContractBase {
    constructor(
        public address: TAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E',
        public client: Web3Client = di.resolve(BscWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Bscscan)
    ) {
        super(address, client, explorer)
    }

    async WETH (): Promise<TAddress> {
        return this.$read('function WETH() returns address');
    }

    async addLiquidity (eoa: {address: TAddress, key: string}, tokenA: TAddress, tokenB: TAddress, amountADesired: bigint, amountBDesired: bigint, amountAMin: bigint, amountBMin: bigint, to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write('function addLiquidity(address, address, uint256, uint256, uint256, uint256, address, uint256) returns (uint256 amountA,uint256 amountB,uint256 liquidity)', eoa, tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline);
    }

    async addLiquidityETH (eoa: {address: TAddress, key: string}, token: TAddress, amountTokenDesired: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write('function addLiquidityETH(address, uint256, uint256, uint256, address, uint256) returns (uint256 amountToken,uint256 amountETH,uint256 liquidity)', eoa, token, amountTokenDesired, amountTokenMin, amountETHMin, to, deadline);
    }

    async factory (): Promise<TAddress> {
        return this.$read('function factory() returns address');
    }

    async getAmountIn (amountOut: bigint, reserveIn: bigint, reserveOut: bigint): Promise<{ amountIn: bigint }> {
        return this.$read('function getAmountIn(uint256, uint256, uint256) returns uint256 amountIn', amountOut, reserveIn, reserveOut);
    }

    async getAmountOut (amountIn: bigint, reserveIn: bigint, reserveOut: bigint): Promise<{ amountOut: bigint }> {
        return this.$read('function getAmountOut(uint256, uint256, uint256) returns uint256 amountOut', amountIn, reserveIn, reserveOut);
    }

    async getAmountsIn (amountOut: bigint, path: TAddress[]): Promise<{ amounts: bigint[] }> {
        return this.$read('function getAmountsIn(uint256, address[]) returns uint256[] amounts', amountOut, path);
    }

    async getAmountsOut (amountIn: bigint, path: TAddress[]): Promise<{ amounts: bigint[] }> {
        return this.$read('function getAmountsOut(uint256, address[]) returns uint256[] amounts', amountIn, path);
    }

    async quote (amountA: bigint, reserveA: bigint, reserveB: bigint): Promise<{ amountB: bigint }> {
        return this.$read('function quote(uint256, uint256, uint256) returns uint256 amountB', amountA, reserveA, reserveB);
    }

    async removeLiquidity (eoa: {address: TAddress, key: string}, tokenA: TAddress, tokenB: TAddress, liquidity: bigint, amountAMin: bigint, amountBMin: bigint, to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write('function removeLiquidity(address, address, uint256, uint256, uint256, address, uint256) returns (uint256 amountA,uint256 amountB)', eoa, tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline);
    }

    async removeLiquidityETH (eoa: {address: TAddress, key: string}, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write('function removeLiquidityETH(address, uint256, uint256, uint256, address, uint256) returns (uint256 amountToken,uint256 amountETH)', eoa, token, liquidity, amountTokenMin, amountETHMin, to, deadline);
    }

    async removeLiquidityETHSupportingFeeOnTransferTokens (eoa: {address: TAddress, key: string}, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write('function removeLiquidityETHSupportingFeeOnTransferTokens(address, uint256, uint256, uint256, address, uint256) returns uint256 amountETH', eoa, token, liquidity, amountTokenMin, amountETHMin, to, deadline);
    }

    async removeLiquidityETHWithPermit (eoa: {address: TAddress, key: string}, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint, approveMax: boolean, v: number, r: Buffer | string, s: Buffer | string): Promise<TxWriter> {
        return this.$write('function removeLiquidityETHWithPermit(address, uint256, uint256, uint256, address, uint256, bool, uint8, bytes32, bytes32) returns (uint256 amountToken,uint256 amountETH)', eoa, token, liquidity, amountTokenMin, amountETHMin, to, deadline, approveMax, v, r, s);
    }

    async removeLiquidityETHWithPermitSupportingFeeOnTransferTokens (eoa: {address: TAddress, key: string}, token: TAddress, liquidity: bigint, amountTokenMin: bigint, amountETHMin: bigint, to: TAddress, deadline: bigint, approveMax: boolean, v: number, r: Buffer | string, s: Buffer | string): Promise<TxWriter> {
        return this.$write('function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address, uint256, uint256, uint256, address, uint256, bool, uint8, bytes32, bytes32) returns uint256 amountETH', eoa, token, liquidity, amountTokenMin, amountETHMin, to, deadline, approveMax, v, r, s);
    }

    async removeLiquidityWithPermit (eoa: {address: TAddress, key: string}, tokenA: TAddress, tokenB: TAddress, liquidity: bigint, amountAMin: bigint, amountBMin: bigint, to: TAddress, deadline: bigint, approveMax: boolean, v: number, r: Buffer | string, s: Buffer | string): Promise<TxWriter> {
        return this.$write('function removeLiquidityWithPermit(address, address, uint256, uint256, uint256, address, uint256, bool, uint8, bytes32, bytes32) returns (uint256 amountA,uint256 amountB)', eoa, tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline, approveMax, v, r, s);
    }

    async swapETHForExactTokens (eoa: {address: TAddress, key: string}, amountOut: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write('function swapETHForExactTokens(uint256, address[], address, uint256) returns uint256[] amounts', eoa, amountOut, path, to, deadline);
    }

    async swapExactETHForTokens (eoa: {address: TAddress, key: string}, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write('function swapExactETHForTokens(uint256, address[], address, uint256) returns uint256[] amounts', eoa, amountOutMin, path, to, deadline);
    }

    async swapExactETHForTokensSupportingFeeOnTransferTokens (eoa: {address: TAddress, key: string}, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write('function swapExactETHForTokensSupportingFeeOnTransferTokens(uint256, address[], address, uint256)', eoa, amountOutMin, path, to, deadline);
    }

    async swapExactTokensForETH (eoa: {address: TAddress, key: string}, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write('function swapExactTokensForETH(uint256, uint256, address[], address, uint256) returns uint256[] amounts', eoa, amountIn, amountOutMin, path, to, deadline);
    }

    async swapExactTokensForETHSupportingFeeOnTransferTokens (eoa: {address: TAddress, key: string}, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write('function swapExactTokensForETHSupportingFeeOnTransferTokens(uint256, uint256, address[], address, uint256)', eoa, amountIn, amountOutMin, path, to, deadline);
    }

    async swapExactTokensForTokens (eoa: {address: TAddress, key: string}, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write('function swapExactTokensForTokens(uint256, uint256, address[], address, uint256) returns uint256[] amounts', eoa, amountIn, amountOutMin, path, to, deadline);
    }

    async swapExactTokensForTokensSupportingFeeOnTransferTokens (eoa: {address: TAddress, key: string}, amountIn: bigint, amountOutMin: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write('function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256, uint256, address[], address, uint256)', eoa, amountIn, amountOutMin, path, to, deadline);
    }

    async swapTokensForExactETH (eoa: {address: TAddress, key: string}, amountOut: bigint, amountInMax: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write('function swapTokensForExactETH(uint256, uint256, address[], address, uint256) returns uint256[] amounts', eoa, amountOut, amountInMax, path, to, deadline);
    }

    async swapTokensForExactTokens (eoa: {address: TAddress, key: string}, amountOut: bigint, amountInMax: bigint, path: TAddress[], to: TAddress, deadline: bigint): Promise<TxWriter> {
        return this.$write('function swapTokensForExactTokens(uint256, uint256, address[], address, uint256) returns uint256[] amounts', eoa, amountOut, amountInMax, path, to, deadline);
    }



    abi = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
}
