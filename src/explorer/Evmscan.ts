import { TPlatform } from '@dequanto/models/TPlatform';
import { BlockChainExplorerFactory } from './BlockChainExplorerFactory';


export function Evmscan (options: { platform: TPlatform }) {
    const ClientConstructor = BlockChainExplorerFactory.create(options);
    return new ClientConstructor();
}
