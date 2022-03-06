import { Generator } from '@dequanto/gen/Generator';
import { $path } from '@dequanto/utils/$path';
import { File } from 'atma-io';

UTest({
    async 'generate test' () {
        let genPath = `/test/tmp/polygon/DaiTokenContractBase.ts`

        try {
            await File.removeAsync(genPath);
        } catch(e){}

        let existsBase = await File.exists(genPath);
        eq_(existsBase, false);

        let templatePath = $path.resolve(`/src/gen/ContractTemplate.ts`);
        let exists = await File.exists(templatePath);
        eq_(exists, true);
        await Generator.generateForClass('/test/fixtures/DaiTokenContract.ts');

        existsBase = await File.exists(genPath);
        eq_(existsBase, true);

        let source = await File.readAsync(genPath, { skipHooks: true });
        has_(source, 'onTransfer');
    }
})
