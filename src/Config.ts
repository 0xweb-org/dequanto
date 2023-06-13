import memd from 'memd';
import AppConfig from 'appcfg'
import { IContractDetails } from './models/IContractDetails';
import { TPlatform } from './models/TPlatform';
import { $secret } from './utils/$secret';
import { $cli } from './utils/$cli';
import { obj_extend } from 'atma-utils';
import { Directory } from 'atma-io';
import { ITokenGlob } from './models/ITokenGlob';
import { TAddress } from './models/TAddress';

export interface IProviderEndpoint {
    url: string
    private?: boolean
    safe?: boolean

    // Is not used in generall ClientPool, only retrievable via getWeb3 method.
    manual?: boolean

    traceable?: boolean
}
export class Config {
    settings: {
        /** Root path of the dequanto library */
        base?: string
    }
    accounts: {
        [platform in TPlatform]: {
            [name: string]: {
                address: string
                key: string
            }
        }
    }
    tokens: ITokenGlob[]

    blockchainExplorer: {
        [platform in TPlatform]: {
            key: string
            host: string
        }
    }
    web3: {
        [platform in TPlatform]: {
            chainId?: number
            chainToken?: string
            endpoints: IProviderEndpoint[]
        }
    }
    contracts?: {
        [platform in TPlatform]: IContractDetails[]
    }
    erc4337?: {
        name: string
        entryPoint: TAddress
        accountFactory: TAddress
        platforms: TPlatform[]
    }[]

    @memd.deco.memoize()
    static async fetch (parameters?: { pin?, 'config-accounts'?, 'config-global'? } ) {
        let unlockedAccountsKey = await $secret.getPin(parameters);
        let configPathAccounts = $cli.getParamValue('config-accounts', parameters) ?? '%APPDATA%/.dequanto/accounts.json';
        let configPathGlobal = $cli.getParamValue('config-global', parameters) ?? '%APPDATA%/.dequanto/config.yml';

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
        let cfg = await AppConfig.fetch<Config>([
            {
                path: `${prfx}${dequantoConfigs}dequanto.yml`,
                optional: true,
            },
            {
                path: `${prfx}${dequantoConfigs}defi.yml`,
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
        ]);

        obj_extend(config, cfg.toJSON());
        return cfg;
    }

    static async extend (json) {
        let current = await Config.fetch();
        await current.$write(json)
    }
}

export const config = new Config();
