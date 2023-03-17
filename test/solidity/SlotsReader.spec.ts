import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { SlotsParser } from '@dequanto/solidity/SlotsParser';
import { SlotsStorage } from '@dequanto/solidity/SlotsStorage';
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
        }
    },
    async 'should read mapping value'() {
        let code = `
            contract A {
                uint public countA = 3;
                mapping (uint => uint) dict;
                uint public countB = 4;
                constructor () {
                    dict[3] = 7;
                }
            }
        `;

        let provider = new HardhatProvider();
        let client = await provider.client();

        let { contract, abi } = await provider.deployCode(code, { client });

        let slots = await SlotsParser.slots({ path: '', code });
        let storage = SlotsStorage.createWithClient(client, contract.address, slots);

        eq_(await storage.get('dict[3]'), 7);
    }
})
