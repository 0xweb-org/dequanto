import di from 'a-di'
import { l } from '@dequanto/utils/$logger';
import { UAction } from 'atma-utest';
import { Config } from '@dequanto/config/Config';
import { TokensService } from '@dequanto/tokens/TokensService';
import { TPCoingecko } from '@dequanto/tokens/TokenProviders/TPCoingecko';
import { ChainlinkFeedProvider } from '@dequanto/tokens/TokenOracles/chainlink/ChainlinkFeedProvider';
import { TPSushiswap } from '@dequanto/tokens/TokenProviders/TPSushiswap';
import { TPUniswap } from '@dequanto/tokens/TokenProviders/TPUniswap';
import { TPCoinmarketcap } from '@dequanto/tokens/TokenProviders/TPCoinmarketcap';


UAction.create({
    async $before () {
        await Config.fetch();
    },
    async 'redownload-tokens' () {
        let provider = di.resolve(TokensService);

        let r = await provider.redownload();
        console.log(`Downloaded`, r.length, `[0]`, r[0]);
    },
    async 'redownload-chainlink' () {
        let provider = di.resolve(ChainlinkFeedProvider);
        let r = await provider.redownload();
        l`Chainlink Feeds fetchs: ${r.length}`;
    },

    'fetch single providers': {
        async 'coingecko' () {
            let p = new TPCoingecko();
            let tokens = await p.redownloadTokens();
            l`Fetched ${tokens.length} tokens`;
        },
        async 'sushiswap' () {
            let p = new TPSushiswap();
            let tokens = await p.redownloadTokens();
            l`Fetched ${tokens.length} tokens`;
        },
        async 'uniswap' () {
            let p = new TPUniswap();
            let tokens = await p.redownloadTokens();
            l`Fetched ${tokens.length} tokens`;
        },
        async '!coinmarketcap' () {
            let p = new TPCoinmarketcap();
            let tokens = await p.redownloadTokens();
            l`Fetched ${tokens.length} tokens`;
        }
    },
    '//test single providers': {
        async 'coingecko' () {
            let p = new TPCoingecko();
            let weth = await p.getBySymbol('celo', 'WETH');
            console.log(weth);
            eq_(weth.decimals, 18);
        }
    },
})
