import { IBlockchainExplorer } from './IBlockchainExplorer';
import { Constructor } from '@dequanto/utils/types';
import { BlockchainExplorer, IBlockchainExplorerConfig, IBlockchainExplorerFactoryParams } from './BlockchainExplorer';
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

        let cfg = $config.get(`blockchainExplorer.${platform}`);
        let params = {
            platform ,
            ...(opts ?? {}),
            ...(cfg?? {})
        };
        let Ctor = registry[platform];
        if (Ctor != null) {
            if (typeof Ctor === 'function') {
                return new Ctor(params);
            }
            return Ctor;
        }

        return new BlockchainExplorer(params);
    }

    /** Same as sync variation, but ensures the config is being fetched */
    export async function getAsync (platform: TPlatform | string, opts?: IBlockchainExplorerFactoryParams) {
        await Config.get();
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
