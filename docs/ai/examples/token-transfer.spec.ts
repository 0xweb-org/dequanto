import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { TokenTransferService } from '@dequanto/tokens/TokenTransferService';
import { TokensService } from '@dequanto/tokens/TokensService';

UTest({
    async 'load known token metadata and read a live token balance' () {
        const client = await Web3ClientFactory.getAsync('eth');
        const tokens = new TokensService('eth');
        const usdc = await tokens.getKnownToken('USDC');
        const service = new TokenTransferService(client);

        const balance = await service.getBalance(
            '0x0000000000000000000000000000000000000000',
            usdc
        );

        eq_(usdc.symbol, 'USDC');
        eq_(usdc.decimals, 6);
        eq_(usdc.address.toLowerCase(), '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
        gte_(balance, 0n);
    }
});