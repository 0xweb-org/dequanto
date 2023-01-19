import di from 'a-di';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { TxLogParser } from '@dequanto/txs/receipt/TxLogParser'
import { File } from 'atma-io'
import { TransactionReceipt } from 'web3-core';

const tx = {
    swap: `0x7e91bf011c11e5e8a553db696bd4b070507b7149af841eb0319010bbfb03502a`
};

UTest({
    async '//download' () {
        let receipt = await di.resolve(EthWeb3Client).getTransactionReceipt(tx.swap);
        await File.writeAsync(`./test/fixtures/receipts/swap.json`, receipt);
    },
    async 'parse swap logs' () {
        let swapReceipt = await File.readAsync<TransactionReceipt>('./test/fixtures/receipts/swap.json');

        let parser = new TxLogParser();
        let logs = await parser.parse(swapReceipt);
        let dai = logs.find(x => x.token.symbol === 'DAI');
        eq_(dai.amount, 30000000000000000000000n);
    }
})
