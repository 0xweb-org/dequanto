/**
 *  AUTO-Generated Class: 2022-01-08 23:50
 *  Implementation: https://polygonscan.com/address/0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1#code
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';
import { ClientEventsStream } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { AbiItem } from 'web3-utils';
import { TransactionReceipt } from 'web3-core';
import { EventData } from 'web3-eth-contract';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';

import { Polyscan } from '@dequanto/BlockchainExplorer/Polyscan'
import { PolyWeb3Client } from '@dequanto/clients/PolyWeb3Client'
export class Matic_l2SaddleSwapContract extends ContractBase {
    constructor(
        public address: TAddress = '0x3d4Cc8A61c7528Fd86C55cfe061a78dCBA48EDd1',
        public client: Web3Client = di.resolve(PolyWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Polyscan)
    ) {
        super(address, client, explorer)
    }

    // 0x4d49e87d
    async addLiquidity (eoa: {address: TAddress, key: string, value?: string | number | bigint }, amounts: bigint[], minToMint: bigint, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'addLiquidity'), eoa, amounts, minToMint, deadline);
    }

    // 0x4a1b0d57
    async calculateCurrentWithdrawFee (user: TAddress): Promise<bigint> {
        return this.$read('function calculateCurrentWithdrawFee(address) returns uint256', user);
    }

    // 0x7c61e561
    async calculateRemoveLiquidity (account: TAddress, amount: bigint): Promise<bigint[]> {
        return this.$read('function calculateRemoveLiquidity(address, uint256) returns uint256[]', account, amount);
    }

    // 0x98899f40
    async calculateRemoveLiquidityOneToken (account: TAddress, tokenAmount: bigint, tokenIndex: number): Promise<bigint> {
        return this.$read('function calculateRemoveLiquidityOneToken(address, uint256, uint8) returns uint256', account, tokenAmount, tokenIndex);
    }

    // 0xa95b089f
    async calculateSwap (tokenIndexFrom: number, tokenIndexTo: number, dx: bigint): Promise<bigint> {
        return this.$read('function calculateSwap(uint8, uint8, uint256) returns uint256', tokenIndexFrom, tokenIndexTo, dx);
    }

    // 0xf9273ffb
    async calculateTokenAmount (account: TAddress, amounts: bigint[], deposit: boolean): Promise<bigint> {
        return this.$read('function calculateTokenAmount(address, uint256[], bool) returns uint256', account, amounts, deposit);
    }

    // 0xd46300fd
    async getA (): Promise<bigint> {
        return this.$read('function getA() returns uint256');
    }

    // 0x0ba81959
    async getAPrecise (): Promise<bigint> {
        return this.$read('function getAPrecise() returns uint256');
    }

    // 0xef0a712f
    async getAdminBalance (index: bigint): Promise<bigint> {
        return this.$read('function getAdminBalance(uint256) returns uint256', index);
    }

    // 0xda7a77be
    async getDepositTimestamp (user: TAddress): Promise<bigint> {
        return this.$read('function getDepositTimestamp(address) returns uint256', user);
    }

    // 0x82b86600
    async getToken (index: number): Promise<TAddress> {
        return this.$read('function getToken(uint8) returns address', index);
    }

    // 0x91ceb3eb
    async getTokenBalance (index: number): Promise<bigint> {
        return this.$read('function getTokenBalance(uint8) returns uint256', index);
    }

    // 0x66c0bd24
    async getTokenIndex (tokenAddress: TAddress): Promise<number> {
        return this.$read('function getTokenIndex(address) returns uint8', tokenAddress);
    }

    // 0xe25aa5fa
    async getVirtualPrice (): Promise<bigint> {
        return this.$read('function getVirtualPrice() returns uint256');
    }

    // 0x6dd4480b
    async initialize (eoa: {address: TAddress, key: string, value?: string | number | bigint }, _pooledTokens: TAddress[], decimals: number[], lpTokenName: string, lpTokenSymbol: string, _a: bigint, _fee: bigint, _adminFee: bigint, _withdrawFee: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'initialize'), eoa, _pooledTokens, decimals, lpTokenName, lpTokenSymbol, _a, _fee, _adminFee, _withdrawFee);
    }

    // 0x31cd52b0
    async removeLiquidity (eoa: {address: TAddress, key: string, value?: string | number | bigint }, amount: bigint, minAmounts: bigint[], deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'removeLiquidity'), eoa, amount, minAmounts, deadline);
    }

    // 0x84cdd9bc
    async removeLiquidityImbalance (eoa: {address: TAddress, key: string, value?: string | number | bigint }, amounts: bigint[], maxBurnAmount: bigint, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'removeLiquidityImbalance'), eoa, amounts, maxBurnAmount, deadline);
    }

    // 0x3e3a1560
    async removeLiquidityOneToken (eoa: {address: TAddress, key: string, value?: string | number | bigint }, tokenAmount: bigint, tokenIndex: number, minAmount: bigint, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'removeLiquidityOneToken'), eoa, tokenAmount, tokenIndex, minAmount, deadline);
    }

    // 0x91695586
    async swap (eoa: {address: TAddress, key: string, value?: string | number | bigint }, tokenIndexFrom: number, tokenIndexTo: number, dx: bigint, minDy: bigint, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swap'), eoa, tokenIndexFrom, tokenIndexTo, dx, minDy, deadline);
    }

    // 0x5fd65f0f
    async swapStorage (): Promise<{ initialA: bigint, futureA: bigint, initialATime: bigint, futureATime: bigint, swapFee: bigint, adminFee: bigint, defaultWithdrawFee: bigint, lpToken: TAddress }> {
        return this.$read('function swapStorage() returns (uint256,uint256,uint256,uint256,uint256,uint256,uint256,address)');
    }

    // 0xc00c125c
    async updateUserWithdrawFee (eoa: {address: TAddress, key: string, value?: string | number | bigint }, recipient: TAddress, transferAmount: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'updateUserWithdrawFee'), eoa, recipient, transferAmount);
    }

    onAddLiquidity (fn: (event: EventData, provider: TAddress, tokenAmounts: bigint[], fees: bigint[], invariant: bigint, lpTokenSupply: bigint) => void): ClientEventsStream<any> {
        return this.$on('AddLiquidity', fn);
    }

    onNewAdminFee (fn: (event: EventData, newAdminFee: bigint) => void): ClientEventsStream<any> {
        return this.$on('NewAdminFee', fn);
    }

    onNewSwapFee (fn: (event: EventData, newSwapFee: bigint) => void): ClientEventsStream<any> {
        return this.$on('NewSwapFee', fn);
    }

    onNewWithdrawFee (fn: (event: EventData, newWithdrawFee: bigint) => void): ClientEventsStream<any> {
        return this.$on('NewWithdrawFee', fn);
    }

    onRampA (fn: (event: EventData, oldA: bigint, newA: bigint, initialTime: bigint, futureTime: bigint) => void): ClientEventsStream<any> {
        return this.$on('RampA', fn);
    }

    onRemoveLiquidity (fn: (event: EventData, provider: TAddress, tokenAmounts: bigint[], lpTokenSupply: bigint) => void): ClientEventsStream<any> {
        return this.$on('RemoveLiquidity', fn);
    }

    onRemoveLiquidityImbalance (fn: (event: EventData, provider: TAddress, tokenAmounts: bigint[], fees: bigint[], invariant: bigint, lpTokenSupply: bigint) => void): ClientEventsStream<any> {
        return this.$on('RemoveLiquidityImbalance', fn);
    }

    onRemoveLiquidityOne (fn: (event: EventData, provider: TAddress, lpTokenAmount: bigint, lpTokenSupply: bigint, boughtId: bigint, tokensBought: bigint) => void): ClientEventsStream<any> {
        return this.$on('RemoveLiquidityOne', fn);
    }

    onStopRampA (fn: (event: EventData, currentA: bigint, time: bigint) => void): ClientEventsStream<any> {
        return this.$on('StopRampA', fn);
    }

    onTokenSwap (fn: (event: EventData, buyer: TAddress, tokensSold: bigint, tokensBought: bigint, soldId: bigint, boughtId: bigint) => void): ClientEventsStream<any> {
        return this.$on('TokenSwap', fn);
    }

    extractLogsAddLiquidity (tx: TransactionReceipt): TLogAddLiquidity[] {
        let abi = this.$getAbiItem('event', 'AddLiquidity');
        return this.$extractLogs(tx, abi) as any as TLogAddLiquidity[];
    }

    extractLogsNewAdminFee (tx: TransactionReceipt): TLogNewAdminFee[] {
        let abi = this.$getAbiItem('event', 'NewAdminFee');
        return this.$extractLogs(tx, abi) as any as TLogNewAdminFee[];
    }

    extractLogsNewSwapFee (tx: TransactionReceipt): TLogNewSwapFee[] {
        let abi = this.$getAbiItem('event', 'NewSwapFee');
        return this.$extractLogs(tx, abi) as any as TLogNewSwapFee[];
    }

    extractLogsNewWithdrawFee (tx: TransactionReceipt): TLogNewWithdrawFee[] {
        let abi = this.$getAbiItem('event', 'NewWithdrawFee');
        return this.$extractLogs(tx, abi) as any as TLogNewWithdrawFee[];
    }

    extractLogsRampA (tx: TransactionReceipt): TLogRampA[] {
        let abi = this.$getAbiItem('event', 'RampA');
        return this.$extractLogs(tx, abi) as any as TLogRampA[];
    }

    extractLogsRemoveLiquidity (tx: TransactionReceipt): TLogRemoveLiquidity[] {
        let abi = this.$getAbiItem('event', 'RemoveLiquidity');
        return this.$extractLogs(tx, abi) as any as TLogRemoveLiquidity[];
    }

    extractLogsRemoveLiquidityImbalance (tx: TransactionReceipt): TLogRemoveLiquidityImbalance[] {
        let abi = this.$getAbiItem('event', 'RemoveLiquidityImbalance');
        return this.$extractLogs(tx, abi) as any as TLogRemoveLiquidityImbalance[];
    }

    extractLogsRemoveLiquidityOne (tx: TransactionReceipt): TLogRemoveLiquidityOne[] {
        let abi = this.$getAbiItem('event', 'RemoveLiquidityOne');
        return this.$extractLogs(tx, abi) as any as TLogRemoveLiquidityOne[];
    }

    extractLogsStopRampA (tx: TransactionReceipt): TLogStopRampA[] {
        let abi = this.$getAbiItem('event', 'StopRampA');
        return this.$extractLogs(tx, abi) as any as TLogStopRampA[];
    }

    extractLogsTokenSwap (tx: TransactionReceipt): TLogTokenSwap[] {
        let abi = this.$getAbiItem('event', 'TokenSwap');
        return this.$extractLogs(tx, abi) as any as TLogTokenSwap[];
    }

    abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"tokenAmounts","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"fees","type":"uint256[]"},{"indexed":false,"internalType":"uint256","name":"invariant","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"lpTokenSupply","type":"uint256"}],"name":"AddLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newAdminFee","type":"uint256"}],"name":"NewAdminFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newSwapFee","type":"uint256"}],"name":"NewSwapFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newWithdrawFee","type":"uint256"}],"name":"NewWithdrawFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"initialTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"futureTime","type":"uint256"}],"name":"RampA","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"tokenAmounts","type":"uint256[]"},{"indexed":false,"internalType":"uint256","name":"lpTokenSupply","type":"uint256"}],"name":"RemoveLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"tokenAmounts","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"fees","type":"uint256[]"},{"indexed":false,"internalType":"uint256","name":"invariant","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"lpTokenSupply","type":"uint256"}],"name":"RemoveLiquidityImbalance","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"lpTokenAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"lpTokenSupply","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"boughtId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensBought","type":"uint256"}],"name":"RemoveLiquidityOne","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"currentA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"StopRampA","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokensSold","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensBought","type":"uint256"},{"indexed":false,"internalType":"uint128","name":"soldId","type":"uint128"},{"indexed":false,"internalType":"uint128","name":"boughtId","type":"uint128"}],"name":"TokenSwap","type":"event"},{"inputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"uint256","name":"minToMint","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"calculateCurrentWithdrawFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"calculateRemoveLiquidity","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint8","name":"tokenIndex","type":"uint8"}],"name":"calculateRemoveLiquidityOneToken","outputs":[{"internalType":"uint256","name":"availableTokenAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"tokenIndexFrom","type":"uint8"},{"internalType":"uint8","name":"tokenIndexTo","type":"uint8"},{"internalType":"uint256","name":"dx","type":"uint256"}],"name":"calculateSwap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bool","name":"deposit","type":"bool"}],"name":"calculateTokenAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getA","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAPrecise","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getAdminBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getDepositTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"index","type":"uint8"}],"name":"getToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"index","type":"uint8"}],"name":"getTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"getTokenIndex","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getVirtualPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20[]","name":"_pooledTokens","type":"address[]"},{"internalType":"uint8[]","name":"decimals","type":"uint8[]"},{"internalType":"string","name":"lpTokenName","type":"string"},{"internalType":"string","name":"lpTokenSymbol","type":"string"},{"internalType":"uint256","name":"_a","type":"uint256"},{"internalType":"uint256","name":"_fee","type":"uint256"},{"internalType":"uint256","name":"_adminFee","type":"uint256"},{"internalType":"uint256","name":"_withdrawFee","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256[]","name":"minAmounts","type":"uint256[]"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"uint256","name":"maxBurnAmount","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityImbalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"uint8","name":"tokenIndex","type":"uint8"},{"internalType":"uint256","name":"minAmount","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityOneToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"tokenIndexFrom","type":"uint8"},{"internalType":"uint8","name":"tokenIndexTo","type":"uint8"},{"internalType":"uint256","name":"dx","type":"uint256"},{"internalType":"uint256","name":"minDy","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapStorage","outputs":[{"internalType":"uint256","name":"initialA","type":"uint256"},{"internalType":"uint256","name":"futureA","type":"uint256"},{"internalType":"uint256","name":"initialATime","type":"uint256"},{"internalType":"uint256","name":"futureATime","type":"uint256"},{"internalType":"uint256","name":"swapFee","type":"uint256"},{"internalType":"uint256","name":"adminFee","type":"uint256"},{"internalType":"uint256","name":"defaultWithdrawFee","type":"uint256"},{"internalType":"contract LPToken","name":"lpToken","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"transferAmount","type":"uint256"}],"name":"updateUserWithdrawFee","outputs":[],"stateMutability":"nonpayable","type":"function"}]
}

    type TLogAddLiquidity = {
        contract: TAddress,
        provider: TAddress, tokenAmounts: bigint[], fees: bigint[], invariant: bigint, lpTokenSupply: bigint
    }
    type TLogNewAdminFee = {
        contract: TAddress,
        newAdminFee: bigint
    }
    type TLogNewSwapFee = {
        contract: TAddress,
        newSwapFee: bigint
    }
    type TLogNewWithdrawFee = {
        contract: TAddress,
        newWithdrawFee: bigint
    }
    type TLogRampA = {
        contract: TAddress,
        oldA: bigint, newA: bigint, initialTime: bigint, futureTime: bigint
    }
    type TLogRemoveLiquidity = {
        contract: TAddress,
        provider: TAddress, tokenAmounts: bigint[], lpTokenSupply: bigint
    }
    type TLogRemoveLiquidityImbalance = {
        contract: TAddress,
        provider: TAddress, tokenAmounts: bigint[], fees: bigint[], invariant: bigint, lpTokenSupply: bigint
    }
    type TLogRemoveLiquidityOne = {
        contract: TAddress,
        provider: TAddress, lpTokenAmount: bigint, lpTokenSupply: bigint, boughtId: bigint, tokensBought: bigint
    }
    type TLogStopRampA = {
        contract: TAddress,
        currentA: bigint, time: bigint
    }
    type TLogTokenSwap = {
        contract: TAddress,
        buyer: TAddress, tokensSold: bigint, tokensBought: bigint, soldId: bigint, boughtId: bigint
    }
