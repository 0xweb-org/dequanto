import { TAddress } from '@dequanto/models/TAddress'
import { TPlatform } from './TPlatform'

export interface ITokenBase {
    symbol?: string
    name?: string
    platform?: TPlatform
    address?: TAddress
    decimals?: number
    logo?: string
    type?: 'ERC20' | 'ERC721' | 'fiat' | 'commodity'
}
export interface IToken extends ITokenBase {
    symbol?: string
    name?: string
    platform: TPlatform
    address: TAddress
    decimals?: number
    logo?: string
    type?: 'ERC20'
}

export interface ITokenFiat extends ITokenBase {
    symbol: string
    name?: string
    type?: 'fiat'
}

export interface IToken721 extends ITokenBase {
    name?: string
    platform: TPlatform
    address: TAddress
    tokenId: bigint
    type?: 'ERC721'
}
