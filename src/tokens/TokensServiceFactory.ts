import di from 'a-di';
import { TPlatform } from '@dequanto/models/TPlatform';
import { TokensServiceBsc } from './TokensServiceBsc';
import { TokensServiceEth } from './TokensServiceEth';
import { TokensServicePolygon } from './TokensServicePolygon';
import { TokensServiceXDai } from './TokensServiceXDai';

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
            default:
                throw new Error(`Unsupported platform ${platform} for TokensService`);
        }
    }
}
