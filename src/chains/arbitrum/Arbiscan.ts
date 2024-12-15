import di from 'a-di';

import { $config } from '@dequanto/utils/$config';
import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';
import { ArbWeb3Client } from './ArbWeb3Client';

const contracts = $config.get('contracts.arbitrum', []);

export class Arbiscan extends BlockchainExplorerFactory.create({
    ABI_CACHE: `./cache/arb/abis.json`,
    CONTRACTS: contracts,
    getWeb3 () {
        return di.resolve(ArbWeb3Client)
    },
    getConfig () {
        const config = $config.get('blockchainExplorer.arbitrum');
        return config;
    }
}) {

}
