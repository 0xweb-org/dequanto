import { TPlatform } from '@dequanto/models/TPlatform';
import { $config } from '@dequanto/utils/$config';
import { IBlockchainExplorerFactoryParams } from './BlockchainExplorerFactory';
import { IBlockchainExplorer } from './IBlockchainExplorer';
import { Constructor } from '@dequanto/utils/types';
import { BlockchainExplorer } from './BlockchainExplorer';

export namespace BlockchainExplorerProvider {

    const registry = {} as Record<TPlatform, IBlockchainExplorer | Constructor<IBlockchainExplorer>>;

    export function get (platform: TPlatform): IBlockchainExplorer {
        switch (platform) {
            case 'hardhat':
                return new BlockchainExplorer({ platform });
            default:
                let cfg = $config.get(`blockchainExplorer.${platform}`);

                let Mix = registry[platform];
                if (Mix != null) {
                    if (typeof Mix === 'function') {
                        return new Mix(cfg);
                    }
                    return Mix;
                }
                if (cfg != null) {
                    return new BlockchainExplorer({ platform });
                }
                throw new Error(`Unsupported platform ${platform} for block chain explorer`);
        }
    }

    export function register (platform: TPlatform, explorer: IBlockchainExplorer | Constructor<IBlockchainExplorer>) {
        registry[platform] = explorer;
    }

    export function create(options: IBlockchainExplorerFactoryParams) {
        return new BlockchainExplorer(options);
    }
}

