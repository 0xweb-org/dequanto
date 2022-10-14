import { Config } from '@dequanto/Config';
import { TPlatform } from '@dequanto/models/TPlatform';
import type Web3 from 'web3';

export interface IWeb3EndpointOptions {
    type?: 'private'
    safe?: boolean
    ws?: boolean

    endpoints?: Config['web3']['eth']['endpoints']
    web3?: Web3
    platform?: TPlatform
    chainId?: number
}
