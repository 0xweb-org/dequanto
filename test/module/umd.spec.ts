//import Foo from '../lib/umd/dequanto.js'
//const foo = require('../lib/umd/dequanto.js');
//import { Web3ClientFactory } from '../../src/exports.lib.ts'
import { $abiCoder, $txData  } from '../../lib/umd/dequanto.js'

// import { class_Dfr } from 'atma-utils';
// console.log('class_Dfr', class_Dfr);

debugger;
console.log('Foo', foo);

$txData.getJson({} as TEth.)


$abiCoder.decode(types, hex)

UTest({
    async 'get block' () {
        let client = await Web3ClientFactory.getAsync('eth');
        let block = await client.getBlockNumber();
    }
})
