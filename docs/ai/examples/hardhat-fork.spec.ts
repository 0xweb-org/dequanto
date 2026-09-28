import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { ERC20 } from '@dequanto/prebuilt/openzeppelin/ERC20';
import { $erc20 } from '@dequanto/utils/$erc20';
import { $require } from '@dequanto/utils/$require';

UTest({
    async 'set an ERC20 balance and transfer from an impersonated account on a fork' () {
        // Requires an accessible Ethereum RPC from the dequanto configuration.
        const client = await Web3ClientFactory.getAsync('hh:memory:eth');
        // To use an already running local Ethereum fork, use getAsync('hh:eth').
        const usdc = new ERC20('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', client);
        const account = {
            address: '0x0000000000000000000000000000000000001234',
            type: 'impersonated'
        } as const;
        const to = '0x0000000000000000000000000000000000005678';
        const amount = 1_000_000n; // 1 USDC (6 decimals).


        await client.debug.setBalance(account.address, 10n ** 18n);
        await $erc20.setBalanceAny(client, usdc.address, account.address, amount);
        $require.eq(await usdc.balanceOf(account.address), amount);

        const recipientBalance = await usdc.balanceOf(to);
        const writer = await usdc.$receipt().transfer(account, to, amount);

        $require.Hex(writer.receipt.transactionHash);
        $require.eq(await usdc.balanceOf(account.address), 0n);
        $require.eq(await usdc.balanceOf(to), recipientBalance + amount);
    }
});
