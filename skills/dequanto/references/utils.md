# Utility Helpers

Dequanto includes helpers for common EVM and TypeScript operations. Prefer them when they make contract code shorter and more consistent. Verify unfamiliar helpers in the installed declarations.

Key source files:

- `src/abi/$abi.ts`
- `src/utils/$contract.ts`
- `src/utils/$require.ts`
- `src/utils/$hex.ts`
- `src/utils/$date.ts`
- `src/utils/$sig.ts`
- `src/utils/$promise.ts`

Runnable example: [utility helpers](../examples/utils.spec.ts).

## ABI Encoding And Decoding

Import `$abi` from `dequanto/abi/$abi`. Use it instead of another ABI coder or manually constructed calldata.

```ts
import { $abi } from 'dequanto/abi/$abi';

const encoded = $abi.encode(['address', 'uint256'], [account, 5n]);
const [decodedAccount, decodedAmount] = $abi.decode(['address', 'uint256'], encoded);
const calldata = $abi.encodeCall(
    'function transfer(address to, uint256 amount)',
    [account, 5n]
);
const totalSupply = $abi.decodeReturn<bigint>(
    'function totalSupply() view returns (uint256)',
    responseHex
);
```

- `encode` and `decode` accept one type/value or arrays of types/values.
- `encodeCall` accepts a Solidity function declaration or JSON ABI item.
- `decodeReturn` accepts a function declaration, JSON ABI item, or output definitions. Multiple named outputs are returned as an object.

## Solidity-Compatible Keccak-256

Use `$contract.keccak256(...)` for the same Keccak-256 operation used by Solidity:

```ts
import { $contract } from 'dequanto/utils/$contract';

const topic = $contract.keccak256('Transfer(address,address,uint256)');
const bytes = $contract.keccak256('0x1234', 'buffer');
```

A string beginning with `0x` is hashed as bytes; other strings are UTF-8 encoded. The default output is hex. Pass `'buffer'` for a `Uint8Array`.

## Runtime Requirements

`$require` provides compact runtime validation similar in purpose to Solidity's `require`:

```ts
import { $require } from 'dequanto/utils/$require';

const address = $require.AddressNotEmpty(inputAddress, 'Recipient is required');
$require.BigInt(amount, 'Amount must be bigint', { min: 1n });
$require.gte(balance, amount, 'Insufficient balance');
$require.Hex(calldata, 'Invalid calldata');
$require.notNull(receipt, 'Receipt was not returned');
```

Useful checks include `True`, `notNull`, `Null`, `notEmpty`, `eq`, `notEq`, `gt`, `gte`, `lt`, `lte`, `match`, `has`, `oneOf`, `Address`, `AddressNotEmpty`, `AddressChecked`, `TxHash`, `Hex`, `Number`, `BigInt`, and `Numeric`. Most value validators return the validated value.

## Hex Manipulation

Use `$hex` for `0x` normalization, conversion, padding, concatenation, slicing, and byte counts:

```ts
import { $hex } from 'dequanto/utils/$hex';

const value = $hex.ensure('1234');             // 0x1234
const word = $hex.padBytes(value, 32);          // left-pad to 32 bytes
const payload = $hex.concat([value, '0xabcd']);
const firstTwoBytes = $hex.getBytes(payload, 0, 2);
const byteLength = $hex.getBytesLength(payload);
```

`toHex('hello')` encodes a normal string as UTF-8. `toHexBuffer(...)` also ensures an even number of hex digits. `padBytes` takes a byte count and pads left by default; pass `{ padEnd: true }` to pad right.

## Date And Time

Use `$date` for time spans, Unix timestamps, formatting, date boundaries, and arithmetic:

```ts
import { $date } from 'dequanto/utils/$date';

const timeoutMs = $date.parseTimespan('5min');
const timeoutSeconds = $date.parseTimespan('5min', { get: 's' });
const deadline = $date.tool().add('5min').toUnixTimestamp();
const date = $date.fromUnixTimestamp(deadline);
```

`parseTimespan` returns milliseconds by default. Request seconds explicitly when passing time to a contract or RPC API.

## Signing

Use `$sig` for account creation, message and typed-data signatures, transaction signing, and signer recovery:

```ts
import { $sig } from 'dequanto/utils/$sig';

const account = $sig.$account.generate();
const signature = await $sig.signMessage('Approve operation', account);
const signer = $sig.recoverMessage('Approve operation', signature);
```

Use `signMessage`/`recoverMessage` for EIP-191 messages, `signTypedData` for typed data, and `signTx`/`recoverTx` for transactions. Account helpers include `generate`, `fromMnemonic`, and `fromKey`.

## Promise Results Without Try/Catch

`$promise.caught(...)` converts a rejection into a result object:

```ts
import { $promise } from 'dequanto/utils/$promise';

const { result, error } = await $promise.caught(loadValue());
if (error) {
    console.error(error.message);
} else {
    console.log(result);
}
```

It accepts a promise or a function returning a promise and returns `{ result }` on success or `{ error }` on failure. Other helpers cover delays, timeouts, events, callbacks, and polling.

The remaining files under `src/utils/` mostly support organization, conversion, formatting, and readability. Use them when relevant, but verify current signatures in `lib/types/utils/` rather than guessing.
