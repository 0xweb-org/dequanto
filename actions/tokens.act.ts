import di from 'a-di'
import { TokensService } from '@dequanto/tokens/TokensService';
import { UAction } from 'atma-utest';
import { TPCoingecko } from '@dequanto/tokens/TokenProviders/TPCoingecko';
import { l } from '@dequanto/utils/$logger';

UAction.create({
    async '!redownload tokens' () {
        let provider = di.resolve(TokensService);

        let r = await provider.redownload();
        console.log(`Downloaded`, r.length, `[0]`, r[0]);
    },

    'fetch single providers': {
        async 'coingecko' () {
            let p = new TPCoingecko();
            let tokens = await p.redownloadTokens();
            l`Fetched ${tokens.length} tokens`;
        }
    },
    'test single providers': {
        async 'coingecko' () {
            let p = new TPCoingecko();
            let weth = await p.getBySymbol('celo', 'WETH');
            console.log(weth);
            eq_(weth.decimals, 18);
        }
    },
})
