import { Web3ClientFactory } from '../../lib/esm/clients/Web3ClientFactory.mjs'

UTest({
    async 'get block' () {
        let client = await Web3ClientFactory.getAsync('eth');
        let block = await client.getBlockNumber();
        gt_(block, 100);
    }
})
