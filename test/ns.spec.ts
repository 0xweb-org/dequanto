import { EnsProvider } from '@dequanto/ns/providers/EnsProvider'
import { UDProvider } from '@dequanto/ns/providers/UDProvider';
import { $ns } from '@dequanto/ns/utils/$ns';

UTest({


    'ens': {
        async 'namehash' () {
            let hash = $ns.namehash('alice.eth');
            eq_(hash, `0x787192fc5378cc32aa956ddfdedbf26b24e8d78e40109add0eea2c1a012c3dec`);
        },
        async 'address' () {
            let ens = new EnsProvider()
            let addr = await ens.getAddress('alice.eth');
            eq_(addr, `0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75`);
        }
    },
    'ud': {
        async 'namehash' () {
            let hash = $ns.namehash('brad.crypto');
            eq_(hash, `0x756e4e998dbffd803c21d23b06cd855cdc7a4b57706c95964a37e24b47c10fc9`);
        },
        async 'address' () {
            let ens = new UDProvider()
            let addr = await ens.getAddress('brad.crypto');
            eq_(addr?.toLowerCase(), `0x8aad44321a86b170879d7a244c1e8d360c99dda8`);
        }
    }
})
