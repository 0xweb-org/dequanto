import di from 'a-di';
import alot from 'alot';
import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { ITransactionDetails } from '@dequanto/models/ITransactionDetails';
import { utils } from 'ethers'
import { TransactionDescription } from 'ethers/lib/utils';
import { Transaction } from 'web3-core';
import { ContractProvider } from './ContractProvider';


export class TxContract {

    private provider = di.resolve(ContractProvider, this.loader);

    constructor (private loader: IBlockChainExplorer = di.resolve(Etherscan)) {

    }

    async parseTrasaction (tx: Transaction): Promise<TransactionDescription> {
        const abi = await this.provider.getAbi(tx.to);

        const inter = new utils.Interface(abi);
        const decodedInput = inter.parseTransaction({
            data: tx.input,
            value: tx.value,
        });

        return decodedInput;
    }

    async parseTrasactions (arr: Transaction[]): Promise<ITransactionDetails[]> {
        let mapped = await alot(arr).mapAsync(async tx => {
            let details = await this.parseTrasaction(tx);
            return {
                ...tx,
                details: details as any
            };
        }).toArrayAsync();

        return mapped;
    }
}
