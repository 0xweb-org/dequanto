import { TBufferLike } from '@dequanto/models/TBufferLike';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TransactionRequest } from '@ethersproject/abstract-provider';

import type Web3 from 'web3';
import { provider } from 'web3-core';
import { IPoolClientConfig } from '../ClientPool';

export interface IWeb3Client {
    platform: string
    chainId: number
    defaultGasLimit: number

    sign (txData: TransactionRequest, privateKey: string): Promise<TBufferLike>
}


export interface IWeb3ClientOptions {
    endpoints: IPoolClientConfig[]
    platform?: TPlatform
    chainId?: number
    // Token symbol: e.g. ETH
    chainToken?: string
    // alias to `provider`
    web3?: Web3 | provider
    provider?: Web3 | provider

    debug?: {
        setStorageAt?: {
            call: 'hardhat_setStorageAt' | string
            params: 3 | number
        },
        setCode?: {
            call: 'hardhat_setCode' | string
            params: 2 | number
        },
        setBalance?: {
            call: 'hardhat_setBalance' | string,
            params: 2 | number
        },
        impersonateAccount?: {
            call: 'hardhat_impersonateAccount' | string,
            params: 1 | number
        },
        stopImpersonatingAccount?: {
            call: 'hardhat_stopImpersonatingAccount' | string,
            params: 1 | number,
        },
        reset?: {
            call: 'hardhat_reset' | string,
            params: 1 | number
        }
    }
}
