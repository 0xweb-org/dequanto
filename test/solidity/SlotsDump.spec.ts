import { BlockChainExplorerStorage } from '@dequanto/BlockchainExplorer/BlockChainExplorerStorage';
import { Config } from '@dequanto/Config';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { SlotsDump } from '@dequanto/solidity/SlotsDump';
import { SlotsParser } from '@dequanto/solidity/SlotsParser';
import { SlotsStorage } from '@dequanto/solidity/SlotsStorage';
import { MappingKeysLoader } from '@dequanto/solidity/storage/MappingKeysLoader';
import { l } from '@dequanto/utils/$logger';
import { File } from 'atma-io';

const provider = new HardhatProvider();
const client = provider.client();

UTest({
    async $before() {
        await Config.fetch();
    },
    async 'should read and write contracts storage'() {

        const code = `
            contract A {
                event UserSet(address user);
                uint public countA = 3;
                mapping(address => uint) users;

                function addUser() external {
                    users[msg.sender] = 1;
                    emit UserSet(msg.sender);
                }
            }
        `;
        const deployer = provider.deployer();
        const { contract, abi } = await provider.deployCode(code, { client });
        const explorer = new BlockChainExplorerStorage({
            contracts: {
                [contract.address]: {
                    abi,
                    source: code
                }
            }
        });
        const dump = new SlotsDump({
            address: contract.address,
            client,
            explorer,
        });

        return UTest({
            async 'should read contract storage'() {

                await contract.addUser(deployer);

                let { json, memory } = await dump.getStorage();
                eq_(json.countA, 3);
                eq_(json.users[deployer.address], 1);

                let slot0 = memory[0];
                deepEq_(slot0, [
                    '0x0000000000000000000000000000000000000000000000000000000000000000',
                    '0x0000000000000000000000000000000000000000000000000000000000000003',
                ]);
                let slotMap = memory[1];
                deepEq_(slotMap, [
                    '0xa3c1274aadd82e4d12c8004c33fb244ca686dad4fcc8957fc5668588c11d9502',
                    '0x0000000000000000000000000000000000000000000000000000000000000001'
                ]);

                l`> Dump partial`
                let dumpPartial = new SlotsDump({
                    address: contract.address,
                    client,
                    explorer,
                    fields: ['countA']
                });
                let resultPartial = await dumpPartial.getStorage();
                eq_(resultPartial.json.countA, 3);
                eq_(resultPartial.json.users, null);
                eq_(resultPartial.memory.length, 1);

                l`> Read single field`
                let slots = await SlotsParser.slots({ path: '', code })
                let storageBase = SlotsStorage.createWithClient(client, contract.address, slots)
                eq_(await storageBase.get('countA'), 3);
            },
            async 'should write contracts storage from SLOT-VALUE table'() {
                let table = [
                    [
                        '0x0000000000000000000000000000000000000000000000000000000000000000',
                        '0x0000000000000000000000000000000000000000000000000000000000000008',
                    ] as [string, string],
                ];
                await dump.restoreStorageFromTable(table);
                let countA = await contract.countA();
                eq_(countA, 8n);
            },
            async 'should write contracts storage from JSON' () {
                await dump.restoreStorageFromJSON({
                    countA: 12n
                });
                let countA = await contract.countA();
                eq_(countA, 12n);
            },
        });


    },

    async '//should read mapping keys'() {
        // SAFE
        let loader = new MappingKeysLoader({
            address: '0x5afe3855358e112b5647b952709e6165e1c1eeee'
        });
        let keys = await loader.load('_balances');
        console.log(keys.map(arr => arr.join('.')));
    },
    async '//slots dump'() {
        // SAFE
        let loader = new SlotsDump({
            address: '0x5afe3855358e112b5647b952709e6165e1c1eeee'
        });
        let { json, memory } = await loader.getStorage()
        await File.writeAsync('./tmp/storage.csv', memory.map(x => x.join(', ')).join('\n'));
        await File.writeAsync('./tmp/storageJson.json', json);
    }
})
