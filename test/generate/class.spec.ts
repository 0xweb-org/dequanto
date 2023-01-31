import hh from 'hardhat';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { Generator } from '@dequanto/gen/Generator';
import { $path } from '@dequanto/utils/$path';
import { Directory, File } from 'atma-io';
import { $date } from '@dequanto/utils/$date';
import { l } from '@dequanto/utils/$logger';
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { TestNode } from '../hardhat/TestNode';
import { $promise } from '@dequanto/utils/$promise';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { $bigint } from '@dequanto/utils/$bigint';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { $contract } from '@dequanto/utils/$contract';
import { $txData } from '@dequanto/utils/$txData';
import { Wallet } from 'ethers';
import { $fn } from '@dequanto/utils/$fn';

declare let include;

UTest({
    $config: {
        timeout: $date.parseTimespan('5min'),
    },

    async $before () {
        await TestNode.start();
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

        let { WETH } = await include.js('/test/tmp/polygon/WETH/WETH.ts');


        let weth = new WETH.WETH();
        let decimals = await weth.decimals();
        eq_(decimals, 18);

        '> read in batch'

        let nameReq = weth
            .$config({ send: 'manual' })
            .name();

        let totalSupplyReq = await weth
            .$config({ send: 'manual' })
            .totalSupply();

        let reader = new ContractReader(weth.client);
        let [ name, totalSupply ] = await reader.executeBatch([ nameReq, totalSupplyReq ]);

        eq_(name, 'Wrapped Ether');
        gt_(totalSupply, 1000n);

        let nameFromSlot = await weth.storage._name();
        eq_(nameFromSlot, name);

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

        let provider = new HardhatProvider();
        let client = await provider.client('localhost');


        await hh.run('compile', {
            sources: '/test/fixtures/contracts',
            tsgen: false
        });
        const gen = new Generator({
            name: 'Foo',
            platform: 'hardhat',
            source: {
                abi: './artifacts/test/fixtures/contracts/Foo.sol/Foo.json'
            },
            output: './test/tmp/eth/'
        });
        await gen.generate();

        let { Foo } = await include.js('/test/tmp/eth/Foo/Foo.ts');

        let foo:any = await provider.deployClass(Foo.Foo, {
            arguments: [ 'hello' ],
            client
        });

        let name = await foo.name();
        eq_(name, 'hello');

        await $promise.wait(2000);

        l`Subscribe to transactions stream`
        const transactionsListener = [];
        foo.onTransaction('*').subscribe((data) => {
            transactionsListener.push(data.calldata);
        });

        l`Set new name`
        let tx = await foo.setName(provider.deployer(), 'bar');
        let receipt = await tx.wait();
        eq_(receipt.status, true);


        l`Check name was set`
        name = await foo.name();
        eq_(name, 'bar');

        l`Check logs`
        let logs = await foo.getPastLogsUpdated({});
        gte_(logs.length, 1);

        let log = logs[logs.length - 1];
        eq_(log.transactionHash, tx.tx.hash);
        eq_(log.event, 'Updated');
        eq_(log.params.newName, 'bar');

        l`Check overloads`
        let zero = await foo.someEcho();
        eq_(zero, 0);

        let echoed = await foo.someEcho(2);
        eq_(echoed, 2);


        await $promise.waitForTrue(() => transactionsListener.length > 0, {
            timeoutMessage: `Transactions were not captured`,
            timeoutMs: 4000,
            intervalMs: 100,
        });

        let methods = transactionsListener.map(x => x.method);
        deepEq_(methods, ['setName']);

    },
})
