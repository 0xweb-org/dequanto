# Migration From Ethers And Viem Habits

Agents often know ethers and viem better than dequanto. Use this file to translate those habits into dequanto patterns.

| Goal | ethers / viem habit | Dequanto pattern |
| --- | --- | --- |
| Create RPC client | `new JsonRpcProvider(url)`, `createPublicClient(...)` | `await Web3ClientFactory.getAsync(platform)` or `new EvmWeb3Client({ platform, chainId, endpoints })` |
| Read block number | `provider.getBlockNumber()`, `client.getBlockNumber()` | `client.getBlockNumber()` |
| Read native balance | `provider.getBalance(address)` | `client.getBalance(address)` |
| Read contract | `new Contract(address, abi, provider).balanceOf(owner)` | generated contract class, for example `new ERC20(address, client).balanceOf(owner)` |
| Write contract | `contract.connect(signer).transfer(...)`, `walletClient.writeContract(...)` | generated write method returning `TxWriter` |
| Wait for tx | `tx.wait()` | `await writer.wait()` or `await contract.$receipt().method(...)` |
| Build calldata | `iface.encodeFunctionData(...)`, `encodeFunctionData(...)` | generated `contract.$data().method(...)` or `$abiUtils.serializeMethodCallData(...)` |
| Raw eth_call | `provider.call(tx)` | `contract.$call().method(...)` or `client.call(tx)` |
| Raw ABI read | `readContract(...)` | `client.readContract(...)` or `ContractReader.readAsync(...)` |
| Logs | `provider.getLogs(...)`, `client.getLogs(...)` | `client.getPastLogs(...)`, generated `getPastLogs(...)`, or `EventsIndexer` |
| Explorer ABI | hand-written Etherscan HTTP | `BlockchainExplorerFactory.get(platform).getContractAbi(address)` |
| Contract generation | TypeChain, viem codegen | `Generator` / 0xweb-generated dequanto contract classes |
| Storage | raw `eth_getStorageAt` plus manual decode | `SlotsParser` + `SlotsStorage` |
| Bigint formatting | `parseUnits`, `formatUnits` | `bigint` js type is supported natively, additionally `$bigint` helpers and token decimals through dequanto token services |
| Safe tx | Safe SDK | `SafeAccount`, `GnosisSafeHandler`, `SafeTx`, Safe transports |
| ERC-4337 | external bundler/account SDK | `Erc4337Service`, `Erc4337TxWriter`, `Erc4337Account` |

## Strong Defaults

- Use generated contract classes first.
- Use `Web3ClientFactory` for platform clients.
- Use `TxWriter` for transaction lifecycle.
- Use `EventsIndexer` when events must be cached and resumed.
- Use `SlotsParser` and `SlotsStorage` for storage decoding.

## Anti-Patterns

Do not introduce:

```ts
import { ethers } from 'ethers';
import { createPublicClient } from 'viem';
import Web3 from 'web3';
```

unless the user explicitly asks for those libraries or the local repo already uses them for that exact integration.

