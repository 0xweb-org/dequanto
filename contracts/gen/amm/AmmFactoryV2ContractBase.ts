/**
 *  AUTO-Generated Class: 2021-11-09 14:26
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';

import { Bscscan } from '@dequanto/BlockchainExplorer/Bscscan';
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client';
import { ClientEventsStream } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { AbiItem } from 'web3-utils';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';

export class AmmFactoryV2ContractBase extends ContractBase {
    constructor(
        public address: TAddress = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
        public client: Web3Client = di.resolve(BscWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Bscscan)
    ) {
        super(address, client, explorer)
    }

    async INIT_CODE_PAIR_HASH (): Promise<Buffer | string> {
        return this.$read('function INIT_CODE_PAIR_HASH() returns bytes32');
    }

    async allPairs (input0: bigint): Promise<TAddress> {
        return this.$read('function allPairs(uint256) returns address', input0);
    }

    async allPairsLength (): Promise<bigint> {
        return this.$read('function allPairsLength() returns uint256');
    }

    async createPair (eoa: {address: TAddress, key: string}, tokenA: TAddress, tokenB: TAddress): Promise<TxWriter> {
        return this.$write('function createPair(address, address) returns address pair', eoa, tokenA, tokenB);
    }

    async feeTo (): Promise<TAddress> {
        return this.$read('function feeTo() returns address');
    }

    async feeToSetter (): Promise<TAddress> {
        return this.$read('function feeToSetter() returns address');
    }

    async getPair (input0: TAddress, input1: TAddress): Promise<TAddress> {
        return this.$read('function getPair(address, address) returns address', input0, input1);
    }

    async setFeeTo (eoa: {address: TAddress, key: string}, _feeTo: TAddress): Promise<TxWriter> {
        return this.$write('function setFeeTo(address)', eoa, _feeTo);
    }

    async setFeeToSetter (eoa: {address: TAddress, key: string}, _feeToSetter: TAddress): Promise<TxWriter> {
        return this.$write('function setFeeToSetter(address)', eoa, _feeToSetter);
    }

    onPairCreated (fn: (token0: TAddress, token1: TAddress, pair: TAddress, input3: bigint) => void): ClientEventsStream<any> {
        return this.$on('PairCreated', fn);
    }

    abi = [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
}
