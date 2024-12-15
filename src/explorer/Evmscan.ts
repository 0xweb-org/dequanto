import { TPlatform } from '@dequanto/models/TPlatform';
import { BlockchainExplorer } from './BlockchainExplorer';


/**
 * @obsolete Use BlockchainExplorer class instead.
 */
export function Evmscan (options: { platform: TPlatform }) {
    return new BlockchainExplorer(options);
}
