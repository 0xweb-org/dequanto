/**
 *  AUTO-Generated Class: 2021-11-12 12:23
 */
import di from 'a-di';
import { TAddress } from '@dequanto/models/TAddress';

import { Polyscan } from '@dequanto/BlockchainExplorer/Polyscan';
import { PolyWeb3Client } from '@dequanto/clients/PolyWeb3Client';
import { ClientEventsStream } from '@dequanto/clients/ClientEventsStream';
import { ContractBase } from '@dequanto/contracts/ContractBase';
import { TransactionReceipt } from 'web3-core';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import type { TxWriter } from '@dequanto/txs/TxWriter';


export class ERC20Base extends ContractBase {
    constructor(
        public address: TAddress = '',
        public client: Web3Client = di.resolve(PolyWeb3Client),
        public explorer: IBlockChainExplorer = di.resolve(Polyscan)
    ) {
        super(address, client, explorer)
    }

    async name (): Promise<string> {
        return this.$read('function name() returns string');
    }

    async approve (eoa: {address: TAddress, key: string}, _spender: TAddress, _value: bigint): Promise<TxWriter> {
        return this.$write('function approve(address, uint256) returns bool', eoa, _spender, _value);
    }

    async totalSupply (): Promise<bigint> {
        return this.$read('function totalSupply() returns uint256');
    }

    async transferFrom (eoa: {address: TAddress, key: string}, _from: TAddress, _to: TAddress, _value: bigint): Promise<TxWriter> {
        return this.$write('function transferFrom(address, address, uint256) returns bool', eoa, _from, _to, _value);
    }

    async decimals (): Promise<number> {
        return this.$read('function decimals() returns uint8');
    }

    async balanceOf (_owner: TAddress): Promise<bigint> {
        return this.$read('function balanceOf(address) returns uint256', _owner);
    }

    async symbol (): Promise<string> {
        return this.$read('function symbol() returns string');
    }

    async transfer (eoa: {address: TAddress, key: string}, _to: TAddress, _value: bigint): Promise<TxWriter> {
        return this.$write('function transfer(address, uint256) returns bool', eoa, _to, _value);
    }

    async allowance (_owner: TAddress, _spender: TAddress): Promise<bigint> {
        return this.$read('function allowance(address, address) returns uint256', _owner, _spender);
    }

    onApproval (fn: (owner: TAddress, spender: TAddress, value: bigint) => void): ClientEventsStream<any> {
        return this.$on('Approval', fn);
    }

    onTransfer (fn: (from: TAddress, to: TAddress, value: bigint) => void): ClientEventsStream<any> {
        return this.$on('Transfer', fn);
    }

    extractLogsApproval (tx: TransactionReceipt): TLogApproval[] {
        let abi = this.$getAbiItem('event', 'Approval');
        return this.$extractLogs(tx, abi) as any as TLogApproval[];
    }

    extractLogsTransfer (tx: TransactionReceipt): TLogTransfer[] {
        let abi = this.$getAbiItem('event', 'Transfer');
        return this.$extractLogs(tx, abi) as any as TLogTransfer[];
    }

    abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
}

    type TLogApproval = {
        contract: TAddress,
        owner: TAddress, spender: TAddress, value: bigint
    }
    type TLogTransfer = {
        contract: TAddress,
        from: TAddress, to: TAddress, value: bigint
    }
