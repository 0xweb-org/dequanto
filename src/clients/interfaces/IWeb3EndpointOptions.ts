import { IConfigData } from '@dequanto/config/interface/IConfigData';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TTransport } from '@dequanto/rpc/transports/ITransport';


export interface IWeb3EndpointOptions {
    type?: 'private'
    safe?: boolean
    ws?: boolean

    endpoints?: IConfigData['web3']['eth']['endpoints']
    web3?: TTransport.Transport
    platform?: TPlatform
    chainId?: number
    chainToken?: string
}
