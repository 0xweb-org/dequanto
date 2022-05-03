import { TBufferLike } from '@dequanto/models/TBufferLike';
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
    chainId?: number
    // alias to `provider`
    web3?: Web3 | provider
    provider?: Web3 | provider
}
