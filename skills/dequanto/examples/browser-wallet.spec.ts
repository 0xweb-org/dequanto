import { Web3ClientFactory } from 'dequanto/clients/Web3ClientFactory';
import { TokenTransferService } from 'dequanto/tokens/TokenTransferService';
import { $require } from 'dequanto/utils/$require';
import { $sig } from 'dequanto/utils/$sig';
import { $bigint } from 'dequanto/utils/$bigint';
import { MockWallet } from '../../../test/eip6963/MockWallet';

// In browser applications (dApps), dequanto discovers injected wallets via EIP-6963 / EIP-1193.
// When an account is connected to client.wallet, TxWriter routes transactions to the browser wallet
// for signing and submission without needing a private key.
UTest({
    async 'connect to an injected browser wallet and send a transaction' () {
        const client = await Web3ClientFactory.getAsync('hh:memory');

        // Setup mock injected provider (simulates MetaMask or Rabby announcing via EIP-6963)
        const mockWallet = new MockWallet(client);
        const walletAccount = mockWallet.addAccount();
        const recipient = $sig.$account.generate();

        await client.debug.setBalance(walletAccount.address, 10n ** 18n);
        mockWallet.unlockAccount(walletAccount);
        mockWallet.announce();

        // 1. Discover available wallets
        const providers = await client.wallet.getProviders();
        $require.True(providers.some(x => x.info.uuid === mockWallet.uuid));

        // 2. Connect wallet (calls eth_requestAccounts)
        const accounts = await client.wallet.connect(mockWallet.uuid);
        $require.True(client.wallet.isConnected(walletAccount.address));
        $require.eq(accounts[0], walletAccount.address);

        // 3. Send transaction from browser wallet (no private key required)
        const transfer = new TokenTransferService(client);
        const tx = await transfer.transfer({ address: walletAccount.address }, recipient.address, 'ETH', 0.05);
        const receipt = await tx.wait();

        $require.Hex(receipt.transactionHash);
        const recipientBalance = await client.getBalance(recipient.address);
        $require.eq($bigint.toEther(recipientBalance), 0.05);
    }
});
