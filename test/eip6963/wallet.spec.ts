import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';

import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { EntryPoint } from '@dequanto-contracts/erc4337/EntryPoint/EntryPoint';
import { MockWallet } from './MockWallet';
import { $sig } from '@dequanto/utils/$sig';
import { TokenTransferService } from '@dequanto/tokens/TokenTransferService';
import { $bigint } from '@dequanto/utils/$bigint';


const provider = new HardhatProvider();
const client = await provider.client();
const explorer = await provider.explorer();
const wallet = new MockWallet(client);

UTest({
    async $after () {
        //await wallet.detach()
    },
    async 'transfer from account1 to 2'() {
        wallet.announce();
        const account = wallet.addAccount();
        const account2 = await $sig.$account.generate();

        await client.debug.setBalance(account.address, 10n**18n);

        await wallet.unlockAccount(account);
        let address = await client.wallet.connect();
        eq_(address, account.address);

        let amount = 0.003;
        let transfer = new TokenTransferService(client);
        let tx = await transfer.transfer({ address: account.address }, account2.address, 'ETH', amount);
        let receipt = await tx.wait();

        let account2Balance = await client.getBalance(account2.address);
        eq_($bigint.toEther(account2Balance), amount);
    },

})
