import { BlockChainExplorerFactory } from './BlockChainExplorerFactory';

import { $config } from '@dequanto/utils/$config';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import di from 'a-di';


const contracts = $config.get('contracts.eth', [])
export class Etherscan extends BlockChainExplorerFactory.create({
    ABI_CACHE: `./cache/eth/abis.json`,
    CONTRACTS: contracts,
    getWeb3 () {
        return di.resolve(EthWeb3Client)
    },
    getConfig () {
        const config = $config.get('blockchainExplorer.eth');
        return {
            key: config?.key,
            host: config?.host,
        };
    }
}) {

}

