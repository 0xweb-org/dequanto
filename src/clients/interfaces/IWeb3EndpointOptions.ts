import { Config } from '@dequanto/Config';

export interface IWeb3EndpointOptions {
    type?: 'private'
    safe?: boolean
    ws?: boolean

    endpoints?: Config['web3']['eth']['endpoints']
}
