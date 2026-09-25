import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { Config } from '@dequanto/config/Config';
import { $require } from '@dequanto/utils/$require';

UTest({
    async '!read common RPC data via Web3Client directly' () {
        const cfg = await Config.fetch();

        const client = await Web3ClientFactory.getAsync('eth');

        const chainId = await client.getChainId();
        const latest = await client.getBlockNumber();
        const block = await client.getBlock('latest');
        const balance = await client.getBalance('0x0000000000000000000000000000000000000000');

        $require.eq(chainId, 1);
        $require.gt(Number(latest), 0);
        $require.gt(Number(block.timestamp), 0);
        $require.gte(balance, 0n);
    },

    async 'call low-level RPC methods from the generated Rpc client' () {
        const client = await Web3ClientFactory.getAsync('eth');
        // getRpc exposes the full generated RPC method list from OpenRPC specs, including eth, core-geth, MetaMask, and Flashbots methods.
        const rpc = await client.getRpc();

        const latest = await rpc.eth_blockNumber();
        const block = await rpc.eth_getBlockByNumber('latest', false);
        const balance = await rpc.eth_getBalance('0x0000000000000000000000000000000000000000', 'latest');

        $require.gt(Number(latest), 0);
        $require.gt(Number(block.timestamp), 0);
        $require.gte(balance, 0n);

        // Use rpc.request for custom or not-yet-generated RPC methods.
        const response = await rpc.request({
            method: 'eth_blockNumber',
            params: []
        });
        $require.gt(Number(response), 0);
    }
});
