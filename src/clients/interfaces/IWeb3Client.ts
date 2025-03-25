import { TPlatform } from '@dequanto/models/TPlatform';
import { IRpcConfig } from '../ClientPool';
import { TTransport } from '@dequanto/rpc/transports/ITransport';

export interface IWeb3Client {
    platform: string
    chainId: number
    defaultGasLimit: number
}


export interface IWeb3ClientOptions {
    endpoints: IRpcConfig[]
    platform?: TPlatform
    chainId?: number
    // Token symbol: e.g. ETH
    chainToken?: string
    // alias to `provider`
    web3?: TTransport.Transport | Promise<TTransport.Transport>
    provider?: TTransport.Transport

    defaultTxType?: 0 | 1 | 2;
    defaultGasPriceRatio?: number;

    // block time in ms
    blockTimeAvg?: number;

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
        mine?: {
            call: 'hardhat_mine' | string,
            params: 1 | number
        }
    }
}
