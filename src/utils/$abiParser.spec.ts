import alot from 'alot';
import { $abiParser } from './$abiParser'

UTest({
    'should parse type'() {
        ([
            [
                ['uint256', '(uint256)'],
                [
                    {
                        name: '',
                        type: 'uint256',
                    }
                ]
            ],
            [
                ['(uint256 foo, uint256 bar)'],
                [
                    {
                        name: 'foo',
                        type: 'uint256'
                    },
                    {
                        name: 'bar',
                        type: 'uint256'
                    }
                ]
            ],

            [
                [ 'uint256 foo', '(uint256 foo)'],
                [
                    {
                        name: 'foo',
                        type: 'uint256'
                    }
                ]
            ],

            [
                ['(uint256 foo, uint256 bar) user'],
                [
                    {
                        name: 'user',
                        type: 'tuple',
                        components: [
                            {
                                name: 'foo',
                                type: 'uint256'
                            },
                            {
                                name: 'bar',
                                type: 'uint256'
                            }
                        ]
                    }
                ]
            ],
            [
                ['((uint256 foo, uint256 bar) user, uint256 qux)'],
                [
                    {
                        name: 'user',
                        type: 'tuple',
                        components: [
                            {
                                name: 'foo',
                                type: 'uint256'
                            },
                            {
                                name: 'bar',
                                type: 'uint256'
                            }
                        ]
                    },
                    {
                        name: 'qux',
                        type: 'uint256'
                    }
                ]
            ]
        ]).forEach(([types, expect]) => {
            types.forEach(type => {
                let inputs = $abiParser.parseArguments(type);
                deepEq_(inputs, expect);
            });
        })

    }
})
