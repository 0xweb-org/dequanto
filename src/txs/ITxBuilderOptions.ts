import { EoAccount } from "@dequanto/models/TAccount";
import { TAddress } from '@dequanto/models/TAddress';
import { TAbiItem } from '@dequanto/types/TAbi';
import { TxNonceManager } from './TxNonceManager';


export interface ITxBuilderNonceOptions {

    // sets the nonce of the first tx in pending state
    overriding?: boolean

    nonce?: number | bigint | TxNonceManager

    /**
     * (Set the nonce of the N-th tx in pending state)
     * Nonce will be generated for pending transactions:
     * 1: Used nonce of the first pending transaction will
     * 2: second pending transaction
     * ...
     * In any case MAX is the count of pending transactions, so any value is safe.
     */
    noncePending?: number
}

export interface ITxBuilderOptions extends ITxBuilderNonceOptions {
    gasPrice?: bigint
    gasPriceRatio?: number
    gasLimit?: number
    gasLimitRatio?: number

    gasFunding?: EoAccount
    gasEstimation?: boolean

    /** Used for gasEstimation */
    from?: TAddress
    send?: 'manual' | 'auto'

    type?: 0 | 1 | 2

    abi?: TAbiItem[]
}
