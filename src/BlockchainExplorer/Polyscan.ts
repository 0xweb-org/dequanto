import di from 'a-di';
import { BlockChainExplorerFactory } from './BlockChainExplorerFactory';
import { $config } from '@dequanto/utils/$config';
import { PolyWeb3Client } from '@dequanto/clients/PolyWeb3Client';

const contracts = $config.get('contracts.polygon', []);

export class Polyscan extends BlockChainExplorerFactory.create({
    ABI_CACHE: `./cache/poly/abis.json`,
    CONTRACTS: contracts,
    getWeb3 () {
        return di.resolve(PolyWeb3Client)
    },
    getConfig () {
        const config = $config.get('blockchainExplorer.polygon');
        return {
            key: config?.key,
            host: config?.host,
        };
    }
}) {

}
