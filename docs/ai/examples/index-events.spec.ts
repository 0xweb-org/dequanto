import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { EventsIndexer } from '@dequanto/indexer/EventsIndexer';
import { ERC20 } from '@dequanto-contracts/openzeppelin/ERC20';

UTest({
    async 'index stable USDC Transfer logs from live Ethereum RPC' () {
        const client = await Web3ClientFactory.getAsync('eth');
        const usdc = new ERC20('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', client);

        const indexer = new EventsIndexer(usdc, {
            name: 'USDCTransfersAiExample',
            fs: {
                directory: './test/tmp/ai-examples/logs/'
            }
        });

        const { logs, infos } = await indexer.getPastLogs('Transfer', {
            fromBlock: 18_000_000,
            toBlock: 18_000_010
        });

        gt_(logs.length, 0);
        gte_(infos.fetched + infos.cached, logs.length);
        eq_(logs[0].event, 'Transfer');
        has_(logs[0].transactionHash, /^0x[a-fA-F0-9]{64}$/);
    }
});