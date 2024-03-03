import { $require } from '@dequanto/utils/$require';
import { INsProvider, INsProviderOptions } from './providers/INsProvider';
import { Web3Client } from '@dequanto/clients/Web3Client';
import { EnsProvider } from './providers/EnsProvider';
import { UDProvider } from './providers/UDProvider';
import { SpaceIdProvider } from './providers/SpaceIdProvider';
import alot from 'alot';
import { TAddress } from '@dequanto/models/TAddress';
import { $is } from '@dequanto/utils/$is';

export class NameService {

    providers: INsProvider[];

    constructor(public client: Web3Client) {
        this.providers = [
            new EnsProvider(client),
            new SpaceIdProvider(client),
            new UDProvider(client),
        ];
    }

    getAddress (domain: string, opts?: INsProviderOptions) {
        let provider = this.providers.find(x => x.supports(domain));
        $require.notNull(provider, `NS Provider for ${domain} not found`);
        return provider.getAddress(domain, opts);
    }
    getContent (uri: string, opts?: INsProviderOptions) {
        let provider = this.providers.find(x => x.supports(uri));
        $require.notNull(provider, `NS Provider for ${uri} not found`);
        return provider.getContent(uri, opts);
    }
    supports (mix: string) {
        return this.providers.some(x => x.supports(mix));
    }
    async getReverseName (address: TAddress, opts?: INsProviderOptions & { provider?: 'ens' | 'sid' | 'ud' }) {
        let providerErrors = {};
        let entry = await alot(this.providers)
            .mapAsync(async provider => {
                try {
                    return await provider.getReverseName(address, opts)
                } catch (e) {
                    providerErrors[provider.configKey] = e.message;
                    return null;
                }
            })
            .firstAsync(x => $is.notEmpty(x?.name));

        return {
            errors: providerErrors,
            ...(entry ?? {})
        };
    }
}
