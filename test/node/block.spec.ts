import { Web3ClientFactory } from '../../lib/esm/clients/Web3ClientFactory.mjs'

console.log(`Web3ClientFactory`, Web3ClientFactory);

UTest({
    async 'get block' () {
        let client = await Web3ClientFactory.getAsync('eth');
        let block = await client.getBlockNumber();
        gt_(block, 100);
    }
})
