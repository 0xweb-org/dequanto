# Contract Generation

TypeScript class generation is a core dequanto workflow. Prefer generated contract classes over raw ABI calls: generated classes let application code call contracts as ordinary TypeScript classes, with no direct web3-specific ABI encoding, decoding, or JSON-RPC plumbing.

Before generating a contract, check whether dequanto already ships a prebuilt class. The package includes OpenZeppelin contract classes under `dequanto/prebuilt/**` / `@dequanto/prebuilt/openzeppelin/**`. Class names match the OpenZeppelin contract names, for example `ERC20`, `ERC721`, `Ownable`, or `TimelockController`.

For standard OpenZeppelin contracts, do not generate a new class. Import the prebuilt class and pass the target contract address plus a chain client loaded by platform/chain abbreviation:

```ts
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { ERC20 } from '@dequanto/prebuilt/openzeppelin/ERC20';

const platform = 'eth';
const address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const client = await Web3ClientFactory.getAsync(platform);
const token = new ERC20(address, client);

const symbol = await token.symbol();
const decimals = await token.decimals();
```

Use the high-level generation tools when no prebuilt class exists:

- For deployed and explorer-verified third-party contracts, use `0xweb install` as the primary generation workflow.
- For local contract development, use `@0xweb/contract` / `@0xweb/hardhat` so local Solidity contracts generate TypeScript classes from the normal compile flow.
- Use the low-level `Generator` API only when the task needs custom generation inside TypeScript code.

Key source files:

- `src/gen/Generator.ts`
- `src/gen/GeneratorFromAbi.ts`
- `src/gen/GeneratorStorageReader.ts`
- `src/contracts/ContractClassFactory.ts`
- `src/hardhat/HardhatProvider.ts`

Useful tests:

- `test/generate/gen.spec.ts`
- `test/generate/class.spec.ts`
- `test/generate/base.spec.ts`
- `test/generate/slotreader.spec.ts`
- `test/hardhat/deployments/deployments.spec.ts`

## Install Third-Party Contracts With 0xweb

Use `0xweb install` as the primary tool for generating classes from deployed third-party contracts. When the contract is verified on an Etherscan-compatible explorer, `0xweb` downloads the ABI and source, follows standard proxy patterns, and generates the class for the current implementation.

```bash
npm i 0xweb -g
0xweb install <address> --name <contractClassName> --chain <chainAbbr>
```

Example:

```bash
0xweb install 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48 --name USDC --chain eth
```

If the target contract is a proxy but the implementation cannot be detected automatically, pass the implementation address explicitly:

```bash
0xweb install <proxyAddress> --implementation <implementationAddress> --name SomeName --chain eth
```

By default, `0xweb install` saves the downloaded Solidity sources next to the generated class. Use `--save-sources false` when the project should keep only the generated contract class:

```bash
0xweb install <address> --name SomeName --chain eth --save-sources false
```

The generated class can then be imported and used like a normal TypeScript class:

```ts
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { USDC } from './0xc/eth/USDC/USDC';

const client = await Web3ClientFactory.getAsync('eth');
const usdc = new USDC(undefined, client);

const symbol = await usdc.symbol();
const decimals = await usdc.decimals();
```

## Install From ABI JSON Or Solidity Source

`0xweb install` also accepts a local ABI JSON artifact or Solidity source file instead of an address:

```bash
0xweb install test/fixtures/artifacts/AnyERC20/AnyERC20.json --name AnyERC20 --chain eth
0xweb install contracts/AnyERC20.sol --name AnyERC20 --chain eth
```

Use this for ad hoc class generation from explicit local inputs. For ongoing local contract development, prefer the Hardhat integration so the generated classes stay in sync with `hardhat compile`.

## Hardhat Projects

Use `@0xweb/hardhat` in Hardhat projects. The plugin hooks into the Hardhat compile flow and generates TypeScript classes for local `*.sol` contracts whenever the project is compiled.

```bash
npm i @0xweb/hardhat --save-dev
```

Load the plugin from the Hardhat config:

```ts
import '@0xweb/hardhat';
```

Then compile normally:

```bash
npx hardhat compile
```

Use the generated classes in tests, scripts, and app code instead of raw ABI objects.

## Low-Level Generator API

Use `Generator` directly only for custom generation tasks, test fixtures, non-Hardhat toolchains, or agent code that must generate classes from explicit ABI arrays, ABI JSON, compiled artifacts, Solidity files, or explorer-verified source by address. For normal third-party contracts, prefer `0xweb install`; for local Hardhat projects, prefer `@0xweb/hardhat`.

### Generate From Compiled Artifact

```ts
import { Generator } from '@dequanto/gen/Generator';

const gen = new Generator({
    name: 'AnyERC20',
    platform: 'hardhat',
    source: {
        path: './artifacts/contracts/AnyERC20.sol/AnyERC20.json'
    },
    output: './0xc/hardhat/'
});

const info = await gen.generate();
```

### Generate From Solidity

```ts
const info = await Generator.generateFromSol('./contracts/MyToken.sol');
```

Or:

```ts
const gen = new Generator({
    name: 'IERC4626',
    platform: 'hardhat',
    source: {
        path: '@openzeppelin/contracts/interfaces/IERC4626.sol'
    },
    output: './0xc/hardhat/'
});

await gen.generate();
```

### Generate From Explorer Address

```ts
const gen = new Generator({
    name: 'DaiToken',
    platform: 'eth',
    source: {
        abi: '0x6b175474e89094c44da98b954eedeac495271d0f'
    },
    output: './0xc/eth/'
});

await gen.generate();
```

When `source.abi` is an address, the generator asks the platform explorer for ABI/source and follows common proxy implementations. Prefer `0xweb install` for normal installed-contract workflows.

## Storage Reader Generation

When a contract is generated from verified on-chain source, such as with `0xweb install` or a generator address source, the generated contract class also includes a storage reader. Consumers can use it to load private storage variables by Solidity variable name, when the verified source exposes the storage layout.

Use `GeneratorStorageReader` when the task needs generated storage accessors without generating the full contract class.

```ts
import { GeneratorStorageReader } from '@dequanto/gen/GeneratorStorageReader';

const gen = new GeneratorStorageReader();
const result = await gen.generate({
    address,
    name: 'WETH',
    contractName: 'MaticWETH',
    network: 'poly',
    client,
    sources
});
```

## Generated Metadata

Generated classes can include `$meta`:

- `artifact`
- `class`
- `source`
- `name`

Agents should inspect generated files before assuming method names, constructor helpers, event helper names, or storage reader fields.