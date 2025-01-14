import di from 'a-di';
import alot from 'alot';
import { TPlatform } from '@dequanto/models/TPlatform';
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { Config } from '@dequanto/config/Config';
import { EvmWeb3Client } from './EvmWeb3Client';
import { $require } from '@dequanto/utils/$require';
import { $config } from '@dequanto/utils/$config';

export namespace Web3ClientFactory {

    export function get (platform: TPlatform | string | number, opts?: IWeb3EndpointOptions) {
        let web3 = $config.get('web3');
        if (typeof platform ==='number') {
            let chain = alot.fromObject(web3).find(x => x.value.chainId === platform);
            if (chain == null) {
                throw new Error(`Unsupported platform ${platform} for web3 client`);
            }
            platform = chain.key
        }
        if (platform === 'hardhat' || platform.startsWith('hh:')) {
            let client = di.resolve(HardhatProvider).client('localhost', opts);
            if (platform.startsWith('hh:')) {
                client.configureFork(platform.slice(3));
            }
            return client;
        }
        let cfg = web3[platform];
        $require.notNull(cfg, `Unsupported platform ${platform} for web3 client`)
        return new EvmWeb3Client({ platform, ...cfg });

        // switch (platform) {
        //     case 'bsc':
        //         return di.resolve(BscWeb3Client, opts);
        //     case 'eth':
        //         return di.resolve(EthWeb3Client, opts);
        //     case 'eth:goerli':
        //         return di.resolve(EthWeb3Client, {
        //             platform: platform,
        //             chainId: 5,
        //             ...(opts ?? {})
        //         });
        //     case 'polygon':
        //         return di.resolve(PolyWeb3Client, opts);
        //     case 'arbitrum':
        //         return di.resolve(ArbWeb3Client, opts);
        //     case 'xdai':
        //         return di.resolve(XDaiWeb3Client, opts);
        //     default:
        //         let cfg = config.web3[platform];
        //         if (cfg != null) {
        //             return new EvmWeb3Client({ platform, ...cfg });
        //         }
        //         throw new Error(`Unsupported platform ${platform} for web3 client`);
        // }
    }

    /** Same as sync variation, but ensures the config is being fetched */
    export async function getAsync (platform: TPlatform | string | number, opts?: IWeb3EndpointOptions) {
        let cfg = await Config.get();
        return get(platform, opts);
    }
}
