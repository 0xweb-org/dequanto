import di from 'a-di';
import alot from 'alot';
import { IToken } from '@dequanto/models/IToken';
import { TokensService } from '@dequanto/tokens/TokensService';
import { Wallet } from './Wallet';

export class WalletService {
    constructor (public wallet: Wallet) {

    }

    async getTokens (fromBlock?: number): Promise<IToken[]> {
        let wallet = this.wallet;
        let account = wallet.account;

        let events = await wallet.explorer.getErc20Transfers(
            account.address,
            fromBlock,
        );

        let service = di.resolve(TokensService, account.platform, wallet.explorer);
        let tokens = await alot(events)
            .map(x => x.contractAddress)
            .distinct()
            .mapAsync(async address => {
                let token = await service.getKnownToken(address);

                if (token?.address == null) {
                    return null;
                }
                return token
            })
            .toArrayAsync({ threads: 10 });

        return tokens.filter(Boolean);
    }
}



class WalletTokensEntity {

}
