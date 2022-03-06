/**
 *  AUTO-Generated Class: 2022-01-08 23:50
 *  Implementation: https://polygonscan.com/address/0x28529fec439cfF6d7D1D5917e956dEE62Cd3BE5c#code
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
export class Dai_l2AmmWrapperContract extends ContractBase {
    constructor(
        public address: TAddress = '0x28529fec439cfF6d7D1D5917e956dEE62Cd3BE5c',
        public client: Web3Client = di.resolve(PolyWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Polyscan)
    ) {
        super(address, client, explorer)
    }

    // 0x676c5ef6
    async attemptSwap (eoa: {address: TAddress, key: string, value?: string | number | bigint }, recipient: TAddress, amount: bigint, amountOutMin: bigint, deadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'attemptSwap'), eoa, recipient, amount, amountOutMin, deadline);
    }

    // 0xe78cea92
    async bridge (): Promise<TAddress> {
        return this.$read('function bridge() returns address');
    }

    // 0x9cd01605
    async exchangeAddress (): Promise<TAddress> {
        return this.$read('function exchangeAddress() returns address');
    }

    // 0xfc6e3b3b
    async hToken (): Promise<TAddress> {
        return this.$read('function hToken() returns address');
    }

    // 0x1ee1bf67
    async l2CanonicalToken (): Promise<TAddress> {
        return this.$read('function l2CanonicalToken() returns address');
    }

    // 0x28555125
    async l2CanonicalTokenIsEth (): Promise<boolean> {
        return this.$read('function l2CanonicalTokenIsEth() returns bool');
    }

    // 0xeea0d7b2
    async swapAndSend (eoa: {address: TAddress, key: string, value?: string | number | bigint }, chainId: bigint, recipient: TAddress, amount: bigint, bonderFee: bigint, amountOutMin: bigint, deadline: bigint, destinationAmountOutMin: bigint, destinationDeadline: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'swapAndSend'), eoa, chainId, recipient, amount, bonderFee, amountOutMin, deadline, destinationAmountOutMin, destinationDeadline);
    }





    abi = [{"inputs":[{"internalType":"contract L2_Bridge","name":"_bridge","type":"address"},{"internalType":"contract IERC20","name":"_l2CanonicalToken","type":"address"},{"internalType":"bool","name":"_l2CanonicalTokenIsEth","type":"bool"},{"internalType":"contract IERC20","name":"_hToken","type":"address"},{"internalType":"contract Swap","name":"_exchangeAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"attemptSwap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"bridge","outputs":[{"internalType":"contract L2_Bridge","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"exchangeAddress","outputs":[{"internalType":"contract Swap","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"hToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2CanonicalToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"l2CanonicalTokenIsEth","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"chainId","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"bonderFee","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"destinationAmountOutMin","type":"uint256"},{"internalType":"uint256","name":"destinationDeadline","type":"uint256"}],"name":"swapAndSend","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]
}


