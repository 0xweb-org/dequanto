import { ChainAccount } from "@dequanto/models/TAccount";
import { TAddress } from '@dequanto/models/TAddress';
import { TAbiItem } from '@dequanto/types/TAbi';

export interface ITxConfig {
    gasPrice?: bigint
    gasPriceRatio?: number
    gasLimit?: number
    gasLimitRatio?: number

    gasFunding?: ChainAccount
    gasEstimation?: boolean

    /** Used for gasEstimation */
    from?: TAddress
    send?: 'manual' | 'auto'
    nonce?: number
    type?: 1 | 2

    /**
     * Nonce will be generated for pending transactions:
     * 1: Used nonce of the first pending transaction will
     * 2: second pending transaction
     * ...
     * In any case MAX is the count of pending transactions, so any value is safe.
     */
    noncePending?: number


    abi?: TAbiItem[]
}
