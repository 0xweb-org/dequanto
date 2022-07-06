import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { GnosisSafe } from '@dequanto/safe/GnosisSafe';
import { $signRaw } from '@dequanto/utils/$signRaw';
import { TestNode } from '../hardhat/TestNode';

UTest({
    'should sign tx hash' () {
        const key = `0x66e91912f68828c17ad3fee506b7580c4cd19c7946d450b4b0823ac73badc878`;
        const address = `0x6a2EB7F6734F4B79104A38Ad19F1c4311e5214c8`
        const txHash = `0x1ed9d878f89585977e98425d5cedf51027c041e414bb471d64519f8f510bb555`;

        const signature = $signRaw.signEC(txHash, key);
        eq_(signature.signature, `0xc0df6a1b659d56d3d23f66cbd1c483467ea68a428fea7bbbe0a527d43d8681f616af33344035f36c08218718480374dada0fe6cdb266d0182a4225d0e9c227181b`);
    },

    async '!create' () {
        let provider = new HardhatProvider();
        let client = provider.client();
        let owner1 = provider.deployer();
        let owner2 = provider.deployer(1);

        let gnosisSafe = new GnosisSafe(null, owner1, client);

        let safe = await gnosisSafe.create({
            owners: [
                owner1.address,
                owner2.address
            ]
        });
        console.log(safe.getAddress());
    }
})
