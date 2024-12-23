import { $abiCoder } from '@dequanto/abi/$abiCoder';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { TAbiInput } from '@dequanto/types/TAbi';
import { $buffer } from '@dequanto/utils/$buffer';
import { $contract } from '@dequanto/utils/$contract';
import { $hex } from '@dequanto/utils/$hex';
import { l } from '@dequanto/utils/$logger';
import { File } from 'atma-io'

UTest({
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
    async 'decode simple'() {

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
    async 'encode multiple'() {
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
    async 'encode multiple with string'() {
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
        async 'decode compiled'() {
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
    }
})
