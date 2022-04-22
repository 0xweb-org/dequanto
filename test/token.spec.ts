import { TokensService } from '@dequanto/tokens/TokensService';

UTest({
    async 'should load token data' () {
        let service = new TokensService('eth');
        let usdc = await service.getKnownToken('USDC');
        eq_(usdc.decimals, 6);
        eq_(usdc.name, 'USD Coin');
        eq_(usdc.address, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
    }
})
