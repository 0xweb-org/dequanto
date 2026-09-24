import { Generator } from '@dequanto/gen/Generator';
import { $require } from '@dequanto/utils/$require';
import { File } from 'atma-io';

// Generator is the low-level API for creating contract classes programmatically.
// Prefer 0xweb install for third-party contracts and @0xweb/hardhat for local Hardhat contracts.
UTest({
    async 'generate a typed contract class from a fixture artifact' () {
        const output = './test/tmp/ai-examples/hardhat/';
        const gen = new Generator({
            name: 'AnyERC20',
            platform: 'hardhat',
            source: {
                path: './test/fixtures/artifacts/AnyERC20/AnyERC20.json'
            },
            output
        });

        const result = await gen.generate();
        const source = await File.readAsync<string>(result.main, { skipHooks: true });

        $require.has('class AnyERC20', source);
        $require.has('ContractBase', source);
    }
});