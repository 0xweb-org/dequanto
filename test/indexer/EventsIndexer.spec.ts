import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { EventsIndexer } from '@dequanto/indexer/EventsIndexer';
import { $date } from '@dequanto/utils/$date';
import { File, Directory } from 'atma-io';

const FS_DIR = './test/tmp/data/logs/';

UTest({
    async $before () {
        if (await Directory.existsAsync(FS_DIR)) {
            await Directory.removeAsync(FS_DIR)
        }
    },
    async 'fetch events' () {

        let hh = new HardhatProvider();
        let deployer = hh.deployer();
        let client = hh.client();
        let code = `
            contract Foo {
                event Number (uint256 num);
                event String (string str);

                function emitNumber(uint num) external {
                    emit Number(num);
                }
                function emitString(string memory str) external  {
                    emit String(str);
                }
            }
        `;
        let { contract } = await hh.deployCode(code, {
            client
        });

        await contract.$receipt().emitNumber(deployer, 1);
        await contract.$receipt().emitNumber(deployer, 2);
        await contract.$receipt().emitNumber(deployer, 3);
        await contract.$receipt().emitString(deployer, 'hello');

        let indexer = new EventsIndexer(contract, {
            name: 'FooTest',
            fs: {
                directory: FS_DIR,
                blockTimeAvg: 1,
            }
        });
        let { logs } = await indexer.getPastLogs('Number');
        eq_(logs.length, 3);
        eq_(logs[0].params.num, 1);
        eq_(logs[1].params.num, 2);
        eq_(logs[2].params.num, 3);

        const WEEK_SECONDS = $date.parseTimespan('1week', { get: 's' });
        const BASE_DIR = `${FS_DIR}/hardhat/FooTest-${contract.address}/`;
        let blockNr = await client.getBlockNumber();
        let storageData = await File.readAsync<any[]>(`${BASE_DIR}0-${WEEK_SECONDS}.json`);

        eq_(storageData.length, 3);

        let storageMetaData = await File.readAsync<any[]>(`${BASE_DIR}meta-arr.json`);
        eq_(storageMetaData.find(x => x.event === 'Number').lastBlock, blockNr);

        let resultMany = await indexer.getPastLogs([ 'Number', 'String' ]);

        deepEq_(logs, resultMany.logs.filter(x => x.event === 'Number'));

        let stringEvents = resultMany.logs.filter(x => x.event === 'String');
        eq_(stringEvents.length, 1);
        eq_(stringEvents[0].params.str, 'hello');


        let resultAll = await indexer.getPastLogs('*');
        deepEq_(resultMany.logs, resultAll.logs);


        let { contract: contract2 } = await hh.deployCode(code, {
            client
        });
        await contract2.$receipt().emitString(deployer, 'world');

        let multiIndexer = new EventsIndexer(contract, {
            addresses: [
                contract.address,
                contract2.address
            ],
            name: 'FooTest',
            fs: {
                directory: FS_DIR
            }
        });

        let { logs: logsMulti } = await multiIndexer.getPastLogs('String');
        eq_(logsMulti.length, 2);
        eq_(logsMulti[0].params.str, 'hello');
        eq_(logsMulti[1].params.str, 'world');
        eq_(logsMulti[0].address, contract.address);
        eq_(logsMulti[1].address, contract2.address);


        await client.debug.mine('3weeks');
        await contract.$receipt().emitNumber(deployer, 4);

        let resultAfter4Weeks = await indexer.getPastLogs([ 'Number' ]);

        deepEq_(
            resultAfter4Weeks.logs.map(x => Number(x.params.num)),
            [ 1, 2, 3, 4 ]
        );

        let storageData3rdWeek = await File.readAsync<any[]>(`${BASE_DIR}${WEEK_SECONDS * 3}-${WEEK_SECONDS * 4}.json`);
        eq_(storageData3rdWeek.length, 1);
    }
});
