import { TAddress } from '@dequanto/models/TAddress'
import { TPlatform } from './TPlatform'

export interface IToken {
    symbol?: string
    name?: string
    platform: TPlatform
    address: TAddress
    decimals?: number
    logo?: string
}
