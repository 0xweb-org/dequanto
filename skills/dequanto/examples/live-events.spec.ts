import { Web3ClientFactory } from 'dequanto/clients/Web3ClientFactory';
import { ERC20 } from 'dequanto/prebuilt/openzeppelin/ERC20';
import { Rpc } from 'dequanto/rpc/Rpc';
import { $promise } from 'dequanto/utils/$promise';
import { $require } from 'dequanto/utils/$require';

const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

UTest({
    $config: {
        timeout: 60_000
    },

    'expose generated and low-level subscription APIs' () {
        eq_(typeof ERC20.prototype.onTransfer, 'function');
        eq_(typeof ERC20.prototype.onLog, 'function');
        eq_(typeof Rpc.prototype.eth_subscribe, 'function');
    },

    async '// generated contract subscriptions require a configured wss endpoint' () {
        const client = await Web3ClientFactory.getAsync('eth');
        const usdc = new ERC20(USDC, client);

        // Prefer the generated, event-specific method for typed callback arguments.
        const callbackStream = usdc.onTransfer(event => {
            console.log(event.name, event.arguments);
        });

        // The same method returns a stream when the callback is omitted.
        const transferStream = usdc.onTransfer();
        const listener = transferStream.subscribe(
            event => console.log(event.arguments),
            error => console.error(error)
        );

        // Subscribe by event name when the name is selected dynamically.
        const namedStream = usdc.onLog('Transfer', event => {
            console.log(event.name, event.arguments);
        });

        $require.notNull(callbackStream);
        $require.notNull(namedStream);
        listener.unsubscribe();
    },

    async '// client newHeads subscription requires a configured wss endpoint' () {
        const client = await Web3ClientFactory.getAsync('eth');
        const subscription = await client.subscribe('newHeads');

        try {
            const block = await $promise.timeout(
                new Promise((resolve, reject) => {
                    subscription.subscribe(resolve, reject, true);
                }),
                30_000,
                'Waiting for the next block'
            );
            $require.notNull(block);
        } finally {
            await subscription.unsubscribe();
        }
    },

    async '// raw Rpc subscription requires RPC_ETH_WS' () {
        const wsUrl = $require.notNull(process.env.RPC_ETH_WS, 'Set RPC_ETH_WS to a wss:// endpoint');
        const rpc = new Rpc(wsUrl);
        const subscription = await rpc.eth_subscribe('newHeads');

        try {
            const block = await $promise.timeout(
                new Promise((resolve, reject) => {
                    subscription.subscribe(resolve, reject, true);
                }),
                30_000,
                'Waiting for the next block'
            );
            $require.notNull(block);
        } finally {
            await subscription.unsubscribe();
        }
    }
});
