import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { BlockDateResolver } from '@dequanto/blocks/BlockDateResolver';
import { $date } from '@dequanto/utils/$date';

UTest({
    $config: {
        timeout: 20_000
    },
    async $before () {

    },
    async 'fetch block by time' () {
        let client = await Web3ClientFactory.getAsync('eth');
        let block = new BlockDateResolver(client);
        let nr = await block.getBlockNumberFor($date.parse('03-03-2024 10:20'));
        eq_(nr, 19353706);
    },

})
