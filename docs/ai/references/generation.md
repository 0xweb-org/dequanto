# Contract Generation

Use `Generator` to create typed contract clients from ABI arrays, ABI JSON, compiled artifacts, Solidity files, or explorer-verified source by address.

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

## Generate From Compiled Artifact

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

## Generate From Solidity

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

## Generate From Explorer Address

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

When `source.abi` is an address, the generator asks the platform explorer for ABI/source and follows common proxy implementations.

## Storage Reader Generation

Use `GeneratorStorageReader` when the task needs generated storage accessors.

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

