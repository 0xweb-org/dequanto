import { Wallet } from 'ethers';
import { l } from '@dequanto/utils/$logger';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { $bigint } from '@dequanto/utils/$bigint';
import { $contract } from '@dequanto/utils/$contract';
import { $txData } from '@dequanto/utils/$txData';
import { TestNode } from './hardhat/TestNode';

UTest({
    $config: {
        timeout: 20_000
    },
    async $before () {
        await TestNode.start();
    },
    async 'check balances' () {
        let provider = new HardhatProvider();
        let client = await provider.client('localhost');

        let acc1 = provider.deployer(1);
        let acc2 = provider.deployer(2);

        let balancesBatched = await client.getBalances([
            acc1.address,
            acc2.address,
        ]);
        let balancesSingle = await Promise.all([
            client.getBalance(acc1.address),
            client.getBalance(acc2.address),
        ]);

        eq_(balancesBatched[0], balancesSingle[0]);
        eq_(balancesBatched[1], balancesSingle[1]);

    },
    async 'check subscriptions and batch tx resolver' () {

        let provider = new HardhatProvider();
        let client = await provider.client('localhost');

        let acc1 = provider.deployer(1);
        let acc2 = provider.deployer(2);

        l`Subscribe to pending transactions`
        client.subscribe('pendingTransactions', <any> assert.await(2));

        let builder = new TxDataBuilder(client, acc1, {
            to: acc2.address,
            value: $bigint.toWei(1)
        });
        await Promise.all([
            builder.setNonce(),
            builder.setGas(),
        ]);

        let writer = TxWriter.create(client, builder, acc1);

        l`Manually check the tx HASH later`
        let wallet = new Wallet(acc1.key);
        let json = $txData.getJson(builder.getTxData(client) as any);
        let txSigned = await wallet.signTransaction(json);
        let txHash = $contract.keccak256(txSigned);

        let r1 = await writer.send().wait();
        eq_(r1.transactionHash, txHash);

        let r2 = await (await writer.transferNative(acc1, acc2.address, $bigint.toWei(2))).wait();

        l`Get Transactions`
        let txs = await client.getTransactions([r1.transactionHash, r2.transactionHash]);

        eq_(txs[0].hash, r1.transactionHash);
        eq_(txs[1].hash, r2.transactionHash);

        l`Get Receipts`
        let receipts = await client.getTransactionReceipts([r1.transactionHash, r2.transactionHash])
        eq_(receipts[0].transactionHash, r1.transactionHash);
        eq_(receipts[1].transactionHash, r2.transactionHash);

        l`Get Blocks`
        let blocks = await client.getBlocks([0,1]);
        eq_(blocks.length, 2);

        eq_(blocks[0].number, 0);
        eq_(blocks[1].number, 1);
    }
})
