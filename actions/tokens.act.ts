import di from 'a-di'
import alot from 'alot';
import axios from 'axios'
import { TokensService } from '@dequanto/tokens/TokensService';
import { UAction } from 'atma-utest';
import { TPCoingecko } from '@dequanto/tokens/TokenProviders/TPCoingecko';
import { l } from '@dequanto/utils/$logger';
import { $str } from '@dequanto/solidity/utils/$str';
import { File } from 'atma-io';
import { $require } from '@dequanto/utils/$require';
import { TPlatform } from '@dequanto/models/TPlatform';
import { ChainlinkFeedProvider } from '@dequanto/tokens/TokenOracles/chainlink/ChainLinkFeedProvider';

UAction.create({
    async 'redownload tokens' () {
        let provider = di.resolve(TokensService);

        let r = await provider.redownload();
        console.log(`Downloaded`, r.length, `[0]`, r[0]);
    },
    async '!redownload chainlink' () {
        let provider = di.resolve(ChainlinkFeedProvider);
        let r = await provider.redownload();
    },

    '//fetch single providers': {
        async 'coingecko' () {
            let p = new TPCoingecko();
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
