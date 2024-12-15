import di from 'a-di';

import { $config } from '@dequanto/utils/$config';
import { ArbWeb3Client } from './ArbWeb3Client';
import { BlockchainExplorer } from '@dequanto/explorer/BlockchainExplorer';


const contracts = $config.get('contracts.arbitrum', []);


export class Arbiscan extends BlockchainExplorer {

    constructor() {
        super({
            platform: 'arbitrum',
            ABI_CACHE: `./cache/arb/abis.json`,
            CONTRACTS: contracts,
            getWeb3() {
                return di.resolve(ArbWeb3Client)
            },
            getConfig() {
                const config = $config.get('blockchainExplorer.arbitrum');
                return config;
            }
        })
    }

}
