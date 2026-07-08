import { ContractBase, TContractTypes } from '@dequanto/contracts/ContractBase'
import { $abiParser } from '@dequanto/utils/$abiParser';
import { $address } from '@dequanto/utils/$address';
import { l } from '@dequanto/utils/$logger';

UTest({
    async 'overrides'() {
        class Foo extends ContractBase {
            abi = null;
            Types = null;
            constructor() {
                super($address.ZERO, void 0, void 0);
            }
            getAbi(abis, args) {
                return this.$getAbiItemOverload(abis, args);
            }
            getAbiByName(name, args) {
                return this.$getAbiItemOverload(name, args);
            }
        }

        return UTest({
            'by signatures'() {
                let abi = new Foo().getAbi(
                    [
                        'function calculate(address, address, uint256) returns uint256',
                        'function calculate(address, address) returns uint256',
                        'function calculate(address, address, address, uint256) returns uint256',
                        'function calculate(address, address, address) returns uint256'
                    ],
                    [$address.ZERO, $address.ZERO, $address.ZERO]);

                let args = abi.inputs.map(x => x.type);
                deepEq_(args, ['address', 'address', 'address'], 'getAbiItemOverload() test failed');
            },
            'by name'() {
                let foo = new Foo();
                foo.abi = [
                    'function calculate(address, address, uint256) returns uint256',
                    'function calculate(address, address) returns uint256',
                    'function calculate(address, address, address, uint256) returns uint256',
                    'function calculate(address, address, address) returns uint256'
                ].map(x => $abiParser.parseMethod(x));

                let abi = foo.getAbi(
                    'calculate',
                    [$address.ZERO, $address.ZERO, $address.ZERO]);

                let args = abi.inputs.map(x => x.type);
                deepEq_(args, ['address', 'address', 'address'], 'getAbiItemOverload() test failed');
            },
            'complex: tuple with additional field'() {
                let foo = new Foo();
                foo.abi = [
                    {
                        "inputs": [
                            {
                                "name": "vault",
                                "type": "address"
                            },
                            {
                                "name": "asset",
                                "type": "address"
                            },
                            {
                                "name": "amount",
                                "type": "uint256"
                            },
                            {
                                "name": "receiver",
                                "type": "address"
                            },
                            {
                                "components": [
                                    {
                                        "name": "swapDeadline",
                                        "type": "uint256"
                                    },
                                    {
                                        "name": "swapAmountOutMinimum",
                                        "type": "uint256"
                                    },
                                    {
                                        "name": "swapTokenOut",
                                        "type": "address"
                                    },
                                    {
                                        "name": "minShares",
                                        "type": "uint256"
                                    }
                                ],
                                "name": "params",
                                "type": "tuple"
                            },
                            {
                                "name": "deadline",
                                "type": "uint256"
                            },
                            {
                                "name": "v",
                                "type": "uint8"
                            },
                            {
                                "name": "r",
                                "type": "bytes32"
                            },
                            {
                                "name": "s",
                                "type": "bytes32"
                            }
                        ],
                        "name": "depositWithPermit",
                        "outputs": [
                            {
                                "name": "shares",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "name": "vault",
                                "type": "address"
                            },
                            {
                                "name": "asset",
                                "type": "address"
                            },
                            {
                                "name": "amount",
                                "type": "uint256"
                            },
                            {
                                "name": "receiver",
                                "type": "address"
                            },
                            {
                                "components": [
                                    {
                                        "name": "swapDeadline",
                                        "type": "uint256"
                                    },
                                    {
                                        "name": "swapAmountOutMinimum",
                                        "type": "uint256"
                                    },
                                    {
                                        "name": "swapTokenOut",
                                        "type": "address"
                                    },
                                    {
                                        "name": "minShares",
                                        "type": "uint256"
                                    },
                                    {
                                        "name": "data",
                                        "type": "bytes"
                                    }
                                ],
                                "name": "params",
                                "type": "tuple"
                            },
                            {
                                "name": "deadline",
                                "type": "uint256"
                            },
                            {
                                "name": "v",
                                "type": "uint8"
                            },
                            {
                                "name": "r",
                                "type": "bytes32"
                            },
                            {
                                "name": "s",
                                "type": "bytes32"
                            }
                        ],
                        "name": "depositWithPermit",
                        "outputs": [
                            {
                                "name": "shares",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }
                ];

                // Get with empty data field
                let abi = foo.getAbi(
                    'depositWithPermit',
                    [
                        "0x67d269191c92Caf3cD7723F116c85e6E9bf55933",
                        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
                        "42000000000000000000",
                        "0x83c129BdB1aCa77232BAbf04f0ECf18F2272Ee36",
                        {
                            "minShares": "0",
                            "swapAmountOutMinimum": "0",
                            "swapDeadline": "0",
                            "swapTokenOut": "0x0000000000000000000000000000000000000000",
                            "data": "0x"
                        },
                        "1783463937",
                        27,
                        "0xf3fff7e2940324436c98258309fc8f233f2d79f5f178ff27bc91d7542a08736e",
                        "0x04839d8873930a680e2e0c89245f39775f276d5d3abbf7244c038f6db41f4a77"
                    ]
                );
                notEq_(abi, null, 'ABI not found');
                let input = abi.inputs.find(x => x.name === 'params');

                let argsTypes = input.components.map(x => x.type);

                deepEq_(argsTypes, ['uint256', 'uint256', 'address', 'uint256', 'bytes'], 'getAbiItemOverload() test failed');


                // Get without data field
                abi = foo.getAbi(
                    'depositWithPermit',
                    [
                        "0x67d269191c92Caf3cD7723F116c85e6E9bf55933",
                        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
                        "42000000000000000000",
                        "0x83c129BdB1aCa77232BAbf04f0ECf18F2272Ee36",
                        {
                            "minShares": "0",
                            "swapAmountOutMinimum": "0",
                            "swapDeadline": "0",
                            "swapTokenOut": "0x0000000000000000000000000000000000000000"
                        },
                        "1783463937",
                        27,
                        "0xf3fff7e2940324436c98258309fc8f233f2d79f5f178ff27bc91d7542a08736e",
                        "0x04839d8873930a680e2e0c89245f39775f276d5d3abbf7244c038f6db41f4a77"
                    ]
                );
                notEq_(abi, null, 'ABI not found');
                input = abi.inputs.find(x => x.name === 'params');

                argsTypes = input.components.map(x => x.type);
                deepEq_(argsTypes, ['uint256', 'uint256', 'address', 'uint256'], 'getAbiItemOverload() test failed');
            }
        });

    }
})
