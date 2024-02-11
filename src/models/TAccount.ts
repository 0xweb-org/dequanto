import { TAddress } from './TAddress';
import { TEth } from './TEth';
import { TPlatform } from './TPlatform';


export interface IAccount {
    type?: 'eoa' | 'safe' | 'erc4337'
    name?: string
    platform?: TPlatform

    address?: TAddress
    key?: TEth.Hex | `p1:0x${string}`;
}

export interface IAccountTx extends IAccount {
    value?: number | string | bigint;
}


export interface EoAccount extends IAccount {
    type?: 'eoa'
    key?: TEth.Hex | `p1:0x${string}`;
}

export interface SafeAccount extends IAccount {
    type: 'safe'
    provider?: 'gnosis'

    // Safe account must include platform information
    platform: TPlatform

    /**
     * @deprecated backcomp. Use `address` prop
     */
    safeAddress?: TAddress

    operator: EoAccount

    owners?: (string | EoAccount)[]
    threshold?: number
}

export interface Erc4337Account extends IAccount {
    type: 'erc4337'
    provider?: 'default' | string

    // Erc4337 account must include platform information
    platform: TPlatform

    operator: EoAccount
}

export type TAccount = string | IAccount | EoAccount | SafeAccount | Erc4337Account;
