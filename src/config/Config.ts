import memd from 'memd';
import { class_Dfr, obj_extend } from 'atma-utils';
import { TConfigParamsBrowser, TConfigParamsNode } from './AConfigBase';
import { IConfigData } from './interface/IConfigData';
import { ConfigProvider } from './ConfigProvider';
import { $logger } from '../utils/$logger';
import { ConfigDefaults } from './ConfigDefaults';

export class Config {

    @memd.deco.memoize()
    static async fetch (parameters?: TConfigParamsNode | TConfigParamsBrowser) {
        singleton ??= new class_Dfr();

        let cfg = await provider.fetch(parameters);

        obj_extend(config, cfg);

        if (config.web3 == null) {
            let message = `web3 is not defined in the config file`;
            $logger.log(message);
            singleton.reject(new Error(message));
            return;
        }

        singleton.resolve(cfg);
        return cfg;
    }

    /** Will return a config that was previously loaded by fetch with any parameters or will trigger fetch with default parameters  */
    static async get (): Promise<IConfigData> {
        if (singleton != null) {
            return singleton;
        }
        return Config.fetch();
    }

    static async extend (json) {
        await provider.extend(json);
    }
}

export const config = { } as IConfigData;

let provider = new ConfigProvider();
let singleton: class_Dfr<IConfigData> = null;
