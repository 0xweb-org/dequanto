# Tokens And Accounts

Use dequanto token and account helpers for known token metadata, balances, transfers, and signing.

Key source files:

- `src/tokens/TokensService.ts`
- `src/tokens/TokensServiceFactory.ts`
- `src/tokens/TokenTransferService.ts`
- `src/ChainAccountService.ts`
- `src/utils/$sig.ts`
- `src/utils/$account.ts`
- `src/models/TAccount.ts`

Useful tests:

- `test/token.spec.ts`
- `test/ChainAccount.spec.ts`
- `test/hardhat/tx.spec.ts`

## Token Metadata

```ts
import { TokensService } from '@dequanto/tokens/TokensService';

const tokens = new TokensService('eth');
const usdc = await tokens.getKnownToken('USDC');
```

For forked Hardhat platform strings:

```ts
import { TokensServiceFactory } from '@dequanto/tokens/TokensServiceFactory';

const tokens = await TokensServiceFactory.getAsync('hh:eth');
```

## Token Transfer Service

```ts
import { TokenTransferService } from '@dequanto/tokens/TokenTransferService';

const service = new TokenTransferService(client);
const tx = await service.transfer(sender, receiver, 'USDC', 10);
await tx.wait();
```

Amount handling:

- `number` amounts are converted with token decimals.
- `bigint` amounts are already raw smallest units.
- Native token transfers use `client.getBalance` and native tx value.
- ERC20 transfers use generated ERC20 wrappers from token metadata.

## Transfer All

```ts
const tx = await service.transferAll(sender, receiver, 'ETH');
```

With remainder:

```ts
const tx = await service.transferAllWithRemainder(sender, receiver, 'USDC', 1);
```

## Accounts

Generate or derive EOA accounts:

```ts
import { $sig } from '@dequanto/utils/$sig';

const account = $sig.$account.generate();
const fromMnemonic = await $sig.$account.fromMnemonic(mnemonic, 0);
const fromKey = await $sig.$account.fromKey(privateKey);
```

Use `ChainAccountService` for named encrypted account storage:

```ts
import { ChainAccountService } from '@dequanto/ChainAccountService';

const service = new ChainAccountService();
const account = await service.get('deployer');
```

## Account Types

Transaction APIs accept several account shapes:

- EOA account: `{ address, key }`
- named account: string resolved through `ChainAccountService`
- impersonated account in Hardhat
- Safe account: `{ type: 'safe', address, operator, owners? }`
- ERC-4337 account: `{ type: 'erc4337', address, operator }`

Inspect `src/models/TAccount.ts` before adding a new account shape.

