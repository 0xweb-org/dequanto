# Events And Indexing

Use generated contract log helpers for simple event reads. Use `EventsIndexer` for resumable, cached, file-backed historical indexing.

Key source files:

- `src/contracts/ContractBase.ts`
- `src/contracts/ContractReader.ts`
- `src/contracts/ContractStream.ts`
- `src/indexer/EventsIndexer.ts`
- `src/indexer/storage/FsEventsIndexerStore.ts`
- `src/indexer/storage/FsEventsMetaStore.ts`

Useful tests:

- `test/indexer/EventsIndexer.spec.ts`
- `test/subscriptions.spec.ts`
- `test/receipt.spec.ts`

## Direct Past Logs

```ts
const logs = await contract.getPastLogs('Transfer', {
    fromBlock,
    toBlock,
    params: {
        from: owner
    }
});
```

Use `'*'` for all events, or an event-name array for multiple events.

## EventsIndexer

```ts
import { EventsIndexer } from '@dequanto/indexer/EventsIndexer';

const indexer = new EventsIndexer(contract, {
    name: 'TokenTransfers',
    fs: {
        directory: './data/logs/',
        blockTimeAvg: 12
    }
});

const { logs, infos } = await indexer.getPastLogs('Transfer', {
    fromBlock,
    toBlock,
    params: { from: owner }
});
```

`infos.fetched` counts newly fetched events. `infos.cached` counts events loaded from the store.

## Multiple Addresses

Use `addresses` when the same ABI is deployed to multiple addresses:

```ts
const indexer = new EventsIndexer(contract, {
    addresses: [contract.address, secondAddress],
    name: 'FactoryChildren'
});
```

## Streaming

Use `getPastLogsStream` for large ranges:

```ts
for await (const chunk of indexer.getPastLogsStream('Transfer', {
    fromBlock,
    blockRangeLimits: { blocks: 1_000 }
})) {
    for (const log of chunk.logs) {
        console.log(log.params);
    }
}
```

## Cache Invalidation

Use `removeCached({ fromBlock })` to delete cached logs and metadata from a given block onward.

## Live Events

Generated contracts expose:

```ts
contract.$onLog('Transfer', log => {
    console.log(log);
});
```

For raw client subscriptions, use `client.subscribe(...)`.

