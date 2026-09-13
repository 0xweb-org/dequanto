import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { ERC20 } from '@dequanto-contracts/openzeppelin/ERC20';

UTest({
    async 'build ERC20 transfer tx data without submitting' () {
        const client = await Web3ClientFactory.getAsync('eth');
        const usdc = new ERC20('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', client);
        const sender = { address: '0x0000000000000000000000000000000000000001' as const };
        const receiver = '0x0000000000000000000000000000000000000002' as const;

        const tx = await usdc.$data().transfer(sender, receiver, 1_000_000n);

        eq_(tx.to.toLowerCase(), usdc.address.toLowerCase());
        has_(tx.data, /^0xa9059cbb/);
    }
});