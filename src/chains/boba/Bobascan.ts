import di from 'a-di';

import { $config } from '@dequanto/utils/$config';
import { BobaWeb3Client } from './BobaWeb3Client';
import { BlockchainExplorer } from '@dequanto/explorer/BlockchainExplorer';

const config = $config.get('blockchainExplorer.boba');
const contracts = $config.get('contracts.boba', []);

export class Bobascan extends BlockchainExplorer {

    constructor() {
        super({
            platform: 'boba',
            ABI_CACHE: `./cache/boba/abis.json`,
            CONTRACTS: contracts,
            getWeb3() {
                return di.resolve(BobaWeb3Client)
            },
            getConfig() {
                const config = $config.get('blockchainExplorer.boba');
                return config;
            }
        })
    }

}
