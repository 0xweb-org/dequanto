import { SlotsParser } from '@dequanto/solidity/SlotsParser';

UTest({
    async 'should extract slots from contract' () {

        const input = `
            contract Test {
                uint256 a; // 0x0
                uint256[3] b; // 0x1-0x3
                struct Data {
                    uint256 id;
                    uint256 value;
                }
                Data c; // 0x4-0x5
                Data[] d; // 0x6

                mapping(uint256 => uint256) e; // 0x7

                bytes32 private f; // 0x8
                bytes16 private g; // 0x9
                bytes16 private h; // 0x9
            }
        `;

        const slots = await SlotsParser.slots({
            code: input,
            path: './test/solidity/Parser.sol'
        }, 'Test');

        has_(slots[0], {
            slot: 0,
            position: 0,
            name: 'a',
            size: 256,
            type: 'uint256'
        });
        has_(slots[1], {
            slot: 1,
            position: 0,
            name: 'b',
            size: 256 * 3,
            type: 'uint256[3]'
        });
        has_(slots[2], {
            slot: 4,
            position: 0,
            name: 'c',
            size: 256 * 2,
            type: '(uint256 id, uint256 value)'
        });
        has_(slots[3], {
            slot: 6,
            position: 0,
            name: 'd',
            size: Infinity,
            type: '(uint256 id, uint256 value)[]'
        });
        has_(slots[4], {
            slot: 7,
            position: 0,
            name: 'e',
            size: Infinity,
            type: 'mapping(uint256 => uint256)'
        });
        has_(slots[5], {
            slot: 8,
            position: 0,
            name: 'f',
            size: 256,
            type: 'bytes32'
        });
        has_(slots[6], {
            slot: 9,
            position: 0,
            name: 'g',
            size: 128,
            type: 'bytes16'
        });
        has_(slots[7], {
            slot: 9,
            position: 128,
            name: 'h',
            size: 128,
            type: 'bytes16'
        });
    },
    async 'should extract slots from abi' () {

        const input = `
            (uint256 foo, uint256[3] bar)
        `;

        const slots = await SlotsParser.slotsFromAbi(input);

        has_(slots[0], {
            slot: 0,
            position: 0,
            name: 'foo',
            size: 256,
            type: 'uint256'
        });
        has_(slots[1], {
            slot: 1,
            position: 0,
            name: 'bar',
            size: 256 * 3,
            type: 'uint256[3]'
        });
    },
    async 'should extract slots from inherited contracts' () {
        const input = `
            contract Foo {
                uint a;
                string b;
            }
            contract Test is Foo {
                uint256 c;
            }
        `;

        const slots = await SlotsParser.slots({
            code: input,
            path: './test/solidity/Parser.sol'
        }, 'Test');

        has_(slots[0], {
            slot: 0,
            name: 'a',
            size: 256,
            type: 'uint'
        });
        has_(slots[1], {
            slot: 1,
            name: 'b',
            size: Infinity,
            type: 'string'
        });
        has_(slots[2], {
            slot: 2,
            name: 'c',
            size: 256,
            type: 'uint256'
        });
    },
    async 'should parse weth.sol' () {
        let slots = await SlotsParser.slots({ path: './test/fixtures/scan/WETH.sol'}, 'MaticWETH');
        let names = slots.map(x => x.name);
        let types = slots.map(x => x.type);

        eq_(names[0], '_balances');
        eq_(types[0], 'mapping(address => uint256)');

        eq_(names[1], '_allowances');
        eq_(types[1], 'mapping(address => mapping(address => uint256))');


        eq_(names[2], '_totalSupply');
        eq_(types[2], 'uint256');


        eq_(names[3], '_name');
        eq_(types[3], 'string');

        eq_(names[4], '_symbol');
        eq_(types[4], 'string');

        eq_(names[5], '_decimals');
        eq_(types[5], 'uint8');

        eq_(names[6], '_roles');
        eq_(types[6], 'mapping(bytes32 => (((bytes32[] _values, mapping(bytes32 => uint256) _indexes) _inner) members, bytes32 adminRole))');

        eq_(names[7], '_revertMsg');
        eq_(types[7], 'string');

        eq_(names[8], 'inited');
        eq_(types[8], 'bool');

        eq_(names[9], 'domainSeperator');
        eq_(types[9], 'bytes32');

        eq_(names[10], 'nonces');
        eq_(types[10], 'mapping(address => uint256)');

    }
})
