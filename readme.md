# dequanto

[![Documentation Link](https://img.shields.io/badge/%E2%9D%93-documentation-green.svg)](https://docs.0xweb.org/dequanto)
[![CircleCI](https://circleci.com/gh/0xweb-org/dequanto.svg?style=svg)](https://circleci.com/gh/0xweb-org/dequanto)


Here we share our library to work with Ethereum Virtual Machine RPC Nodes: Ethereum, Polygon, BSC, Arbitrum, etc. We use web3 and ethers to provide new Features and to simplify the API.

1. RPC Client Pool
2. Transaction Builder
3. Generated TypeScript classes for contracts
4. Etherscan & Co clients
5. Tokens provider - get token data by symbol, address, platform.
6. Tokens service - transfer and swap
7. Transaction **Indexers** - listens to blocks and parse new transactions to simplify further processing
8. Native **`BigInt`** types and various utility methods
9. OpenZeppelin contracts


###  **`Source-Code`** Distribution

Not as a library, but as the source code. Clone or fork it and use it as a **submodule**. Means:
a) you can `import` any `class`, `namespace` and `utility` method.
b) you can easily extend and modify any `class`, `namespace` and `utility` method.
c) you get the documentation direct from the code. _We don't have much time yet to document all the parts_

And path prefix (alias) to your `tsconfig.json`
```json
{
    "compilerOptions": {
        "paths": {
            "@dequanto/*": [ "your-sub-module-folder/src/*" ],
            "@dequanto-contract/*": [ "your-sub-module-folder/contract/*" ]
        }
    }
}
```

### Configuration

Before you use the code, you should prepare the configuration for it: Node RPC URLs, Accounts, Blockchain Explorer API Keys, etc.

## 1. RPC Client Pool

Provide multiple RPC Node URLs, this will make your application much more reliable. Even if one of the Nodes goes down or for some reason is not in-sync, all your RPC calls will still work.

[Web3Client](src/clients/Web3Client.ts) is the base class for all the EVM Platforms. This wraps web3 to provide pool-based communication with nodes. It handles also Gas and Nonce Values.


## 2. Transaction Builder

[TxDataBuilder](src/txs/TxDataBuilder.ts) and [TxWriter](src/txs/TxWriter.ts) to create and submit transaction.


## 3. Generated TypeScript classes for contracts

With auto-generated classes you can

a) type-safe method read and write(transaction) calls to blockchain
b) parse receipts of the contract transactions
c) easily subscribe to event streams of the contract

## 4. Etherscan&Co clients

Ready to use Etherscan&Co classes to consume their API. Just drop-in the KEYs.

## 5. Tokens provider

Get Tokens Data (`address`, `decimals`, etc) by `symbol` and `platform`

## 6. Tokens service

One-liners to transfer tokens from A to B, or swap the tokens using popular DEXes

## 7. Transaction **Indexers**

Start listening the blockchain with less code

## 8. Utils

Lots of Utility methods. BigInt are the first-class citizens in the code.


### 9. OpenZeppelin contracts

We prebuild generic OpenZeppelin contracts

```
import { ERC20 } from '@dequanto-contracts/openzeppelin/ERC20

let erc20 = new ERC20(`0x...`);
let balance = await erc20.balanceOf('0x...');
```
