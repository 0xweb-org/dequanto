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
        let date = new Date('2024-03-03T10:20:00Z');
        let nr = await block.getBlockNumberFor(date);
        // As binary search is used to fetch a block for a given time, check aproximately 3 blocks difference
        let diff = Math.abs(nr - 19354006);
        lt_(diff, 3);


        let info = await block.getBlockInfoFor(date);
        let secondsDiff = Math.abs($date.toUnixTimestamp(date) - info.timestamp);
        lt_(secondsDiff, 24);
    },

})
