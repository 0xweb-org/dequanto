import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { SlotsParser } from '@dequanto/solidity/SlotsParser';
import { SlotsReader } from '@dequanto/solidity/SlotsReader';
import { $buffer } from '@dequanto/utils/$buffer';
import { $hex } from '@dequanto/utils/$hex';

UTest({
    async 'should read contracts storage'() {

        let provider = new HardhatProvider();
        let client = await provider.client();
        let path = '/test/fixtures/slots/Vault.sol';

        let hex = $buffer.toHex($buffer.fromString('hello'));

        hex = $hex.padBytes(hex, 32, { padEnd: true });

        let { contract, abi } = await provider.deploySol(path, { arguments: [ hex ], client });
        let slots = await SlotsParser.slots({ path }, 'Vault');
        //-console.log(slots);

        let reader = SlotsReader.createWithClient(client, contract.address, slots);

        async function read(key) {
            return await reader.for(key).read();
        }
        async function readArrItem(key, idx) {
            return await reader.for(key).read(idx);
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

        let user1 = await reader.for('users').read(0);
        eq_(user1.id, 0)
        eq_(toString(user1.password), 'one');

        let user2 = await reader.for('users').read(1);
        eq_(user2.id, 1)
        eq_(toString(user2.password), 'two');

        let user1Map = await reader.for('idToUser').read(0);
        eq_(user1Map.id, 0)
        eq_(toString(user1Map.password), 'one');


        let user2Map = await reader.for('idToUser').read(1);
        eq_(user2Map.id, 1)
        eq_(toString(user2Map.password), 'two');

        let singleSlotString = await reader.for('singleSlotString').read();
        eq_(singleSlotString, 'hello')

        let dynamicSlotString = await reader.for('dynamicSlotString').read();
        eq_(dynamicSlotString, '0123456789012345678901234567890123456789012345678901234567890')
    },

    async 'should read from contracts with inheritance'() {

        let provider = new HardhatProvider();
        let client = await provider.client();
        let path = '/test/fixtures/slots/Foo.sol';


        let { contract, abi } = await provider.deploySol(path, { client });
        let slots = await SlotsParser.slots({ path }, 'Foo');

        let reader = SlotsReader.createWithClient(client, contract.address, slots);

        eq_(await reader.for('fooBase').read(), 1n)
        eq_(await reader.for('foo').read(), 2n)
    }
})
