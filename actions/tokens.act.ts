import di from 'a-di'
import { TokensService } from '@dequanto/tokens/TokensService';
import { UAction } from 'atma-utest';

UAction.create({
    async 'redownload tokens' () {
        let provider = di.resolve(TokensService);

        let r = await provider.redownload();
        console.log(`Downloaded`, r.length, `[0]`, r[0]);
    }
})
