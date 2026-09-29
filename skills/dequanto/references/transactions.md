# Transactions

Use generated contract write methods for normal contract transactions. Use `TxDataBuilder` and `TxWriter` when code needs lower-level control over gas, nonce, signing, persistence, retry, or raw tx data.

Key source files:

- `src/txs/TxDataBuilder.ts`
- `src/txs/TxWriter.ts`
- `src/txs/agents/BatchAgent.ts`
- `src/txs/TxNonceManager.ts`
- `src/contracts/ContractWriter.ts`
- `src/tokens/TokenTransferService.ts`
- `src/txs/receipt/TxLogParser.ts`

Useful tests:

- `test/Web3Client.spec.ts`
- `test/hardhat/tx.spec.ts`
- `test/receipt.spec.ts`
- `test/safe/safe.spec.ts`
- `test/services/timelock.spec.ts`

## TxWriter Lifecycle

For transactions from any address on a Hardhat development network or fork, pass `{ address, type: 'impersonated' }` as the account. The writer enables impersonation automatically. See [Hardhat development and forking](hardhat.md#impersonate-an-account) for a complete ERC20 transfer example.

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

## BatchAgent For Scripts

Use `BatchAgent` when a script should run its full transaction flow without immediately submitting transactions on-chain. `BatchAgent` plugs into `TxWriter.DEFAULTS.agent`, intercepts write calls, returns completed mock writers/receipts to the script, and caches the transactions for later review or execution.

```ts
import { BatchAgent } from 'dequanto/txs/agents/BatchAgent';

const batch = new BatchAgent().enable();

try {
    await token.$receipt().approve(sender, spender, amount);
    await vault.$receipt().deposit(sender, amount, receiver);

    console.log(await batch.print());

    // Submit cached transactions after review.
    const writers = await batch.execute();
    await Promise.all(writers.map(x => x?.wait()));
} finally {
    batch.disable();
}
```

Important behavior:

- Use `batch.transactions` or `batch.getTxData()` to inspect cached transactions programmatically.
- `batch.print()` formats pending transactions and decoded input data for review.
- `batch.execute()` skips duplicate transactions by default; pass `{ includeDuplicates: true }` when duplicates are intentional.
- Deployment transactions are ignored by default; pass `new BatchAgent({ ignoreContractCreation: false })` when contract creation should also be intercepted.
- If the account being submitted is a Safe, `execute()` creates one Safe multicall/batch transaction from many cached single transactions.
- If the account being submitted is a Timelock, `execute()` creates one Timelock batch/scheduleBatch flow from many cached single transactions.
- For normal EOA accounts, `execute()` sends each cached transaction on-chain.

## Build And Sign Raw Tx

```ts
import { TxDataBuilder } from 'dequanto/txs/TxDataBuilder';

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
import { TxWriter } from 'dequanto/txs/TxWriter';

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
import { TxLogParser } from 'dequanto/txs/receipt/TxLogParser';

const parser = new TxLogParser();
const logs = await parser.parse(receipt, { abi });
```

## Reverts And Error Handling

Developers do not need to perform manual pre-flight simulations (e.g. via `contract.$call()` or `contract.$gas()`). When sending a transaction via `TxWriter` or generated methods like `contract.$receipt().method(account, ...)`:

1. **Automatic Simulation via Gas Estimation:** Dequanto automatically estimates gas before submitting. Estimating gas inherently simulates the transaction on the node.
2. **Custom Error Decoding:** If the call reverts during estimation, dequanto catches the revert, automatically decodes the custom error bytecode using the contract ABI, formats the call arguments, attaches execution traces (when running on Hardhat/debug nodes), and throws a standard JavaScript `Error`.
3. **On-Chain Reverts:** If gas estimation succeeded (or was disabled) but the transaction subsequently reverts on-chain, the flow is identical: `await writer.wait()` rejects with a standard JavaScript `Error` containing the decoded custom error name and arguments.

```ts
try {
    await vault.$receipt().withdraw(user, 100n);
} catch (error) {
    // error.message includes the decoded custom error name, parameters, method, and traces:
    // e.g., "VM Exception: reverted with custom error 'InsufficientBalance(50, 100)'"
    console.error(error.message);
}
```

See the [revert and custom error example](../examples/revert-error.spec.ts) for runnable demonstrations.

## Avoid

- Do not perform manual simulations with `$call()` or `$gas()` solely to catch reverts before sending; `TxWriter` automatically simulates via gas estimation, decodes custom errors, and throws standard JavaScript errors.
- Do not manually manage gas and nonce unless the task needs it.
- Do not use external wallet clients when a dequanto `TAccount`, `SafeAccount`, or `Erc4337Account` flow is available.

