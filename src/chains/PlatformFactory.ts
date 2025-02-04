import { BlockchainExplorerFactory } from '@dequanto/explorer/BlockchainExplorerFactory';
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { ChainAccountService } from '@dequanto/ChainAccountService';
import { IWeb3EndpointOptions } from '@dequanto/clients/interfaces/IWeb3EndpointOptions';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TokenService } from '@dequanto/tokens/TokenService';
import { TokensService } from '@dequanto/tokens/TokensService';
import { TokensServiceFactory } from '@dequanto/tokens/TokensServiceFactory';
import { TokenTransferService } from '@dequanto/tokens/TokenTransferService';
import memd from 'memd';

export interface IPlatformTools {
    platform: TPlatform
    client: Web3Client
    tokens: TokensService
    token: TokenService

    explorer: IBlockchainExplorer
    accounts: ChainAccountService

    transfer: TokenTransferService
}

export class PlatformFactory {

    @memd.deco.memoize()
    async get (platform: TPlatform, opts?: IWeb3EndpointOptions): Promise<IPlatformTools> {
        let client = await Web3ClientFactory.getAsync(platform, opts);
        let tokens = TokensServiceFactory.get(platform);
        let explorer = BlockchainExplorerFactory.get(platform);
        let accounts = new ChainAccountService();
        let transfer = new TokenTransferService(client);
        let token = new TokenService(client);
        return {
            platform,
            client,
            tokens,
            token,
            explorer,
            accounts,
            transfer,
        };
    }
}
