import di from 'a-di';

import { $config } from '@dequanto/utils/$config';
import { BlockChainExplorerFactory } from '@dequanto/BlockchainExplorer/BlockChainExplorerFactory';
import { XDaiWeb3Client } from './XDaiWeb3Client';

const contracts = $config.get('contracts.xdai', []);

export class XDaiscan extends BlockChainExplorerFactory.create({
    ABI_CACHE: `./cache/xdai/abis.json`,
    CONTRACTS: contracts,
    getWeb3 () {
        return di.resolve(XDaiWeb3Client)
    },
    getConfig () {
        const config = $config.get('blockchainExplorer.xdai');
        return {
            key: config?.key,
            host: config?.host,
        };
    }
}) {

}
