import { config } from '@dequanto/config/Config';
import { ConfigDefaults } from '@dequanto/config/ConfigDefaults';
import { IConfigData } from '@dequanto/config/interface/IConfigData';
import { TEth } from '@dequanto/models/TEth';
import alot from 'alot';
import { obj_getProperty, obj_setProperty } from 'atma-utils';
import { $require } from './$require';
import { IWeb3ClientOptions } from '@dequanto/clients/interfaces/IWeb3Client';
import { TExplorerDefinition } from '@dequanto/models/TExplorer';

const $global = typeof global === 'undefined'
    ? window
    : global;
export namespace $config {

    let envOptions = null;

    export function get <T = any> (path: string, $default?: T): T {
        let value = (typeof $global.app !== 'undefined' ? $global.app.config?.$get?.(path) : null)
            ?? obj_getProperty(config, path)
            ?? obj_getProperty(envOptions, path);

        if (value == null && envOptions == null) {
            envOptions = reloadEnv();
            return get(path, $default);
        }
        if (value == null) {
            value = obj_getProperty(ConfigDefaults, path);
        }
        return value ?? $default;
    }

    export function getWeb3Options (mix: TEth.Platform | number): IWeb3ClientOptions {
        let web3 = $config.get<IConfigData['web3']>('web3');
        let chains = $config.get<IConfigData['chains']>('chains', []);
        let platform: TEth.Platform;
        if (typeof mix === 'number') {
            let chain = alot.fromObject(web3).find(x => x.value.chainId === mix);
            if (chain != null) {
                platform = chain.key;
            } else {
                let chain = chains.find(x => x.chainId === mix);
                if (chain!= null) {
                    platform = chain.platform;
                }
            }
            $require.notNull(platform, `Invalid platform for chainId ${mix}`);
        } else {
            platform = mix;
        }

        let web3Config = web3[platform];
        if (web3Config == null) {
            // Find the configuration by the alias
            let chain = alot
                .fromObject(web3)
                .filter(x => Array.isArray(x.value.aliases))
                .find(x => x.value.aliases.includes(platform));
            web3Config = chain?.value;
        }

        let chainConfig = chains.find(x => x.platform === platform || x.aliases?.includes(platform));

        $require.notNull(web3Config || chainConfig, `Unsupported platform ${platform} for web3 client`);
        return {
            platform,
            ...(chainConfig ?? {}),
            ...(web3Config ?? {}),
        } as any as IWeb3ClientOptions;
    }

    export function getExplorerOptions (mix: TEth.Platform | number): TExplorerDefinition {
        let platform = getWeb3Options(mix).platform;

        let explorer = $config.get<IConfigData['blockchainExplorer']>(`blockchainExplorer`);
        let chains = $config.get<IConfigData['chains']>('chains', []);


        let explorerConfig = explorer[platform];
        let chainConfig = chains.find(x => x.platform === platform || x.aliases?.includes(platform));

        $require.notNull(explorerConfig || chainConfig, `Unsupported platform ${platform} for web3 client`);
        return {
            platform,
            ...(chainConfig?.explorers?.[0] ?? {}),
            ...(explorerConfig ?? {}),
        } satisfies TExplorerDefinition;
    }

    export function set <T = any> (path: string, value: T) {
        $global.app.config?.$set?.(path, value);
    }

    /**
     * Reloads dequanto env config from cli ARGUMENTS and DQ_SETTINGS__** environment
     */
    export function reloadEnv(argv?: string[], env?: { [key: string]: string }) {

        if (argv == null && typeof process !== 'undefined' && process.argv) {
            argv = process.argv;
        }
        if (env == null && typeof process !== 'undefined' && process.env) {
            env = process.env;
        }

        envOptions = {};
        if (argv != null) {
            for (let i = 0; i < argv.length; i++) {
                let key = argv[i];
                let value = argv[i + 1];
                if (key.startsWith('--config=')) {
                    value = key.replace('--config=', '');
                    key = '--config';
                }
                if (key === '--config') {
                    value = trimQuotes(value);
                    if (value === '') {
                        continue;
                    }
                    let [ path, val ] = value.split('=');

                    obj_setProperty(envOptions, path.trim(), val.trim());
                    i++;
                }
            }
        }
        if (env != null) {
            for (let key in env) {
                if (/DQ_/i.test(key) === false) {
                    continue;
                }
                let path = key.replace(/^dq_/i, '').replace(/__/g, '.').toLowerCase();
                let val = env[key];
                obj_setProperty(envOptions, path, val);
            }
        }
        return envOptions;
    }
    function trimQuotes(value: string): string {
        value = value?.trim() ?? '';
        let q = /^['"]/.exec(value);
        if (q) {
            return value.substring(1, value.length - 1);
        }
        return value;
    }
}
