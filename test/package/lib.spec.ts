import { Generator } from '@dequanto/gen/Generator';
import { Directory, File } from 'atma-io';
import { run } from 'shellbee';
import ts from 'typescript';
import path from 'path';

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
        await Directory.copyToAsync('./src/', `${base}/node_modules/dequanto/src/`, { verbose: true  });
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
    async 'should load the generated contract' () {
        const gen = new Generator({
            target: 'js',
            outputFileExt: 'mjs',
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

        let dtsFile = new File(`./test/fixtures/package/simple/0xc/eth/WETH/WETH.d.ts`);

        eq_(await dtsFile.existsAsync(), true, 'd.ts file does not exist');

        let projectDir = process.cwd() + '/test/fixtures/package/simple/';
        let errors = await checkTypeScriptFile(projectDir, dtsFile.uri.toLocalFile());
        deepEq_(errors, []);
    }
})


/**
 * Check for TypeScript errors in a .d.ts file.
 * @param {string} filePath - The path to the .d.ts file.
 * @returns {Promise<void>}
 */
async function checkTypeScriptFile(projectDir, filePath) {
    // Ensure the file exists
    if (await File.existsAsync(filePath) === false) {
        return [ `File not found: ${filePath}` ];
    }

    const configPath = path.resolve(projectDir, "tsconfig.json");
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const errors = [];

    if (configFile.error) {
        errors.push(configFile.error.messageText);
        return errors;
    }

    const parsedCommandLine = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        projectDir
    );

    // Create a TypeScript program with the .d.ts file
    const program = ts.createProgram([filePath], parsedCommandLine.options);

    // Get diagnostics (errors and warnings)
    const diagnostics = ts.getPreEmitDiagnostics(program);

    if (diagnostics.length > 0) {
        diagnostics.forEach((diag) => {
            const message = ts.flattenDiagnosticMessageText(diag.messageText, "\n");
            const location =
                diag.file && diag.start !== undefined
                    ? diag.file.getLineAndCharacterOfPosition(diag.start)
                    : null;

            if (location) {
                errors.push(
                    `Error at ${diag.file.fileName}:${location.line + 1}:${
                        location.character + 1
                    } - ${message}`
                );
            } else {
                errors.push(`Error: ${message}`);
            }
        });
    }
    return errors;
}
