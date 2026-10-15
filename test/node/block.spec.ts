import { UTest } from 'atma-utest';
import { Web3ClientFactory } from '../../lib/esm/clients/Web3ClientFactory.mjs'

UTest.create({
    async 'should get a block' () {
        let client = await Web3ClientFactory.getAsync('eth');
        let block = await client.getBlockNumber();
        gt_(block, 100);
    }
})
