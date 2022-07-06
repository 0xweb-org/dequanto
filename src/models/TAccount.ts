import { TAddress } from './TAddress';
import { TPlatform } from './TPlatform';


export interface IAccount {
    type?: 'eoa' | 'safe'
    name?: string
    address?: TAddress
    platform?: TPlatform
}


export interface ChainAccount extends IAccount {
    type?: 'eoa'
    key?: string;
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

export type TAccount = string | ChainAccount | SafeAccount;
