# Transactions

Use generated contract write methods for normal contract transactions. Use `TxDataBuilder` and `TxWriter` when code needs lower-level control over gas, nonce, signing, persistence, retry, or raw tx data.

Key source files:

- `src/txs/TxDataBuilder.ts`
- `src/txs/TxWriter.ts`
- `src/txs/TxNonceManager.ts`
- `src/contracts/ContractWriter.ts`
- `src/tokens/TokenTransferService.ts`
- `src/txs/receipt/TxLogParser.ts`

Useful tests:

- `test/Web3Client.spec.ts`
- `test/hardhat/tx.spec.ts`
- `test/receipt.spec.ts`
- `test/safe/safe.spec.ts`

## TxWriter Lifecycle

Generated write methods return a `TxWriter`.

```ts
const tx = await contract.setValue(account, 5n);
const hash = await tx.onSent;
const receipt = await tx.wait();
```

`TxWriter` exposes:

- `onSent`
- `onCompleted`
- `wait()`
- `on('transactionHash' | 'receipt' | 'error' | 'log', cb)`
- `builder`
- `receipt`
- `tx.knownLogs`

## Build And Sign Raw Tx

```ts
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';

const builder = new TxDataBuilder(client, sender, {
    to: receiver
});

builder.setValue(10n * 10n ** 18n);
await builder.setGas();
await builder.setNonce();

const signed = await builder.signToString(sender.key);
const receipt = await client.sendSignedTransaction(signed);
```

## Send Existing Tx Data

```ts
import { TxWriter } from '@dequanto/txs/TxWriter';

const tx = await TxWriter.writeTxData(client, {
    to: receiver,
    value: 1n
}, sender);

await tx.wait();
```

## Manual Contract Tx Data

Use generated `$data()`:

```ts
const data = await token.$data().transfer(sender, receiver, amount);
```

Use manual mode if a writer should be created without immediate submission:

```ts
const tx = await token
    .$config({ send: 'manual', gasEstimation: false })
    .transfer(sender, receiver, amount);
```

## Nonces

Use `TxNonceManager.create(client, account)` when submitting multiple pending transactions from one account.

```ts
const nonce = TxNonceManager.create(client, account);
const service = new TokenTransferService(client).$config({ nonce });
```

## Receipts And Logs

Use `TxLogParser` for receipts when no generated contract parser is available.

```ts
import { TxLogParser } from '@dequanto/txs/receipt/TxLogParser';

const parser = new TxLogParser();
const logs = await parser.parse(receipt, { abi });
```

## Avoid

- Do not manually manage gas and nonce unless the task needs it.
- Do not use external wallet clients when a dequanto `TAccount`, `SafeAccount`, or `Erc4337Account` flow is available.

