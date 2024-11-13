import { Directory, File } from 'atma-io';
import { run } from 'shellbee';

UTest({
    '$config': {
        timeout: 100_000
    },
    async '$before' () {
        let path = `./test/fixtures/package/simple`
        let pkgJsonLocal = await File.readAsync<any> ('./package.json');
        let pkgJson = {
            dependencies: {
                ...pkgJsonLocal.dependencies,
                dequanto: 'latest'
            }
        }
        await File.writeAsync(`${path}/package.json`, JSON.stringify(pkgJson, null, 2));
        let resultInstall = await run({
            'command': 'npm install dequanto',
            cwd: `${path}/`
        });

        await Directory.copyToAsync('./lib/', `${path}/node_modules/dequanto/lib/`, { verbose: true  });
        await File.writeAsync(`${path}/node_modules/dequanto/package.json`, pkgJsonLocal);
    },
    async 'should install latest dequanto' () {
        let path = `./test/fixtures/package/simple/`
        // let resultInstall = await run({
        //     'command': 'npm install dequanto',
        //     cwd: path
        // });

        let resultCommand = await run({
            'command': 'node ./check.mjs',
            cwd: path
        });

        eq_(resultCommand.errors?.[0], null);

        let str = resultCommand.std.join('\n');
        has_(str, /Current Ethereum block number: \d+/);
    }
})
