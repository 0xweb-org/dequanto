import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';

UTest({
    async 'read latest block and zero-address balance from live Ethereum RPC' () {
        const client = await Web3ClientFactory.getAsync('eth');

        const latest = await client.getBlockNumber();
        const block = await client.getBlock('latest');
        const balance = await client.getBalance('0x0000000000000000000000000000000000000000');

        gt_(Number(latest), 0);
        gt_(Number(block.timestamp), 0);
        gte_(balance, 0n);
    }
});