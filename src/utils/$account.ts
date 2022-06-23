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

        let acc = 'safeAddress' in account
            ? account.operator
            : account;

        return acc;
    }

    export function isSafe (account:TAccount): account is SafeAccount {
        return typeof account !== 'string' && 'safeAddress' in account;
    }
}
