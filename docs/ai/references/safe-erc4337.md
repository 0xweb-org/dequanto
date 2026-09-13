# Safe And ERC-4337

Use dequanto account-agent flows for Gnosis Safe and ERC-4337 instead of wiring external SDK calls directly.

Key source files:

- `src/safe/GnosisSafeHandler.ts`
- `src/safe/GnosisSafeFactory.ts`
- `src/safe/GnosisSafeService.ts`
- `src/safe/SafeTx.ts`
- `src/safe/transport/InMemoryServiceTransport.ts`
- `src/safe/transport/FileServiceTransport.ts`
- `src/safe/transport/SafeServiceTransport.ts`
- `src/erc4337/Erc4337Service.ts`
- `src/erc4337/Erc4337TxWriter.ts`
- `src/txs/agents/SafeAgent.ts`
- `src/txs/agents/Erc4337Agent.ts`

Useful tests:

- `test/safe/safe.spec.ts`
- `test/erc4337/erc4337.spec.ts`

## Safe Account Transaction

Use a `SafeAccount` with generated contract write methods:

```ts
const safeAccount = {
    type: 'safe',
    address: safeAddress,
    operator: owner1,
    owners: [owner1, owner2]
} as const;

const tx = await token.transfer(safeAccount, receiver, amount);
await tx.wait();
```

Pass a Safe transport through writer config when needed:

```ts
const tx = await token
    .$config(null, {
        safeTransport: new InMemoryServiceTransport(client, owner1)
    })
    .transfer(safeAccount, receiver, amount);
```

## Manual Safe Flow

```ts
import { GnosisSafeHandler } from '@dequanto/safe/GnosisSafeHandler';
import { ContractWriter } from '@dequanto/contracts/ContractWriter';

const writer = new ContractWriter(target.address, client);
const txWriter = await writer.writeAsync(safeAccount, 'airdrop()', [], {
    builderConfig: {
        send: 'manual',
        gasEstimation: false
    }
});

const safe = new GnosisSafeHandler({
    safeAddress,
    owners: [owner1],
    client,
    transport
});

const { safeTxHash } = await safe.createTransaction(txWriter, 0n);
await safe.confirmTx(safeTxHash, owner2);
const submitTx = await safe.submitTransaction(safeTxHash);
await submitTx.wait();
```

## Safe Batch

Use `SafeTx.executeBatch(...)` with generated `$data()` calls:

```ts
const safeTx = new SafeTx(safeAccount, client, {
    safeTransport,
    contracts
});

const tx = await safeTx.executeBatch(
    await token.$data().approve(safeAccount, spender, amount),
    await token.$data().transfer(safeAccount, receiver, amount)
);

await tx.wait();
```

## Safe Decoding

Use `GnosisSafeService.decodeSafeTx(data, { decodeContractCall: true })`. Register ABIs on the explorer when decoding local or unknown contracts.

## ERC-4337

Use `Erc4337TxWriter` for the higher-level flow:

```ts
const erc4337 = new Erc4337TxWriter(client, explorer, {
    addresses: {
        entryPoint,
        accountFactory
    }
});

const account = await erc4337.getAccount(owner);
const txData = await token.$data().transfer(account, receiver, amount);

const { writer } = await erc4337.submitUserOpViaEntryPointWithOwner({
    tx: txData,
    owner,
    submitter
});

await writer.wait();
```

Use `Erc4337Service` for low-level operation creation, signing, decoding, and `handleOps` submission.

## Avoid

- Do not manually assemble Safe `execTransaction` signatures unless the task is explicitly low-level.
- Do not bypass dequanto `TxWriter` account agents for Safe or ERC-4337 when generated contract writes can use account types.

