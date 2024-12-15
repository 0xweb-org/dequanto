import di from 'a-di';
import { $config } from '@dequanto/utils/$config';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { BlockchainExplorerFactory } from './BlockchainExplorerFactory';


const contracts = $config.get('contracts.eth', [])
export class Etherscan extends BlockchainExplorerFactory.create({
    ABI_CACHE: `./cache/eth/abis.json`,
    CONTRACTS: contracts,
    getWeb3 () {
        return di.resolve(EthWeb3Client)
    },
    getConfig (platform: TPlatform) {
        platform ??= 'eth';

        let config = $config.get(`blockchainExplorer.${platform}`);

        let mainnet = /(?<mainnet>\w+):/.exec(platform)?.groups?.mainnet;
        if (mainnet != null) {
            let mainnetConfig = $config.get(`blockchainExplorer.${mainnet}`);
            config = {
                ...(mainnetConfig ?? {}),
                ...(config ?? {})
            };
        }
        return {
            key: config?.key,
            host: config?.host,
            www: config?.www,
        };
    }
}) {

}

