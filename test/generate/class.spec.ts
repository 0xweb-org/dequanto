import hh from 'hardhat';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { Generator } from '@dequanto/gen/Generator';
import { $path } from '@dequanto/utils/$path';
import { File } from 'atma-io';
import { $date } from '@dequanto/utils/$date';
import { l } from '@dequanto/utils/$logger';
import { ContractReader } from '@dequanto/contracts/ContractReader';
import { TestNode } from '../hardhat/TestNode';
import { $promise } from '@dequanto/utils/$promise';
import { ContractWriter } from '@dequanto/contracts/ContractWriter';
import { ERC20 } from '@dequanto-contracts/openzeppelin/ERC20';
import alot from 'alot';
import { ITxLogItem } from '@dequanto/txs/receipt/ITxLogItem';

declare let include;

UTest({
    $config: {
        timeout: $date.parseTimespan('5min'),
    },

    async $before () {
        await TestNode.start();
        ContractWriter.SILENT = true;
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
        let weth: ERC20 & { storage } = new WETH.WETH();
        let decimals = await weth.decimals();
        eq_(decimals, 18);

        l`> read in batch`

        let nameReq = await weth
            .$config({ send: 'manual' })
            .name();

        let totalSupplyReq = weth
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

        let templatePath = $path.resolve(`/src/gen/templates/ContractTemplate.ts.tmpl`);
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

        return UTest({
            $config: {
                timeout: $date.parseTimespan('1min'),
            },
            async 'deploy to localhost to listen for WS events' () {
                let provider = new HardhatProvider();
                let client = await provider.client('localhost');
                let { contract: foo }= await provider.deployClass<any>(Foo.Foo, {
                    arguments: [ 'hello' ],
                    client
                });

                let name = await foo.name();
                eq_(name, 'hello');

                l`> check storage simple`;
                let nameFromSlot = await foo.storage.name();
                eq_(nameFromSlot, 'hello');

                l`> check storage nested`
                let user = await foo.storage.user();
                deepEq_(user, {
                    account: '0x0000000000000000000000000000000000000001',
                    amount: 50n
                })

                l`> Deploy second contract`;
                let { contract: qux } = await provider.deployClass<any>(Foo.Foo, {
                    arguments: [ 'qux' ],
                    client
                });

                l`> Getting name`;
                let nameBar = await qux.name();
                eq_(nameBar, 'qux');
                notEq_(foo.address, qux.address);

                l`> Update qux contract and check later the event is not included in logs`
                let quxTx = await qux.setName(provider.deployer(), 'Qux2');
                let quxReceipt = await quxTx.wait();
                eq_(quxReceipt.status, true);


                l`> Get name with Contract Reader`
                let reader = new ContractReader(client);
                let nameFromReader = await reader.readAsync(foo.address, 'name() returns (string)');
                eq_(nameFromReader, 'hello');

                l`> Get name with Contract Reader and method SIGNATURE`
                let nameFromReaderWithSig = await reader.readAsync(foo.address, '0x06fdde03() returns (string)');
                eq_(nameFromReaderWithSig, 'hello');

                l`> Subscribe to transactions stream`
                const transactionsListener = [];
                let subjectStream = foo.$onTransaction({ filter: { method: '*' } });
                subjectStream.subscribe((data) => {
                    transactionsListener.push(data.calldata);
                });
                await subjectStream.onConnected;


                l`> Set new name (block ${ await client.getBlockNumber() })`
                let tx = await foo.setName(provider.deployer(), 'bar');
                let receipt = await tx.wait();
                eq_(receipt.status, true);

                l`> Check name was set (block ${ await client.getBlockNumber() })`
                name = await foo.name();
                eq_(name, 'bar');

                l`> Set new name via setName2`
                let txSetName2 = await foo.setName2(provider.deployer(), 'bar2');
                await txSetName2.wait();
                l`> Check name was set (block ${ await client.getBlockNumber() })`
                name = await foo.name();
                eq_(name, 'bar2');

                l`> Check logs for FOO contract`
                let logs = await foo.getPastLogsUpdated({});
                gte_(logs.length, 1);
                eq_(logs.find(log => log.params.newName == 'Qux2'), null);

                let log = logs[logs.length - 1];
                eq_(log.transactionHash, tx.tx.hash);
                eq_(log.event, 'Updated');
                eq_(log.params.newName, 'bar');

                l`> Check logs for FOO contract with Event Name`;
                let logsByName = await foo.getPastLogs('Updated');
                deepEq_(logs, logsByName);

                l`> Check logs by topic`
                let parsed = await reader.getLogsParsed('event Updated(string newName)', {
                    fromBlock: quxReceipt.blockNumber,
                });
                let names = parsed.map(x => x.params.newName);
                deepEq_(names, ['Qux2', 'bar']);


                l`> Emit logs again, and recheck fromBlock`;
                let blockNr = await client.getBlockNumber();
                tx = await foo.setName(provider.deployer(), 'qux');
                receipt = await tx.wait();

                eq_(typeof receipt.blockNumber, 'number');
                eq_(blockNr + 1, receipt.blockNumber);
                logs = await foo.getPastLogsUpdated({
                    fromBlock: blockNr + 1
                });
                eq_(logs.length, 1);
                eq_(logs[0].params.newName, 'qux');
                eq_(typeof logs[0].blockNumber, 'number');



                l`Check overloads`
                let zero = await foo.someEcho();
                eq_(zero, 0);

                let echoed = await foo.someEcho(2);
                eq_(echoed, 2);


                await $promise.waitForTrue(() => transactionsListener.length > 2, {
                    timeoutMessage: () => `Transactions were not captured. Got ${transactionsListener.length} Expected: 2`,
                    timeoutMs: 4000,
                    intervalMs: 100,
                });

                let methods = transactionsListener.map(x => x.method);
                deepEq_(methods, [
                    // 3 set TX were emitted above
                    'setName',
                    'setName2',
                    'setName',
                ]);

                let allLogs = await foo.$getPastLogsParsed('*') as ITxLogItem[];
                let allEvents = alot(allLogs).map(x => x.event).distinct().toArray();
                deepEq_(allEvents, [ 'Updated', 'Updated2']);

                let allLogsByName = await foo.getPastLogs(['Updated', 'Updated2']);
                deepEq_(allLogs, allLogsByName);
            },

            async 'deploy and check indexed logs' () {
                let provider = new HardhatProvider();
                // use in-memory, as is enough
                let client = await provider.client('hardhat');
                let { contract: foo } = await provider.deployClass<any>(Foo.Foo, {
                    arguments: [ 'hello' ],
                    client
                });

                let deployer = provider.deployer();
                let value = Date.now();
                l`Emit and fetch simple Logs`;
                let tx = await foo.shouldEmitIndexedNormal(deployer, value, 4)
                await tx.wait();
                tx = await foo.shouldEmitIndexedNormal(deployer, value + 1, 6)
                await tx.wait();

                let logs = await foo.getPastLogsIndexedNormal({
                    params: { valueA: value }
                });
                eq_(logs.length, 1);
                eq_(logs[0].params.valueB, 4n);

                let logs2nd = await foo.getPastLogsIndexedNormal({
                    params: { valueA: value + 1 }
                });
                eq_(logs2nd.length, 1);
                eq_(logs2nd[0].params.valueB, 6n);
            },

            async 'deploy and check indexed logs with index not-linear parameter order' () {
                let provider = new HardhatProvider();
                // use in-memory, as is enough
                let client = await provider.client('hardhat');
                let { contract: foo } = await provider.deployClass<any>(Foo.Foo, {
                    arguments: [ 'hello' ],
                    client
                });


                let deployer = provider.deployer();
                let value = Date.now();
                l`Emit and fetch simple Logs`;
                let tx = await foo.shouldEmitIndexedWithOffset(deployer, 10, value, 10)
                await tx.wait();
                tx = await foo.shouldEmitIndexedWithOffset(deployer, 11, value + 1)
                await tx.wait();

                let logs = await foo.getPastLogsIndexedWithOffset({
                    params: { valueB: value }
                });
                eq_(logs.length, 1);
                eq_(logs[0].params.valueA, 10n);

                let logs2nd = await foo.getPastLogsIndexedWithOffset({
                    params: { valueB: value + 1 }
                });
                eq_(logs2nd.length, 1);
                eq_(logs2nd[0].params.valueA, 11n);
            }
        })
    },
})
