import memd from 'memd';

import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'


import { TAddress } from './models/TAddress'
import { TPlatform } from './models/TPlatform'
import { $config } from './utils/$config'
import { $address } from './utils/$address';
import { $crypto, $cryptoImpl } from './utils/$crypto';
import { $buffer } from './utils/$buffer';
import { ChainAccount, IAccount, SafeAccount } from './models/TAccount';
import { $contract } from './utils/$contract';
import { TEth } from './models/TEth';
import { $hex } from './utils/$hex';


export namespace ChainAccountProvider {
    export function get (platform: TPlatform, name: string): IAccount {
        let accounts = AccountsConfigProvider.get();
        let acc: ChainAccount = accounts?.[platform]?.[name];
        if (acc == null) {
            throw new Error(`Account not resolved by name: ${name} in ${platform}`);
        }
        acc.name = name;
        acc.platform = platform;
        return acc;
    }
    export function tryGet (mix: string | TAddress, platform?): IAccount {
        let all = this.getAll();

        let accounts = all.filter(x => ($address.eq(mix, x.address) || x.name == mix));
        if (accounts.length === 0) {
            return null;
        }
        let acc = accounts[0];
        return {
            ... acc,
            platform: platform ?? acc.platform
        };
    }
    export function getAll (): IAccount[] {
       return AccountsConfigProvider.get();
    }
    export function getAddressFromKey (key: TEth.BufferLike): TEth.Address {
        // use NodeJS crypto module
        const crypto = new $cryptoImpl.Node()
        const wallet = crypto.createECDH('secp256k1');

        wallet.setPrivateKey(
            typeof key ==='string'
            ? $buffer.fromHex(key)
            : key
        );
        //slices the 04 prefix
        const pubKeyBuffer = wallet.getPublicKey().slice(1);
        const address = $contract.keccak256(pubKeyBuffer).slice(-40);
        return $address.toChecksum(`0x${address}`);
    }

    export function getAccountFromMnemonic(mnemonic: string, index: number): ChainAccount
    export function getAccountFromMnemonic(mnemonic: string, path: string): ChainAccount
    export function getAccountFromMnemonic(mnemonic: string, mix: number | string = 0): ChainAccount {
        const path = typeof mix === 'number'
            ? `m/44'/60'/0'/${mix}`
            : mix;
        const seed = mnemonicToSeedSync(mnemonic);
        const hdKey = HDKey.fromMasterSeed(seed);
        const account = hdKey.derive(path);

        return {
            key: $hex.ensure(account.privateKey),
            address: getAddressFromKey(account.privateKey),
        };
    }
    export function generate (opts?: { name?: string, platform?: TPlatform }): ChainAccount {
        const bytes = $crypto.randomBytes(32);
        const address = $address.toChecksum(getAddressFromKey(bytes));
        return {
            ...(opts ?? {}),
            address: address,
            key: $buffer.toHex(bytes as any)
        };
    }

    class AccountsConfigProvider {
        @memd.deco.memoize()
        static get (): IAccount[] {

            type TDictionary = {
                [platform: string]: {
                    [name: string]: ChainAccount | SafeAccount
                }
            };

            let accounts: TDictionary | (ChainAccount | SafeAccount)[] = $config.get('accounts');
            if (accounts == null) {
                return [];
            }
            if (Array.isArray(accounts)) {
                return accounts;
            }
            let out = [];
            for (let platform in accounts) {
                for (let name in accounts[platform]) {
                    let account = accounts[platform][name];
                    account.name = name;
                    account.platform = platform as TPlatform;
                    out.push(account);
                }
            }
            return out;
        }
    }
}
