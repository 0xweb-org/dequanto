import { Generator } from '@dequanto/gen/Generator';
import { Directory, File } from 'atma-io';
import { run } from 'shellbee';

const base = `./test/fixtures/package/simple`;

UTest({
    '$config': {
        timeout: 100_000
    },
    async '$before' () {
        let pkgJsonLocal = await File.readAsync<any> ('./package.json');
        let pkgJson = {
            dependencies: {
                ...pkgJsonLocal.dependencies,
                dequanto: 'latest'
            }
        }
        await File.writeAsync(`${base}/package.json`, JSON.stringify(pkgJson, null, 2));
        await run({
            'command': 'npm install dequanto',
            cwd: `${base}/`
        });

        await Directory.copyToAsync('./lib/', `${base}/node_modules/dequanto/lib/`, { verbose: true  });
        await File.writeAsync(`${base}/node_modules/dequanto/package.json`, pkgJsonLocal);
    },
    async 'client.getBlockNumber should work' () {


        let resultCommand = await run({
            'command': 'node ./check.mjs',
            cwd: base
        });

        eq_(resultCommand.errors?.[0], null);

        let str = resultCommand.std.join('\n');
        has_(str, /Current Ethereum block number: \d+/);
    },
    async '!should load the generated contract' () {
        const gen = new Generator({
            target: 'js',
            name: 'WETH',
            platform: 'polygon',
            source: {
                abi: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
            },
            output: './test/fixtures/package/simple/0xc/eth/'
        });
        await gen.generate();

        let resultCommand = await run({
            'command': 'node ./checkGen.mjs',
            cwd: base
        });

        eq_(resultCommand.errors?.[0], null);

        let str = resultCommand.std.join('\n');
        has_(str, "WETH decimals: 18");
    }
})
