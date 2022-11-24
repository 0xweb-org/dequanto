import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { BlocksWalker } from '@dequanto/indexer/handlers/BlocksWalker';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { TestNode } from '../hardhat/TestNode';

UTest({

    async 'walk over sent simple transactions to get the blocks, txs, and receipts' () {
        let provider = new HardhatProvider();
        let client = await TestNode.client();

        let acc1 = provider.deployer(1);
        let acc2 = provider.deployer(2);


        let w1 = await TxWriter.writeTxData(client, { to: acc2.address, value: 2n, }, acc1);
        let r1 = await w1.wait();

        let w2 = await TxWriter.writeTxData(client, { to: acc2.address, value: 3n, }, acc1);
        let r2 = await w2.wait();

        let blockNumber = await client.getBlockNumber();
        eq_(r2.blockNumber, blockNumber);

        let arr = [] as { block, txs?, receipts? } []
        let walker = new BlocksWalker({
            client,
            name: 'test',
            loadTransactions: true,
            loadReceipts: true,
            async visitor (block, data) {
                arr.push({ block, ...data });
            }
        });

        await walker.start(0);
        await walker.onEndPromise;

        eq_(arr.length, blockNumber + 1);

        eq_(arr[arr.length - 1].block.number, r2.blockNumber);
        eq_(arr[arr.length - 1].txs.length, 1);
        eq_(arr[arr.length - 1].txs[0].hash, r2.transactionHash);

        eq_(arr[arr.length - 1].receipts.length, 1);
        eq_(arr[arr.length - 1].receipts[0].status, r2.status);
        eq_(arr[arr.length - 1].receipts[0].transactionHash, r2.transactionHash);
    }

})
