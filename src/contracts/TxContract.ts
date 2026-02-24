import di from 'a-di';
import alot from 'alot';
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { ITransactionDetails } from '@dequanto/models/ITransactionDetails';
import { ContractProvider } from './ContractProvider';
import { TEth } from '@dequanto/models/TEth';
import { $abiUtils } from '@dequanto/utils/$abiUtils';

export class TxContract {

    private provider: ContractProvider;

    constructor (private explorer: IBlockchainExplorer) {
        this.provider = di.resolve(ContractProvider, explorer);
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
