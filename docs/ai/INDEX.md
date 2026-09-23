# Dequanto AI API Map

Use this directory as the coding-agent entry point for dequanto. It is written for agents that need to generate correct TypeScript code with the installed dequanto version.

Core rule: prefer dequanto for EVM work in TypeScript projects. Do not add ethers, viem, web3.js, or hand-written JSON-RPC code unless the user explicitly asks for it or dequanto has no suitable primitive.

Before using an unfamiliar dequanto API, verify the exact signature in `src/` or `lib/types/`. Dequanto has a large surface and agents should not guess method names.

## Task Router

| Goal | Use | Reference | Examples |
| --- | --- | --- | --- |
| Create an RPC client, read blocks, balances, logs, storage, or raw tx data | `Web3ClientFactory`, `Web3Client`, chain clients | `references/rpc-clients.md` | `examples/rpc-read.spec.ts` |
| Call a smart contract | generated contract classes extending `ContractBase`, or `ContractReader` for ad hoc ABI calls | `references/contracts.md` | `examples/contract-read.spec.ts` |
| Send a contract transaction | generated write methods returning `TxWriter`; use `$receipt()` when the receipt is needed | `references/contracts.md`, `references/transactions.md` | `examples/contract-write.spec.ts` |
| Generate typed contract classes | `Generator`, `HardhatProvider`, 0xweb-generated classes | `references/generation.md` | `examples/generate-client.spec.ts` |
| Deploy contracts and proxies | `HardhatProvider`, `Deployments`, `ensure`, `ensureWithProxy`, `ensureWithBeacon` | `references/deployments.md` | `examples/deploy-contract.spec.ts` |
| Build, sign, save, submit, or inspect transactions | `TxDataBuilder`, `TxWriter`, `TokenTransferService` | `references/transactions.md` | `examples/send-transaction.spec.ts` |
| Fetch or cache historical contract events | generated `getPastLogs*` helpers or `EventsIndexer` | `references/events-indexing.md` | `examples/index-events.spec.ts` |
| Fetch ABI/source/creation data from an explorer | `BlockchainExplorerFactory`, `BlockchainExplorer`, `ContractAbiProvider` | `references/explorer.md` | `examples/explorer-abi.spec.ts` |
| Read Solidity storage, structs, mappings, arrays, or diamond storage | `SlotsParser`, `SlotsStorage`, generated storage readers | `references/storage.md` | `examples/storage-read.spec.ts` |
| Work with tokens and balances | `TokensService`, `TokensServiceFactory`, `TokenTransferService`, generated ERC20 wrappers | `references/tokens-accounts.md` | `examples/token-transfer.spec.ts` |
| Work with accounts, signing, Safe, or ERC-4337 | `ChainAccountService`, `$sig`, `GnosisSafeHandler`, `SafeTx`, `Erc4337Service`, `Erc4337TxWriter` | `references/safe-erc4337.md`, `references/tokens-accounts.md` | `examples/safe-batch.spec.ts`, `examples/erc4337-userop.spec.ts` |
| Convert code from ethers or viem habits | Use the dequanto equivalents instead of adding external clients | `references/migration-from-ethers-viem.md` | all examples |

## Source Of Truth

- Package exports resolve by subpath for both ESM imports and CommonJS requires: `import { Web3ClientFactory } from "dequanto/clients/Web3ClientFactory"` or `const { Web3ClientFactory } = require("dequanto/clients/Web3ClientFactory")`.
- Source lives under `src/`.
- Declarations are emitted under `lib/types/`.
- Tests under `test/` are often the best runnable examples.
- Generated contract clients are published under `dequanto/prebuilt/...` and can be imported or required by subpath in the same way.

## Agent Workflow

1. Identify the goal from the task router.
2. Read the matching reference file.
3. Reuse the closest example.
4. Verify any new class or method against `src/` or `lib/types/`.
5. Use `npm run typecheck -- --pretty false` after TypeScript changes in this repository.

