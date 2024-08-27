//import Foo from '../lib/umd/dequanto.js'
//const foo = require('../lib/umd/dequanto.js');
//import { Web3ClientFactory } from '../../src/exports.lib.ts'
import { Web3ClientFactory } from '../../lib/esm/clients/Web3ClientFactory.mjs'

// import { class_Dfr } from 'atma-utils';
// console.log('class_Dfr', class_Dfr);




UTest({
    async 'get block' () {
        //debugger;
        console.log('>>>>', Web3ClientFactory, Web3ClientFactory?.getAsync, Web3ClientFactory?.foo);
        //debugger;
        let client = await Web3ClientFactory.getAsync('eth');
        let block = await client.getBlockNumber();
        console.log('block', block);
    }
})
