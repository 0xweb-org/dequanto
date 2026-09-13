# Contracts

Use generated contract clients whenever an ABI, artifact, Solidity source, or verified explorer source is available. Generated clients extend `ContractBase` and expose typed read/write methods.

Key source files:

- `src/contracts/ContractBase.ts`
- `src/contracts/ContractReader.ts`
- `src/contracts/ContractWriter.ts`
- `src/contracts/ContractClassFactory.ts`
- `src/contracts/utils/ContractBaseUtils.ts`
- `src/txs/TxWriter.ts`

Useful tests:

- `test/generate/gen.spec.ts`
- `test/hardhat/deployments/deployments.spec.ts`
- `test/receipt.spec.ts`

## Generated Contract Shape

Generated read methods call `this.$read(...)` and return decoded values.

Generated write methods call `this.$write(...)` and return a `Promise<TxWriter>`.

Common generated-client helpers from `ContractBase`:

- `$address(address)` creates the same contract wrapper for another address.
- `$config(builderConfig, writerConfig)` returns a configured wrapper clone.
- `$receipt()` wraps write methods so they wait for mining.
- `$data()` creates tx data instead of sending it.
- `$gas()` estimates write-method gas.
- `$call()` simulates write methods with `eth_call`.
- `$req()` creates deferred read requests for batching.
- `$signed()` creates methods for signed flows.
- `forBlock(numberOrDate)` reads at a block number or date.
- `getPastLogs(event, options)` and generated event helpers read parsed logs.

## Reads

Prefer:

```ts
const token = new ERC20(tokenAddress, client);
const balance = await token.balanceOf(account);
```

For ad hoc reads without a generated class:

```ts
import { ContractReader } from '@dequanto/contracts/ContractReader';

const reader = new ContractReader(client);
const symbol = await reader.readAsync<string>(
    tokenAddress,
    'function symbol() returns string'
);
```

For batching generated reads, prefer deferred requests from `$req()` and execute through `$executeBatch(...)` when available.

## Writes

Generated write methods return `TxWriter`.

```ts
const tx = await token.transfer(sender, receiver, amount);
const receipt = await tx.wait();
```

If the caller needs a receipt directly:

```ts
const tx = await token.$receipt().transfer(sender, receiver, amount);
const receipt = tx.receipt;
```

If the caller needs calldata but should not submit:

```ts
const data = await token.$data().transfer(sender, receiver, amount);
```

For manual send mode:

```ts
const tx = await token
    .$config({ send: 'manual', gasEstimation: false })
    .transfer(sender, receiver, amount);
```

## Events

For generated contracts, prefer generated log helpers when present. Otherwise use:

```ts
const logs = await token.getPastLogs('Transfer', {
    fromBlock,
    toBlock,
    params: { from: owner }
});
```

`ContractBase` converts raw logs to `ITxLogItem` with `event`, `params`, `arguments`, `blockNumber`, `transactionHash`, and address data.

## Avoid

- Do not instantiate `ethers.Contract` or `viem.getContract` in consumer code that already uses dequanto.
- Do not manually encode ABI calldata when generated `$data()` or `$abiUtils.serializeMethodCallData(...)` is available.
- Do not guess generated method names for overloaded Solidity functions; inspect the generated class.

