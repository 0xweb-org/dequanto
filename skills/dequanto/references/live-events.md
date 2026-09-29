# WebSocket And Live Logs

Live subscriptions require at least one WebSocket endpoint in the chain's RPC endpoint list. Add a `wss://...` URL alongside any HTTP endpoints:

```yaml
web3:
  eth:
    endpoints:
      - url: wss://ethereum.example
      - url: https://ethereum.example
```

When a subscription requests a live connection, dequanto automatically selects a WebSocket endpoint from the client pool. A WebSocket endpoint can also serve normal RPC calls. HTTP endpoints remain useful for ordinary request traffic and as additional pool endpoints.

You can provide the same configuration through `Config.fetch({ config: ... })`, workspace or global dequanto configuration, or the platform RPC environment configuration. See [RPC clients](rpc-clients.md) and [the configuration example](../examples/config.spec.ts).

Key source files:

- `src/clients/Web3Client.ts`
- `src/clients/ClientEventsStream.ts`
- `src/contracts/ContractBase.ts`
- `src/contracts/ContractStream.ts`
- `src/rpc/Rpc.ts`
- `src/rpc/RpcSubscription.ts`
- generated contract classes such as `src/prebuilt/openzeppelin/ERC20.ts`

Useful tests:

- `test/subscriptions.spec.ts`
- `test/rpc/rpc.spec.ts`

Runnable template: [live event subscriptions](../examples/live-events.spec.ts). Its cases are skipped by default because they need a working WebSocket endpoint and live network activity.

## Generated Contract Event Subscriptions

Prefer generated contract classes for contract logs. They expose a typed method for every event:

```ts
import { ERC20 } from 'dequanto/prebuilt/openzeppelin/ERC20';

const token = new ERC20(tokenAddress, client);

token.onTransfer(event => {
    // The generated callback carries typed Transfer arguments.
    console.log(event.arguments);
});

token.onApproval(event => {
    console.log(event.arguments);
});
```

Generated classes also expose `onLog(eventName, callback?)` when the event name is selected dynamically:

```ts
token.onLog('Transfer', event => {
    console.log(event.name, event.arguments);
});
```

Both forms return a `ClientEventsStream`, even when a callback is provided. Omit the callback to compose or subscribe to the stream yourself:

```ts
const transfers = token.onTransfer();
const listener = transfers.subscribe(
    event => console.log(event.arguments),
    error => console.error(error)
);

// Removes this callback from the client-side stream.
listener.unsubscribe();
```

Use the generated `on<EventName>` method when the event is known at development time because its callback is event-specific. Use `onLog(name)` when the event name is chosen dynamically.

Live streams only receive new logs after the subscription connects. Use generated `getPastLogs<EventName>` methods or `EventsIndexer` for historical ranges.

## Client-Level Subscriptions

Use `client.subscribe` for low-level live logs, new block headers, or pending transactions. It automatically requests a WebSocket connection from the configured pool:

```ts
const subscription = await client.subscribe('newHeads', (error, block) => {
    if (error) {
        console.error(error);
        return;
    }
    console.log(block.number);
});

// Ends the remote RPC subscription.
await subscription.unsubscribe();
```

Supported overloads include:

```ts
await client.subscribe('logs', {
    address: tokenAddress,
    topics: [transferTopic]
}, callback);

await client.subscribe('newPendingTransactions', callback);
```

## Raw RPC Subscriptions

Use the generated RPC client when you need the low-level `eth_subscribe` lifecycle directly:

```ts
import { Rpc } from 'dequanto/rpc/Rpc';

const rpc = new Rpc('wss://ethereum.example');
const subscription = await rpc.eth_subscribe('newHeads');

subscription.subscribe(
    block => console.log(block.number),
    error => console.error(error)
);

await subscription.unsubscribe();
```

`RpcSubscription.subscribe` accepts data and error callbacks. Always call `unsubscribe()` when a low-level subscription is no longer needed.
