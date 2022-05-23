import hh from 'hardhat';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { Generator } from '@dequanto/gen/Generator';
import { $path } from '@dequanto/utils/$path';
import { File } from 'atma-io';
import { Foo } from '../fixtures/contracts/Foo';
import { WETH } from '../fixtures/contracts/WETH';
import alot from 'alot';
import { $date } from '@dequanto/utils/$date';

UTest({
    $config: {
        timeout: $date.parseTimespan('5min'),
    },

    async 'generate polygons WETH' () {

        const gen = new Generator({
            name: 'WETH',
            platform: 'polygon',
            source: {
                abi: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
            },
            output: './test/tmp/polygon/'
        });
        await gen.generate();
        await File.copyTo('/test/tmp/polygon/WETH/WETH.ts', '/test/fixtures/contracts/');

        let weth = new WETH();
        let decimals = await weth.decimals();
        eq_(decimals, 18);
        if (false) {
            let current = await weth.client.getBlockNumber();
            let logs = await weth.getPastLogsTransfer({
                fromBlock: current - 200
            });
            let min = alot(logs).min(x => x.blockNumber);
            let max = alot(logs).max(x => x.blockNumber);
            console.log(`Count: ${logs.length}. Blocks: ${min}-${max}`)
        }
    },
    async 'generate from class meta comments and check the sources' () {
        let genPath = `/test/tmp/polygon/DaiTokenContractBase/DaiTokenContractBase.ts`

        try {
            await File.removeAsync(genPath);
        } catch(e){}

        let existsBase = await File.exists(genPath);
        eq_(existsBase, false);

        let templatePath = $path.resolve(`/src/gen/ContractTemplate.ts`);
        let exists = await File.exists(templatePath);
        eq_(exists, true, `Path 404: ${templatePath}`);
        await Generator.generateForClass('/test/fixtures/DaiTokenContract.ts');

        existsBase = await File.exists(genPath);
        eq_(existsBase, true, `Path 404: ${genPath}`);

        let source = await File.readAsync(genPath, { skipHooks: true });
        has_(source, 'onTransfer');
    },
    async 'generate and check with deployed contract' () {
        await hh.run('compile', {
            sources: '/test/fixtures/contracts'
        });

        const gen = new Generator({
            name: 'Foo',
            platform: 'eth',
            source: {
                abi: './artifacts/test/fixtures/contracts/Foo.sol/Foo.json'
            },
            output: './test/tmp/eth/'
        });
        await gen.generate();
        await File.copyTo('/test/tmp/eth/Foo/Foo.ts', '/test/fixtures/contracts/');


        let foo = await HardhatProvider.resolve(Foo, 'hello');
        let name = await foo.name();
        eq_(name, 'hello');


        let tx = await foo.setName(HardhatProvider.deployer(), 'bar');
        await tx.wait();

        name = await foo.name();
        eq_(name, 'bar');

        let logs = await foo.getPastLogsUpdated({});
        eq_(logs.length, 1);

        let log = logs[0];
        eq_(log.transactionHash, tx.tx.hash);
        eq_(log.event, 'Updated');
        eq_(log.params.newName, 'bar');
    },
})
