import di from 'a-di';
import { BlockchainExplorerFactory } from './BlockchainExplorerFactory';

import { $config } from '@dequanto/utils/$config';
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client';

const contracts = $config.get('contracts.bsc', []);
export class Bscscan extends BlockchainExplorerFactory.create({
    ABI_CACHE: `./cache/bsc/abis.json`,
    CONTRACTS: contracts,
    getWeb3 () {
        return di.resolve(BscWeb3Client)
    },
    getConfig () {
        const config = $config.get('blockchainExplorer.bsc');
        return {
            key: config?.key,
            host: config?.host,
            www: config?.www,
        };
    }
}) {

}
