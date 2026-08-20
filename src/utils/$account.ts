import { EoAccount, Erc4337Account, SafeAccount, TAccount, TimelockAccount } from "@dequanto/models/TAccount";
import { $address } from './$address';
import { $require } from './$require';

export namespace $account {

    export function getSender (account: TAccount): EoAccount {
        if (typeof account === 'string') {
            if ($address.isValid(account)) {
                return { address: account };
            }
            return { name: account };
        }

        let acc = isSafe(account) || isErc4337 (account) || isTimelock(account)
            ? account.operator
            : account;

        $require.notNull(acc, `Sender not resolved for ${ account?.address ?? account }`);
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
        if (account.type != null && typeof account.type === 'string') {
            return account.type === 'safe';
        }
        // Optimistic match by pattern "safe/";
        return rgx.test(account.name);
    }

    export function isErc4337 (account:TAccount): account is Erc4337Account {
        if (account == null) {
            return false;
        }
        let rgx = /^erc4337\//;
        if (typeof account === 'string') {
            return rgx.test(account);
        }
         if (account.type != null && typeof account.type === 'string') {
            return account.type === 'erc4337';
        }
        // Optimistic match by pattern "erc4337/";
        return rgx.test(account.name);
    }

    export function isTimelock (account:TAccount): account is TimelockAccount {
        if (account == null) {
            return false;
        }
        let rgx = /^timelock\//;
        if (typeof account === 'string') {
            return rgx.test(account);
        }
        if (account.type != null && typeof account.type === 'string') {
            return account.type === 'timelock';
        }
        // Optimistic match by pattern "timelock/";
        return rgx.test(account.name);
    }
}
