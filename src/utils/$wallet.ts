import { ChainAccount } from '@dequanto/ChainAccounts';
import { Wallet, utils } from 'ethers';

export namespace $wallet {
    export async function ecdsaSign (account: ChainAccount, message: string) {
        let wallet = new Wallet(account.key);
        let signature = await wallet.signMessage(message);
        return signature;
    }
}
