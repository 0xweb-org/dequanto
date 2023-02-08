import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { SlotsParser } from '@dequanto/solidity/SlotsParser';
import { SlotsStorage } from '@dequanto/solidity/SlotsStorage';
import { $address } from '@dequanto/utils/$address';
import { l } from '@dequanto/utils/$logger';

UTest({
    async 'should read and write simple Value Types'() {
        let code = `
            contract Foo {
                uint256 public iNumber = 41;
                bool public iBool = true;
                string public iString = "hello";
                address public iAddress = 0x0000000000000000000000000000000000000000;
                bytes2 public iBytes = 0xFFEE;

                enum FooEnum { foo, bar, qux }

                FooEnum public iEnum = FooEnum.bar;
            }
        `;

        let provider = new HardhatProvider();
        let client = await provider.client();

        let { contract } = await provider.deployCode(code, { client });
        let slots = await SlotsParser.slots({ path: '', code });
        let storage = SlotsStorage.createWithClient(client, contract.address, slots);

        return UTest({
            async 'NUMBER' () {
                let iNumber = await storage.get('iNumber');
                eq_(iNumber, 41n);

                await storage.set('iNumber', '0x7');
                iNumber = await storage.get('iNumber');
                eq_(iNumber, 7n);
            },
            async 'BOOLEAN' () {
                let iBool = await storage.get('iBool');
                eq_(iBool, true);

                await storage.set('iBool', false);
                iBool = await storage.get('iBool');
                eq_(iBool, false);
            },
            async 'STRING' () {
                let iString = await storage.get('iString');
                eq_(iString, "hello");

                await storage.set('iString', "world");
                iString = await storage.get('iString');
                eq_(iString, "world");
            },
            async 'ADDRESS' () {
                let iAddress = await storage.get('iAddress');
                eq_(iAddress, $address.ZERO);

                let newAddress = $address.ZERO.replace('x0', 'x1');

                await storage.set('iAddress', newAddress);
                iAddress = await storage.get('iAddress');
                eq_(iAddress, newAddress);
            },
            async 'BYTES' () {
                let iBytes = await storage.get('iBytes');
                eq_(iBytes, '0xffee');


                await storage.set('iBytes', '0xeeff');
                iBytes = await storage.get('iBytes');
                eq_(iBytes, '0xeeff');
            },
            async 'ENUM' () {
                let value = await storage.get('iEnum');
                eq_(value, 1);

                await storage.set('iEnum', 2);
                value = await storage.get('iEnum');
                eq_(value, 2);
            }
        })
    },

    async 'should read and write fix-sized structs'() {
        let code = `
            contract Foo {
                struct User {
                    uint256 ID;
                    uint256 balance;
                }
                struct UserContainer {
                    User user;
                }

                User public user = User(3, 4);
                UserContainer public container = UserContainer(User(5, 6));
            }
        `;

        let provider = new HardhatProvider();
        let client = await provider.client();

        let { contract } = await provider.deployCode(code, { client });
        let slots = await SlotsParser.slots({ path: '', code });
        let storage = SlotsStorage.createWithClient(client, contract.address, slots);

        return UTest({
            async 'read single in simple structure' () {
                let user = await storage.get('user');
                deepEq_(user, {
                    ID: 3n,
                    balance: 4n,
                })

                let value = await storage.get('user.ID');
                eq_(value, 3n);

                await storage.set('user.ID', 7n);
                value = await storage.get('user.ID');
                eq_(value, 7n);
            },


            async 'nested structure' () {
                let container = await storage.get('container');
                deepEq_(container, {
                    user: {
                        ID: 5n,
                        balance: 6n,
                    }
                });

                let user = await storage.get('container.user');
                deepEq_(user, {
                    ID: 5n,
                    balance: 6n,
                });

                let value = await storage.get('container.user.ID');
                deepEq_(value, 5n);

                await storage.set('container.user.ID', 3n);
                value = await storage.get('container.user.ID');
                eq_(value, 3n);
            },
        })
    },

    async 'should read and write arrays'() {
        let code = `
            contract Foo {
                struct User {
                    uint256 ID;
                    uint256 balance;
                }
                uint256[3] fixSized = [ 2, 3, 4 ];
                User[1] fixSizedStructs;

                uint256[] dynamicSized = [ 5, 6, 7 ];

                User[] dynamicSizedStructs;

                constructor () {
                    fixSizedStructs[0] = User(11, 12);
                    dynamicSizedStructs.push(User(18, 19));
                    dynamicSizedStructs.push(User(20, 21));
                }
            }
        `;

        let provider = new HardhatProvider();
        let client = await provider.client();

        let { contract } = await provider.deployCode(code, { client });
        let slots = await SlotsParser.slots({ path: '', code });
        let storage = SlotsStorage.createWithClient(client, contract.address, slots);

        return UTest({
            async 'read and write fixed sized array' () {
                let v0 = await storage.get('fixSized[0]');
                eq_(v0, 2n);

                let v1 = await storage.get('fixSized[1]');
                eq_(v1, 3n);

                await storage.set('fixSized[1]', 8n);
                v1 = await storage.get('fixSized[1]');
                eq_(v1, 8n);

                let readAll = await storage.get('fixSized');
                deepEq_(readAll, [ 2n, 8n, 4n ]);
            },
            async 'read and write fixed sized array with Structs' () {
                let v0 = await storage.get('fixSizedStructs[0].ID');
                eq_(v0, 11n);

                let v1 = await storage.get('fixSizedStructs[0].balance');
                eq_(v1, 12n);

                let vAll = await storage.get('fixSizedStructs[0]');
                deepEq_(vAll, { ID: 11n, balance: 12n });

                await storage.set('fixSizedStructs[0].balance', 17n);
                v1 = await storage.get('fixSizedStructs[0].balance');
                eq_(v1, 17n);
            },
            async 'read and write dynamic sized array' () {
                let v0 = await storage.get('dynamicSized[0]');
                eq_(v0, 5n);

                let v1 = await storage.get('dynamicSized[1]');
                eq_(v1, 6n);

                let v2 = await storage.get('dynamicSized[2]');
                eq_(v2, 7n);

                await storage.set('dynamicSized[1]', 15n);
                v1 = await storage.get('dynamicSized[1]');
                eq_(v1, 15n);
            },
            async 'read and write dynamic sized array with Structs' () {
                let v0_0 = await storage.get('dynamicSizedStructs[0].ID');
                eq_(v0_0, 18n);

                let v0_1 = await storage.get('dynamicSizedStructs[0].balance');
                eq_(v0_1, 19n);

                let v1_0 = await storage.get('dynamicSizedStructs[1].ID');
                eq_(v1_0, 20n);

                let v1_1 = await storage.get('dynamicSizedStructs[1].balance');
                eq_(v1_1, 21n);

                await storage.set('dynamicSizedStructs[1].ID', 55n);
                v1_0 = await storage.get('dynamicSizedStructs[1].ID');
                eq_(v1_0, 55n);
            },
        })
    },

    async 'should read and write mappings'() {
        let code = `
            contract Foo {
                struct User {
                    uint256 ID;
                    uint256 balance;
                }
                mapping(uint256 => uint256) ids;
                mapping(address => uint256) addresses;
                mapping(address => User) users;


                constructor () {
                    ids[1] = 2;
                    ids[7] = 8;

                    addresses[address(0xC000000000000000000000000000000000000000)] = 3;

                    users[address(0xa000000000000000000000000000000000000000)] = User(10,11);
                    users[address(0xB000000000000000000000000000000000000000)] = User(12,13);
                }
            }
        `;

        let provider = new HardhatProvider();
        let client = await provider.client();

        let { contract } = await provider.deployCode(code, { client });
        let slots = await SlotsParser.slots({ path: '', code });
        let storage = SlotsStorage.createWithClient(client, contract.address, slots);

        return UTest({
            async 'read and write (number---number) mapping' () {
                let v0 = await storage.get('ids["1"]');
                eq_(v0, 2n);

                let v1 = await storage.get('ids["7"]');
                let v1_ = await storage.get('ids[7]');

                eq_(v1, 8n);
                eq_(v1_, 8n);

                await storage.set('ids[7]', 9n);
                v1 = await storage.get(['ids', 7]);
                eq_(v1, 9n);
            },
            async 'read and write (address---number) mapping' () {
                let v0 = await storage.get('addresses["0xC000000000000000000000000000000000000000"]');
                eq_(v0, 3n);

                await storage.set('addresses["0xC000000000000000000000000000000000000000"]', 21n);
                v0 = await storage.get('addresses["0xC000000000000000000000000000000000000000"]');
                eq_(v0, 21n);
            },
            async 'read and write (address---struct) mapping' () {
                let v0 = await storage.get('users["0xa000000000000000000000000000000000000000"].ID');
                eq_(v0, 10n);

                let v1 = await storage.get('users["0xa000000000000000000000000000000000000000"].balance');
                eq_(v1, 11n);

                let struct = await storage.get('users["0xa000000000000000000000000000000000000000"]');
                deepEq_(struct, {
                    ID: 10n,
                    balance: 11n
                });

                deepEq_([
                    await storage.get('users["0xB000000000000000000000000000000000000000"].ID'),
                    await storage.get('users["0xB000000000000000000000000000000000000000"].balance'),
                ], [ 12n, 13n ]);

                await storage.set('users["0xa000000000000000000000000000000000000000"].balance', 500n);

                v1 = await storage.get('users["0xa000000000000000000000000000000000000000"].balance');
                eq_(v1, 500n);

                await storage.set('users["0xa000000000000000000000000000000000000000"]', {
                    ID: 30n,
                    balance: 1000n
                });

                let arr = [
                    await storage.get('users["0xa000000000000000000000000000000000000000"].ID'),
                    await storage.get(['users', '0xa000000000000000000000000000000000000000', 'balance']),
                ];
                deepEq_(arr, [ 30n, 1000n ]);
            },
        })
    },

})
