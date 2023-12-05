import { TAddress } from '@dequanto/models/TAddress'

export interface INsProvider {
    supports (domain: string): boolean
    getAddress (domain: string): Promise<TAddress>
    getContent(uri: string): Promise<string>
}
