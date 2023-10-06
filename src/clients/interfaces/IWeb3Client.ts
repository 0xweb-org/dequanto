import { TBufferLike } from '@dequanto/models/TBufferLike';
import { TPlatform } from '@dequanto/models/TPlatform';

import { IPoolClientConfig } from '../ClientPool';
import { TEth } from '@dequanto/models/TEth';
import { TTransport } from '@dequanto/rpc/transports/ITransport';

export interface IWeb3Client {
    platform: string
    chainId: number
    defaultGasLimit: number

    sign (txData: TEth.Tx, privateKey: string): Promise<TBufferLike>
}


export interface IWeb3ClientOptions {
    endpoints: IPoolClientConfig[]
    platform?: TPlatform
    chainId?: number
    // Token symbol: e.g. ETH
    chainToken?: string
    // alias to `provider`
    web3?: TTransport.Transport
    provider?: TTransport.Transport

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
