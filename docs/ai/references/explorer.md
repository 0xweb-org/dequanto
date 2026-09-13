# Blockchain Explorer

Use dequanto explorer APIs instead of hand-written Etherscan-compatible HTTP calls.

Key source files:

- `src/explorer/BlockchainExplorerFactory.ts`
- `src/explorer/BlockchainExplorer.ts`
- `src/explorer/IBlockchainExplorer.ts`
- `src/contracts/ContractAbiProvider.ts`
- `src/explorer/ContractVerifier.ts`

Useful tests:

- `test/BlockchainExplorer.spec.ts`
- `test/safe/safe.spec.ts`
- `test/erc4337/erc4337.spec.ts`

## Create Explorer

```ts
import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';

const explorer = BlockchainExplorerFactory.get('eth');
```

`getAsync(platform)` ensures config is loaded first.

## ABI And Source

```ts
const { abi, implementation } = await explorer.getContractAbi(address);
const source = await explorer.getContractSource(implementation);
const creation = await explorer.getContractCreation(address);
```

`getContractAbi` follows common proxy patterns:

- OpenZeppelin implementation slot
- Zeppelinos implementation slot
- `implementation()`
- `getTarget()`
- similar-bytecode explorer hints

## Transactions And Transfers

```ts
const txs = await explorer.getTransactionsAll(address);
const internal = await explorer.getInternalTransactionsAll(address);
const transfers = await explorer.getErc20TransfersAll(address);
```

ERC20 transfer values are normalized to `bigint`; `blockNumber` and `tokenDecimal` are numbers; `timeStamp` is a `Date`.

## Local ABI Registry

For local decoding without remote explorer data:

```ts
explorer.registerAbi([{
    name: 'Demo',
    address,
    abi
}]);
```

This pattern is used by Safe and ERC-4337 decoding tests.

## Verification

Use `Deployments` for normal verification orchestration. It delegates to `ContractVerifier` and explorer `submitContractVerification(...)` / `checkContractVerificationSubmission(...)`.

## Avoid

- Do not call explorer URLs directly if `BlockchainExplorer` exposes the operation.
- Do not manually resolve proxy implementations without checking `getContractAbi(address)` first.

