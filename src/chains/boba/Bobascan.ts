import di from 'a-di';

import { $config } from '@dequanto/utils/$config';
import { BlockChainExplorerFactory } from '@dequanto/BlockchainExplorer/BlockChainExplorerFactory';
import { BobaWeb3Client } from './BobaWeb3Client';

const config = $config.get('blockchainExplorer.boba');
const contracts = $config.get('contracts.boba', []);

export class Bobascan extends BlockChainExplorerFactory.create({
    ABI_CACHE: `./cache/boba/abis.json`,
    CONTRACTS: contracts,
    getWeb3 () {
        return di.resolve(BobaWeb3Client)
    },
    getConfig () {
        const config = $config.get('blockchainExplorer.boba');
        return {
            key: config?.key,
            host: config?.host,
        };
    }
}) {

}
