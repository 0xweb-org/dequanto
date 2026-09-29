import alot from 'alot';
import { IConfigData } from './interface/IConfigData';

export function DefaultFactory (config: IConfigData): IConfigData {

    if (typeof process !== 'undefined' && process.env != null) {
        let urls = [] as { url: string, platform: string }[]
        for (let key in process.env) {
            if (key.startsWith('RPC_') === false) {
                continue;
            }
            let platform = key
                .replace('RPC_', '')
                .replace(/_(WSS|\d+)$/i, '')
                .toLowerCase();

            if (platform in config.web3 === false) {
                continue;
            }

            const url = process.env[key];
            if (/^(http|ws)/.test(url) === false) {
                continue;
            }
            urls.push({ url, platform });
        }
        if (urls.length > 0) {
            const dict = alot(urls)
                .groupBy(x => x.platform)
                .toDictionary(x => x.key, x => x.values.map(item => ({ url: item.url })));

            for (let platform in dict) {
                config.web3[platform].endpoints = dict[platform];
            }
        }
    }

    return config;
}
