# RPC Clients

Use dequanto RPC clients for node access. Prefer `await Web3ClientFactory.getAsync(platform, opts?)` so configuration is loaded before RPC, explorer, and chain services are used.

Key source files:

- `src/clients/Web3ClientFactory.ts`
- `src/clients/Web3Client.ts`
- `src/clients/EvmWeb3Client.ts`
- `src/clients/ClientPool.ts`
- `src/rpc/Rpc.ts`
- `src/rpc/RpcBase.ts`

Useful tests:

- `test/Web3Client.spec.ts`
- `test/client/block.spec.ts`
- `test/node/block.spec.ts`
- `test/subscriptions.spec.ts`

## Client Creation

```ts
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';

const client = await Web3ClientFactory.getAsync('eth');
```

For Hardhat:

```ts
const client = await Web3ClientFactory.getAsync('hardhat');
```

For a fork-like platform string:

```ts
const client = await Web3ClientFactory.getAsync('hh:eth');
```

For direct endpoints:

```ts
import { EvmWeb3Client } from '@dequanto/clients/EvmWeb3Client';

const client = new EvmWeb3Client({
    platform: 'eth',
    chainId: 1,
    endpoints: [{ url: process.env.RPC_URL_ETH }]
});
```

## Common Reads

```ts
const blockNumber = await client.getBlockNumber();
const block = await client.getBlock('latest');
const balance = await client.getBalance(address);
const tx = await client.getTransaction(hash);
const receipt = await client.getTransactionReceipt(hash);
const code = await client.getCode(contractAddress);
const chainId = await client.getChainId();
```

Storage:

```ts
const slot0 = await client.getStorageAt(contractAddress, 0);
const slots = await client.getStorageAtBatched(contractAddress, [0, 1, 2]);
```

Raw contract call:

```ts
const result = await client.readContract({
    address: tokenAddress,
    abi,
    method: 'balanceOf',
    params: [owner]
});
```

## Logs

Use `getPastLogs(filter, options?)` for raw log queries. It handles block-range pagination and node range limits.

```ts
const logs = await client.getPastLogs({
    address: tokenAddress,
    fromBlock,
    toBlock,
    topics: [transferTopic]
});
```

For large ranges, use `streamed: true` and `onProgress`.

## Subscriptions

Use `subscribe(...)` for websocket subscriptions:

```ts
const sub = await client.subscribe('newHeads', (error, block) => {
    if (error) throw error;
    console.log(block.number);
});
```

For contract events, generated contracts expose `$onLog(event, cb?)`.

## Avoid

- Do not use raw `fetch`/HTTP for Ethereum JSON-RPC when `Web3Client` or `client.getRpc()` can do it.
- Do not call `getWeb3()` on `Web3Client`; the base class throws and points to the compatibility layer.

