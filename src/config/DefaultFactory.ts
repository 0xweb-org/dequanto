import { IConfigData } from './interface/IConfigData';

export function DefaultFactory (config: IConfigData): IConfigData {

    if (typeof process !== 'undefined' && process.env != null) {
        for (let key in process.env) {
            if (key.startsWith('RPC_') === false) {
                continue;
            }
            const platform = key.replace('RPC_', '').toLowerCase();
            if (platform in config.web3 === false) {
                continue;
            }

            const url = process.env[key];
            if (/^(http|ws)/.test(url) === false) {
                continue;
            }
            config.web3[platform].endpoints = [
                { url: url }
            ];
        }
    }

    return config;
}
