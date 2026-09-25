import memd from 'memd';
import type { Config as Appcfg } from 'appcfg/Config';
import { class_Dfr, obj_extend } from 'atma-utils';
import { TConfigParamsBrowser, TConfigParamsNode } from './AConfigBase';
import { IConfigData } from './interface/IConfigData';
import { ConfigProvider } from './ConfigProvider';
import { $logger } from '../utils/$logger';

export class Config {

    @memd.deco.memoize()
    static async fetch (parameters?: TConfigParamsNode | TConfigParamsBrowser): Promise<Appcfg<IConfigData> & IConfigData> {
        singleton ??= new class_Dfr();

        if (parameters?.rpc) {
            parameters.config ??= {};
            parameters.config.web3 ??= {};
            for (let platform in parameters.rpc) {
                parameters.config.web3[platform] ??= {} as any;
                parameters.config.web3[platform].endpoints = [];
                let val = parameters.rpc[platform];
                if (typeof val === 'string') {
                    parameters.config.web3[platform].endpoints.push({
                        url: val
                    });
                    continue;
                }
                if (Array.isArray(val) && typeof val[0] === 'string') {
                    parameters.config.web3[platform].endpoints.push(...val.map(url => ({url})));
                    continue;
                }
                parameters.config.web3[platform].endpoints = val as any;
            }
        }

        let cfg = await provider.fetch(parameters);

        obj_extend(config, cfg);

        if (config.web3 == null && config.chains == null) {
            let message = `web3 is not defined in the config file`;
            $logger.log(message);
            singleton.reject(new Error(message));
            return;
        }

        singleton.resolve(cfg);
        return cfg;
    }

    /** Will return a config that was previously loaded by fetch with any parameters or will trigger fetch with default parameters  */
    static async get (config?: Partial<IConfigData>): Promise<Appcfg<IConfigData> & IConfigData>  {
        if (singleton != null && config == null) {
            return singleton;
        }
        return Config.fetch({ config });
    }

    static async extend (json) {
        await provider.extend(json);
    }

    static clean (): Config {
        memd.fn.clearMemoized(Config.fetch);
        singleton = null;
        return Config;
    }
}

export const config = { } as IConfigData;

let provider = new ConfigProvider();
let singleton: class_Dfr<Appcfg<IConfigData> & IConfigData> = null;
