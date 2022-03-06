import di from 'a-di';
import { Etherscan } from '@dequanto/BlockchainExplorer/Etherscan';
import { EthWeb3Client } from '@dequanto/clients/EthWeb3Client';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TokenPriceService, TokenPriceServiceCacheable } from './TokenPriceService';
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client';
import { Bscscan } from '@dequanto/BlockchainExplorer/Bscscan';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';

export namespace TokenPriceServiceProvider {

    export function create (platform: TPlatform, client?: Web3Client, explorer?: IBlockChainExplorer) {
        if (platform === 'eth') {
            return di.resolve(
                TokenPriceService,
                client ?? di.resolve(EthWeb3Client),
                explorer ?? di.resolve(Etherscan),
            );
        }
        if (platform === 'bsc') {
            return di.resolve(
                TokenPriceService,
                client ?? di.resolve(BscWeb3Client),
                explorer ?? di.resolve(Bscscan),
            );
        }
        throw new Error(`Unsupported platform: ${platform}`);
    }

    /** To boot performance use cached prices within 5 minutes interval */
    export function createTimeRanged (platform: TPlatform, client?: Web3Client, explorer?: IBlockChainExplorer) {
        let service = TokenPriceServiceProvider.create(platform, client, explorer);
        return new TokenPriceServiceCacheable(service);
    }
}
