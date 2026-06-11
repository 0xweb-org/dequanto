import alot from 'alot';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { EventsIndexer } from '@dequanto/indexer/EventsIndexer';
import { $date } from '@dequanto/utils/$date';
import { $promise } from '@dequanto/utils/$promise';
import { File, Directory } from 'atma-io';
import { $require } from '@dequanto/utils/$require';
import { l } from '@dequanto/utils/$logger';
import { TxWriter } from '@dequanto/txs/TxWriter';

const FS_DIR = './test/tmp/data/logs/';
const WEEK_SECONDS = $date.parseTimespan('1week', { get: 's' });

const hh = new HardhatProvider();
const deployer = hh.deployer();
const client = hh.client();
const code = `
    contract Foo {
        event Number (uint256 indexed num);
        event String (string str);

        function emitNumber(uint num) external {
            emit Number(num);
        }
        function emitString(string memory str) external  {
            emit String(str);
        }
    }
`;

UTest({
    async $before () {
        if (await Directory.existsAsync(FS_DIR)) {
            await Directory.removeAsync(FS_DIR)
        }
    },
    async $after () {
        await client.debug.reset();
    },
    async 'fetch events' () {

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

        let events = await indexer.getPastLogs('Number', { params: {
            num: '0x2'
        } });

        let nums = alot(events.logs).map(x => x.params.num).toArray();
        deepEq_(nums, [2n]);
    },
    async 'fetch events streamed' () {

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


        let fromBlock = await client.getBlockNumber() + 1;

        await contract.$receipt().emitNumber(deployer, 1);
        await contract.$receipt().emitNumber(deployer, 2);
        await contract.$receipt().emitNumber(deployer, 3);
        await contract.$receipt().emitNumber(deployer, 4);
        await contract.$receipt().emitNumber(deployer, 5);


        let indexer = new EventsIndexer(contract, {
            name: 'FooTest',
            fs: {
                directory: FS_DIR,
                blockTimeAvg: 1,
            }
        });


        l`Get all logs with 1-step iteration`;
        let step = 1;
        for await (let cursor of indexer.getPastLogsStream('Number', {
            fromBlock,
            blockRangeLimits: {
                blocks: 1
            }
        })) {
            eq_(cursor.logs.length, 1);
            eq_(cursor.logs[0].params.num, step);
            step += 1;
        }
        eq_(step, 6);


        l`Get single log from 1-block range fromBlock..fromBlock`;
        let count = 0;
        for await (let cursor of indexer.getPastLogsStream('Number', {
            fromBlock,
            toBlock: fromBlock
        })) {

            eq_(cursor.logs.length, 1, `Expects 1 log`);
            eq_(cursor.logs[0].params.num, count + 1);
            count += 1;
        }
        eq_(count, 1);

        l`Will fail on toBlock < fromBlock`;
        let { error } = await $promise.caught(async () => {
            for await (let cursor of indexer.getPastLogsStream('Number', {
                fromBlock,
                toBlock: fromBlock - 1
            })) {
                throw new Error(`Expect revert`);
            }
        });
        $require.match(/Invalid block range order/, error.message);
    },

    async 'fetch range-based events' () {
        let { contract } = await hh.deployCode(code, {
            client
        });

        const numbers = alot.fromRange(1, 6).toArray();
        const numbersTxs = await alot(numbers)
            .mapAsync(async num => {
                return await contract.$receipt().emitNumber(deployer, num) as TxWriter;
            })
            .toArrayAsync({ threads: 1});
        const numbersBlocks = alot(numbersTxs)
            .map(tx => {
                return tx.receipt.blockNumber;
            })
            .toArray()


        let indexer = new EventsIndexer(contract, {
            name: 'FooTestRanges',
            fs: {
                directory: FS_DIR,
                blockTimeAvg: 1,
            }
        });

        const block = await client.getBlockNumber();
        const WEEK_FLOOR = Math.floor(block / WEEK_SECONDS);
        const storageFrom = WEEK_FLOOR * WEEK_SECONDS;
        const storageTo = storageFrom + WEEK_SECONDS;

        const BASE_DIR = `${FS_DIR}/hardhat/FooTestRanges-${contract.address}/`;
        const STORAGE_PATH = `${BASE_DIR}${storageFrom}-${storageTo}.json`;

        const COUNT = 5; // [1,2,3,4,5]

        // [5]
        latest_log: {
            let { logs } = await indexer.getPastLogs('Number', {
                fromBlock: numbersBlocks[COUNT - 1]
            });
            eq_(logs.length, 1);
            eq_(logs[0].params.num, numbers[numbers.length - 1]);

            let storageData = await File.readAsync<any[]>(STORAGE_PATH);
            eq_(storageData.length, 1);

            console.log(`Latest FromBlock`, numbersBlocks[numbersBlocks.length - 1])
        }

        // [2, 3]
        previous_log: {
            let { logs } = await indexer.getPastLogs('Number', {
                fromBlock: numbersBlocks[1],
                toBlock: numbersBlocks[2],
            });

            eq_(logs.length, 2);
            eq_(logs[0].params.num, numbers[1]);
            eq_(logs[1].params.num, numbers[2]);

            let storageData = await File.readAsync<any[]>(STORAGE_PATH, { cached: false });
            eq_(storageData.length, 3);
        }

        // [1, 2, 3, 4]
        first_logs: {
            let { logs, infos } = await indexer.getPastLogs('Number', {
                fromBlock: numbersBlocks[0],
                toBlock: numbersBlocks[3],
            });

            eq_(infos.cached, 2);
            eq_(infos.fetched, 2);

            eq_(logs.length, 4);
            eq_(logs[0].params.num, numbers[0]);
            eq_(logs[1].params.num, numbers[1]);
            eq_(logs[2].params.num, numbers[2]);
            eq_(logs[3].params.num, numbers[3]);

            let storageData = await File.readAsync<any[]>(STORAGE_PATH, { cached: false });
            eq_(storageData.length, 5);
        }

        // [1, 2, 3, 4, 5]
        full_logs: {
            let { logs, infos } = await indexer.getPastLogs('Number', {
                fromBlock: numbersBlocks[0],
                toBlock: numbersBlocks[5],
            });

            eq_(infos.cached, 5);
            eq_(infos.fetched, 0);

            eq_(logs.length, 5);
            eq_(logs[0].params.num, numbers[0]);
            eq_(logs[1].params.num, numbers[1]);
            eq_(logs[2].params.num, numbers[2]);
            eq_(logs[3].params.num, numbers[3]);
            eq_(logs[4].params.num, numbers[4]);

            let storageData = await File.readAsync<any[]>(STORAGE_PATH, { cached: false });
            eq_(storageData.length, 5);
        }

        // [1, 2, 3, 4, 5]
        clear_logs_and_refetch: {
            await indexer.removeCached({ fromBlock: numbersBlocks[2] });
            let { logs, infos } = await indexer.getPastLogs('Number', {
                fromBlock: numbersBlocks[0],
            });

            eq_(infos.cached, 2);
            eq_(infos.fetched, 3);

            eq_(logs.length, 5);
            eq_(logs[0].params.num, numbers[0]);
            eq_(logs[1].params.num, numbers[1]);
            eq_(logs[2].params.num, numbers[2]);
            eq_(logs[3].params.num, numbers[3]);
            eq_(logs[4].params.num, numbers[4]);

            let storageData = await File.readAsync<any[]>(STORAGE_PATH, { cached: false });
            eq_(storageData.length, 5);
        }

        from_streamed_cached: {
            const logs = [];
            for await (let chunk of await indexer.getPastLogsStream(['Number'])) {
                logs.push(...chunk.logs);
            }
            eq_(logs.length, 5);
            eq_(logs[0].params.num, numbers[0]);
            eq_(logs[1].params.num, numbers[1]);
            eq_(logs[2].params.num, numbers[2]);
            eq_(logs[3].params.num, numbers[3]);
            eq_(logs[4].params.num, numbers[4]);
        }

        from_streamed_partial_cached: {
            await indexer.removeCached({ fromBlock: numbersBlocks[2] });

            const logs = [];
            for await (let chunk of await indexer.getPastLogsStream(['Number'])) {
                logs.push(...chunk.logs);

                eq_(chunk.infos.cached, 2);
                eq_(chunk.infos.fetched, 3);
            }

            eq_(logs.length, 5);
            eq_(logs[0].params.num, numbers[0]);
            eq_(logs[1].params.num, numbers[1]);
            eq_(logs[2].params.num, numbers[2]);
            eq_(logs[3].params.num, numbers[3]);
            eq_(logs[4].params.num, numbers[4]);
        }

        from_streamed_fetched: {
            await indexer.removeCached({ fromBlock: 0 });

            // get [3, 4]: fetch [3, 4]
            const logs = [];
            for await (let chunk of await indexer.getPastLogsStream(['Number'], {
                fromBlock: numbersBlocks[3],
                toBlock: numbersBlocks[4],
            })) {
                logs.push(...chunk.logs);
                eq_(chunk.infos.cached, 0);
                eq_(chunk.infos.fetched, 2);
            }
            eq_(logs.length, 2);
            eq_(logs[0].params.num, numbers[3]);
            eq_(logs[1].params.num, numbers[4]);

            // get [1, 2]: fetch [1, 2]
            logs.length = 0;
            for await (let chunk of await indexer.getPastLogsStream(['Number'], {
                fromBlock: numbersBlocks[1],
                toBlock: numbersBlocks[2],
            })) {
                logs.push(...chunk.logs);
                eq_(chunk.infos.cached, 0);
                eq_(chunk.infos.fetched, 2);
            }

            eq_(logs.length, 2);
            eq_(logs[0].params.num, numbers[1]);
            eq_(logs[1].params.num, numbers[2]);

            // get all: fetch [5], cached: [1, 4]
            logs.length = 0;
            for await (let chunk of await indexer.getPastLogsStream(['Number'])) {
                logs.push(...chunk.logs);
                eq_(chunk.infos.cached, 4);
                eq_(chunk.infos.fetched, 1);
            }
            eq_(logs.length, 5);
            eq_(logs[0].params.num, numbers[0]);
            eq_(logs[1].params.num, numbers[1]);
            eq_(logs[2].params.num, numbers[2]);
            eq_(logs[3].params.num, numbers[3]);
            eq_(logs[4].params.num, numbers[4]);
        }
    }
});
