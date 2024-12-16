import AppConfig from 'appcfg'
import { Config as Appcfg } from 'appcfg/Config';

import { IConfigProvider, TConfigParamsNode } from './AConfigBase';
import { IConfigData } from './interface/IConfigData';
import { $cli } from '../utils/$cli';
import { $secret } from '../utils/$secret';
import { $require } from '@dequanto/utils/$require';
import { is_BROWSER } from '@dequanto/utils/$const';
import { ConfigDefaults } from './ConfigDefaults';

const DEFAULT_PATHS = {
    ACCOUNTS: {
        local: `./0xc/config/accounts.json`,
        global: `%APPDATA%/.dequanto/accounts.json`
    },
    CONFIG: {
        local: `./0xc/config/config.yml`,
        global: `%APPDATA%/.dequanto/config.yml`
    }
};


export class ConfigProvider implements IConfigProvider {

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
        let isLocal = parameters?.isLocal ?? false;
        let PATH_KEY: 'local' | 'global' = isLocal ? 'local' : 'global';

        let unlockedAccountsKey = await $secret.getPin(parameters);
        let configPathAccounts = $cli.getParamValue('config-accounts', parameters)
            ?? DEFAULT_PATHS.ACCOUNTS[ PATH_KEY ];
        let configPathMain = $cli.getParamValue('config-global', parameters)
            ?? DEFAULT_PATHS.CONFIG[ PATH_KEY ];

        return [
            {
                config: {
                    ...ConfigDefaults,
                    pin: unlockedAccountsKey ?? void 0,
                    ...(parameters?.config ?? {}),
                }
            },
            {
                path: `./configs/dequanto.yml`,
                optional: true,
            },
            {
                name: 'main',
                path: configPathMain,
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
                config: {
                    ...ConfigDefaults,
                    ...(parameters?.config ?? {}),
                }
            },
        ];
    }
}

