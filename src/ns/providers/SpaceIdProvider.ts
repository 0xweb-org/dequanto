import di from 'a-di';
import { EnsProvider } from './EnsProvider';
import { BscWeb3Client } from '@dequanto/clients/BscWeb3Client';

export class SpaceIdProvider extends EnsProvider {


    constructor(public client = di.resolve(BscWeb3Client)) {
        super(client);
        this.configKey = 'sid';
    }

    supports (domain: string) {
        return /\.bnb([/|?]|$)/.test(domain);
    }

}
