import { UTest } from 'atma-utest';
import { $abi } from 'dequanto/abi/$abi';
import { $abiCoder } from 'dequanto/abi/$abiCoder';
import { HardhatProvider } from 'dequanto/hardhat/HardhatProvider';
import { TAbiInput } from 'dequanto/types/TAbi';
import { $contract } from 'dequanto/utils/$contract';
import { l } from 'dequanto/utils/$logger';
import { File } from 'atma-io'
import { TEth } from 'dequanto/models/TEth';

UTest.create({
    'encode call data'() {
        let to = '0x0000000000000000000000000000000000000002';
        let expected = '0xa9059cbb00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000005';
        let fromString = $abi.encodeCall('function transfer(address to, uint256 amount)', [to, 5n]);
        let fromJson = $abi.encodeCall({
            type: 'function',
            name: 'transfer',
            stateMutability: 'nonpayable',
            inputs: [
                { name: 'to', type: 'address' },
                { name: 'amount', type: 'uint256' }
            ],
            outputs: [
                { name: '', type: 'bool' }
            ]
        }, [to, 5n]);

        eq_(fromString, expected);
        eq_(fromJson, expected);
    },
    'decode return data'() {
        let owner = '0x0000000000000000000000000000000000000002';

        let scalarHex = $abiCoder.encode(['uint256'], [5n]);
        let scalar = $abi.decodeReturn({
            type: 'function',
            name: 'totalSupply',
            inputs: [],
            outputs: [
                { name: '', type: 'uint256' }
            ]
        }, scalarHex);
        eq_(scalar, 5n);

        let tupleHex = $abiCoder.encode(['uint256', 'address'], [5n, owner]);
        let tuple = $abi.decodeReturn({
            type: 'function',
            name: 'snapshot',
            inputs: [],
            outputs: [
                { name: 'total', type: 'uint256' },
                { name: 'owner', type: 'address' }
            ]
        }, tupleHex);
        deepEq_(tuple, {
            total: 5n,
            owner
        });
    },
    async 'encode packed'() {
        let json = await File.readAsync<{ types, values, keccak256 }[]>('./test/fixtures/abi/encodePacked.json');
        json.forEach((data, i) => {
            let encoded = $abiCoder.encodePacked(data.types, data.values);
            let hash = $contract.keccak256(encoded);
            eq_(hash, data.keccak256);
        })
    },
    async 'encode'() {
        let json = await File.readAsync<{ type, value, encoded }[]>('./test/fixtures/abi/encode.json');
        json.forEach((data, i) => {
            let encoded = $abiCoder.encode([data.type], [data.value]);
            eq_(encoded, data.encoded);
        })
    },
    async 'decode a simple value'() {

        let [nrNumber] = $abiCoder.decode(['uint32'], '0x0000000000000000000000000000000000000000000000000000000000000011');
        eq_(typeof nrNumber, 'number');
        eq_(nrNumber, 17);

        // >2**32
        let [nrBigInt] = $abiCoder.decode(['uint64'], '0x0000000000000000000000000000000000000000000000000000000100000001');
        eq_(typeof nrBigInt, 'bigint');
        eq_(nrBigInt, 2n ** 32n + 1n);
    },
    async 'decode tuple'() {
        let hex = `0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000802c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae000000000000000000000000000000000000000000000000000000000000001b68747470733a2f2f666f6f2e6261722f7061636b6167652e7a69700000000000`;
        let abi = {
            "name": "package",
            "type": "tuple",
            "components": [
                {
                    "name": "version",
                    "type": "uint256"
                },
                {
                    "name": "timestamp",
                    "type": "uint256"
                },
                {
                    "name": "url",
                    "type": "string"
                },
                {
                    "name": "sha256",
                    "type": "bytes32"
                }
            ]
        };

        let json = $abiCoder.decodeSingle(abi, hex);
        deepEq_(json, {
            version: 1n,
            timestamp: 2n,
            url: 'https://foo.bar/package.zip',
            sha256: '0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae'
        });
    },
    async 'encode multiple values'() {
        let values = [
            '0x0000000000000000000000000000000000000002',
            '0x0000000000000000000000000000000000000003',
        ];
        l`> raw types`;
        let hexFromRaw = $abiCoder.encode(['address', 'address'], values);
        let decoded = $abiCoder.decode(['address', 'address'], hexFromRaw);
        deepEq_(decoded, values);

        l`> as tuple`
        let abi = <TAbiInput>{
            type: 'tuple',
            components: [
                { name: 'a1', type: 'address' },
                { name: 'a2', type: 'address' },
            ]
        };
        let hexFromTuple = $abiCoder.encode([abi], [{ a1: values[0], a2: values[1] }]);
        let decoded2 = $abiCoder.decode([abi], hexFromTuple);
        deepEq_(decoded2, [{ a1: values[0], a2: values[1] }]);

        let decoded3 = $abiCoder.decode([abi], hexFromRaw);
        deepEq_(decoded3, [{ a1: values[0], a2: values[1] }]);
    },
    async 'encode multiple values with a string'() {
        let values = [
            '0x0000000000000000000000000000000000000011',
            'Hello',
        ];
        l`> raw types`;
        let hexFromRaw = $abiCoder.encode(['address', 'string'], values);
        let decoded = $abiCoder.decode(['address', 'string'], hexFromRaw);
        deepEq_(decoded, values);

        l`> as tuple`
        let abi = <TAbiInput>{
            type: 'tuple',
            components: [
                { name: 'a1', type: 'address' },
                { name: 'a2', type: 'string' },
            ]
        };
        let hexFromTuple = $abiCoder.encode([abi], [{ a1: values[0], a2: values[1] }]);
        let decoded2 = $abiCoder.decode([abi], hexFromTuple, {
            dynamic: true
        });
        deepEq_(decoded2, [{ a1: values[0], a2: values[1] }]);

        let decoded3 = $abiCoder.decode([abi], hexFromRaw, {
            dynamic: false
        });
        deepEq_(decoded3, [{ a1: values[0], a2: values[1] }]);
    },
    async 'encode struct'() {
        let hex = $abiCoder.encode(['address', 'address', 'string'], [
            '0x0000000000000000000000000000000000000002',
            '0x0000000000000000000000000000000000000003',
            'Hello Bar'
        ]);
        let tupleAbi = <TAbiInput>{
            type: 'tuple',
            components: [
                { name: 'a1', type: 'address' },
                { name: 'a2', type: 'address' },
                { name: 'user', type: 'string' }
            ]
        };
        let decoded = $abiCoder.decode(['address', 'address', 'string'], hex);
        deepEq_(decoded, [
            '0x0000000000000000000000000000000000000002',
            '0x0000000000000000000000000000000000000003',
            'Hello Bar'
        ]);

        let [decoded2] = $abiCoder.decode([tupleAbi], hex, {
            dynamic: false
        });
        deepEq_(decoded2, {
            a1: '0x0000000000000000000000000000000000000002',
            a2: '0x0000000000000000000000000000000000000003',
            user: 'Hello Bar'
        });

    },
    'decode constructor arguments': {
        async 'decode compound contracts'() {
            let deployments = await File.readAsync<any[]>('./test/fixtures/abi/deployments.json');

            deployments.forEach(({ input, abi, params }) => {
                for (let key in params) {
                    let val = params[key];
                    if (typeof val === 'string' && /^\d{10,}$/.test(val)) {
                        params[key] = BigInt(val);
                    }
                }
                let { params: parsed } = $contract.decodeDeploymentArguments(input, abi);
                deepEq_(params, parsed);
            });

        },
        async 'decode compiled constructor arguments'() {
            let hh = new HardhatProvider();
            let client = hh.client();
            let code = `
                    pragma solidity 0.8.20;

                    contract Foo {
                        uint256 public _x = 1;
                        uint256 immutable _foo;
                        constructor (uint256 value) {
                            _foo = value;
                        }
                    }
                    contract Bar is Foo {

                        constructor(uint256 a, uint256 b) Foo(b) {

                        }
                    }
            `;
            let { receipt, abi } = await hh.deployCode(code, {
                arguments: [2, 4]
            });
            let tx = await client.getTransaction(receipt.transactionHash);
            let { params } = $contract.decodeDeploymentArguments(tx.input, abi.find(x => x.type === 'constructor'));

            deepEq_(params, {
                a: 2n,
                b: 4n
            });
        }
    },

    async 'decode return data'() {
        const abi = {
            "inputs": [],
            "name": "foo",
            "outputs": [
                { "name": "timestamp", "type": "uint64" },
                { "name": "amount", "type": "uint192" },
                { "name": "token", "type": "address" },
                { "name": "key", "type": "bytes12" }
            ],
            "type": "function"
        };
        const data = $abi.decodeReturn(
            abi as TEth.Abi.Item,
            '0x000000000000000000000000000000000000000000000000000000006ac9356b00000000000000000000000000000000000000000000554fe449d2e4dad91861000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
        );
        deepEq_(data, {
            timestamp: 1791571307n,
            amount: 402874893736737211226209n,
            token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            key: '0x000000000000000000000000'
        });
    }
})
