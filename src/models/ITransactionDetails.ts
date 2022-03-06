import { TransactionDescription } from 'ethers/lib/utils';
import { Transaction } from 'web3-core';


export interface ITransactionDetails extends Transaction {
    isError?: '1' | string
    details?: {
        name: string
        args: any[]
    }
}
