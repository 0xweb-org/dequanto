# RPC Clients

Use dequanto RPC clients for node access. Prefer `await Web3ClientFactory.getAsync(platform, opts?)` so configuration is loaded before RPC, explorer, and chain services are used.

Key source files:

- `src/clients/Web3ClientFactory.ts`
- `src/clients/Web3Client.ts`
- `src/clients/EvmWeb3Client.ts`
- `src/clients/ClientPool.ts`
- `src/blocks/BlockDateResolver.ts`
- `src/rpc/Rpc.ts`
- `src/rpc/RpcBase.ts`

Useful tests:

- `test/Web3Client.spec.ts`
- `test/client/block.spec.ts`
- `test/node/block.spec.ts`
- `test/subscriptions.spec.ts`

## Client Creation

```ts
import { Web3ClientFactory } from 'dequanto/clients/Web3ClientFactory';

const client = await Web3ClientFactory.getAsync('eth');
```

For an in-memory Hardhat fork using the platform's default/configured RPCs:

```ts
const client = await Web3ClientFactory.getAsync('hh:memory:eth');
```

To connect to an already running local Hardhat node configured as an Ethereum fork:

```ts
const client = await Web3ClientFactory.getAsync('hh:eth');
```

Use `hh:memory` for an in-memory development network without a fork, or `hardhat` for a separately running local development node. See [Hardhat development and forking](hardhat.md) for setup, impersonation, balance/storage changes, mining, and snapshots.

For direct endpoints:

```ts
import { EvmWeb3Client } from 'dequanto/clients/EvmWeb3Client';

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

## Transaction Trace Analysis

Use `$traces.load(client, { tx })` as the primary entry point for AI-assisted analysis of transaction data on a supported client. It loads execution traces and builds both a structured call tree and a readable string, resolving each address's ABI once per load. Use `call` for programmatic analysis and `formatted` for inspection or reporting; avoid calling `getCalls()` and `format()` separately when both are needed.

```ts
import { $traces } from 'dequanto/utils/$traces';
import { TEth } from 'dequanto/models/TEth';
import { Web3Client } from 'dequanto/clients/Web3Client';

async function analyzeTransaction(client: Web3Client, tx: TEth.TxLike) {
    const { call, formatted } = await $traces.load(client, {
        tx,
        color: false,
    });

    console.log(formatted);
    return call; // JSON.stringify(call) is supported.
}
```

Pass transaction data including `to`, `data` (or `input`), and the relevant `from` and `value`. Generated contract `$data()` helpers can produce this input. The client must configure `client.debug.traceCall`, and its RPC endpoint must support that method and return opcode `structLogs` with stack and memory data. A Hardhat client or fork is suitable. `load()` simulates the transaction at `latest` by default; it does not broadcast it or replay a mined transaction at its original state.

The result contains:

- `call`: the root `TCall`, with nested `calls`, call `type`, destination `to`, `method`, decoded `args`, `return`, `abi`, `failed`, and raw `input`. Traverse nested calls to locate failures, including failures caught by their parent. Decoded bigints become decimal strings. When decoding is unavailable, `args` and `abi` can be `null`, `method` can be a selector or `null`, and return data retains its full hex value.
- `formatted`: the readable trace, including decoded events where available. Use `color: false` for AI input or plain-text logs. The call tree does not include events.

Optional inputs:

- `traces`: reuse an existing `TClientDebugTraces` result and skip the trace RPC. For a specific block, obtain it with `await client.debug.traceCall(tx, blockNumber)` and pass it to `load()`.
- `getABI(address)`: override ABI resolution with an async function returning `{ abi, name?, contractName? }`. By default, dequanto checks its local contract store and then the network's explorer when available.
- `color` and `shortAddress`: control the formatted output; defaults are `true` and `false`, respectively.

Source: `src/utils/$traces.ts`; regression examples: `test/utils/traces.spec.ts` and `test/utils/traces.revert.spec.ts` in the dequanto repository.

## Resolve Blocks By Date

Use `BlockDateResolver` to find the block nearest to a date, or to resolve a block number back to its date:

```ts
import { BlockDateResolver } from 'dequanto/blocks/BlockDateResolver';

const resolver = new BlockDateResolver(client);
const date = new Date('2024-03-03T10:20:00Z');

const blockNumber = await resolver.getBlockNumberFor(date);
const { block, timestamp } = await resolver.getBlockInfoFor(date);
const blockDate = await resolver.getDate(blockNumber);
```

`getBlockNumberFor(date)` returns the nearest block number. `getBlockInfoFor(date)` also returns that block's Unix timestamp. The resolver estimates from the chain's average block time and refines the estimate by loading blocks, so the result can be immediately before or after the requested time. Compare the returned timestamp when an exact time boundary matters. Dates before the chain was active throw a `Date out of range` error.

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

Add a `wss://...` endpoint to the chain RPC list, then use generated contract event methods, `client.subscribe(...)`, or `Rpc.eth_subscribe(...)`. Dequanto automatically selects a WebSocket endpoint for live connections; that endpoint can also serve ordinary RPC calls. See [WebSocket and live logs](live-events.md).

## Avoid

- Do not use raw `fetch`/HTTP for Ethereum JSON-RPC when `Web3Client` or `client.getRpc()` can do it.
- Do not call `getWeb3()` on `Web3Client`; the base class throws and points to the compatibility layer.

