import { Web3ClientFactory } from 'dequanto/clients/Web3ClientFactory';
import { $require } from 'dequanto/utils/$require';

UTest({
    async 'change balances, storage, and time on Hardhat and roll back'() {
        const client = await Web3ClientFactory.getAsync('hh:memory');
        const address = '0x0000000000000000000000000000000000001234';
        const balanceBefore = await client.getBalance(address);
        const storageBefore = await client.getStorageAt(address, 0);
        const blockBefore = await client.getBlockNumber();
        const id = await client.debug.snapshot();

        await client.debug.setBalance(address, 10n ** 18n);
        $require.eq(await client.getBalance(address), 10n ** 18n);

        // The same operation writes a known slot at any contract address.
        await client.debug.setStorageAt(address, 0, '0x2a');
        $require.eq(BigInt(await client.getStorageAt(address, 0)), 42n);

        await client.debug.mine('5days');
        $require.eq(await client.getBlockNumber(), blockBefore + 432_000);

        await client.debug.revert(id);

        $require.eq(await client.getBalance(address), balanceBefore);
        $require.eq(await client.getStorageAt(address, 0), storageBefore);
        $require.eq(await client.getBlockNumber(), blockBefore);
    }
});
