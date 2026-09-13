import { Generator } from '@dequanto/gen/Generator';
import { File } from 'atma-io';

UTest({
    async 'generate a typed contract client from a fixture artifact' () {
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

        has_(source, 'class AnyERC20');
        has_(source, 'ContractBase');
    }
});