import type { RpcTypes } from '@dequanto/rpc/Rpc'
import { TAddress } from './TAddress';
import { TEth } from './TEth';
import { TPlatform } from './TPlatform';

export interface IAccount {
    type?: 'eoa' | 'safe' | 'erc4337' | 'timelock'
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
    key?: TEth.Hex | `p1:0x${string}`
    signer?: IRpcSigner
}

interface IRpcSigner {
    eth_sign (account: TEth.Address, data: TEth.Hex): Promise<TEth.Hex>
    eth_signTransaction (tx: TEth.TxLike): Promise<TEth.Hex>
    eth_signTypedData_v4 (address: TEth.Address, typedData: Partial<RpcTypes.TypedData>): Promise<TEth.Hex>
    personal_sign (challenge: string, address: TEth.Address): Promise<TEth.Hex>
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

export interface TimelockAccount extends IAccount {
    type: 'timelock'
    provider?: 'default' | string

    // Erc4337 account must include platform information
    platform: TPlatform

    operator: EoAccount
}

export type TAccount = string | IAccount | EoAccount | SafeAccount | Erc4337Account;
