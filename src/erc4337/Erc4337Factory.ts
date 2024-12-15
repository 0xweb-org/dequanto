import { BlockchainExplorerProvider } from '@dequanto/explorer/BlockchainExplorerProvider';
import { IBlockchainExplorer } from '@dequanto/explorer/IBlockchainExplorer';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';
import { TPlatform } from '@dequanto/models/TPlatform';
import { $config } from '@dequanto/utils/$config';
import { $require } from '@dequanto/utils/$require';
import { Erc4337Service } from './Erc4337Service';
import { Erc4337TxWriter } from './Erc4337TxWriter';
import { IConfigData } from '@dequanto/config/interface/IConfigData';

export class Erc4337Factory {
    static createService (opts?: {
        platform: TPlatform
        client?: Web3Client
        explorer?: IBlockchainExplorer
        /** default: default */
        name?: string
    }) {
        let platform = opts.platform;
        let name = opts.name ?? 'default';
        let client = opts.client ?? Web3ClientFactory.get(platform);
        let explorer = opts.explorer ?? BlockchainExplorerProvider.get(platform);

        let providers = $config.get('erc4337') as IConfigData['erc4337'];
        let provider = providers.find(x => (x.name === name || (name === 'default' && !x.name)) && x.platforms.includes(platform));

        $require.notNull(provider, `No 4337 provider information found for ${name} and platform "${platform}"`);

        console.log(`CreateService`, provider.contracts.entryPoint);

        return new Erc4337Service(client, explorer, {
            addresses: {
                entryPoint: provider.contracts.entryPoint,
                accountFactory: provider.contracts.accountFactory
            }
        });
    }
    static createWriter (opts?: {
        platform: TPlatform
        client?: Web3Client
        explorer?: IBlockchainExplorer
        /** default: default */
        name?: string
    }) {
        let service = Erc4337Factory.createService(opts);
        let writer = new Erc4337TxWriter(
            service.client,
            service.explorer,
            service.info
        );
        return writer;
    }
}
