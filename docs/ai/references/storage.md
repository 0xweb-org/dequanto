# Solidity Storage

Prefer the storage reader included in generated contract classes. For manual layouts, use `SlotsParser` to derive layout and `SlotsStorage` to read or write slots. Do not decode raw storage words as ABI payloads.

Key source files:

- `src/solidity/SlotsParser.ts`
- `src/solidity/SlotsStorage.ts`
- `src/solidity/storage/handlers/SlotStructHandler.ts`
- `src/solidity/storage/handlers/SlotMappingHandler.ts`
- `src/solidity/storage/handlers/SlotDynamicArrayHandler.ts`
- `src/solidity/storage/SlotsStorageTransport.ts`
- `src/gen/GeneratorStorageReader.ts`

Useful tests:

- `test/solidity/SlotsReader.spec.ts`
- `test/solidity/Storage.spec.ts`
- `test/solidity/SlotsParser.spec.ts`
- `test/generate/slotreader.spec.ts`

## Generated Contract Storage Readers

Contract classes installed from a blockchain explorer with `0xweb install`, or generated from Solidity sources with `@0xweb/hardhat`, include a storage reader on `contractInstance.storage`. It contains the storage layout derived from the source, including slot positions and packed fields, so you can access storage by variable name without manually resolving slots.

On a Hardhat development network or fork, write a variable with `await contractInstance.storage.$set('someVar', value)`. The generated reader exposes `$set` and `$get`; `set` and `get` are methods on the underlying `SlotsStorage`.

For example, using the generated AavePool class:

```ts
import { Web3ClientFactory } from 'dequanto/clients/Web3ClientFactory';
import { AavePool } from '../../../0xc/eth/AavePool/AavePool';

const client = await Web3ClientFactory.getAsync('hh:memory:eth');
const pool = new AavePool(undefined, client);
const id = await client.debug.snapshot();

try {
    await pool.storage.$set('_flashLoanPremium', 12_345n);
    const premium = await pool.storage._flashLoanPremium();
    const publicPremium = await pool.FLASHLOAN_PREMIUM_TOTAL();
} finally {
    await client.debug.revert(id);
}
```

The AavePool import points to this repository's generated class; use your project's generated path. Keep generated storage layouts in sync with the deployed implementation, especially after proxy upgrades. See the [storage example](../examples/storage.spec.ts) for assertions and rollback verification.

## Parse Slots From Solidity

```ts
import { SlotsParser } from '@dequanto/solidity/SlotsParser';

const slots = await SlotsParser.slots({
    path: './contracts/Vault.sol'
}, 'Vault');
```

For inline code:

```ts
const slots = await SlotsParser.slots({ path: '', code }, 'Foo');
```

## Parse Slots From ABI Inputs

Use this for standalone struct or tuple ABI data:

```ts
const slots = await SlotsParser.slotsFromAbi(
    '(uint256 foo, address owner, bool enabled)'
);
```

## Read Contract Storage

```ts
import { SlotsStorage } from '@dequanto/solidity/SlotsStorage';

const storage = SlotsStorage.createWithClient(client, contract.address, slots);

const owner = await storage.get('owner');
const user = await storage.get('users[0]');
const balance = await storage.get(`balances["${account}"]`);
```

Supported path forms include:

- `field`
- `struct.field`
- `array[0]`
- `mapping["0x..."]`
- `mapping["0x..."].field`
- `nested[0].balances[1]`
- breadcrumb arrays such as `['users', account, 'balance']`

## Read Diamond Or Offset Storage

For library-selected storage roots:

```ts
const storage = SlotsStorage.createWithClient(client, contract.address, slots, {
    storageOffset: $contract.keccak256('diamond.app.storage')
});
```

## Write Storage In Tests

`SlotsStorage.set(...)` exists and is useful in Hardhat/debug contexts:

```ts
await storage.set('user.balance', 1000n);
```

For a known raw slot on Hardhat, use `await client.debug.setStorageAt(contractAddress, slot, '0x2a')`; the value is padded to 32 bytes. To set an ERC20 balance without resolving its layout manually, use `$erc20.setBalanceAny(client, tokenAddress, accountAddress, amount)`. See [Hardhat development and forking](hardhat.md) for examples and snapshot/rollback handling.

Do not use storage writes in production code unless the transport explicitly supports it and the task requires test/debug mutation.

## Raw Slot Reads

Use `client.getStorageAt(address, slot)` or `client.getStorageAtBatched(address, slots)` only when raw words are needed.

