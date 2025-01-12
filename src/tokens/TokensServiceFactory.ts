import { TPlatform } from '@dequanto/models/TPlatform';
import { TokensService } from './TokensService';
import { Web3ClientFactory } from '@dequanto/clients/Web3ClientFactory';

export namespace TokensServiceFactory {

    export function get (platform: TPlatform) {
        let client = Web3ClientFactory.get(platform);
        return new TokensService(client.network);
    }
}
