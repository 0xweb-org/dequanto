import { TxData } from '@ethereumjs/tx';
import type Web3 from 'web3';
import { IPoolClientConfig } from '../ClientPool';

export interface IWeb3Client {
    platform: string
    chainId: number
    defaultGasLimit: number

    sign (txData: TxData, privateKey: string): Buffer
}


export interface IWeb3ClientOptions {
    endpoints: IPoolClientConfig[]
    chainId?: number
    web3?: Web3
}
