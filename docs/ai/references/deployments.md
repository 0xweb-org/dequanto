# Deployments

Use `HardhatProvider` for compile/deploy helper flows and `Deployments` for idempotent deployments, deployment storage, bytecode checks, proxy upgrades, beacon proxies, and verification.

Key source files:

- `src/hardhat/HardhatProvider.ts`
- `src/contracts/deploy/Deployments.ts`
- `src/contracts/deploy/proxy/ProxyDeployment.ts`
- `src/contracts/deploy/storage/DeploymentsStorage.ts`
- `src/contracts/deploy/ContractDeployer.ts`

Useful tests:

- `test/hardhat/deployments/deployments.spec.ts`
- `test/hardhat/deploy.spec.ts`
- `test/hardhat/compile.spec.ts`
- `test/hardhat/forked.spec.ts`
- `test/hardhat/snaps.spec.ts`

## HardhatProvider

```ts
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';

const hh = new HardhatProvider();
const client = hh.client();
const deployer = hh.deployer(0);
```

Common methods:

- `client('hardhat' | 'localhost')`
- `forked({ platform, url, block })`
- `deployer(index)`
- `compileSol(path, options?)`
- `compileCode(code, options?)`
- `deploySol(path, options?)`
- `deployCode(code, options?)`
- `deployClass(Ctor, options?)`
- `getContractFromSolPath(path, options?)`

## Idempotent Deployments

```ts
import { Deployments } from '@dequanto/contracts/deploy/Deployments';

const deployments = new Deployments(client, deployer, {
    directory: './deployments/',
    verification: false
});

const { contract, deployment } = await deployments.ensure(MyContract, {
    arguments: ['Name', 'SYM', 1_000n]
});
```

`ensure` reuses saved deployments when possible. With `latest: true`, it checks local bytecode against deployed bytecode and redeploys when required unless options say otherwise.

## Transparent Proxy

```ts
const { contract, contractImplementation, contractProxy, deployment } =
    await deployments.ensureWithProxy(MyUpgradeableContract, {
        id: 'MyUpgradeableContract',
        initialize: [owner]
    });
```

Initializer params are passed by method name:

- `initialize`
- `initializeV2`
- `initializeV3`

`ensureWithProxy` serializes initializer and latest migration calldata from the generated contract ABI.

## Beacon Proxy

```ts
const result = await deployments.ensureWithBeacon(MyUpgradeableContract, {
    id: 'Pool/A',
    initialize: [owner]
});
```

Beacon deployment ids can use paths. The first path segment is treated as the implementation id.

## Storage Layout

Proxy and beacon upgrades validate generated storage layout data when available. For upgrade-sensitive work, inspect generated `$slots` and deployment layout output before assuming compatibility.

## Avoid

- Do not deploy a contract twice manually when `Deployments.ensure(...)` should own the deployment record.
- Do not skip `id` for multiple proxy or beacon instances of the same implementation.
- Do not assume proxy upgrade safety from TypeScript compile success alone.

