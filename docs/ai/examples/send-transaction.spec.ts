import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { $account } from '@dequanto/utils/$account';
import { $address } from '@dequanto/utils/$address';
import { $number } from '@dequanto/utils/$number';
import { $require } from '@dequanto/utils/$require';

UTest({
    async 'build native transfer tx data with gas fields' () {
        const client = await Web3ClientFactory.getAsync('hh:memory');
        const alice = $account.generate('alice');
        await client.debug.setBalance(alice.address, 1e18);
        const bob = $account.generate('bob');

        const builder = new TxDataBuilder(client, alice, {
            to: bob.address
        });

        builder.setValue(0.05);
        await builder.setGas({ gasEstimation: false, gasLimit: 21_000 });

        $require.True($address.eq(builder.data.to, bob.address));
        $require.eq(builder.data.value, $number.toHex(5e16));
        $require.eq(Number(builder.data.gas), 21_000);
        $require.notNull(builder.data.maxFeePerGas ?? builder.data.gasPrice);

        const writer = TxWriter.create(client, builder, alice);
        const tx = await writer.send();
        const receipt = await tx.wait();
        $require.TxHash(receipt.transactionHash);
        $require.eq(await client.getBalance(bob.address), BigInt(5e16));
    }
});
