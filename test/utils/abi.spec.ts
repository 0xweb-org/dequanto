import { $abiCoder } from '@dequanto/abi/$abiCoder';
import { EvmBytecode } from '@dequanto/evm/EvmBytecode';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { TEth } from '@dequanto/models/TEth';
import { $abiUtils } from '@dequanto/utils/$abiUtils';
import { $bigint } from '@dequanto/utils/$bigint';
import { $buffer } from '@dequanto/utils/$buffer';
import { $contract } from '@dequanto/utils/$contract';
import { File } from 'atma-io'

UTest({
    async 'encode packed' () {
        let json = await File.readAsync<{ types, values, keccak256 }[]>('./test/fixtures/abi/encodePacked.json');
        //-json = [ json[473] ];
        json.forEach((data, i) => {
            let encoded = $abiCoder.encodePacked(data.types, data.values);
            let hash = $contract.keccak256(encoded);
            eq_(hash, data.keccak256);
        })
    },
    async 'encode' () {
        let json = await File.readAsync<{ type, value, encoded }[]>('./test/fixtures/abi/encode.json');

        //-json = [ json[0] ];

        json.forEach((data, i) => {
            let encoded = $abiCoder.encode([ data.type ], [ data.value ]);
            eq_(encoded, data.encoded);
        })
    },
    async 'decode simple' () {

        let [ nrNumber ] = $abiCoder.decode(['uint32'], '0x0000000000000000000000000000000000000000000000000000000000000011');
        eq_(typeof nrNumber, 'number');
        eq_(nrNumber, 17);

        // >2**32
        let [ nrBigInt ] = $abiCoder.decode(['uint64'], '0x0000000000000000000000000000000000000000000000000000000100000001');
        eq_(typeof nrBigInt, 'bigint');
        eq_(nrBigInt, 2n**32n+1n);
    },
    'decode constructor arguments': {
        async 'decode compound contracts' () {
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
        async 'decode compiled' () {
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
                arguments: [ 2, 4 ]
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
