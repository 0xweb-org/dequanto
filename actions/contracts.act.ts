import { UAction } from 'atma-utest';
import { Generator } from '@dequanto/gen/Generator';
import { Directory, File } from 'atma-io';
import alot from 'alot';
import { TAddress } from '@dequanto/models/TAddress';

UAction.create({

    async 'gnosis'() {
        const files = await Directory.readFilesAsync('./contracts/abi/gnosis/', '**.json');
        await alot(files)
            .forEachAsync(async file => {
                let path = file.uri.toLocalFile();

                let name = file.uri.file.replace(/\.\w+$/, '');
                let generator = new Generator({
                    name: name,
                    source: {
                        abi: path
                    },
                    platform: 'eth',
                    output: `./contracts/gnosis/${name}.ts`
                });
                await generator.generate();
            })
            .toArrayAsync();
    },
    async 'openzeppelin'() {
        const files = await Directory.readFilesAsync('./node_modules/@openzeppelin/contracts/build/contracts/', '**.json');
        await alot(files)
            .forEachAsync(async file => {
                let path = file.uri.toLocalFile();

                let name = file.uri.file.replace(/\.\w+$/, '');
                let generator = new Generator({
                    name: name,
                    source: {
                        abi: path
                    },
                    platform: 'eth',
                    output: `./contracts/openzeppelin/${name}.ts`
                });

                await generator.generate();

                let content = await file.readAsync<{ abi }>();
                await File.writeAsync(`./contracts/openzeppelin/${name}.json`, content.abi);
            })
            .toArrayAsync();
    },
    async '!account-abstraction'() {
        const ENTRY_POINT = '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789';

        async function generate(name: string, source: ConstructorParameters<typeof Generator>[0]['source']) {

            let generator = new Generator({
                name: name,
                source: source,
                platform: 'eth',
                output: `./contracts/ERC4337/`,
                saveSources: false
            });
            await generator.generate();
        }

        await generate('EntryPoint', { abi: ENTRY_POINT });
        await generate('SimpleAccount', { path: './test/fixtures/erc4337/samples/SimpleAccount.sol' });
        await generate('SimpleAccountFactory', { path: './test/fixtures/erc4337/samples/SimpleAccountFactory.sol' });
    }
});
