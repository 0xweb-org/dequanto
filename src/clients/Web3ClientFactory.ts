import di from 'a-di';
import { TPlatform } from '@dequanto/models/TPlatform';
import { BscWeb3Client } from './BscWeb3Client';
import { EthWeb3Client } from './EthWeb3Client';
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions';
import { PolyWeb3Client } from './PolyWeb3Client';
import { ArbWeb3Client } from '@dequanto/chains/arbitrum/ArbWeb3Client';
import { XDaiWeb3Client } from '@dequanto/chains/xdai/XDaiWeb3Client';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';
import { config } from '@dequanto/Config';
import { $require } from '@dequanto/utils/$require';

export namespace Web3ClientFactory {

    export function get (platform: TPlatform | string, opts?: IWeb3EndpointOptions) {
        switch (platform) {
            case 'bsc':
                return di.resolve(BscWeb3Client, opts);
            case 'eth':
                return di.resolve(EthWeb3Client, opts);
            case 'eth:goerli':
                return di.resolve(EthWeb3Client, {
                    platform: platform,
                    chainId: 5,
                    ...(opts ?? {})
                });
            case 'polygon':
                return di.resolve(PolyWeb3Client, opts);
            case 'arbitrum':
                return di.resolve(ArbWeb3Client, opts);
            case 'xdai':
                return di.resolve(XDaiWeb3Client, opts);
            case 'hardhat':
                return di.resolve(HardhatProvider).client('localhost');
            default:
                let cfg = config.web3[platform];
                if (cfg != null) {
                    return createEVMClient({ platform, ...cfg });
                }
                throw new Error(`Unsupported platform ${platform} for web3 client`);
        }
    }
}


function createEVMClient (opts: {
    platform: string

    chainId?: number
    chainToken?: string
    extends?: TPlatform
    endpoints: any
}) {

    $require.Numeric(opts.chainId, `ChainID should be numeric. Got ${opts.chainId}`);

    class Client extends EthWeb3Client {

        constructor () {
            super({
                platform: opts.platform as TPlatform,
                chainId: Number(opts.chainId),
                chainToken: opts.chainToken,
                endpoints: opts.endpoints
            })
        }
    }
    return new Client();
}
