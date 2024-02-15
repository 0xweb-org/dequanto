import { TAddress } from '@dequanto/models/TAddress'
import { TPlatform } from '@dequanto/models/TPlatform'


export interface INsProviderOptions {
    /**
     * Loop over each chain the provider supports.
     * @default: true
     */
    multichain?: boolean
}

export interface INsProvider {
    supports (domain: string): boolean

    getAddress (domain: string, opts?: INsProviderOptions): Promise<{
        platform: TPlatform
        address: TAddress
    }>
    getContent(uri: string, opts?: INsProviderOptions): Promise<{
        platform: TPlatform
        value: string
    }>
    getReverseName (address: TAddress, opts?: INsProviderOptions): Promise<{
        platform: TPlatform
        name: string
    }>
}
