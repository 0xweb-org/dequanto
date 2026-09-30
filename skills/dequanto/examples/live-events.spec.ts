import { TEth } from 'dequanto/models/TEth';
import { Web3ClientFactory } from 'dequanto/clients/Web3ClientFactory';
import { ERC20 } from 'dequanto/prebuilt/openzeppelin/ERC20';
import { $account } from 'dequanto/utils/$account';
import { $erc20 } from 'dequanto/utils/$erc20';
import { $promise } from 'dequanto/utils/$promise';
import { $require } from 'dequanto/utils/$require';

const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' as const;
const TRANSFER_AMOUNT = 1_000_000n; // 1 USDC (6 decimals).

UTest({
    $config: {
        timeout: 60_000
    },

    async 'subscribe to contract events with a generated contract class' () {
        const client = await Web3ClientFactory.getAsync('hh:memory:eth');
        const usdc = new ERC20(USDC, client);

        let eventFromTypedCallback = null;
        let eventFromTypedStream = null;
        let eventFromNamedCallback = null;

        // Prefer the generated, event-specific method for typed callback arguments.
        usdc.onTransfer(event => {
            eventFromTypedCallback = event;
        });

        // The same method returns a stream when the callback is omitted.
        const transferStream = usdc.onTransfer();
        const listener = transferStream.subscribe(
            event => {
                eventFromTypedStream = event;
            },
            error => {
                throw error;
            }
        );

        // Subscribe by event name when the name is selected dynamically.
        usdc.onLog('Transfer', event => {
            eventFromNamedCallback = event;
        });

        const sender = $account.generate('sender');
        const receiver = $account.generate('receiver');

        // Test-only fork setup: fund the sender with native gas and USDC balance.
        await client.debug.setBalance(sender.address, 10n ** 18n);
        await $erc20.setBalanceAny(
            client,
            usdc.address,
            sender.address,
            TRANSFER_AMOUNT
        );

        try {
            const writer = await usdc
                .$receipt()
                .transfer(sender, receiver.address, TRANSFER_AMOUNT);

            for (const event of [
                eventFromTypedCallback,
                eventFromTypedStream,
                eventFromNamedCallback
            ]) {
                const receivedEvent = $require.notNull(event);
                $require.eq(receivedEvent.name, 'Transfer');
                $require.eq(receivedEvent.event.address, usdc.address);
                $require.eq(
                    receivedEvent.event.transactionHash,
                    writer.receipt.transactionHash
                );
            }
        } finally {
            listener.unsubscribe();
        }
    },

    async 'subscribe to new block headers with Web3Client' () {
        const client = Web3ClientFactory.get('hh:memory');
        const previousBlockNumber = await client.getBlockNumber();
        const subscription = await client.subscribe('newHeads');

        try {
            const nextBlock = $promise.timeout(
                new Promise<TEth.Block>((resolve, reject) => {
                    subscription.subscribe(resolve, reject, true);
                }),
                5_000,
                'Waiting for the next block'
            );
            await client.debug.mine(1);

            const block = await nextBlock;
            $require.eq(block.number, previousBlockNumber + 1);
        } finally {
            await subscription.unsubscribe();
        }
    },

    async 'subscribe to new block headers with the low-level Rpc client' () {
        const client = Web3ClientFactory.get('hh:memory');
        const previousBlockNumber = await client.getBlockNumber();
        const rpc = await client.getRpc({ ws: true });
        const subscription = await rpc.eth_subscribe('newHeads');

        try {
            const nextBlock = $promise.timeout(
                new Promise<TEth.Block>((resolve, reject) => {
                    subscription.subscribe(resolve, reject, true);
                }),
                5_000,
                'Waiting for the next block'
            );
            await client.debug.mine(1);

            const block = await nextBlock;
            $require.eq(block.number, previousBlockNumber + 1);
        } finally {
            await subscription.unsubscribe();
        }
    }
});
