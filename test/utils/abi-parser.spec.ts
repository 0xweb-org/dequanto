import { $abiCoder } from '../../src/abi/$abiCoder'
import { $abiParser } from '../../src/utils/$abiParser'

UTest({
    'parse an empty return' () {
        let abi = $abiParser.parseMethod('function bar(uint256):()');
        has_(abi, {
            type: 'function',
            name: 'bar',
            inputs: [
                {
                    type: 'uint256',
                    name: ''
                }
            ],
            outputs: [],
        });
    },
    'parse a single return' () {
        let abi = $abiParser.parseMethod('function foo(uint256) returns address');
        has_(abi, {
            outputs: [
                { type: 'address', name: ''}
            ],
        });
    },
    'parse multiple returns' () {
        let abi = $abiParser.parseMethod('function foo(uint256) returns (address, uint256)');
        has_(abi, {
            outputs: [
                { type: 'address', name: ''},
                { type: 'uint256', name: ''},
            ],
        });
    },
    'parse tuples' () {
        let abiStr = `function getUserPosition(address) returns [uint256 posid, address token0, address token1, address token][]`;
        let abi = $abiParser.parseMethod(abiStr);
        has_(abi, {
            type: 'function',
            name: 'getUserPosition',
            inputs: [
                {
                    type: 'address',
                    name: ''
                }
            ],
            outputs: [
                {
                    type: 'tuple[]',
                    components: [
                        {
                            type: 'uint256',
                            name: 'posid'
                        },
                        {
                            type: 'address',
                            name: 'token0'
                        },
                        {
                            type: 'address',
                            name: 'token1'
                        },
                        {
                            type: 'address',
                            name: 'token'
                        },
                    ]
                }
            ],
        });
    },
    'parse methods' () {

        [
            `foo(address):uint256`,
            `foo ( address ) : uint256`,
            `foo (address) : (uint256)`,
            `foo ( address ) returns uint256`,
            `foo ( address ) returns (uint256)`,
        ].forEach(str => {
            let abi = $abiParser.parseMethod(str);
            eq_(abi.name, 'foo', str);
            deepEq_(abi.inputs, [ { name: '', type: 'address' } ], str);
            deepEq_(abi.outputs, [ { name: '', type: 'uint256' } ], str)
        });

        [
            `foo(address,uint256):uint256`,
            `function foo(address, uint256): uint256`,
        ].forEach(str => {
            let abi = $abiParser.parseMethod(str);
            eq_(abi.name, 'foo', str);
            deepEq_(abi.inputs, [
                { name: '', type: 'address' },
                { name: '', type: 'uint256' },
            ], str);
            deepEq_(abi.outputs, [ { name: '', type: 'uint256' } ], str)
        });
    },
    'parse methods with names' () {
        [
            `foo(address account, uint256 value):(uint256 foo,uint256 bar)`,
            `function foo (address account,  uint256 value ) returns (uint256 foo ,uint256 bar)`,
        ].forEach(str => {
            let abi = $abiParser.parseMethod(str);
            eq_(abi.name, 'foo', str);
            deepEq_(abi.inputs, [
                { name: 'account', type: 'address' },
                { name: 'value', type: 'uint256' },
            ], str);
            deepEq_(abi.outputs, [
                { name: 'foo', type: 'uint256' },
                { name: 'bar', type: 'uint256' },
            ], str)
        })
    },
    'parse methods with modifiers' () {
        [
            `lorem() external view returns (uint256)`,
            `lorem ( ) view returns (uint256)`,
        ].forEach(str => {
            let abi = $abiParser.parseMethod(str);
            eq_(abi.name, 'lorem', str);
            eq_(abi.stateMutability, 'view');
            deepEq_(abi.outputs, [ { name: '', type: 'uint256' } ]);
        })
    },
    'parse methods with memory keywords' () {
        [
            `upgradeToAndCall(address newImplementation, bytes memory data) external`,
            `upgradeToAndCall(address newImplementation, bytes calldata data) external`,
        ].forEach(str => {
            let abi = $abiParser.parseMethod(str);
            eq_(abi.name, 'upgradeToAndCall', str);

            deepEq_(abi.inputs[0], { name: 'newImplementation', type: 'address' });
            deepEq_(abi.inputs[1], { name: 'data', type: 'bytes' });
        })
    },

    'parse structs' () {
        let foo = $abiParser.parseStruct(`
            struct IFoo {
                address user;
            }
        `);
        deepEq_(foo, {
            name: 'IFoo',
            type: 'tuple',
            internalType: 'struct IFoo',
            components: [
                { name: 'user', type: 'address' }
            ]
        });

        let bar = $abiParser.parseStruct(`
            struct IFoo {
                address user;
            }
            struct IBar {
                IFoo foo;
                uint256 amount;
            }
        `);
        deepEq_(bar, {
            name: 'IBar',
            type: 'tuple',
            internalType: 'struct IBar',
            components: [
                {
                    name: 'foo',
                    type: 'tuple',
                    internalType: 'struct IFoo',
                    components: [
                        { name: 'user', type: 'address' }
                    ]
                },
                { name: 'amount', type: 'uint256' }
            ]
        });

        let baz = $abiParser.parseStruct(`
            struct IFoo {
                address user;
            }
            struct IBaz {
                IFoo[] foos;
            }
        `);
        deepEq_(baz, {
            name: 'IBaz',
            type: 'tuple',
            internalType: 'struct IBaz',
            components: [
                {
                    name: 'foos',
                    type: 'tuple[]',
                    internalType: 'struct IFoo[]',
                    components: [
                        { name: 'user', type: 'address' }
                    ]
                }
            ]
        });
    },
    async 'encode structs' () {
        let user = '0xA0b86991C6218b36c1d19d4A2E9Eb0cE36060000';
        let user2 = '0x08C23e9d8f34Fefb1B7bd6A91B7fF122F4e16f5c';
        let fixtures: [string, any, string][] = [
            [
                `struct IFoo { address user; }`,
                { user },
                '0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce36060000'
            ],
            [
                `struct IFoo { uint256 amount; }`,
                { amount: 17n },
                '0x0000000000000000000000000000000000000000000000000000000000000011'
            ],
            [
                `struct IFoo { bool active; }`,
                { active: true },
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            ],
            [
                `struct IFoo { address user; uint256 amount; }`,
                { user, amount: 5n },
                '0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce360600000000000000000000000000000000000000000000000000000000000000000005'
            ],
            [
                `struct IFoo { bytes32 hash; }`,
                { hash: '0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae' },
                '0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'
            ],
            [
                `struct IFoo { bytes data; }`,
                { data: '0x1234' },
                '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000021234000000000000000000000000000000000000000000000000000000000000'
            ],
            [
                `struct IFoo { string name; }`,
                { name: 'Hi' },
                '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000024869000000000000000000000000000000000000000000000000000000000000'
            ],
            [
                `struct IFoo { uint256[] values; }`,
                { values: [1n, 2n, 3n] },
                '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003'
            ],
            [
                `
                    struct IFoo { address user; }
                    struct IBar { IFoo foo; uint256 amount; }
                `,
                { foo: { user }, amount: 5n },
                '0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce360600000000000000000000000000000000000000000000000000000000000000000005'
            ],
            [
                `
                    struct IFoo { address user; uint256 amount; }
                    struct IBar { IFoo[] foos; }
                `,
                { foos: [{ user, amount: 1n }, { user: user2, amount: 2n }] },
                '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce36060000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000008c23e9d8f34fefb1b7bd6a91b7ff122f4e16f5c0000000000000000000000000000000000000000000000000000000000000002'
            ]
        ];

        fixtures.forEach(([struct, data, expected], i) => {
            let abi = $abiParser.parseStruct(struct);
            let hex = $abiCoder.encode(abi, data);
            eq_(hex, expected, `fixture ${i}`);

            let decoded = $abiCoder.decode(abi, hex);
            deepEq_(decoded, data, `fixture ${i}`);
        });
    }
})
