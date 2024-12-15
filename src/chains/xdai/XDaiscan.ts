import di from 'a-di';

import { $config } from '@dequanto/utils/$config';
import { XDaiWeb3Client } from './XDaiWeb3Client';
import { BlockchainExplorer } from '@dequanto/explorer/BlockchainExplorer';

const contracts = $config.get('contracts.xdai', []);

export class XDaiscan extends BlockchainExplorer {

    constructor() {
        super({
            platform: 'xdai',
            ABI_CACHE: `./cache/xdai/abis.json`,
            CONTRACTS: contracts,
            getWeb3() {
                return di.resolve(XDaiWeb3Client)
            },
            getConfig() {
                const config = $config.get('blockchainExplorer.xdai');
                return config;
            }
        })
    }

}
