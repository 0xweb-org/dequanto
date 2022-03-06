import { UAction } from 'atma-utest';
import { Generator } from '@dequanto/gen/Generator';

// File header example

/**
 * dequanto
 * name: SushiFactoryContractBase
 * platform: polygon
 * source.abi: 0xc35dadb65012ec5796536bd9864ed8773abc74c4
 * output: ./contracts/gen/polygon/
 */

UAction.create({
    // atma act ./dequanto/actions/gen.act.ts -q genc --path ./some/file.ts
    async '!genc' () {
        let app = global.app;
        let path = app.config.$get('path');

        await Generator.generateForClass(path);
    },
    async 'cli' () {
        let app = global.app;
        let address = app.config.$get('address');
        let net = app.config.$get('net') as 'bsc' | 'eth';
        let name = app.config.$get('name');
        let opts = {
            platform: net,
            name: name,
            source: {
                abi: address,
            },
            output: `./contracts/${net}/`
        };
        let generator = new Generator(opts);
        await generator.generate();
    }
});
