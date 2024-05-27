import { Wallet } from 'ethers';
import { l } from '@dequanto/utils/$logger';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { TxDataBuilder } from '@dequanto/txs/TxDataBuilder';
import { TxWriter } from '@dequanto/txs/TxWriter';
import { $bigint } from '@dequanto/utils/$bigint';
import { $contract } from '@dequanto/utils/$contract';
import { $txData } from '@dequanto/utils/$txData';
import { Web3Client } from '@dequanto/clients/Web3Client';
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
