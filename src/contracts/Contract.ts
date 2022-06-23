import di from 'a-di'
import alot from 'alot'
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer'
import { IContractDetails } from '@dequanto/models/IContractDetails'
import { ContractProvider, IContractProvider } from './ContractProvider'
import { IContractReader } from './ContractReader'

import { Transaction, TransactionReceipt } from 'web3-core';
import { utils } from 'ethers'
import { ITransactionDetails } from '@dequanto/models/ITransactionDetails'
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder'
import { TxWriter } from '@dequanto/txs/TxWriter'
import { Web3Client } from '@dequanto/clients/Web3Client'
import { $contract } from '@dequanto/utils/$contract'
import { ChainAccount } from "@dequanto/models/TAccount"
import { $is } from '@dequanto/utils/$is'

export interface IContractInit {
    Ctor?:  new (...args) => any
    explorer?: IBlockChainExplorer
    client?: Web3Client

    refAbi?: string
}

export abstract class Contract {
    name: string = null
    address: string = null
    proxyImpl: string = null
    refAbi: string = null
    abi: string = null

    opts: IContractInit

    protected abstract client: Web3Client
    protected abstract runner: IContractReader
    protected abstract provider: IContractProvider
    protected abstract explorer: IBlockChainExplorer

    constructor (data: Partial<IContractDetails>, opts: IContractInit) {
        this.name = data.name;
        this.address = data.address;
        this.proxyImpl = data.proxy;
        this.refAbi = data.refAbi;
        this.abi = data.abi;
        this.opts = opts;
    }

    readAsync<T = any>(methodAbi: string, ...params): Promise<T> {
        return this.runner.readAsync(this.address, methodAbi, ...params);
    }

    async writeAsyncWithAccount<T = any>(account: ChainAccount, interfaceAbi: string, ...params): Promise<TxWriter> {

        let txBuilder = new TxDataBuilder(this.client, account, {
            to: this.address
        });

        txBuilder.setInputDataWithABI(interfaceAbi, ...params);
        await Promise.all([
            txBuilder.setGas(),
            txBuilder.setNonce(),
        ]);

        return TxWriter.write(this.client, txBuilder, account);
    }

    async getTransactionsFor (address: string, opts?: { decode?: boolean }): Promise<ITransactionDetails[]> {
        let txs = await this.explorer.getTransactions(address);
        txs = txs.filter(x => x.to.toUpperCase() === this.address.toUpperCase());
        if (opts?.decode) {
            txs = await this.parseTrasactions(txs);
        }
        return txs;
    }

    async parseTrasaction (tx: Transaction): Promise<ITransactionDetails> {
        const abiAddress = this.refAbi
            ?? this.proxyImpl
            ?? this.address
            ?? tx.to;

        const abi = this.abi ?? await this.provider.getAbi(abiAddress);
        const inter = new utils.Interface(abi);
        const decodedInput = inter.parseTransaction({
            data: tx.input,
            value: tx.value,
        });



        return {
            ...tx,
            details: {
                name: decodedInput.name,
                args: $contract.normalizeArgs(Array.from(decodedInput.args))
            }
        };
    }

    async parseTrasactions (arr: Transaction[]): Promise<ITransactionDetails[]> {
        return await alot(arr).mapAsync(async tx => {
            return await this.parseTrasaction(tx);
        }).toArrayAsync();
    }




    protected static async create<T extends Contract> (mix: string, opts?: IContractInit): Promise<T> {
        let provider = di.resolve(ContractProvider, opts.explorer)

        let info = await provider.getInfo(mix)
        if (info == null) {
            let byName = $is.Address(mix) === false;
            if (byName) {
                throw new Error(`Contract by name not found ${mix}`);
            }
            info = <any> { address: mix };
        }

        return new opts.Ctor({
            refAbi: opts.refAbi,
            ...info,
        }, opts);
    }
}
