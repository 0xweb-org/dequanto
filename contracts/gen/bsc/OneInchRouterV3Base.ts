import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';

import { Bscscan } from '@dequanto/explorer/Bscscan';
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client';

import { ContractBase } from '@dequanto/contracts/ContractBase';
import { AbiItem } from 'web3-utils';
import { TxWriter } from '@dequanto/txs/TxWriter';

export class OneInchRouterV3Base extends ContractBase {
    constructor(
        public address: TAddress = '0x11111112542d85b3ef69ae05771c2dccff4faa26',
        public client = di.resolve(BscWeb3Client),
        public explorer = di.resolve(Bscscan)
    ) {
        super(address, client, explorer)
    }

    async destroy (eoa: {address: TAddress, key: string}, ): Promise<TxWriter> {
        return this.$write('function destroy():()', eoa);
    }

    async discountedSwap (eoa: {address: TAddress, key: string}, caller: TAddress, desc: { srcToken: TAddress, dstToken: TAddress, srcReceiver: TAddress, dstReceiver: TAddress, amount: bigint, minReturnAmount: bigint, flags: bigint, permit: Buffer }, data: Buffer): Promise<TxWriter> {
        return this.$write('function discountedSwap(address, tuple, bytes):(uint256 returnAmount,uint256 gasLeft,uint256 chiSpent)', eoa, caller, desc, data);
    }

    async owner (): Promise<TAddress> {
        return this.$read('function owner():(address)');
    }

    async renounceOwnership (eoa: {address: TAddress, key: string}, ): Promise<TxWriter> {
        return this.$write('function renounceOwnership():()', eoa);
    }

    async rescueFunds (eoa: {address: TAddress, key: string}, token: TAddress, amount: bigint): Promise<TxWriter> {
        return this.$write('function rescueFunds(address, uint256):()', eoa, token, amount);
    }

    async swap (eoa: {address: TAddress, key: string}, caller: TAddress, desc: { srcToken: TAddress, dstToken: TAddress, srcReceiver: TAddress, dstReceiver: TAddress, amount: bigint, minReturnAmount: bigint, flags: bigint, permit: Buffer }, data: Buffer): Promise<TxWriter> {
        return this.$write('function swap(address, tuple, bytes):(uint256 returnAmount,uint256 gasLeft)', eoa, caller, desc, data);
    }

    async transferOwnership (eoa: {address: TAddress, key: string}, newOwner: TAddress): Promise<TxWriter> {
        return this.$write('function transferOwnership(address):()', eoa, newOwner);
    }

    async unoswap (eoa: {address: TAddress, key: string}, srcToken: TAddress, amount: bigint, minReturn: bigint, input3: Buffer[]): Promise<TxWriter> {
        return this.$write('function unoswap(address, uint256, uint256, bytes32[]):(uint256 returnAmount)', eoa, srcToken, amount, minReturn, input3);
    }

    async unoswapWithPermit (eoa: {address: TAddress, key: string}, srcToken: TAddress, amount: bigint, minReturn: bigint, pools: Buffer[], permit: Buffer): Promise<TxWriter> {
        return this.$write('function unoswapWithPermit(address, uint256, uint256, bytes32[], bytes):(uint256 returnAmount)', eoa, srcToken, amount, minReturn, pools, permit);
    }

    abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"Error","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"contract IERC20","name":"srcToken","type":"address"},{"indexed":false,"internalType":"contract IERC20","name":"dstToken","type":"address"},{"indexed":false,"internalType":"address","name":"dstReceiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"spentAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"returnAmount","type":"uint256"}],"name":"Swapped","type":"event"},{"inputs":[],"name":"destroy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IAggregationExecutor","name":"caller","type":"address"},{"components":[{"internalType":"contract IERC20","name":"srcToken","type":"address"},{"internalType":"contract IERC20","name":"dstToken","type":"address"},{"internalType":"address","name":"srcReceiver","type":"address"},{"internalType":"address","name":"dstReceiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturnAmount","type":"uint256"},{"internalType":"uint256","name":"flags","type":"uint256"},{"internalType":"bytes","name":"permit","type":"bytes"}],"internalType":"struct AggregationRouterV3.SwapDescription","name":"desc","type":"tuple"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"discountedSwap","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"},{"internalType":"uint256","name":"gasLeft","type":"uint256"},{"internalType":"uint256","name":"chiSpent","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"rescueFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IAggregationExecutor","name":"caller","type":"address"},{"components":[{"internalType":"contract IERC20","name":"srcToken","type":"address"},{"internalType":"contract IERC20","name":"dstToken","type":"address"},{"internalType":"address","name":"srcReceiver","type":"address"},{"internalType":"address","name":"dstReceiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturnAmount","type":"uint256"},{"internalType":"uint256","name":"flags","type":"uint256"},{"internalType":"bytes","name":"permit","type":"bytes"}],"internalType":"struct AggregationRouterV3.SwapDescription","name":"desc","type":"tuple"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"},{"internalType":"uint256","name":"gasLeft","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"srcToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturn","type":"uint256"},{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"name":"unoswap","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"srcToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturn","type":"uint256"},{"internalType":"bytes32[]","name":"pools","type":"bytes32[]"},{"internalType":"bytes","name":"permit","type":"bytes"}],"name":"unoswapWithPermit","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"}],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]
}
