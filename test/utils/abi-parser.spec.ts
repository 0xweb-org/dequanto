import { $abiParser } from '../../src/utils/$abiParser'

UTest({
    'parse empty return' () {
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
    'parse single return' () {
        let abi = $abiParser.parseMethod('function foo(uint256) returns address');
        has_(abi, {
            outputs: [
                { type: 'address', name: ''}
            ],
        });
    },
    'parse multiple return' () {
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
    'parse with names' () {
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
    }
})
