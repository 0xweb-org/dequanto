import di from 'a-di';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TokensServiceBsc } from './TokensServiceBsc';
import { TokensServiceEth } from './TokensServiceEth';
import { TokensServicePolygon } from './TokensServicePolygon';
import { TokensServiceXDai } from './TokensServiceXDai';
import { TokensServiceArbitrum } from '@dequanto/chains/arbitrum/TokensServiceArbitrum';
import { TokensService } from './TokensService';
import { config } from '@dequanto/Config';
import { TokenDataProvider } from './TokenDataProvider';

export namespace TokensServiceFactory {

    export function get (platform: TPlatform) {
        switch (platform) {
            case 'bsc':
                return di.resolve(TokensServiceBsc);
            case 'eth':
                return di.resolve(TokensServiceEth);
            case 'polygon':
                return di.resolve(TokensServicePolygon);
            case 'xdai':
                return di.resolve(TokensServiceXDai);
            case 'arbitrum':
                return di.resolve(TokensServiceArbitrum);
            case 'hardhat':
                let ethProvider = new TokenDataProvider('eth');
                return new TokensService(platform, null, ethProvider);
            default: {
                let cfg = config.web3[platform];
                if (cfg != null) {
                    return di.resolve(TokensService, platform);
                }
                throw new Error(`Unsupported platform ${platform} for TokensService`);
            }
        }
    }
}
