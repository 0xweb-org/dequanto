# Safe, Zodiac Roles, And ERC-4337

Use dequanto account-agent flows for Gnosis Safe, Zodiac Roles, and ERC-4337 instead of wiring external SDK calls directly.

Key source files:

- `src/safe/GnosisSafeHandler.ts`
- `src/safe/GnosisSafeFactory.ts`
- `src/safe/GnosisSafeService.ts`
- `src/safe/SafeTx.ts`
- `src/zodiac/ZodiacTx.ts`
- `src/txs/agents/ZodiacAgent.ts`
- `src/safe/transport/InMemoryServiceTransport.ts`
- `src/safe/transport/FileServiceTransport.ts`
- `src/safe/transport/SafeServiceTransport.ts`
- `src/erc4337/Erc4337Service.ts`
- `src/erc4337/Erc4337TxWriter.ts`
- `src/txs/agents/SafeAgent.ts`
- `src/txs/agents/Erc4337Agent.ts`
- `src/txs/agents/BatchAgent.ts`

Useful tests:

- `test/safe/safe.spec.ts`
- `test/zodiac/ZodiacTx.spec.ts`
- `test/zodiac/ZodiacAgent.spec.ts`
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
import { GnosisSafeHandler } from 'dequanto/safe/GnosisSafeHandler';
import { ContractWriter } from 'dequanto/contracts/ContractWriter';

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

Use `SafeTx.executeBatch(...)` with generated `$data()` calls when manually composing a Safe batch:

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

For scripts, prefer `BatchAgent` when the code should call generated write methods normally and review or submit the collected transactions at the end. If the submitting account is a Safe, `batch.execute()` converts the collected single transactions into one Safe batch/multicall transaction. If the submitting account is a Timelock, `batch.execute()` converts them into one Timelock batch/scheduleBatch flow.

See `./transactions.md` for the full `BatchAgent` script pattern.

## Safe Decoding

Use `GnosisSafeService.decodeSafeTx(data, { decodeContractCall: true })`. Register ABIs on the explorer when decoding local or unknown contracts.

## Zodiac Roles Account Transaction

Use `ZodiacAccount` for a Zodiac Roles Modifier with the bytes32 role-key API:

```ts
import { ZodiacAccount } from 'dequanto/models/TAccount';

let zodiacAccount: ZodiacAccount = {
    type: 'zodiac',
    platform: client.platform,
    address: rolesModifierAddress,
    operator,
    roleKey,
};

let tx = await token.$receipt().transfer(zodiacAccount, receiver, amount);
```

`address` is the Roles Modifier address; `operator` is the EOA authorized for `roleKey`. Supply the role key as hex, not a role name; `ZodiacTx` pads it to 32 bytes. `ZodiacAgent` wraps the original call in `execTransactionWithRole(..., shouldRevert: true)` and the operator submits it directly on-chain. The Safe/avatar pays the inner call's native value; the operator pays gas.

## Zodiac Batch

Use `ZodiacTx` to compose a batch from generated `$data()` calls:

```ts
import { ZodiacTx } from 'dequanto/zodiac/ZodiacTx';

let zodiac = new ZodiacTx(zodiacAccount, client);
let tx = await zodiac.executeBatch(
    await token.$data().approve(zodiacAccount, spender, amount),
    await token.$data().transfer(zodiacAccount, receiver, amount)
);
await tx.wait();
```

Each inner transaction uses CALL. The Roles transaction uses DELEGATECALL to MultiSend. The helper resolves the deployment from `config.safe.contracts[client.network]`, preferring `MultiSendCallOnly` and falling back to `MultiSend`, just like `SafeTx`. Use `options.contracts` for deployment overrides; there is no MultiSend address field on the account.

The Roles Modifier must have a transaction unwrapper registered for the selected MultiSend deployment to check each inner call's permissions.

Use `execute(call)` for a single transaction. `getTxData(call)` and `getBatchTxData(...calls)` return the encoded transaction to the Roles Modifier without submitting it. These results are already wrapped; submit them as the operator, not as a Zodiac account.

`BatchAgent` also collects ordinary contract writes with a Zodiac account and submits them through `ZodiacTx`. It keeps different roles, operators, and chains in separate groups. See `./transactions.md` for the script pattern.

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
- Do not bypass dequanto `TxWriter` account agents for Safe, Zodiac, or ERC-4337 when generated contract writes can use account types.

