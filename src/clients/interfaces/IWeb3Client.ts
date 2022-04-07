import { TxData } from '@ethereumjs/tx';
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
}
