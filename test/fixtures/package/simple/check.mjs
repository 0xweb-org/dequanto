import { Web3ClientFactory } from 'dequanto/clients/Web3ClientFactory'

let client = await Web3ClientFactory.getAsync('eth');
let block = await client.getBlockNumber();

console.log(`Current Ethereum block number: ${block}`);
