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
            // hardhat       - local hardhat network
            // hh:eth        - local hardhat network (which runs as a fork)
            // hh:memory     - in-memory hardhat network
            // hh:memory:eth - getAsync only: in-memory forked hardhat network
            if (platform.startsWith('hh:memory:')) {
                throw new Error(`use getAsync to resolve forked "${platform}" client`);
            }

            let network = platform.startsWith('hh:')
                ? platform.slice(3)
                : null;
            let hh = network === 'memory'
                ? 'hardhat' as const
                : 'localhost' as const;
            let client = di.resolve(HardhatProvider).client(hh, opts);
            if (network != null && network !== 'memory') {
                client.configureFork(network);
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

    type HHInMemoryForkData = {
        block?: number
        url?: string
    }
    /** Same as the sync variant, but ensures the config is fetched */
    export async function getAsync <
        TClient extends EvmWeb3Client | HardhatWeb3Client = EvmWeb3Client
    > (platform: TPlatform | string | number, opts?: IWeb3EndpointOptions & HHInMemoryForkData): Promise<TClient> {
        let cfg = await Config.get();
        if (typeof platform === 'string' && platform.startsWith('hh:memory:')) {
            let network = platform.replace('hh:memory:', '');
            let client = await di.resolve(HardhatProvider).forked({
                platform: network,
                block: opts?.block,
                url: opts?.url,
            });
            return client as TClient;
        }
        return get<TClient>(platform, opts);
    }
}
