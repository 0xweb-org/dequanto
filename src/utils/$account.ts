import { ChainAccount, Erc4337Account, SafeAccount, TAccount } from "@dequanto/models/TAccount";
import { $address } from './$address';

export namespace $account {

    export function getSender (account: TAccount): ChainAccount {
        if (typeof account === 'string') {
            if ($address.isValid(account)) {
                return { address: account };
            }
            return { name: account };
        }

        let acc = isSafe(account) || isErc4337 (account)
            ? account.operator
            : account;

        return acc as ChainAccount;
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
