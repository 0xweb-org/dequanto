import { TAddress } from './TAddress';
import { TPlatform } from './TPlatform';


export class ChainAccount {
    name?: string;
    address?: TAddress;
    key?: string;
    platform?: TPlatform;
}

export class SafeAccount {
    type?: 'gnosis'
    safeAddress: TAddress
    operator: ChainAccount
}

export type TAccount = string | ChainAccount | SafeAccount;
