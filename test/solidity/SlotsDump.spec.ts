import { BlockChainExplorerStorage } from '@dequanto/explorer/BlockChainExplorerStorage';
import { Config } from '@dequanto/config/Config';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { SlotsDump } from '@dequanto/solidity/SlotsDump';
import { SlotsParser } from '@dequanto/solidity/SlotsParser';
import { SlotsStorage } from '@dequanto/solidity/SlotsStorage';
import { l } from '@dequanto/utils/$logger';

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
            async 'should write contracts storage from JSON'() {
                await dump.restoreStorageFromJSON({
                    countA: 12n
                });
                let countA = await contract.countA();
                eq_(countA, 12n);
            },
        });
    },

    async '!dump with constants and immutables'() {
        const code = `
        contract A {
            uint           public countA = 3;
            uint constant  public countB = 4;
            uint           public countC = 5;
            uint immutable public countD;
            uint           public countE = 6;

            constructor (uint256 _countD) {
                countD = _countD;
            }
        }
    `;
        const deployer = provider.deployer();
        const { contract, abi } = await provider.deployCode(code, {
            client,
            arguments: [12]
        });
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
            parser: {
                withConstants: true,
                withImmutables: true
            }
        });

        return UTest({
            async 'should read contract storage'() {
                let { json } = await dump.getStorage();
                deepEq_(json, {
                    countA: 3,
                    countB: 4n,
                    countC: 5,
                    countD: 12n,
                    countE: 6
                })
            }
        });
    }
})
