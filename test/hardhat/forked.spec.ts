import { ERC20 } from '@dequanto-contracts/openzeppelin/ERC20';
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { $account } from '@dequanto/utils/$account';

UTest({
    $config: {
        timeout: 90_000
    },
    async 'should fork the mainnet' () {
        const provider = new HardhatProvider();
        const client = await provider.forked({ platform: 'eth' });
        const owner = $account.generate();

        return UTest({
            $config: {
                timeout: 90_000
            },
            async 'read data from forked network' () {
                const reader = new ContractReader(client);
                // https://data.chain.link/ethereum/mainnet/crypto-usd/eth-usd
                const result = await reader.readAsync('0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419', 'description() returns (string)');
                eq_(result, 'ETH / USD');
            },
            async 'write to forked network' () {
                // https://etherscan.io/address/0x60faae176336dab62e284fe19b885b095d29fb7f
                const ownerImpersonated = '0x60faae176336dab62e284fe19b885b095d29fb7f';
                const daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
                const erc20 = new ERC20(daiAddress, client);

                const balanceDai = await erc20.balanceOf(ownerImpersonated);
                const balanceEth = await client.getBalance(ownerImpersonated);

                gt_(balanceDai, 10n**6n, 'Account should have some DAI (otherwise select another live account)');
                gt_(balanceEth, 10n**10n, 'Account should have some ETH (otherwise select another live account)');

                await client.debug.impersonateAccount(ownerImpersonated);

                const writer = await erc20.transfer({ address: ownerImpersonated }, owner.address, 100n);
                const receipt = await writer.wait();

                let transferEvents = erc20.extractLogsTransfer(receipt);
                eq_(transferEvents.length, 1);

                let balance = await erc20.balanceOf(owner.address);
                eq_(balance, 100n);

                await client.debug.stopImpersonatingAccount(ownerImpersonated);
            },
            async $after () {
                await client.debug.reset({});
            }
        })
    },
})

