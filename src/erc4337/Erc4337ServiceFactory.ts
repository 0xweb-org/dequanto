import type { Config } from '@dequanto/Config';
import { BlockChainExplorerProvider } from '@dequanto/BlockchainExplorer/BlockChainExplorerProvider';
import { IBlockChainExplorer } from '@dequanto/BlockchainExplorer/IBlockChainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { TPlatform } from '@dequanto/models/TPlatform';
import { $config } from '@dequanto/utils/$config';
import { $require } from '@dequanto/utils/$require';
import { Erc4337Service } from './Erc4337Service';

export class Erc4337ServiceFactory {
    static create (opts?: {
        platform: TPlatform
        client?: Web3Client
        explorer?: IBlockChainExplorer
        /** default: default */
        name?: string
    }) {
        let platform = opts.platform;
        let name = opts.name ?? 'default';
        let client = opts.client ?? Web3ClientFactory.get(platform);
        let explorer = opts.explorer ?? BlockChainExplorerProvider.get(platform);

        let providers = $config.get('erc4337') as Config['erc4337'];
        let provider = providers.find(x => (x.name === name || (name === 'default' && !x.name)) && x.platforms.includes(platform));

        $require.notNull(provider, `No 4337 provider information found for ${name} and platform "${platform}"`);

        return new Erc4337Service(client, explorer, {
            addresses: {
                entryPoint: provider.entryPoint,
                accountFactory: provider.accountFactory
            }
        });
    }
}
