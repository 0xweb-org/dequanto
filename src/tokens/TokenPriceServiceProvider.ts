import { TPlatform } from '@dequanto/models/TPlatform';
import { TokenPriceService, TokenPriceServiceCacheable } from './TokenPriceService';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';

export namespace TokenPriceServiceFactory {

    export function get (platform: TPlatform = 'eth', client?: Web3Client, explorer?: IBlockchainExplorer) {

        client ??= Web3ClientFactory.get(platform)
        explorer ??= BlockchainExplorerFactory.get(platform);

        return new TokenPriceService(client, explorer);
    }

    /** To boot performance use cached prices within 5 minutes interval */
    export function createTimeRanged (platform: TPlatform, client?: Web3Client, explorer?: IBlockchainExplorer) {
        let service = TokenPriceServiceFactory.get(platform, client, explorer);
        return new TokenPriceServiceCacheable(service);
    }
}
