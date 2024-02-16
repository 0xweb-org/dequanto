import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { EventsIndexer } from '@dequanto/indexer/EventsIndexer';
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
        let { contract } = await hh.deployCode(`
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
        `, {
            client
        });

        await contract.$receipt().emitNumber(deployer, 1);
        await contract.$receipt().emitNumber(deployer, 2);
        await contract.$receipt().emitNumber(deployer, 3);
        await contract.$receipt().emitString(deployer, 'hello');

        let indexer = new EventsIndexer(contract, {
            name: 'FooTest',
            fs: {
                directory: FS_DIR
            }
        });
        let { logs } = await indexer.getPastLogs('getPastLogsNumber');
        eq_(logs.length, 3);
        eq_(logs[0].params.num, 1);
        eq_(logs[1].params.num, 2);
        eq_(logs[2].params.num, 3);

        let blockNr = await client.getBlockNumber();
        let storageData = await File.readAsync<any[]>(`${FS_DIR}/hardhat/FooTest-${contract.address}.json`);

        eq_(storageData.length, 3);

        let storageMetaData = await File.readAsync<any>(`${FS_DIR}/hardhat/FooTest-${contract.address}-meta.json`);
        eq_(storageMetaData.lastBlock, blockNr);
    }
});
