import di from 'a-di';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { Config } from '@dequanto/config/Config';
import { EvmWeb3Client } from './EvmWeb3Client';
import { $require } from '@dequanto/utils/$require';
import { $config } from '@dequanto/utils/$config';
import type { HardhatWeb3Client } from '@dequanto/hardhat/HardhatWeb3Client';

export namespace Web3ClientFactory {

    export function get <
        TClient extends EvmWeb3Client | HardhatWeb3Client = EvmWeb3Client
    > (platform: TPlatform | number, opts?: IWeb3EndpointOptions): TClient {
        if (typeof platform === 'string' && (platform === 'hardhat' || platform.startsWith('hh:'))) {
            let client = di.resolve(HardhatProvider).client('localhost', opts);
            if (platform.startsWith('hh:')) {
                client.configureFork(platform.slice(3));
            }
            return client as TClient;
        }

        let options = $config.getWeb3Options(platform);
        $require.notNull(options, `Unsupported platform ${platform} for web3 client`)
        return new EvmWeb3Client({
            ...options,
            ...(opts ?? {})
        }) as TClient;
    }

    /** Same as the sync variant, but ensures the config is fetched */
    export async function getAsync <
        TClient extends EvmWeb3Client | HardhatWeb3Client = EvmWeb3Client
    > (platform: TPlatform | string | number, opts?: IWeb3EndpointOptions): Promise<TClient> {
        let cfg = await Config.get();
        return get<TClient>(platform, opts);
    }
}
