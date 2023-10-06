import { $abiCoder } from '@dequanto/abi/$abiCoder';
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
    async 'encode simple' () {

        let [ nrNumber ] = $abiCoder.decode(['uint32'], '0x0000000000000000000000000000000000000000000000000000000000000011');
        eq_(typeof nrNumber, 'number');
        eq_(nrNumber, 17);

        // >2**32
        let [ nrBigInt ] = $abiCoder.decode(['uint64'], '0x0000000000000000000000000000000000000000000000000000000100000001');
        eq_(typeof nrBigInt, 'bigint');
        eq_(nrBigInt, 2n**32n+1n);
    }
})
