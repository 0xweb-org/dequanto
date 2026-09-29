import { Web3ClientFactory } from 'dequanto/clients/Web3ClientFactory';
import { BlockDateResolver } from 'dequanto/blocks/BlockDateResolver';
import { Config } from 'dequanto/config/Config';
import { $date } from 'dequanto/utils/$date';
import { $require } from 'dequanto/utils/$require';

UTest({
    async 'read common RPC data via Web3Client directly' () {
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
    },

    async 'resolve a block number and timestamp from a date' () {
        const client = await Web3ClientFactory.getAsync('eth');
        const resolver = new BlockDateResolver(client);
        const date = new Date('2026-03-03T10:20:00Z');

        const blockNumber = await resolver.getBlockNumberFor(date);
        const info = await resolver.getBlockInfoFor(date);
        const blockDate = await resolver.getDate(blockNumber);

        $require.eq(blockNumber, 24576295);
        $require.eq(blockNumber, 24576295);
        $require.lte(Math.abs($date.toUnixTimestamp(date) - info.timestamp), 1);
        $require.eq(blockDate.toISOString(), new Date('2026-03-03T10:19:59Z').toISOString());
    }
});
