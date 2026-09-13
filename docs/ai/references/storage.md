# Solidity Storage

Use `SlotsParser` to derive layout and `SlotsStorage` to read or write slots. Do not decode raw storage words as ABI payloads.

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

Do not use storage writes in production code unless the transport explicitly supports it and the task requires test/debug mutation.

## Raw Slot Reads

Use `client.getStorageAt(address, slot)` or `client.getStorageAtBatched(address, slots)` only when raw words are needed.

