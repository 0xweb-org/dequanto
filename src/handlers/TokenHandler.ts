import { ChainAccount } from '@dequanto/ChainAccountProvider';
import { PlatformFactory } from '@dequanto/chains/PlatformFactory';
import { IToken } from '@dequanto/models/IToken';
import { TAddress } from '@dequanto/models/TAddress';
import { TPlatform } from '@dequanto/models/TPlatform';
import { $bigint } from '@dequanto/utils/$bigint';
import { $is } from '@dequanto/utils/$is';
import { $require } from '@dequanto/utils/$require';
import di from 'a-di';
import memd from 'memd';

export class TokenHandler {
    constructor(public platform: TPlatform) {

    }

    async transfer (params: {
        from: TAddress | ChainAccount
        to: TAddress
        token: string | IToken
        amount: number
        internal?: boolean
    }) {


        let fromAccount:ChainAccount = await this.getAccount(params.from, true);
        let toAccount = await this.getAccount(params.to, params.internal);

        let chain = await this.chain();

        let token = typeof params.token === 'string'
            ? await chain.tokens.getKnownToken(params.token)
            : params.token;

        $require.Token(token);
        $require.notNull(fromAccount, 'FromAccount');
        $require.notNull(toAccount, 'ToAccount');

        let amountEther = params.amount;
        if (amountEther == Infinity) {
            let balance = await chain.transfer.getBalance(fromAccount.address, token);
            amountEther = $bigint.toEther(balance, token.decimals);
        }
        console.log('Transfering: ', amountEther, token.symbol);

        let service = chain.transfer
            .$config({
                type: 2
                //gasFunding: ChainAccountProvider.get(PLATFORM, 'quant')
            });

        let txToken = params.amount === Infinity
                ? await service.transferAll(fromAccount, toAccount.address, token)
                : await service.transfer(fromAccount, toAccount.address, token, params.amount);

        return txToken;
    }

    @memd.deco.memoize({ perInstance: true })
    private chain () {
        return di.resolve(PlatformFactory).get(this.platform);
    }

    private async getAccount(mix: string | TAddress | ChainAccount, isPrivate?: boolean) {
        if (typeof mix === 'object' && 'address' in mix && 'key' in mix) {
            return mix;
        }
        let chain = await this.chain();
        let account = await chain.accounts.get(mix);
        if (account == null) {
            if (isPrivate !== false) {
                throw new Error(`Account ${mix} not found`);
            }
            return { address: mix } as any as ChainAccount;
        }
        return account;
    }
}
