import AppConfig from 'appcfg'
import { Config as Appcfg } from 'appcfg/Config';

import { IConfigProvider, TConfigParamsNode } from './AConfigBase';
import { IConfigData } from './interface/IConfigData';
import { $cli } from '../utils/$cli';
import { $secret } from '../utils/$secret';
import { $require } from '@dequanto/utils/$require';
import { is_BROWSER } from '@dequanto/utils/$const';

import CONFIG_DEFAULT from '../../configs/dequanto.yml';

export class ConfigProviderPlatform implements IConfigProvider {

    config: Appcfg<IConfigData>

    async fetch (parameters?: TConfigParamsNode) {

        let sources = is_BROWSER
            ? await this.getSourcesBrowser(parameters)
            : await this.getSourcesNode(parameters)
            ;

        let cfg = await AppConfig.fetch<IConfigData>(sources);

        if (this.config != null) {
            this.config.$extend(cfg.toJSON());
        } else {
            this.config = cfg;
        }

        return this.config = cfg;
    }

    async extend (json: Partial<IConfigData>): Promise<void> {
        $require.notNull(this.config, `Config was not fetched yet. Call fetch() first.`);
        await this.config.$write(json);
    }


    private async getSourcesNode (parameters: TConfigParamsNode) {
        let unlockedAccountsKey = await $secret.getPin(parameters);
        let configPathAccounts = $cli.getParamValue('config-accounts', parameters) ?? '%APPDATA%/.dequanto/accounts.json';
        let configPathGlobal = $cli.getParamValue('config-global', parameters) ?? '%APPDATA%/.dequanto/config.yml';

        return [
            {
                config: CONFIG_DEFAULT,
            },
            {
                path: `./configs/dequanto.yml`,
                optional: true,
            },
            {
                path: configPathGlobal,
                writable: true,
                optional: true,
                extendArrays: false,
            },
            unlockedAccountsKey ? {
                name: 'accounts',
                path: configPathAccounts,
                writable: true,
                optional: true,
                secret: unlockedAccountsKey
            } : null,
            {
                path: 'package.json',
                getterProperty: 'dequanto',
                optional: true,
            },
            {
                path: 'dequanto.yml',
                optional: true
            },
            parameters?.dotenv ? {
                dotenv: true
            } : null,
        ];
    }

    private async getSourcesBrowser (parameters: TConfigParamsNode) {
        return [
            {
                config: CONFIG_DEFAULT
            }
        ];
    }
}

