import di from 'a-di';
import { EoAccount } from "@dequanto/models/TAccount";
import { ChainAccountService } from '@dequanto/ChainAccountService';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IToken } from '@dequanto/models/IToken';
import { ISwapService } from './defi/ISwapService';
import { Paraswap } from './defi/paraswap/Paraswap';
import { $require } from '@dequanto/utils/$require';


export class TokenSwapService {

    constructor(
        public client: Web3Client,
        public provider: ISwapService = di.resolve(Paraswap, client.platform, client)
    ) {

    }

    async swap (account: string | EoAccount, params: {
        from: string | IToken
        to: string | IToken
        amount: number | bigint
    }) {
        let $account: EoAccount;

        if (typeof account === 'string') {
            let accountsService = di.resolve(ChainAccountService);
            let acc = await accountsService.get(account, { platform: this.client.platform });
            $account = $require.notNull(acc as EoAccount, `Account ${account} not found`);
        } else {
            $account = account;
        }

        let { from, to, amount } = params;

        let tx = await this.provider.swap($account, {
            from:  from,
            to: to,
            fromAmount: amount,
        });
        return tx;
    }
}
