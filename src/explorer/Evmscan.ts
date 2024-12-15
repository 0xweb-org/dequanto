import { TPlatform } from '@dequanto/models/TPlatform';
import { BlockchainExplorerFactory } from './BlockchainExplorerFactory';


export function Evmscan (options: { platform: TPlatform }) {
    const ClientConstructor = BlockchainExplorerFactory.create(options);
    return new ClientConstructor(options.platform);
}
