import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'

import { TPlatform } from '@dequanto/models/TPlatform';
import { EoAccount, Erc4337Account, SafeAccount, TAccount } from "@dequanto/models/TAccount";
import { $address } from './$address';
import { $sig } from './$sig';
import { $hex } from './$hex';


export namespace $account {

    export function generate (opts?: { name?: string, platform?: TPlatform }): EoAccount {
        let { key, address } = $sig.$account.generate();
        return {
            ...(opts ?? {}),
            key,
            address
        };
    }

    export async function fromMnemonic(mnemonic: string, index: number): Promise<EoAccount>
    export async function fromMnemonic(mnemonic: string, path: string): Promise<EoAccount>
    export async function fromMnemonic(mnemonic: string, mix: number | string): Promise<EoAccount>
    export async function fromMnemonic(mnemonic: string, mix: number | string = 0): Promise<EoAccount> {
        const path = typeof mix === 'number'
            ? `m/44'/60'/0'/${mix}`
            : mix;
        const seed = mnemonicToSeedSync(mnemonic);
        const hdKey = HDKey.fromMasterSeed(seed);
        const account = hdKey.derive(path);
        const key = $hex.ensure(account.privateKey);
        return await fromKey(key);
    }

    export async function fromKey(key: EoAccount['key']): Promise<EoAccount> {
        return <EoAccount> {
            type: 'eoa',
            address: await $sig.$account.getAddressFromKey(key),
            key: key
        };
    }

    export function getSender (account: TAccount): EoAccount {
        if (typeof account === 'string') {
            if ($address.isValid(account)) {
                return { address: account };
            }
            return { name: account };
        }

        let acc = isSafe(account) || isErc4337 (account)
            ? account.operator
            : account;

        return acc as EoAccount;
    }

    export function isSafe (account:TAccount): account is SafeAccount {
        if (account == null) {
            return false;
        }
        let rgx = /^safe\//;
        if (typeof account === 'string') {
            return rgx.test(account);
        }
        if (account.type === 'safe' || rgx.test(account.name)) {
            return true;
        }
        return false;
    }

    export function isErc4337 (account:TAccount): account is Erc4337Account {
        if (account == null) {
            return false;
        }
        let rgx = /^erc4337\//;
        if (typeof account === 'string') {
            return rgx.test(account);
        }
        if (account.type === 'erc4337' || rgx.test(account.name)) {
            return true;
        }
        return false;
    }
}
