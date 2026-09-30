import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';

import { MockWallet } from './MockWallet';
import { $sig } from '@dequanto/utils/$sig';
import { TokenTransferService } from '@dequanto/tokens/TokenTransferService';
import { $bigint } from '@dequanto/utils/$bigint';


const provider = new HardhatProvider();
const client = await provider.client();
const wallet = new MockWallet(client);

UTest({
    async 'should transfer from account 1 to account 2'() {
        const account = wallet.addAccount();
        const account2 = $sig.$account.generate();

        await client.debug.setBalance(account.address, 10n ** 18n);

        wallet.unlockAccount(account);
        wallet.announce();

        let [ address ] = await client.wallet.connect(wallet.uuid);
        eq_(address, account.address);

        let amount = 0.003;
        let transfer = new TokenTransferService(client);
        let tx = await transfer.transfer({ address: account.address }, account2.address, 'ETH', amount);
        await tx.wait();

        let account2Balance = await client.getBalance(account2.address);
        eq_($bigint.toEther(account2Balance), amount);
    },
    async 'should select a newly announced wallet by UUID' () {
        const secondWallet = new MockWallet(client);
        const secondAccount = secondWallet.addAccount();

        secondWallet.unlockAccount(secondAccount);
        secondWallet.announce();

        const providers = await client.wallet.getProviders();
        eq_(providers.some(x => x.info.uuid === wallet.uuid), true);
        eq_(providers.some(x => x.info.uuid === secondWallet.uuid), true);

        const [ address ] = await client.wallet.connect(secondWallet.uuid);
        eq_(address, secondAccount.address);
        eq_(client.wallet.factory.selected.info.uuid, secondWallet.uuid);
    }
})
