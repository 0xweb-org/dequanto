import di from 'a-di';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { Config } from '@dequanto/config/Config';
import { EvmWeb3Client } from './EvmWeb3Client';
import { $require } from '@dequanto/utils/$require';
import { $config } from '@dequanto/utils/$config';

export namespace Web3ClientFactory {

    export function get (platform: TPlatform | number, opts?: IWeb3EndpointOptions) {
        if (typeof platform === 'string' && (platform === 'hardhat' || platform.startsWith('hh:'))) {
            let client = di.resolve(HardhatProvider).client('localhost', opts);
            if (platform.startsWith('hh:')) {
                client.configureFork(platform.slice(3));
            }
            return client;
        }

        let options = $config.getWeb3Options(platform);
        $require.notNull(options, `Unsupported platform ${platform} for web3 client`)
        return new EvmWeb3Client({
            ...options,
            ...(opts ?? {})
        });
    }

    /** Same as sync variation, but ensures the config is being fetched */
    export async function getAsync (platform: TPlatform | string | number, opts?: IWeb3EndpointOptions) {
        let cfg = await Config.get();
        return get(platform, opts);
    }
}
