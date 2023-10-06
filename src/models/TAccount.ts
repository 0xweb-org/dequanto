import { TAddress } from './TAddress';
import { TEth } from './TEth';
import { TPlatform } from './TPlatform';


export interface IAccount {
    type?: 'eoa' | 'safe' | 'erc4337'
    name?: string
    address?: TAddress
    platform?: TPlatform
}


export interface ChainAccount extends IAccount {
    type?: 'eoa'
    key?: TEth.Hex;
}

export interface SafeAccount extends IAccount {
    type: 'safe'
    provider?: 'gnosis',

    /**
     * @deprecated backcomp. Use `address` prop
     */
    safeAddress?: TAddress

    operator: ChainAccount
}

export interface Erc4337Account extends IAccount {
    type: 'erc4337'
    provider?: 'default' | string,

    operator: ChainAccount
}

export type TAccount = string | IAccount | ChainAccount | SafeAccount | Erc4337Account;
