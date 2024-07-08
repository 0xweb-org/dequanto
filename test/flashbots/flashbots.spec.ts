import { ERC20 } from '@dequanto-contracts/openzeppelin/ERC20'
import { ChainAccountService } from '@dequanto/ChainAccountService';
import { Config } from '@dequanto/config/Config';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { FlashbotsProvider } from '@dequanto/flashbots/FlashbotsProvider';
import { EoAccount } from '@dequanto/models/TAccount';
import { $is } from '@dequanto/utils/$is';
import memd from 'memd';

// integration test

UTest({
    async '//integration test'() {
        memd.fn.clearMemoized(Config.fetch);

        const config = await Config.fetch({
            configGlobal: 'test/config.yml',
            dotenv: true,
        });

        const client = Web3ClientFactory.get('eth:goerli');
        // WETH https://sepolia.etherscan.io/address/0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14
        // WETH https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6
        const TOKEN = ({
            'eth:goerli': `0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6`,
            'eth:sepolia': `0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14`,
        } as const)[ client.platform ];

        const account = await ChainAccountService.get<EoAccount>('DequantoIntegrationAccount', { config })

        if (account?.key == null) {
            console.log(`Skip flashbots integration test because TEST_ACCOUNT_KEY is not set`);
            return;
        }

        let balance = await client.getBalance(account.address);
        if (balance < 10n ** 10n) {
            console.log(`Skip flashbots integration test because account ${account.address} has low balance: ${balance}`);
            return;
        }
        let flashbots = await FlashbotsProvider.create(client, account);

        // some tx to test serialization and submission
        let token = new ERC20(TOKEN, client);

        return UTest({
            async 'check send Bundle'() {
                let { signed: txHex } = await token.$signed().approve(account, account.address, 700n);
                let bundleHash = await flashbots.sendPrivateTransaction({
                    tx: txHex,
                });
                console.log('Executed', bundleHash);
                eq_($is.Hex(bundleHash), true, `Not a valid bundle hash: ${bundleHash}`);
            },
            async 'check send MEV Bundle'() {
                // some tx to test serialization and submission
                let { signed: txHex } = await token.$signed().approve(account, account.address, 500n);

                let simulated = await flashbots.simMevBundle({
                    body: [ { tx: txHex } ],
                });
                eq_(simulated.success, true);

                let executed = await flashbots.sendMevBundle({
                    body: [ { tx: txHex } ],
                });
                eq_($is.Hex(executed.bundleHash), true, `Not a valid bundle hash: ${executed.bundleHash}`);
                eq_($is.Hex(executed.block), true, `Not a valid block: ${executed.bundleHash}`);

                console.log('Executed', executed);
                let status = await flashbots.getBundleStats({
                    bundleHash: executed.bundleHash,
                    blockNumber: executed.block,
                });
                console.log('Status', status);
            },
        })
    }
})
