import di from 'a-di';
import { TPlatform } from '@dequanto/models/TPlatform';
import { BscWeb3Client } from './BscWeb3Client';
import { EthWeb3Client } from './EthWeb3Client';
import { IWeb3EndpointOptions } from './interfaces/IWeb3EndpointOptions';
import { PolyWeb3Client } from './PolyWeb3Client';
import { ArbWeb3Client } from '@dequanto/chains/arbitrum/ArbWeb3Client';
import { XDaiWeb3Client } from '@dequanto/chains/xdai/XDaiWeb3Client';
import { HardhatProvider } from '@dequanto/hardhat/HardhatProvider';

export namespace Web3ClientFactory {

    export function get (platform: TPlatform, opts?: IWeb3EndpointOptions) {
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
                throw new Error(`Unsupported platform ${platform} for web3 client`);
        }
    }
}
