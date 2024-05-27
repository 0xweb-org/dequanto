import AppConfig from 'appcfg'
import { Config as Appcfg } from 'appcfg/Config';

import { Directory, File } from 'atma-io';
import { IConfigProvider, TConfigParamsNode } from './AConfigBase';
import { IConfigData } from './interface/IConfigData';
import { $cli } from '../utils/$cli';
import { $logger } from '../utils/$logger';
import { $secret } from '../utils/$secret';
import { $require } from '@dequanto/utils/$require';

export class ConfigProviderPlatform implements IConfigProvider {

    config: Appcfg<IConfigData>

    async fetch (parameters?: TConfigParamsNode) {

        let unlockedAccountsKey = await $secret.getPin(parameters);
        let configPathAccounts = $cli.getParamValue('config-accounts', parameters) ?? '%APPDATA%/.dequanto/accounts.json';
        let configPathGlobal = $cli.getParamValue('config-global', parameters) ?? '%APPDATA%/.dequanto/config.yml';

        let dequantoConfigs = 'dequanto/configs/';

        /** An optional fallback if none of possible locations will be found */
        let pfx = '%APP%/';
        let [
            inCwd,
            inNodeModules,
            inCwdAsConfig,
        ] = await Promise.all([
            File.existsAsync(`./${dequantoConfigs}dequanto.yml`),
            File.existsAsync(`./node_modules/${dequantoConfigs}dequanto.yml`),
            File.existsAsync(`./configs/dequanto.yml`),
        ]);
        let rgx0xwebPath = /[/\\]0xweb[/\\].+$/;

        if (inCwd) {
            pfx = './';
        } else if (inNodeModules) {
            pfx = './node_modules/';
        } else if (inCwdAsConfig) {
            pfx = '';
            dequantoConfigs = 'configs/';
        } else if (rgx0xwebPath.test(__filename)) {
            // check the folder where this 0xweb package could be located
            let dir = __filename.replace(rgx0xwebPath, '/0xweb/');
            let path = `${dir}${dequantoConfigs}`;
            let exists = await Directory.existsAsync(path);
            if (exists) {
                pfx = dir;
            }
        }

        let dequantoDefaultPath = `${pfx}${dequantoConfigs}dequanto.yml`;
        let cfg = await AppConfig.fetch<IConfigData>([
            {
                path: dequantoDefaultPath,
                optional: true,
            },
            {
                path: `${pfx}${dequantoConfigs}defi.yml`,
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
        ]);


        if (cfg.web3 == null) {
            let defaultExists = await File.existsAsync(dequantoDefaultPath);
            let message = `Default config path not exists: ${dequantoDefaultPath} (${ defaultExists });`;
            message += ` cwd: ${process.cwd()} inCwd: ${inCwd}; inNodeModules: ${inNodeModules}; inCwdAsConfig: ${inCwdAsConfig}`;

            $logger.log(message);
            throw new Error(message);
        }

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
}

