import { TokensService } from '@dequanto/tokens/TokensService';
import { TokensServiceFactory } from '@dequanto/tokens/TokensServiceFactory';

UTest({
    async 'should load token data' () {
        let service = new TokensService('eth');
        let usdc = await service.getKnownToken('USDC');
        eq_(usdc.decimals, 6);
        eq_(usdc.name, 'USD Coin');
        eq_(usdc.address, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
    },
    async 'should load token by forked mainnet via hardhat' () {
        let tokens = TokensServiceFactory.get('hardhat');
        let usdc = await tokens.getKnownToken('USDC');
        eq_(usdc.address, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
    }
})
