import type AppConfig from 'appcfg';
import type { IConfigProvider, TConfigParamsBrowser } from './AConfigBase';
import type { IConfigData } from './interface/IConfigData';
import { $require } from '@dequanto/utils/$require';

import configDefault from '../../configs/dequanto.yml';


export class ConfigProviderPlatform implements IConfigProvider {

    config: AppConfig<IConfigData>

    async fetch (parameters?: TConfigParamsBrowser): Promise<IConfigData> {
        return configDefault;
    }

    async extend (json: Partial<IConfigData>): Promise<void> {
        $require.notNull(this.config, `Config was not fetched yet. Call fetch() first.`);
        await this.config.$write(json);
    }
}
