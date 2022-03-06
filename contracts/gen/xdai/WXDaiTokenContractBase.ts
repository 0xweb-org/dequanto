/**
 *  AUTO-Generated Class: 2021-12-15 23:03
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

import { XDaiscan } from '@dequanto/chains/xdai/XDaiscan'
import { XDaiWeb3Client } from '@dequanto/chains/xdai/XDaiWeb3Client'
export class WXDaiTokenContractBase extends ContractBase {
    constructor(
        public address: TAddress = '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
        public client: Web3Client = di.resolve(XDaiWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(XDaiscan)
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
        console.log('WXDaiTokenContractBase.withdraw');
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

    abi = [{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"string","name":""}],"name":"name","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"bool","name":""}],"name":"approve","inputs":[{"type":"address","name":"guy"},{"type":"uint256","name":"wad"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":""}],"name":"totalSupply","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"bool","name":""}],"name":"transferFrom","inputs":[{"type":"address","name":"src"},{"type":"address","name":"dst"},{"type":"uint256","name":"wad"}],"constant":false},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"withdraw","inputs":[{"type":"uint256","name":"wad"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint8","name":""}],"name":"decimals","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":""}],"name":"balanceOf","inputs":[{"type":"address","name":""}],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"string","name":""}],"name":"symbol","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"bool","name":""}],"name":"transfer","inputs":[{"type":"address","name":"dst"},{"type":"uint256","name":"wad"}],"constant":false},{"type":"function","stateMutability":"payable","payable":true,"outputs":[],"name":"deposit","inputs":[],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":""}],"name":"allowance","inputs":[{"type":"address","name":""},{"type":"address","name":""}],"constant":true},{"type":"fallback","stateMutability":"payable","payable":true},{"type":"event","name":"Approval","inputs":[{"type":"address","name":"src","indexed":true},{"type":"address","name":"guy","indexed":true},{"type":"uint256","name":"wad","indexed":false}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"type":"address","name":"src","indexed":true},{"type":"address","name":"dst","indexed":true},{"type":"uint256","name":"wad","indexed":false}],"anonymous":false},{"type":"event","name":"Deposit","inputs":[{"type":"address","name":"dst","indexed":true},{"type":"uint256","name":"wad","indexed":false}],"anonymous":false},{"type":"event","name":"Withdrawal","inputs":[{"type":"address","name":"src","indexed":true},{"type":"uint256","name":"wad","indexed":false}],"anonymous":false}]
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
