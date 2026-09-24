import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { ERC20 } from '@dequanto/prebuilt/openzeppelin/ERC20';
import { $account } from '@dequanto/utils/$account';
import { $erc20 } from '@dequanto/utils/$erc20';
import { $require } from '@dequanto/utils/$require';

const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' as const;
const INITIAL_SENDER_BALANCE = 100_000_000n;
const TRANSFER_AMOUNT = 42_000_000n;

UTest({
    async 'transfer USDC with a prebuilt ERC20 contract class' () {
        const client = await Web3ClientFactory.getAsync('hh:memory:eth');
        const sender = $account.generate('sender');
        const recipient = $account.generate('recipient');
        const usdc = new ERC20(USDC, client);

        // Test-only fork setup: fund the sender with native gas and USDC balance.
        await client.debug.setBalance(sender.address, 1e18);
        await $erc20.setBalanceAny(client, usdc.address, sender.address, 100);

        $require.eq(await usdc.symbol(), 'USDC');
        $require.eq(await usdc.decimals(), 6);
        $require.eq(await usdc.balanceOf(sender.address), INITIAL_SENDER_BALANCE);

        await usdc.$receipt().transfer(sender, recipient.address, TRANSFER_AMOUNT);
        $require.eq(await usdc.balanceOf(recipient.address), TRANSFER_AMOUNT);
    }
});