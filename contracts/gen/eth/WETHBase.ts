/**
 *  AUTO-Generated Class: 2022-01-21 17:15
 *  Implementation: https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2#code
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
import { IBlockChainExplorer } from '@dequanto/explorer/IBlockChainExplorer';

import { Etherscan } from '@dequanto/explorer/Etherscan'
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client'
export class WETHBase extends ContractBase {
    constructor(
        public address: TAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        public client: Web3Client = di.resolve(EthWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Etherscan)
    ) {
        super(address, client, explorer)
    }

    // 0x06fdde03
    async name (): Promise<string> {
        return this.$read('function name() returns string');
    }

    // 0x095ea7b3
    async approve (eoa: {address: TAddress, key: string, value?: string | number | bigint }, guy: TAddress, wad: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'approve'), eoa, guy, wad);
    }

    // 0x18160ddd
    async totalSupply (): Promise<bigint> {
        return this.$read('function totalSupply() returns uint256');
    }

    // 0x23b872dd
    async transferFrom (eoa: {address: TAddress, key: string, value?: string | number | bigint }, src: TAddress, dst: TAddress, wad: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transferFrom'), eoa, src, dst, wad);
    }

    // 0x2e1a7d4d
    async withdraw (eoa: {address: TAddress, key: string, value?: string | number | bigint }, wad: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'withdraw'), eoa, wad);
    }

    // 0x313ce567
    async decimals (): Promise<number> {
        return this.$read('function decimals() returns uint8');
    }

    // 0x70a08231
    async balanceOf (input0: TAddress): Promise<bigint> {
        return this.$read('function balanceOf(address) returns uint256', input0);
    }

    // 0x95d89b41
    async symbol (): Promise<string> {
        return this.$read('function symbol() returns string');
    }

    // 0xa9059cbb
    async transfer (eoa: {address: TAddress, key: string, value?: string | number | bigint }, dst: TAddress, wad: bigint): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'transfer'), eoa, dst, wad);
    }

    // 0xd0e30db0
    async deposit (eoa: {address: TAddress, key: string, value?: string | number | bigint }, ): Promise<TxWriter> {
        return this.$write(this.$getAbiItem('function', 'deposit'), eoa);
    }

    // 0xdd62ed3e
    async allowance (input0: TAddress, input1: TAddress): Promise<bigint> {
        return this.$read('function allowance(address, address) returns uint256', input0, input1);
    }

    onApproval (fn: (event: EventData, src: TAddress, guy: TAddress, wad: bigint) => void): ClientEventsStream<any> {
        return this.$on('Approval', fn);
    }

    onTransfer (fn: (event: EventData, src: TAddress, dst: TAddress, wad: bigint) => void): ClientEventsStream<any> {
        return this.$on('Transfer', fn);
    }

    onDeposit (fn: (event: EventData, dst: TAddress, wad: bigint) => void): ClientEventsStream<any> {
        return this.$on('Deposit', fn);
    }

    onWithdrawal (fn: (event: EventData, src: TAddress, wad: bigint) => void): ClientEventsStream<any> {
        return this.$on('Withdrawal', fn);
    }

    extractLogsApproval (tx: TransactionReceipt): TLogApproval[] {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi) as any as TLogApproval[];
    }

    extractLogsTransfer (tx: TransactionReceipt): TLogTransfer[] {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi) as any as TLogTransfer[];
    }

    extractLogsDeposit (tx: TransactionReceipt): TLogDeposit[] {
        let abi = this.$getAbiItem('event', 'Deposit');
        return this.$extractLogs(tx, abi) as any as TLogDeposit[];
    }

    extractLogsWithdrawal (tx: TransactionReceipt): TLogWithdrawal[] {
        let abi = this.$getAbiItem('event', 'Withdrawal');
        return this.$extractLogs(tx, abi) as any as TLogWithdrawal[];
    }

    abi = <AbiItem[]>[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]
}

    type TLogApproval = {
        contract: TAddress,
        src: TAddress, guy: TAddress, wad: bigint
    }
    type TLogTransfer = {
        contract: TAddress,
        src: TAddress, dst: TAddress, wad: bigint
    }
    type TLogDeposit = {
        contract: TAddress,
        dst: TAddress, wad: bigint
    }
    type TLogWithdrawal = {
        contract: TAddress,
        src: TAddress, wad: bigint
    }
