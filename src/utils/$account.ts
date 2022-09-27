import { ChainAccount, SafeAccount, TAccount } from "@dequanto/models/TAccount";
import { $address } from './$address';

export namespace $account {

    export function getSender (account: TAccount): ChainAccount {
        if (typeof account === 'string') {
            if ($address.isValid(account)) {
                return { address: account };
            }
            return { name: account };
        }

        let acc = isSafe(account)
            ? account.operator
            : account;

        return acc;
    }

    export function isSafe (account:TAccount): account is SafeAccount {
        if (account == null) {
            return false;
        }
        if (typeof account === 'string') {
            return /^safe\//.test(account);
        }
        return 'operator' in account;
    }
}
