import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';

UTest({
    async 'build native transfer tx data with gas fields' () {
        const client = await Web3ClientFactory.getAsync('eth');
        const sender = { address: '0x0000000000000000000000000000000000000001' as const };
        const receiver = '0x0000000000000000000000000000000000000002' as const;

        const builder = new TxDataBuilder(client, sender, {
            to: receiver
        });

        builder.setValue(10n ** 16n);
        await builder.setGas({ gasEstimation: false, gasLimit: 21_000 });

        eq_(builder.data.to, receiver);
        eq_(builder.data.value, '0x2386f26fc10000');
        eq_(Number(builder.data.gas), 21_000);
        notEq_(builder.data.maxFeePerGas ?? builder.data.gasPrice, null);
    }
});