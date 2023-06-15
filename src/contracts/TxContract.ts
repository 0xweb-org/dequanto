import di from 'a-di';
import alot from 'alot';
import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { ITransactionDetails } from '@dequanto/models/ITransactionDetails';
import { utils } from 'ethers'
import { TransactionDescription } from 'ethers/lib/utils';
import { Transaction } from 'web3-core';
import { ContractProvider } from './ContractProvider';
import type { AbiItem } from 'web3-utils';

export class TxContract {

    private provider = di.resolve(ContractProvider, this.explorer);

    constructor (private explorer: IBlockChainExplorer = di.resolve(Etherscan)) {

    }

    async parseTransaction (tx: Transaction): Promise<TransactionDescription> {
        const abi = await this.provider.getAbi(tx.to);

        return this.parseTransactionWithAbi(tx, abi);
    }

    async parseTransactionWithAbi (tx: Transaction, abi): Promise<TransactionDescription> {
        const inter = new utils.Interface(abi);
        const decodedInput = inter.parseTransaction({
            data: tx.input,
            value: tx.value,
        });
        return decodedInput;
    }

    async parseTransactions (arr: Transaction[]): Promise<ITransactionDetails[]> {
        let mapped = await alot(arr).mapAsync(async tx => {
            let details = await this.parseTransaction(tx);
            return {
                ...tx,
                details: details as any
            };
        }).toArrayAsync();

        return mapped;
    }
}
