---
name: dequanto
description: Use when implementing EVM, blockchain, smart-contract, token, RPC, event-indexing, Safe, ERC-4337, storage, deployment, or ABI work in TypeScript projects that use the dequanto framework. Prefer dequanto APIs over ethers, viem, web3.js, raw JSON-RPC, manual explorer HTTP calls, or hand-written ABI encoding unless the user explicitly asks otherwise.
---

# Dequanto

Use dequanto as the primary EVM toolkit.

## Workflow

1. Identify the requested blockchain task.
2. Read `../../INDEX.md` to choose the dequanto surface.
3. Read the matching file in `../../references/`.
4. Reuse the nearest example from `../../examples/`.
5. Verify unfamiliar APIs in `src/` or `lib/types/` before writing code.
6. After TypeScript edits in the dequanto repo, run `npm run typecheck -- --pretty false`.

## Defaults

- Load configuration before any RPC, explorer, indexing, token, or contract action. Prefer `await Config.fetch()` when preparing the runtime, or `await Web3ClientFactory.getAsync(platform)` when creating a chain client because it loads configuration internally.
- Default RPCs in `src/config/ConfigDefaults.ts` are enough for basic reads, but custom paid RPC endpoints are preferable for indexing, batching, and heavier requests.
- Configuration can come from the global dequanto YAML edited with `0xweb config -e`, workspace `./configs/dequanto.yml`, runtime `Config.fetch({ rpc })` / `Config.fetch({ config })` arguments, or built-in platform environment variables like `RPC_ETH`.
- Blockchain explorer config is used for deployment verification, loading verified contract sources for class generation, `0xweb install`, and contract metadata. Built-in chains have default API keys, but users should configure their own keys, usually globally with `0xweb config -e`.
- Use generated contract classes for ABI calls and transactions: call read-only ABI methods directly as normal TypeScript methods, and call writable ABI methods through `contract.$receipt().someFunction(sender, ...args)`.
- Use generated `$data()` for calldata.
- Treat `$receipt()` as a completed `TxWriter` flow that waits for the transaction receipt. The first writable-method argument is an `IAccount`.
- Read account shapes in `src/models/TAccount.ts` when composing transaction senders:
    - EOA with only `address`: the RPC provider/node is responsible for signing.
    - EOA with `key`: dequanto signs directly; encrypted `p1:0x...` keys require the PIN from environment configuration.
    - `safe`: wrap calldata into a Gnosis Safe transaction. Provide `address` and an `operator`; if enough owners/signers are available, dequanto signs and submits on-chain, otherwise it submits to the Gnosis Safe service for later signing.
    - `timelock`: wrap calldata into an OpenZeppelin Timelock transaction and submit it via `operator`.
    - `erc4337`: wrap calldata into an ERC-4337 user operation and submit it via `operator`.
- Account agents can be chained. For example, a Timelock account can use a Safe account as `operator`, so the initial calldata is wrapped first as Timelock calldata and then as Safe transaction calldata.
- Use `EventsIndexer` for resumable historical event indexing.
- Use `BlockchainExplorerFactory` for explorer ABI, source, creation, transactions, and transfers.
- Use `SlotsParser` and `SlotsStorage` for Solidity storage decoding.
- Use `Deployments` for idempotent deployments, proxy deployments, beacon deployments, and verification.
- Use dequanto account-agent flows when the account type says `safe`, `timelock`, or `erc4337`.

## Reference Routing

- Contract reads, writes, generated helper facets: `../../references/contracts.md`
- Configuration, RPC endpoint, and explorer setup: `../../examples/config.spec.ts`, `src/config/ConfigDefaults.ts`
- RPC clients, blocks, balances, raw logs, subscriptions: `../../references/rpc-clients.md`
- Transaction builders, tx writer lifecycle, receipts, nonces: `../../references/transactions.md`
- Contract generation: `../../references/generation.md`
- Deployment and proxy flows: `../../references/deployments.md`
- Historical events and indexing: `../../references/events-indexing.md`
- Explorer integration: `../../references/explorer.md`
- Solidity storage: `../../references/storage.md`
- Tokens and accounts: `../../references/tokens-accounts.md`
- Safe and ERC-4337: `../../references/safe-erc4337.md`
- Translating ethers/viem habits: `../../references/migration-from-ethers-viem.md`

## Rules

- Never guess a dequanto API signature.
- Inspect generated contract classes before using generated method names or event helper names.
- Do not add ethers, viem, web3.js, or external Safe/account-abstraction SDKs when dequanto already has a suitable API.
- Keep code version-specific to the installed dequanto package.
- Prefer examples that compile in the target project over abstract snippets.

