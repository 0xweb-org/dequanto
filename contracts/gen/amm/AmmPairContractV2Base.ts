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

export class AmmPairContractV2Base extends ContractBase {
    constructor(
        public address: TAddress = '0x7752e1fa9f3a2e860856458517008558deb989e3',
        public client: Web3Client = di.resolve(BscWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Bscscan)
    ) {
        super(address, client, explorer)
    }

    async DOMAIN_SEPARATOR (): Promise<Buffer | string> {
        return this.$read('function DOMAIN_SEPARATOR() returns bytes32');
    }

    async MINIMUM_LIQUIDITY (): Promise<bigint> {
        return this.$read('function MINIMUM_LIQUIDITY() returns uint256');
    }

    async PERMIT_TYPEHASH (): Promise<Buffer | string> {
        return this.$read('function PERMIT_TYPEHASH() returns bytes32');
    }

    async allowance (input0: TAddress, input1: TAddress): Promise<bigint> {
        return this.$read('function allowance(address, address) returns uint256', input0, input1);
    }

    async approve (eoa: {address: TAddress, key: string}, spender: TAddress, value: bigint): Promise<TxWriter> {
        return this.$write('function approve(address, uint256) returns bool', eoa, spender, value);
    }

    async balanceOf (input0: TAddress): Promise<bigint> {
        return this.$read('function balanceOf(address) returns uint256', input0);
    }

    async burn (eoa: {address: TAddress, key: string}, to: TAddress): Promise<TxWriter> {
        return this.$write('function burn(address) returns (uint256 amount0,uint256 amount1)', eoa, to);
    }

    async decimals (): Promise<number> {
        return this.$read('function decimals() returns uint8');
    }

    async factory (): Promise<TAddress> {
        return this.$read('function factory() returns address');
    }

    async getReserves (): Promise<{ _reserve0: bigint, _reserve1: bigint, _blockTimestampLast: number }> {
        return this.$read('function getReserves() returns (uint112 _reserve0,uint112 _reserve1,uint32 _blockTimestampLast)');
    }

    async initialize (eoa: {address: TAddress, key: string}, _token0: TAddress, _token1: TAddress): Promise<TxWriter> {
        return this.$write('function initialize(address, address)', eoa, _token0, _token1);
    }

    async kLast (): Promise<bigint> {
        return this.$read('function kLast() returns uint256');
    }

    async mint (eoa: {address: TAddress, key: string}, to: TAddress): Promise<TxWriter> {
        return this.$write('function mint(address) returns uint256 liquidity', eoa, to);
    }

    async name (): Promise<string> {
        return this.$read('function name() returns string');
    }

    async nonces (input0: TAddress): Promise<bigint> {
        return this.$read('function nonces(address) returns uint256', input0);
    }

    async permit (eoa: {address: TAddress, key: string}, owner: TAddress, spender: TAddress, value: bigint, deadline: bigint, v: number, r: Buffer | string, s: Buffer | string): Promise<TxWriter> {
        return this.$write('function permit(address, address, uint256, uint256, uint8, bytes32, bytes32)', eoa, owner, spender, value, deadline, v, r, s);
    }

    async price0CumulativeLast (): Promise<bigint> {
        return this.$read('function price0CumulativeLast() returns uint256');
    }

    async price1CumulativeLast (): Promise<bigint> {
        return this.$read('function price1CumulativeLast() returns uint256');
    }

    async skim (eoa: {address: TAddress, key: string}, to: TAddress): Promise<TxWriter> {
        return this.$write('function skim(address)', eoa, to);
    }

    async swap (eoa: {address: TAddress, key: string}, amount0Out: bigint, amount1Out: bigint, to: TAddress, data: Buffer | string): Promise<TxWriter> {
        return this.$write('function swap(uint256, uint256, address, bytes)', eoa, amount0Out, amount1Out, to, data);
    }

    async symbol (): Promise<string> {
        return this.$read('function symbol() returns string');
    }

    async sync (eoa: {address: TAddress, key: string}, ): Promise<TxWriter> {
        return this.$write('function sync()', eoa);
    }

    async token0 (): Promise<TAddress> {
        return this.$read('function token0() returns address');
    }

    async token1 (): Promise<TAddress> {
        return this.$read('function token1() returns address');
    }

    async totalSupply (): Promise<bigint> {
        return this.$read('function totalSupply() returns uint256');
    }

    async transfer (eoa: {address: TAddress, key: string}, to: TAddress, value: bigint): Promise<TxWriter> {
        return this.$write('function transfer(address, uint256) returns bool', eoa, to, value);
    }

    async transferFrom (eoa: {address: TAddress, key: string}, from: TAddress, to: TAddress, value: bigint): Promise<TxWriter> {
        return this.$write('function transferFrom(address, address, uint256) returns bool', eoa, from, to, value);
    }

    onApproval (fn: (owner: TAddress, spender: TAddress, value: bigint) => void): ClientEventsStream<any> {
        return this.$on('Approval', fn);
    }

    onBurn (fn: (sender: TAddress, amount0: bigint, amount1: bigint, to: TAddress) => void): ClientEventsStream<any> {
        return this.$on('Burn', fn);
    }

    onMint (fn: (sender: TAddress, amount0: bigint, amount1: bigint) => void): ClientEventsStream<any> {
        return this.$on('Mint', fn);
    }

    onSwap (fn: (sender: TAddress, amount0In: bigint, amount1In: bigint, amount0Out: bigint, amount1Out: bigint, to: TAddress) => void): ClientEventsStream<any> {
        return this.$on('Swap', fn);
    }

    onSync (fn: (reserve0: bigint, reserve1: bigint) => void): ClientEventsStream<any> {
        return this.$on('Sync', fn);
    }

    onTransfer (fn: (from: TAddress, to: TAddress, value: bigint) => void): ClientEventsStream<any> {
        return this.$on('Transfer', fn);
    }

    abi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]
}
