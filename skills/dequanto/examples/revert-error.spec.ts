import { HardhatProvider } from 'dequanto/hardhat/HardhatProvider';
import { $account } from 'dequanto/utils/$account';
import { $promise } from 'dequanto/utils/$promise';
import { $require } from 'dequanto/utils/$require';

// No manual pre-flight simulation is necessary: TxWriter and generated contract write methods
// automatically estimate gas before submitting. Gas estimation simulates the transaction;
// if it reverts, dequanto catches the revert, decodes any custom error bytecode using the ABI,
// captures execution traces, and throws a standard JavaScript Error.
// If gas estimation succeeds but the transaction reverts on-chain later, the error flow is identical.
UTest({
    async 'catch automatic revert and decode custom error without manual simulation' () {
        const hh = new HardhatProvider();
        const client = hh.client();
        const deployer = hh.deployer(0);

        const { contract } = await hh.deployCode(`
            contract Vault {
                error InsufficientBalance(uint256 available, uint256 requested);
                uint256 public total;

                function withdraw(uint256 amount) external {
                    uint256 available = 50;
                    if (amount > available) {
                        revert InsufficientBalance(available, amount);
                    }
                    total += amount;
                }
            }
        `, { client });

        const user = $account.generate('user');
        await client.debug.setBalance(user.address, 1e18);

        // Calling $receipt() directly attempts execution; dequanto simulates via gas estimation.
        // It throws a normal Error with decoded custom error details and method context.
        const { error } = await $promise.caught(
            contract.$receipt().withdraw(user, 100n)
        );

        $require.notNull(error, 'Expected transaction to throw on revert');
        $require.has('InsufficientBalance', error.message);
        $require.has('50', error.message);
        $require.has('100', error.message);
    },

    async 'decode custom error when transaction reverts on-chain' () {
        const hh = new HardhatProvider();
        const client = hh.client();

        const { contract } = await hh.deployCode(`
            contract Counter {
                error LimitReached(uint256 max);
                uint256 public count;

                function increment() external {
                    if (count >= 1) {
                        revert LimitReached(1);
                    }
                    count++;
                }
            }
        `, { client });

        const user = $account.generate('user');
        await client.debug.setBalance(user.address, 1e18);

        // First call succeeds and mines
        await contract.$receipt().increment(user);

        // Bypass pre-flight gas estimation so transaction is mined on-chain and reverts there
        const writer = await contract
            .$config({ gasEstimation: false, gasLimit: 100_000 })
            .increment(user);

        const { error } = await $promise.caught(writer.wait());

        $require.notNull(error, 'Expected on-chain revert to throw');
        $require.has('LimitReached', error.message);
        $require.has('1', error.message);
    }
});
