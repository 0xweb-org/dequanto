import di from 'a-di';
import alot from 'alot';
import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { ITransactionDetails } from '@dequanto/models/ITransactionDetails';
import { ContractProvider } from './ContractProvider';
import { TEth } from '@dequanto/models/TEth';
import { $abiUtils } from '@dequanto/utils/$abiUtils';

export class TxContract {

    private provider = di.resolve(ContractProvider, this.explorer);

    constructor (private explorer: IBlockChainExplorer = di.resolve(Etherscan)) {

    }

    async parseTransaction (tx: TEth.TxLike)  {
        const abi = await this.provider.getAbi(tx.to);

        return this.parseTransactionWithAbi(tx, abi);
    }

    async parseTransactionWithAbi (tx: TEth.TxLike, abi) {
        return $abiUtils.parseMethodCallData(abi, tx);
    }

    async parseTransactions (arr: TEth.TxLike[]): Promise<ITransactionDetails[]> {
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
