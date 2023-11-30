import { Web3Client } from '@dequanto/clients/Web3Client';
import { $require } from '@dequanto/utils/$require';
import { EnsProvider } from './providers/EnsProvider';
import { INsProvider } from './providers/INsProvider';
import { SpaceIdProvider } from './providers/SpaceIdProvider';

export class NameService {

    providers: INsProvider[];

    constructor(public client: Web3Client) {
        this.providers = [
            new EnsProvider(client),
            new SpaceIdProvider(client),
        ];
    }

    getAddress (domain: string) {
        let provider = this.providers.find(x => x.supports(domain));
        $require.notNull(provider, `NS Provider for ${domain} not found`);
        return provider.getAddress(domain);
    }
    supports (mix: string) {
        return this.providers.some(x => x.supports(mix));
    }
}
