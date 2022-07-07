import { UAction } from 'atma-utest';
import { Generator } from '@dequanto/gen/Generator';
import { Directory } from 'atma-io';
import alot from 'alot';

UAction.create({

    async '!gnosis' () {
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
    async 'openzeppelin' () {
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
            })
            .toArrayAsync();
    }
});
