import { TAddress } from '@dequanto/models/TAddress'
import { TPlatform } from '@dequanto/models/TPlatform'

export class ITokenGlob {
    symbol: string
    name: string
    logo?: string

    platforms: {
        platform: TPlatform
        address: TAddress
        decimals: number
    }[]
}
