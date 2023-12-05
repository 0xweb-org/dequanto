import { $require } from '@dequanto/utils/$require';
import { INsProvider } from './providers/INsProvider';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { EnsProvider } from './providers/EnsProvider';
import { UDProvider } from './providers/UDProvider';
import { SpaceIdProvider } from './providers/SpaceIdProvider';

export class NameService {

    providers: INsProvider[];

    constructor(public client: Web3Client) {
        this.providers = [
            new EnsProvider(client),
            new SpaceIdProvider(client),
            new UDProvider(client),
        ];
    }

    getAddress (domain: string) {
        let provider = this.providers.find(x => x.supports(domain));
        $require.notNull(provider, `NS Provider for ${domain} not found`);
        return provider.getAddress(domain);
    }
    getContent (uri: string) {
        let provider = this.providers.find(x => x.supports(uri));
        $require.notNull(provider, `NS Provider for ${uri} not found`);
        return provider.getContent(uri);
    }
    supports (mix: string) {
        return this.providers.some(x => x.supports(mix));
    }
}
