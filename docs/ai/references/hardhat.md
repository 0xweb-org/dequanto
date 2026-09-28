# Hardhat Development And Forking

Dequanto integrates Hardhat as a development and forking network for contract development and experimenting with live contracts on a local fork. Use `client.debug` to mine blocks, change balances and storage, impersonate accounts, and restore snapshots. These changes affect the local network only.

Key source files:

- `src/clients/Web3ClientFactory.ts`
- `src/hardhat/HardhatProvider.ts`
- `src/hardhat/HardhatWeb3Client.ts`
- `src/clients/debug/ClientDebugMethods.ts`
- `src/utils/$erc20.ts`
- `src/txs/TxWriter.ts`

Runnable examples: [Hardhat debug operations](../examples/hardhat-debug.spec.ts) and [forked ERC20 transfers](../examples/hardhat-fork.spec.ts). The fork example requires an accessible Ethereum RPC.

## Create A Network Or Fork

Use a project with Hardhat installed and a `hardhat.config.*` file.

```ts
import { Web3ClientFactory } from 'dequanto/clients/Web3ClientFactory';

// Initialize an in-memory Ethereum fork using the platform's default/configured RPCs.
const client = await Web3ClientFactory.getAsync('hh:memory:eth');
```

Replace `eth` with the platform to fork. Optionally pass `{ block: 20_000_000, url: 'https://...' }` as the second argument to select a block and override the source RPC. Initializing an in-memory fork resets the shared Hardhat network; create it before taking snapshots or changing state.

To use a separately running local Hardhat node, start it with Ethereum forking configured through Hardhat's normal node setup, then connect:

```ts
const client = await Web3ClientFactory.getAsync('hh:eth');
```

This connects to the local node (by default `127.0.0.1:8545`) and associates it with Ethereum. It does not start the node or configure its fork.

For an in-memory development network without a fork, use `hh:memory`. Use `hardhat` to connect to a separately running local development node. See [deployments](deployments.md) for compiling and deploying contracts.

## Impersonate An Account

On Hardhat, submit transactions from any address, including a contract address, by passing an account with `type: 'impersonated'`. No private key is required. The transaction writer enables impersonation automatically.

```ts
import { ERC20 } from 'dequanto/prebuilt/openzeppelin/ERC20';
import { $erc20 } from 'dequanto/utils/$erc20';

const usdc = new ERC20('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', client);
const account = {
    address: '0x0000000000000000000000000000000000001234',
    type: 'impersonated'
} as const;
const to = '0x0000000000000000000000000000000000005678';
const amount = 1_000_000n; // 1 USDC in its smallest units.

await client.debug.setBalance(account.address, 10n ** 18n);
await $erc20.setBalanceAny(client, usdc.address, account.address, amount);
const writer = await usdc.$receipt().transfer(account, to, amount);
console.log(writer.receipt.transactionHash);
```

Contract checks still apply, including sufficient token balances and allowances. For explicit control, use `client.debug.impersonateAccount(address)` and `client.debug.stopImpersonatingAccount(address)`.

## Advance The Network

```ts
await client.debug.mine('5days');
await client.debug.mine(10); // Mine 10 blocks.
```

Time strings are converted to seconds and used as the block count, with a default interval of one second per block. `mine('5days')` therefore mines `432_000` blocks, advancing network time by approximately five days. The optional second argument sets the interval in seconds.

## Set Native And ERC20 Balances

Set the native balance of any account or contract in wei:

```ts
await client.debug.setBalance(account.address, 10n ** 18n); // 1 ETH.
```

Use `$erc20.setBalanceAny` to set an ERC20 balance without knowing its storage slot:

```ts
await $erc20.setBalanceAny(client, usdc.address, account.address, 1_000_000n);
// A number is interpreted in whole-token units instead:
await $erc20.setBalanceAny(client, usdc.address, account.address, 1);
```

The helper traces `balanceOf(account)` with `debug_traceCall`, examines accessed storage for the returned balance, and writes the matching slot. A `bigint` amount is in the token's smallest units; a `number` is converted using the token's decimals. This changes balance storage directly without minting tokens or updating total supply. Tokens whose balances are computed rather than stored directly may not be supported.

## Set Contract Storage

For a known storage slot, use:

```ts
await client.debug.setStorageAt(contractAddress, slot, '0x2a');
```

The value is padded to 32 bytes. For named variables, mappings, and packed fields, use a resolved storage layout with `SlotsStorage.set(...)`; see [Solidity storage](storage.md#write-storage-in-tests).

## Snapshots And Rollbacks

```ts
const id = await client.debug.snapshot();
try {
    await client.debug.mine('5days');
    await client.debug.setBalance(account.address, 10n ** 18n);
    // Run transactions or assertions against the modified state.
} finally {
    await client.debug.revert(id);
}
```

Take the snapshot before modifying state. Create a fresh snapshot for each independent scenario.