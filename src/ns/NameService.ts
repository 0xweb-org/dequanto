import { Web3Client } from '@dequanto/clients/Web3Client';
import { $require } from '@dequanto/utils/$require';
import { EnsProvider } from './providers/EnsProvider';
import { INsProvider } from './providers/INsProvider';

export class NameService {

    providers: INsProvider[] = [
        new EnsProvider(this.client)
    ];

    constructor(public client: Web3Client) {

    }

    getAddress (domain: string) {
        let provider = this.providers.find(x => x.supports(domain));
        $require.notNull(provider, `NS Provider for ${domain} not found`);
        return provider.getAddress(domain);
    }
}
