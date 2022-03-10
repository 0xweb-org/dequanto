import { TAddress } from './models/TAddress'
import { TPlatform } from './models/TPlatform'
import { $config } from './utils/$config'
import { Wallet } from 'ethers';
import crypto from 'crypto';
import { $address } from './utils/$address';


export class ChainAccount {
    name?: string
    address: TAddress
    key: string
    platform?: TPlatform
}

const accounts: {
    [platform: string]: {
        [name: string]: ChainAccount
    }
} = $config.get('accounts');

export namespace ChainAccountProvider {
    export function get (platform: TPlatform, name: string): ChainAccount {
        let acc: ChainAccount = accounts?.[platform]?.[name];
        if (acc == null) {
            throw new Error(`Account not resolved by name: ${name} in ${platform}`);
        }
        acc.name = name;
        acc.platform = platform;
        return acc;
    }
    export function tryGet (mix: string | TAddress, platform?): ChainAccount {
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
    export function getAll (): ChainAccount[] {
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
    export function getAddressFromKey (key: string) {
        const bytes = Buffer.from(key, 'hex');
        const wallet = new Wallet(bytes);
        return wallet.address;
    }

    export function generate (opts?: { name?: string, platform?: TPlatform }): ChainAccount {
        const bytes = crypto.randomBytes(32);
        const wallet = new Wallet(bytes);
        return {
            ...(opts ?? {}),
            address: wallet.address,
            key: bytes.toString('hex'),
        }
    }
}
