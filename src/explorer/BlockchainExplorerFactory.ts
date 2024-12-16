import { IBlockchainExplorer } from './IBlockchainExplorer';
import { Constructor } from '@dequanto/utils/types';
import { BlockchainExplorer, IBlockchainExplorerFactoryParams } from './BlockchainExplorer';
import { TPlatform } from '@dequanto/models/TPlatform';
import { $config } from '@dequanto/utils/$config';
import { Config } from '@dequanto/config/Config';



/**
 * @obsolete Use BlockchainExplorer class instead.
 */
export namespace BlockchainExplorerFactory {

    const registry = {} as Record<TPlatform, IBlockchainExplorer | Constructor<IBlockchainExplorer>>;

    export function register (platform: TPlatform, explorer: IBlockchainExplorer | Constructor<IBlockchainExplorer>) {
        registry[platform] = explorer;
    }

    export function get (platform: TPlatform | string, opts?: IBlockchainExplorerFactoryParams) {
        switch (platform) {
            case 'hardhat':
                return new BlockchainExplorer({
                    platform,
                    ...(opts ?? {})
                });
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
                    return new BlockchainExplorer({
                        platform ,
                        ...(opts ?? {})
                    });
                }
                throw new Error(`Unsupported platform ${platform} for block chain explorer`);
        }
    }

    /** Same as sync variation, but ensures the config is being fetched */
    export async function getAsync (platform: TPlatform | string, opts?: IBlockchainExplorerFactoryParams) {
        let cfg = await Config.get();
        return get(platform, opts);
    }

    /** @obsolete Create instance directly with the get/getAsync method */
    export function create (opts: IBlockchainExplorerFactoryParams): Constructor<IBlockchainExplorer> {

        return class extends BlockchainExplorer {
            constructor (config?: IBlockchainExplorerFactoryParams) {
                super(config ?? opts);
            }
        }
    }
}
