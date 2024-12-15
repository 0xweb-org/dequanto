import di from 'a-di';

import { $config } from '@dequanto/utils/$config';
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client';
import { BlockchainExplorer } from './BlockchainExplorer';

const contracts = $config.get('contracts.bsc', []);

export class Bscscan extends BlockchainExplorer {

    constructor () {
        super({
            platform: 'bsc',
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
        })
    }
}
