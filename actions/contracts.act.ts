import { UAction } from 'atma-utest';
import { Generator } from '@dequanto/gen/Generator';
import { Directory } from 'atma-io';
import alot from 'alot';

UAction.create({

    async '!openzeppelin' () {
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
