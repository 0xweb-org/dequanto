import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { NameService } from '@dequanto/ns/NameService';
import { $ns } from '@dequanto/ns/utils/$ns';

UTest({
    'ens': {
        async 'tld' () {
            let hash = $ns.namehash('eth');
            eq_(hash, '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae');
        },
        async 'namehash' () {
            let hash = $ns.namehash('alice.eth');
            eq_(hash, `0x787192fc5378cc32aa956ddfdedbf26b24e8d78e40109add0eea2c1a012c3dec`);
        },
        async 'address' () {
            let ns = new NameService(Web3ClientFactory.get('eth'));
            let { address: addr } = await ns.getAddress('alice.eth');
            eq_(addr, `0xcd2E72aEBe2A203b84f46DEEC948E6465dB51c75`);
        },
        async 'content and records' () {
            let ns = new NameService(Web3ClientFactory.get('eth'));
            let { address: addr } = await ns.getAddress('vitalik.eth');
            eq_(addr, `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`);

            let { value: urlRecord } = await ns.getContent('vitalik.eth/url');
            eq_(urlRecord, 'https://vitalik.ca');

            let { value: contentHash } = await ns.getContent('vitalik.eth');
            eq_(contentHash, `ipfs://Qmci9t87GXFSaLsQgntz5Y73p2MDiLMRWfnKFga35r4s6U`);
        },
        async 'reverse registrar' () {
            let ns = new NameService(Web3ClientFactory.get('eth'));
            let { name } = await ns.getReverseName(`0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`);
            eq_(name, 'vitalik.eth');
        }
    },
    'ud': {
        async 'namehash' () {
            let hash = $ns.namehash('brad.crypto');
            eq_(hash, `0x756e4e998dbffd803c21d23b06cd855cdc7a4b57706c95964a37e24b47c10fc9`);
        },
        async 'address' () {
            let ns = new NameService(Web3ClientFactory.get('eth'));
            let { address: addr } = await ns.getAddress('brad.crypto');
            eq_(addr?.toLowerCase(), `0x8aad44321a86b170879d7a244c1e8d360c99dda8`);
        },
        async 'reverse registrar' () {
            let ns = new NameService(Web3ClientFactory.get('eth'));
            let { name, platform } = await ns.getReverseName(`0x8aad44321a86b170879d7a244c1e8d360c99dda8`);
            eq_(platform, 'polygon');
            eq_(name, 'brad.x');
        }
    },
    'spaceId': {
        async 'address' () {
            let ns = new NameService(Web3ClientFactory.get('bsc'));
            let { address: addr } = await ns.getAddress('fr.boracle.bnb');
            eq_(addr?.toLowerCase(), `0x55328A2dF78C5E379a3FeE693F47E6d4279C2193`.toLowerCase());
        },
        async 'reversed' () {
            let ns = new NameService(Web3ClientFactory.get('bsc'));
            let { name, platform } = await ns.getReverseName(`0xb5932a6B7d50A966AEC6C74C97385412Fb497540`);
            eq_(platform, 'bsc');
            eq_(name, 'spaceid.bnb');
        }
    }
})
