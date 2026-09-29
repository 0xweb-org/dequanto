# Browser and dApp Integration

Dequanto works in browser applications (Vite, Webpack, Next.js, vanilla web). In the browser, transactions and signatures are delegated to connected Web3 wallets (MetaMask, Rabby, Coinbase Wallet, etc.) via EIP-6963 and EIP-1193.

Key source files:

- `src/clients/WalletClient.ts`
- `src/wallets/EIP6963ProviderFactory.ts`
- `src/clients/Web3Client.ts`
- `src/txs/TxWriter.ts`

Runnable example: [browser wallet connection and transfer](../examples/browser-wallet.spec.ts).

## Accessing the Wallet

```ts
import { Web3ClientFactory } from 'dequanto/clients/Web3ClientFactory';

const client = await Web3ClientFactory.getAsync('eth');

// 1. Discover available injected wallets (EIP-6963)
const providers = await client.wallet.getProviders();

// 2. Connect (prompts user wallet)
const [account] = await client.wallet.connect();

// 3. Listen to wallet events
client.wallet.factory.on('onAccountsChanged', (detail, accounts) => {
    console.log('Account switched:', accounts[0]);
});
client.wallet.factory.on('onChainChanged', (detail, chainId) => {
    console.log('Network switched:', chainId);
});
```

## Sending Transactions from Browser

Pass the user's address as an EOA account with no `key`. Because `client.wallet.isConnected(account.address)` is true, `TxWriter` delegates signing and submission to the browser wallet:

```ts
const tx = await token.$receipt().transfer({ address: account }, recipient, 100n);
console.log('Mined tx:', tx.receipt.transactionHash);
```
