# dequanto

[![Documentation](https://img.shields.io/badge/documentation-green.svg)](https://docs.0xweb.org/dequanto)
[![CircleCI](https://circleci.com/gh/0xweb-org/dequanto.svg?style=svg)](https://circleci.com/gh/0xweb-org/dequanto)
[![NPM version](https://badge.fury.io/js/dequanto.svg)](http://badge.fury.io/js/dequanto)

<p align="center">
    <img src="assets/background.jpg" alt="dequanto" />
</p>

`dequanto` is a TypeScript toolkit for EVM development. It can generate typed contract clients from ABI or Solidity sources, submit and monitor transactions, query RPC nodes, read blockchain explorer data, index events, and work with common Ethereum data formats.

The library can be used at different abstraction levels:

- Use generated contract classes for typed calls, transactions, and event parsing
- Use RPC clients directly when you need low-level node access
- Use transaction builders for fine-grained signing and submission flows
- Use storage, ABI, and bytecode utilities when inspecting contracts or chain data

## Features

### Typed Contract Clients

Generate ES6/TypeScript classes from ABI, compiled artifacts, Solidity files, or verified source code fetched from blockchain explorers. Generated clients can call read methods, submit transactions, parse logs, and expose typed helpers around contract metadata.

### RPC Clients

Connect to one or more blockchain nodes through a shared client layer. The RPC client supports node pools, request balancing, throttling, rate limits, and automatic retries.

### Transactions

Build, sign, submit, and wait for transactions with lower-level control over transaction data. The transaction layer also includes support for Gnosis Safe, Account Abstraction, and Flashbots flows.

### Explorer Integration

Use Etherscan-compatible explorers and related APIs to fetch ABIs, source code, contract creation metadata, token data, and other chain information.

### Event Indexing

Fetch and persist contract events with resumable progress. The event indexer is designed for long-running indexing jobs that need file-backed state.

### Watchers

Subscribe to contract events and monitor transactions in real time.

### Numeric Utilities

Work with native `bigint` values and `BigFloat` helpers for mantissa-based math.

### Prebuilt Contracts

Use pre-generated TypeScript wrappers for commonly used contracts, including OpenZeppelin contracts.

## Installation

Install the package from npm:

```bash
npm i dequanto
```

The package ships with:

- CommonJS files under `node_modules/dequanto/lib/cjs`
- ESM files under `node_modules/dequanto/lib/esm`
- TypeScript declarations under `node_modules/dequanto/lib/types`
- TypeScript sources under `node_modules/dequanto/src`

Node and build tools can resolve the correct entry point through the package exports.

## 0xweb CLI

You can also use the [0xweb](https://github.com/0xweb-org/0xweb) CLI to generate contract clients and install contract dependencies.

## Configuration

`dequanto` includes default configuration for several chains and Safe infrastructure. For project-specific settings, add RPC URLs, explorer API keys, and other overrides through YAML config files.

## Development

Useful repository commands:

```bash
npm run typecheck
npm run build
npm test
```

The main validation command for TypeScript changes is:

```bash
npm run typecheck -- --pretty false
```

## Documentation

Full documentation is available at:

```text
https://docs.0xweb.org/dequanto
```

## License

Copyright (c) 2026 0xweb.org
