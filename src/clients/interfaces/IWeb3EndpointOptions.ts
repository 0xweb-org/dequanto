import { Config } from '@dequanto/Config';
import type Web3 from 'web3';

export interface IWeb3EndpointOptions {
    type?: 'private'
    safe?: boolean
    ws?: boolean

    endpoints?: Config['web3']['eth']['endpoints']
    web3?: Web3
    chainId?: number
}
