import { IContractDetails } from './models/IContractDetails';
import { TPlatform } from './models/TPlatform';
import AppConfig from 'appcfg'
import { $secret } from './utils/$secret';
import { $cli } from './utils/$cli';
import memd from 'memd';
import { obj_extend } from 'atma-utils';
import { Directory, env } from 'atma-io';

export interface IProviderEndpoint {
    url: string
    private?: boolean
    safe?: boolean
}
export class Config {
    accounts: {
        [platform in TPlatform]: {
            [name: string]: {
                address: string
                key: string
            }
        }
    }
    blockchainExplorer: {
        [platform in TPlatform]: {
            key: string
            host: string
        }
    }
    web3: {
        [platform in TPlatform]: {
            endpoints: IProviderEndpoint[]
        }
    }
    contracts?: {
        [platform in TPlatform]: IContractDetails[]
    }

    @memd.deco.memoize()
    static async fetch () {
        let unlockedAccounts = await $secret.get();
        let configPathAccounts = $cli.getParamValue('config-accounts') ?? '%APPDATA%/.dequanto/accounts.json';

        let dequantoConfigs = 'dequanto/configs/';
        let [
            //- inApp,
            inCwd,
            inNodeModules,
        ] = await Promise.all([
            //- Directory.existsAsync(env.applicationDir.combine(`./${dequantoConfigs}`).toString()),
            Directory.existsAsync(`./${dequantoConfigs}`),
            Directory.existsAsync(`./node_modules/${dequantoConfigs}`),
        ]);
        let prfx = '%APP%/';
        if (inNodeModules) {
            prfx = './node_modules/'
        }
        if (inCwd) {
            prfx = './'
        }
        let cfg = await AppConfig.fetch([
            {
                path: `${prfx}${dequantoConfigs}dequanto.yml`,
                optional: true,
            },
            {
                path: `${prfx}${dequantoConfigs}defi.yml`,
                optional: true,
            },
            {
                path: '%APPDATA%/.dequanto/config.yml',
                writable: true,
                optional: true
            },
            unlockedAccounts ? {
                name: 'accounts',
                path: configPathAccounts,
                writable: true,
                optional: true,
                secret: unlockedAccounts
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
        ]);

        obj_extend(config, cfg.toJSON());
        return cfg;
    }
}

export const config = new Config();
