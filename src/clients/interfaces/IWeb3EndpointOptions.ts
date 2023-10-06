import { Config } from '@dequanto/Config';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TTransport } from '@dequanto/rpc/transports/ITransport';


export interface IWeb3EndpointOptions {
    type?: 'private'
    safe?: boolean
    ws?: boolean

    endpoints?: Config['web3']['eth']['endpoints']
    web3?: TTransport.Transport
    platform?: TPlatform
    chainId?: number
    chainToken?: string
}
