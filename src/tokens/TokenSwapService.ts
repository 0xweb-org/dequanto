import { ChainAccount } from "@dequanto/models/TAccount";
import { ChainAccountsService } from '@dequanto/ChainAccountsService';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { TxLoggerService } from '@dequanto/loggers/TxLoggerService';
import { IToken } from '@dequanto/models/IToken';
import di from 'a-di';
import { ISwapService } from './defi/ISwapService';
import { Paraswap } from './defi/paraswap/Paraswap';


export class TokenSwapService {

    constructor(
        public client: Web3Client,
        public provider: ISwapService = di.resolve(Paraswap, client.platform, client)
    ) {

    }

    async swap (account: string | ChainAccount, params: {
        from: string | IToken
        to: string | IToken
        amount: number | bigint
    }) {
        if (typeof account === 'string') {
            let accountsService = di.resolve(ChainAccountsService);
            let acc = await accountsService.get(account, this.client.platform);
            if (acc == null) {
                throw new Error(`Account ${account} not found`);
            }
            account = acc;
        }
        // let transfer = di.resolve(TokenTransferService, this.client);
        // let balance = await transfer.getBalance(account, params.from);
        // let token = await transfer.getToken(TOKEN_FROM);
        // let amount = balance - $bigint.toWei(24, token.decimals);

        let { from, to, amount } = params;

        let tx = await this.provider.swap(account, {
            from:  from,
            to: to,
            fromAmount: amount,
        });
        return tx;
    }
}
