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
    }
})
