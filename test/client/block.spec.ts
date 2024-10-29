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
        let nr = await block.getBlockNumberFor(new Date('2024-03-03T10:20:00Z'));
        eq_(nr, 19354006);
    },

})
