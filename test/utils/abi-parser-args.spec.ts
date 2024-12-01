import { $abiParser } from '@dequanto/utils/$abiParser';
import { Fixtures } from '../Fixtures';

UTest({
    async 'should parse type'() {
        const fixtures = {
            'simple uint256': [
                [
                    ['uint256', '(uint256)'],
                    [
                        {
                            name: '',
                            type: 'uint256',
                        }
                    ]
                ]
            ],
            'simple multiple': [
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
                ]
            ],

            'simple multiple and tuple': [
                [
                    [ 'uint256 foo', '(uint256 foo)'],
                    [
                        {
                            name: 'foo',
                            type: 'uint256'
                        }
                    ]
                ]
            ],

            'simple tuple': [
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
            ],
            'simple array tuple': [
                [
                    ['(uint256 foo, uint256 bar)[] users'],
                    [
                        {
                            name: 'users',
                            type: 'tuple[]',
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
                ]
            ],
            'simple multiple with tuple and value-type': [
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
            ],
            'simple array': [
                [
                    ['(address foo, uint256 bar, uint256 qux, uint256 dux, bool lorem, address ipsum)[]'],
                    //['(address token, uint256 allocPoint, uint256 lastRewardBlock, uint256 accRewardPerShare, uint256 lockPeriod, uint256 totalSupply, bool paused, address rewardsDistributor)[]'],
                    [
                        {
                            name: '',
                            type: 'tuple[]',
                            components: [
                                {
                                    name: 'foo',
                                    type: 'address'
                                  },
                                  {
                                    name: 'bar',
                                    type: 'uint256'
                                  },
                                  {
                                    name: 'qux',
                                    type: 'uint256'
                                  },
                                  {
                                    name: 'dux',
                                    type: 'uint256'
                                  },
                                  {
                                    name: 'lorem',
                                    type: 'bool'
                                  },
                                  {
                                    name: 'ipsum',
                                    type: 'address'
                                  }
                            ]
                        }
                    ]
                ]
            ]
        } ;

        await Fixtures.walk(fixtures, (val) => {

            let [types, expect] = val;
            types.forEach(type => {
                let inputs = $abiParser.parseArguments(type);
                deepEq_(inputs, expect);
            });
        });

    }
})
