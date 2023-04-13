import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { SlotsParser } from '@dequanto/solidity/SlotsParser';
import { SlotsStorage } from '@dequanto/solidity/SlotsStorage';
import { SlotsStorageTransportForArray } from '@dequanto/solidity/storage/SlotsStorageTransport';
import { $buffer } from '@dequanto/utils/$buffer';
import { $hex } from '@dequanto/utils/$hex';
import { l } from '@dequanto/utils/$logger';

UTest({
    async 'should read contracts storage'() {

        let provider = new HardhatProvider();
        let client = await provider.client();
        let path = '/test/fixtures/slots/Vault.sol';

        let hex = $buffer.toHex($buffer.fromString('hello'));

        hex = $hex.padBytes(hex, 32, { padEnd: true });

        let { contract, abi } = await provider.deploySol(path, { arguments: [hex], client });
        let slots = await SlotsParser.slots({ path }, 'Vault');


        let keys = slots.map(x => x.name);
        deepEq_(keys, [
            'count',
            'owner',
            'isTrue',
            'u16',
            'password',
            'data',
            'users',
            'idToUser',
            'dynamicSlotString',
            'singleSlotString',
        ]);

        let storage = SlotsStorage.createWithClient(client, contract.address, slots);

        async function read(key) {
            return await storage.get(key);
        }
        async function readArrItem(key, idx) {
            return await storage.get(`${key}[${idx}]`);
        }
        function toString(hex) {
            return $buffer.fromHex($hex.trimBytes(hex)).toString()
        }

        eq_(await read('count'), 123n);
        eq_(await read('owner'), provider.deployer().address.toLowerCase());
        eq_(await read('isTrue'), true);
        eq_(await read('u16'), 31);


        eq_(toString(await read('password')), 'hello');

        eq_(toString(await readArrItem('data', 0)), 'one');
        eq_(toString(await readArrItem('data', 1)), 'two');
        eq_(toString(await readArrItem('data', 2)), 'three');

        let user1 = await storage.get('users[0]');
        eq_(user1.id, 0)
        eq_(toString(user1.password), 'one');

        let user2 = await storage.get('users[1]');
        eq_(user2.id, 1)
        eq_(toString(user2.password), 'two');

        let user1Map = await storage.get('idToUser[0]');
        eq_(user1Map.id, 0)
        eq_(toString(user1Map.password), 'one');


        let user2Map = await storage.get('idToUser[1]');
        eq_(user2Map.id, 1)
        eq_(toString(user2Map.password), 'two');

        let singleSlotString = await storage.get('singleSlotString');
        eq_(singleSlotString, 'hello')

        let dynamicSlotString = await storage.get('dynamicSlotString');
        eq_(dynamicSlotString, '0123456789012345678901234567890123456789012345678901234567890')
    },

    async 'should read from contracts with inheritance'() {

        let provider = new HardhatProvider();
        let client = await provider.client();
        let path = '/test/fixtures/slots/FooStorage.sol';


        let { contract, abi } = await provider.deploySol(path, { client });
        let slots = await SlotsParser.slots({ path }, 'FooStorage');

        let storage = SlotsStorage.createWithClient(client, contract.address, slots);

        eq_(await storage.get('fooBase'), 1n)
        eq_(await storage.get('foo'), 2n)
    },

    'arrays': {
        async 'should read packed flags from single slot'() {
            let code = `
                contract Counter {
                    bool public flag = true;
                    bool[3] public flags = [ true, true, true ];
                    uint128[3] public halfs = [1, 2, 3];
                    uint256[2] public nums = [4, 5];
                }
            `;

            let provider = new HardhatProvider();
            let client = await provider.client();

            let { contract, abi } = await provider.deployCode(code, { client });



            let flag = await contract.flag();
            eq_(flag, true);

            l`Read with ABI`
            let flags = await Promise.all([
                contract.flags(0),
                contract.flags(1),
                contract.flags(2),
            ]);
            deepEq_(flags, [true, true, true]);

            l`Read with SLOTS Readers`
            let slots = await SlotsParser.slots({ path: '', code });

            deepEq_(slots[0], { slot: 0, size: 8, position: 0, type: 'bool', name: 'flag' });
            deepEq_(slots[1], { slot: 1, size: 24, position: 0, type: 'bool[3]', name: 'flags' });

            let storage = SlotsStorage.createWithClient(client, contract.address, slots);


            l`Read single boolean`
            flag = await storage.get('flag')
            eq_(flag, true);

            l`Read fixed size boolean array`
            flags = await Promise.all([
                storage.get('flags[0]'),
                storage.get('flags[1]'),
                storage.get('flags[2]'),
            ]);
            deepEq_(flags, [true, true, true]);

            l`Read fixed size num array`
            let halfs = await Promise.all([
                storage.get('halfs[0]'),
                storage.get('halfs[1]'),
                storage.get('halfs[2]'),
            ]);

            deepEq_(halfs, [1n, 2n, 3n]);

            l`Read fixed size num array`
            let nums = await Promise.all([
                storage.get('nums[0]'),
                storage.get('nums[1]'),
            ]);
            deepEq_(nums, [4n, 5n]);
        },
        async 'should read dynamic arrays'() {
            let code = `
                contract FooContract {
                    struct User {
                        address foo;
                        bool isActive;
                        uint256 amount;
                    }
                    User[] users;

                    constructor () {
                        users.push(User(
                            address(0x1000000000000000000000000000000000000001),
                            true,
                            5
                        ));
                        users.push(User(
                            address(0x2000000000000000000000000000000000000002),
                            true,
                            4
                        ));
                    }
                }
            `;

            let provider = new HardhatProvider();
            let client = await provider.client();

            let { contract, abi } = await provider.deployCode(code, { client });


            l`Read with SLOTS Readers`
            let slots = await SlotsParser.slots({ path: '', code });

            deepEq_(slots[0], { slot: 0, size: Infinity, position: 0, type: '(address foo, bool isActive, uint256 amount)[]', name: 'users' });

            let storage = SlotsStorage.createWithClient(client, contract.address, slots);

            let address = await storage.get('users[0].foo')
            eq_(address, '0x1000000000000000000000000000000000000001');

            let isActive = await storage.get('users[0].isActive')
            eq_(isActive, true);

            let amount = await storage.get('users[0].amount');
            eq_(amount, 5n);

            address = await storage.get('users[1].foo')
            eq_(address, '0x2000000000000000000000000000000000000002');

            isActive = await storage.get('users[1].isActive')
            eq_(isActive, true);

            amount = await storage.get('users[1].amount');
            eq_(amount, 4n);
        },
        async 'should read dynamic array in dynamic array'() {
            let code = `
                contract FooContract {
                    struct User {
                        address foo;
                        uint256[] balances;
                    }
                    User[] users;


                    constructor () {
                        uint256[] memory mem1 = new uint256[](3);
                        mem1[0] = 5;
                        mem1[1] = 6;
                        mem1[2] = 7;
                        users.push(
                            User(address(0x1000000000000000000000000000000000000001), mem1)
                        );

                        uint256[] memory mem2 = new uint256[](2);
                        mem2[0] = 100;
                        mem2[1] = 101;
                        users.push(
                            User(address(0x2000000000000000000000000000000000000002), mem2)
                        );
                    }

                    function getBalance (uint i, uint j) external view returns (uint256) {
                        return users[i].balances[j];
                    }
                    function getLength (uint i) external view returns (uint256) {
                        return users[i].balances.length;
                    }
                }
            `;

            let provider = new HardhatProvider();
            let client = await provider.client();

            let { contract, abi } = await provider.deployCode(code, { client });


            l`Read with SLOTS Readers`
            let slots = await SlotsParser.slots({ path: '', code });
            let storage = SlotsStorage.createWithClient(client, contract.address, slots);

            console.log('getBalance', (await contract.getBalance(0, 1)).toString());
            console.log('getLength', (await contract.getLength(0)).toString());

            eq_(Number(await storage.get('users[0].balances[0]')), 5);
            eq_(Number(await storage.get('users[0].balances[1]')), 6);
            eq_(Number(await storage.get('users[0].balances[2]')), 7);

            eq_(Number(await storage.get('users[1].balances[0]')), 100);
            eq_(Number(await storage.get('users[1].balances[1]')), 101);

            //console.log(await storage.get('users[0].balances[0]'));

        }
    },
    async 'should read mapping value'() {
        let code = `
            contract A {

                uint public countA = 3;
                mapping (uint => uint) dict;
                mapping (address => mapping(address => uint)) allowances;

                struct User {
                    uint foo;
                    uint bar;
                }
                mapping (address => User) users;
                mapping (address => mapping(address => User)) deepUsers;

                uint public countB = 4;
                constructor () {
                    dict[3] = 7;
                    address key1 = address(0x1000000000000000000000000000000000000001);
                    allowances[msg.sender][key1] = 5;

                    users[msg.sender] = User(1,2);
                    deepUsers[msg.sender][key1] = User(4,8);
                }
            }
        `;

        let provider = new HardhatProvider();
        let client = await provider.client();
        let deployer = provider.deployer();
        let { contract, abi } = await provider.deployCode(code, { client });

        let slots = await SlotsParser.slots({ path: '', code });
        let storage = SlotsStorage.createWithClient(client, contract.address, slots);

        eq_(await storage.get('dict[3]'), 7);
        eq_(await storage.get(`allowances["${deployer.address}"]["0x1000000000000000000000000000000000000001"]`), 5);

        eq_(await storage.get(`users["${deployer.address}"].foo`), 1);
        eq_(await storage.get(`users["${deployer.address}"]["bar"]`), 2);

        eq_(await storage.get(`deepUsers["${deployer.address}"]["0x1000000000000000000000000000000000000001"].foo`), 4);
        eq_(await storage.get(`deepUsers["${deployer.address}"]["0x1000000000000000000000000000000000000001"].bar`), 8);
    },
    async 'should read mapping value from storage' () {
        const client = Web3ClientFactory.get('eth');
        const slots = await SlotsParser.slots({
            path: './test/fixtures/parser/v04/ENJToken.sol'
        }, 'ENJToken');

        const reader = SlotsStorage.createWithClient(client, '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c', slots);

        let someBalance = await reader.get('balanceOf["0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c"]');
        gt_(someBalance, 0n);

        let totalSupply = await reader.get('totalSupply');
        gt_(totalSupply, 0n);


        let raw = await client.getStorageAt('0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c', '0x002d328c26df98061841308a1f512546357a648ac1726e814dc9e9ea7a160cec');
        eq_(raw, '0x0000000000000000000000000000000000000000000000024b18673804bbcc00');

    },
    async 'generat positions' () {
        return UTest({
            async 'generate array location' () {
                let x = new SlotsStorageTransportForArray(null, 0);
                let location = x.mapToGlobalSlot(14);
                eq_(location, 18569430475105882587588266137607568536673111973893317399460219858819262702961n);
            }
        })
    },
    'should read basic types': {
        async 'should read bytes' () {

            let code = `
                contract Counter {
                    bytes2 staticBytes = 0x1122;
                    bytes  dynamicBytes;
                    constructor () {
                        dynamicBytes = new bytes(2);
                        dynamicBytes[0] = 0x33;
                        dynamicBytes[1] = 0x44;
                    }
                }
            `;

            let provider = new HardhatProvider();
            let client = await provider.client();

            let { contract, abi } = await provider.deployCode(code, { client });

            l`Read with SLOTS Readers`
            let slots = await SlotsParser.slots({ path: '', code });
            let storage = SlotsStorage.createWithClient(client, contract.address, slots);

            let staticBytes = await storage.get('staticBytes');
            eq_(staticBytes, '0x1122');

            let dynamicBytes = await storage.get('dynamicBytes');
            eq_(dynamicBytes,'0x3344');

    }
})
